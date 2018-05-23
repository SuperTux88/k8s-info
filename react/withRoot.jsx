import React from 'react';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import './style.css'

function getTheme(uiTheme) {
  return createMuiTheme({
    palette: {
      type: uiTheme.paletteType,
      text: {
        ok: uiTheme.paletteType === 'light' ? green[700] : green[500],
        error: uiTheme.paletteType === 'light' ? red[700] : red[500],
      },
    },
  });
}

function withRoot(Component) {
  class WithRoot extends React.Component {
    render() {
      const { uiTheme, ...other } = this.props;

      return (
        <MuiThemeProvider theme={getTheme(uiTheme)}>
          <CssBaseline />
          <Component {...other} />
        </MuiThemeProvider>
      );
    }
  }

  return connect(state => ({uiTheme: state.theme}))(WithRoot);
}

export default withRoot;
