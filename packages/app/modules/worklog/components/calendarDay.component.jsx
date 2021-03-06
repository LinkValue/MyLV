import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core'
import { labelColors } from '@cracra/shared/calendar.constants'

const styles = theme => ({
  calendarDay: {
    height: '100%',
    maxHeight: '5rem',
  },
  calendarDayFill: {
    display: 'block',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
  },
  calendarDaySelected: {
    position: 'relative',
    zIndex: 1,
    border: `solid 2px ${theme.palette.primary['500']}`,
    boxShadow: theme.shadows[8],
  },
})

const CalendarDay = ({
  labelMorning, labelAfternoon, selected, classes,
}) => (
  <div className={classes.calendarDay}>
    <svg
      className={classNames({
        [classes.calendarDayFill]: true,
        [classes.calendarDaySelected]: selected,
      })}
      viewBox="0 0 50 50"
      preserveAspectRatio="none"
    >
      <path style={{ fill: labelColors.get(labelMorning) || 'white' }} d="M0,0L0,50L50,0z" />
      <path style={{ fill: labelColors.get(labelAfternoon) || 'white' }} d="M0,50L50,50L50,0z" />
    </svg>
  </div>
)

export default withStyles(styles)(CalendarDay)
