import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { CssBaseline, withStyles } from 'material-ui'

import AppBar from '../components/appBar.component'
import AppDrawer from '../components/appDrawer.component'
import { toggleProofOfTransportDialog } from '../modules/settings/settings.actions'
import FeatureFlipping from '../components/featureFlipping'
import ProofOfTransportDialog from '../components/dialogs/proofOfTansportDialog.component'
import AppUpdater from '../components/appUpdater.component'
import OfflineSnack from '../components/offlineSnack.component'
import ConnectedPushSnack from '../components/pushSnack.component'

const mapStateToProps = ({
  settings,
  transport,
  auth,
}) => ({
  isConnected: !!auth.user,
  shouldDisplayPushNotificationSnack:
    settings.shouldDisplayPushNotificationSnack && !settings.desktopNotificationsInstalled &&
    !settings.desktopNotificationsEnabled && settings.rehydrated,
  shouldDisplayProofOfTransportDialog: settings.shouldDisplayProofOfTransportDialog && settings.rehydrated,
  hasInvalidTransportProof: transport.expirationDate < Date.now(),
})

const mapDispatchToProps = dispatch => bindActionCreators({ toggleProofOfTransportDialog }, dispatch)

const styles = theme => ({
  appRoot: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appContent: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    boxSizing: 'border-box',
    overflowY: 'auto',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  '@media print': {
    appRoot: {
      position: 'static',
    },
    appContent: {
      marginTop: 0,
      padding: 0,
    },
  },
  '@global iframe': {
    border: 'none',
  },
})

export class App extends React.Component {
  constructor(...args) {
    super(...args)

    this.state = {
      drawerOpen: false,
      openProofOfTransportDialog: true,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.setState({ drawerOpen: false })
    }
  }

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true })
  }

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false })
  }

  handleDialogClose = () => this.setState({ openProofOfTransportDialog: false })

  handleDecline = () => {
    this.setState({ openProofOfTransportDialog: false })
    this.props.toggleProofOfTransportDialog()
  }

  render() {
    const { openProofOfTransportDialog } = this.state
    const {
      classes,
      children,
      shouldDisplayProofOfTransportDialog,
      hasInvalidTransportProof,
      isConnected,
    } = this.props

    const openTransportProofDialog = isConnected && shouldDisplayProofOfTransportDialog
      && hasInvalidTransportProof && openProofOfTransportDialog
    return (
      <div className={classes.appRoot}>
        <CssBaseline />
        <div className={classes.appFrame}>
          <AppBar onDrawerOpen={this.handleDrawerOpen} />
          <AppDrawer open={this.state.drawerOpen} onDrawerClose={this.handleDrawerClose} />
          <div className={classes.appContent}>
            {children}
          </div>
          <FeatureFlipping feature="pushNotifications">
            <ConnectedPushSnack />
          </FeatureFlipping>
          <FeatureFlipping feature="transport">
            <ProofOfTransportDialog
              open={openTransportProofDialog}
              onClose={this.handleDialogClose}
              onDecline={this.handleDecline}
            />
          </FeatureFlipping>
          <AppUpdater />
          <OfflineSnack />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  toggleProofOfTransportDialog: PropTypes.func.isRequired,
  shouldDisplayProofOfTransportDialog: PropTypes.bool.isRequired,
  hasInvalidTransportProof: PropTypes.bool.isRequired,
  isConnected: PropTypes.bool.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App)))
