import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import RefreshIcon from '@material-ui/icons/Refresh';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faLightbulb from '@fortawesome/fontawesome-free-regular/faLightbulb'
import faLightbulbSolid from '@fortawesome/fontawesome-free-solid/faLightbulb'
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub'

import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { fetchContexts } from '../actions/contexts'
import { fetchPods } from '../actions/pods'
import { fetchPodDescribe } from '../actions/pod'
import { fetchContainerInfo } from '../actions/containerInfo'
import { changeThemePaletteType } from '../actions/theme'

import ContextDropdown from './toolbar/ContextDropdown';
import NamespaceDropdown from './toolbar/NamespaceDropdown';
import PodDropdown from './toolbar/PodDropdown';
import ContainerDropdown from './toolbar/ContainerDropdown';
import PageDropdown from './toolbar/PageDropdown';

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
  },
  headerLogo: {
    marginRight: theme.spacing.unit * 2,
    height: '32px',
  },
  headerMenu: {
    flex: 1,
    marginLeft: theme.spacing.unit * 2,
  },
});

const mapStateToProps = (state, { match }) => ({
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
  currentPod: match.params.pod,
  currentContainer: match.params.container,
  currentPage: match.params.page,
  uiTheme: state.theme,
});

class AppToolbar extends Component {
  handleRefresh = () => {
    const { currentContext, currentNamespace, currentPod, currentContainer, currentPage } = this.props;

    this.props.dispatch(fetchContexts());
    this.props.dispatch(fetchPods(currentContext));

    if (currentNamespace && currentPod) {
      this.props.dispatch(fetchPodDescribe(currentContext, currentNamespace, currentPod));
    }

    if (currentNamespace && currentPod && currentContainer && currentPage) {
      this.props.dispatch(fetchContainerInfo(currentContext, currentNamespace, currentPod, currentContainer, currentPage));
    }
  };

  handleTogglePaletteType = () => {
    const newTheme = this.props.uiTheme.paletteType === 'light' ? 'dark' : 'light';
    localStorage.setItem('uiTheme', newTheme);
    this.props.dispatch(changeThemePaletteType(newTheme));
  };

  render() {
    const { classes, uiTheme } = this.props;

    return (
      <MuiThemeProvider theme={createMuiTheme({palette: {type: 'dark'}})}>
        <AppBar position="sticky" className={classes.root}>
          <Toolbar>
            <Link to="/" className={classes.link}>
              <img src="/static/images/favicon.png" className={classes.headerLogo} alt="k8s-logo" />
              <Typography variant="title" color="inherit">
                k8s deployments
              </Typography>
            </Link>
            <div className={classes.headerMenu}>
              <ContextDropdown />
              <NamespaceDropdown />
              <Route path="/:context/:namespace/:pod" component={PodDropdown} />
              <Route path="/:context/:namespace/:pod/:container/:page" component={ContainerDropdown} />
              <Route path="/:context/:namespace/:pod/:container/:page" component={PageDropdown} />
            </div>

            <Tooltip id="appbar-refresh" title="Refresh Data" enterDelay={300}>
              <IconButton
                color="inherit"
                aria-labelledby="appbar-refresh"
                onClick={this.handleRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip id="appbar-theme" title="Toggle light/dark theme" enterDelay={300}>
              <IconButton
                color="inherit"
                onClick={this.handleTogglePaletteType}
                aria-labelledby="appbar-theme"
              >
                <FontAwesomeIcon icon={uiTheme.paletteType === 'light' ? faLightbulbSolid : faLightbulb} />
              </IconButton>
            </Tooltip>

            <Tooltip id="appbar-github" title="GitHub Repo" enterDelay={300}>
              <IconButton
                component="a"
                color="inherit"
                href="https://github.com/SuperTux88/k8s-info"
                target="_blank"
                aria-labelledby="appbar-github"
              >
                <FontAwesomeIcon icon={faGithub} />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(AppToolbar)));
