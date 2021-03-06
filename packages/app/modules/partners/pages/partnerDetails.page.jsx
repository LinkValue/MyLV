import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Helmet } from 'react-helmet'
import { push } from 'react-router-redux'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  withStyles,
  Fab,
} from '@material-ui/core'
import { Print } from '@material-ui/icons'
import { getPeriodDayCount } from '@cracra/shared/holidays.utils'

import { appName } from '@cracra/config/app'
import Calendar from '../../worklog/components/calendar.component'
import EntriesForm from '../../worklog/components/entriesForm.component'
import NotFound from '../../../components/notFound.component'
import { fetchPartnerHolidays } from '../../holidays/holidays.actions'
import HolidayRequestStatusIcon from '../../holidays/components/holidayRequestStatusIcon.component'
import Printer from '../../worklog/components/printer.component'

const mapStateToProps = (state, { match: { params: { id } } }) => ({
  error: state.worklog.error,
  partner: state.partners.partnersById[id],
  partnerHolidays: state.holidays.partnerHolidays,
  holidaysById: state.holidays.holidaysById,
  isPartnerHolidaysLoading: state.holidays.isPartnerHolidaysLoading,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPartnerHolidays,
  goToHolidayRequestDetails: requestId => push(`/holidays/${requestId}`),
}, dispatch)

const styles = theme => ({
  headCard: {
    marginBottom: theme.spacing.unit * 2,
  },
  printButton: {
    position: 'fixed',
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
    zIndex: 10,
  },
  '@media print': {
    printerHidden: {
      display: 'none',
    },
  },
})

export class PartnerDetailsPage extends React.Component {
  componentDidMount() {
    this.props.fetchPartnerHolidays(this.props.match.params.id)
  }

  handleHolidayClick = requestId => () => this.props.goToHolidayRequestDetails(requestId)

  handleWorklogPrint = () => window.print();

  render() {
    const {
      classes,
      partner,
      error,
      match: { params: { id } },
      partnerHolidays,
      holidaysById,
    } = this.props

    if (error) {
      return <NotFound />
    }

    return (
      <Fragment>
        <Helmet>
          <title>CRA de {partner ? `${partner.firstName} ${partner.lastName}` : ''} | {appName}</title>
        </Helmet>
        <div className={classes.printerHidden}>
          <Card classes={{ root: classes.headCard }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {partner ? `${partner.firstName} ${partner.lastName}` : ''}
              </Typography>
            </CardContent>
          </Card>
          <Grid container spacing={16}>
            <Grid item lg={8} xs={12}>
              <Calendar partnerId={id} />
              <EntriesForm hideClientChange />
            </Grid>
            <Grid item lg={4} xs={12}>
              <Card>
                <List subheader={<ListSubheader>Dernières demandes de congés</ListSubheader>}>
                  {partnerHolidays.map(requestId => holidaysById[requestId]).map(request => (
                    <ListItem key={request.id} button onClick={this.handleHolidayClick(request.id)}>
                      <ListItemIcon>
                        <HolidayRequestStatusIcon status={request.status} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Demande du ${moment(request.date).format('DD/MM/YYYY')}`}
                        secondary={
                          `${request.periods.reduce((sum, period) => getPeriodDayCount(period) + sum, 0)} jours`
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        </div>
        <Fab
          color="primary"
          className={classes.printButton}
          onClick={this.handleWorklogPrint}
        >
          <Print />
        </Fab>
        <Printer user={partner} />
      </Fragment>
    )
  }
}

PartnerDetailsPage.defaultProps = {
  partner: null,
}

PartnerDetailsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  partner: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }),
  partnerHolidays: PropTypes.arrayOf(PropTypes.string).isRequired,
  holidaysById: PropTypes.object.isRequired,
  fetchPartnerHolidays: PropTypes.func.isRequired,
  goToHolidayRequestDetails: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PartnerDetailsPage))
