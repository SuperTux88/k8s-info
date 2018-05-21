import React from 'react';
import { Link, Route } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import ContextDropdown from './ContextDropdown';
import NamespaceDropdown from './NamespaceDropdown';
import PodDropdown from './PodDropdown';
import ContainerDropdown from './ContainerDropdown';
import PageDropdown from './PageDropdown';
import Refresh from './Refresh';

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
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

const AppToolbar = ({ classes }) => (
  <AppBar position="static" className={classes.root}>
    <Toolbar>
      <Link to="/" className={classes.link}>
        <img src="/static/images/favicon.png" className={classes.headerLogo} alt="k8s-logo" />
        <Typography variant="title">
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
      <Refresh />
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(AppToolbar);
