import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import withRoot from './withRoot';

import { fetchContexts } from './actions/contexts'

import ContextDropdown from './components/ContextDropdown';

import Index from './pages/Index';
import PodList from './pages/PodList';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  headerLogo: {
    marginRight: theme.spacing.unit * 2,
    height: '32px'
  },
  headerMenu: {
    marginLeft: theme.spacing.unit * 2,
  },
});

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchContexts());
  }

  render() {
     const { classes } = this.props;

    return (
      <BrowserRouter>
        <div>
          <AppBar position="static" title="k8s deployments">
            <Toolbar>
              <img src="/static/images/favicon.png" className={classes.headerLogo} alt="k8s-logo" />
              <Typography variant="title">
                k8s deployments
              </Typography>
              <div className={classes.headerMenu}>
                <Route path="/:context" component={ContextDropdown}/>
              </div>
            </Toolbar>
          </AppBar>
          <Route exact path="/" component={Index}/>
          <Route exact path="/:context" component={PodList}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect()(withStyles(styles)(withRoot(App)));
