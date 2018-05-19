import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import withRoot from './withRoot';
import Index from './pages/Index';

class App extends Component {
  render() {
    return (
      <div>
        <AppBar position="static" title="k8s deployments">
          <Toolbar>
            <Typography variant="title">
              k8s deployments
            </Typography>
          </Toolbar>
        </AppBar>
        <Index />
      </div>
    );
  }
}

export default withRoot(App);
