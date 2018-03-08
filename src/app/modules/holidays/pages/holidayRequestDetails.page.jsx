import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Avatar, Button, Card, CardActions, CardContent, List, ListItem, ListItemText, ListSubheader,
  Typography,
} from 'material-ui'
import { BeachAccess, FlightTakeoff, PregnantWoman } from 'material-ui-icons'
import moment from 'moment'

import NotFound from '../../../components/notFound.component'
import LoadingPage from '../../../components/loadingPage.component'
import Restricted from '../../../components/restricted.component'
import { fetchHolidayRequestDetails } from '../holidays.actions'
import { getPeriodDayCount } from '../hollidays.utils'
import { holidayLabels } from '../../../../shared/calendar-constants'

const mapStateToProps = (state, { match }) => {
  const holidayRequest = state.holidays.holidaysById[match.params.id]

  return {
    holidayRequest,
    isLoading: state.holidays.isUniqueLoading,
    user: state.auth.user,
    partner: holidayRequest ? state.partners.partnersById[holidayRequest.user] : null,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ fetchHolidayRequestDetails }, dispatch)

const getPeriodText = (period) => {
  const startDate = moment(period.startDate).format('DD/MM/YYYY')
  const endDate = moment(period.endDate).format('DD/MM/YYYY')
  return `Du ${startDate} au ${endDate} (${getPeriodDayCount(period)} jours)`
}

const iconsByLabel = {
  paidHolidays: <BeachAccess />,
  unpaidHolidays: <FlightTakeoff />,
  conventionalHolidays: <PregnantWoman />,
}

export class HolidayRequestDetails extends React.Component {
  componentWillMount() {
    this.props.fetchHolidayRequestDetails(this.props.match.params.id)
  }

  render() {
    const {
      holidayRequest,
      user,
      isLoading,
      partner,
    } = this.props

    if (!holidayRequest && !isLoading) {
      return <NotFound />
    }

    if (isLoading) {
      return <LoadingPage />
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="headline" component="h2" gutterBottom>
            {holidayRequest.user === user.id ?
              holidayRequest.title :
              `Demande de congé de ${partner.firstName} ${partner.lastName}`}
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            {holidayRequest.comment}
          </Typography>
          <List>
            <ListSubheader>Période(s) demandée(s)</ListSubheader>
            {holidayRequest.periods.map(period => (
              <ListItem key={period._id}>
                <Avatar>
                  {iconsByLabel[period.label] || <BeachAccess />}
                </Avatar>
                <ListItemText
                  primary={getPeriodText(period)}
                  secondary={holidayLabels.get(period.label)}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
        <Restricted roles={['hr', 'board']} user={user}>
          <CardActions>
            <Button size="small" color="primary">Approuver</Button>
            <Button size="small" color="default">Refuser</Button>
          </CardActions>
        </Restricted>
      </Card>
    )
  }
}

HolidayRequestDetails.defaultProps = {
  holidayRequest: null,
  partner: null,
}

HolidayRequestDetails.propTypes = {
  fetchHolidayRequestDetails: PropTypes.func.isRequired,
  holidayRequest: PropTypes.shape({
    user: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    comment: PropTypes.string,
    periods: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
    })).isRequired,
  }),
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  partner: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }),
  isLoading: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(HolidayRequestDetails)