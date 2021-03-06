const Joi = require('joi')
const config = require('@cracra/config/server')
const moment = require('moment')

const hasRole = require('../../helpers/hasRole.pre')
const {
  HOLIDAY_REQUEST_APPROVED,
  HOLIDAY_REQUEST_REJECTED,
  HOLIDAY_REQUEST_PENDING,
} = require('@cracra/shared/holidays.constants')
const { publicHolidays } = require('@cracra/shared/calendar.constants')
const { getPeriodDayCount } = require('@cracra/shared/holidays.utils')

const statusMapping = {
  [HOLIDAY_REQUEST_APPROVED]: 'acceptée',
  [HOLIDAY_REQUEST_REJECTED]: 'refusée',
}

const getPeriodEntries = (period) => {
  const currentDate = moment(period.startDate)
  return Array.from({ length: getPeriodDayCount(period) * 2 }).reduce((acc) => {
    const day = currentDate.day()

    if (day !== 0 && day !== 6 && !publicHolidays.has(`${currentDate.month()}-${day}`)) {
      acc.push({
        label: period.label,
        date: `${currentDate.format('YYYY-MM-DD')}-${currentDate.hour() >= 12 ? 'pm' : 'am'}`,
      })
    }

    currentDate.add(12, 'h')

    return acc
  }, [])
}

module.exports = {
  method: 'POST',
  path: '/api/holidays/{id}/changeStatus',
  config: {
    validate: {
      payload: {
        status: Joi.string().valid([
          HOLIDAY_REQUEST_APPROVED,
          HOLIDAY_REQUEST_REJECTED,
          HOLIDAY_REQUEST_PENDING,
        ]).required(),
      },
    },
    pre: [hasRole(config.cracra.partnersRoles)],
  },
  async handler(req, res) {
    const { status } = req.payload
    const holidayRequest = await req.server.app.models.Holiday.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { status } },
      { new: true },
    )

    if (holidayRequest.status === HOLIDAY_REQUEST_APPROVED) {
      const entries = [].concat(...holidayRequest.periods.map(period => getPeriodEntries(period, holidayRequest.user)))
      await req.server.plugins.worklog.saveEntries(entries, holidayRequest.user)
    }

    req.server.methods.sendPushNotification(holidayRequest.user, JSON.stringify({
      message: `Demande de congé "${holidayRequest.title}" ${statusMapping[status]}`,
      url: `/holidays/${holidayRequest._id}`,
    }))

    res.mongodb(holidayRequest)
  },
}
