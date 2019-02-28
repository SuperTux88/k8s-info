import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import './style.css';

function getTheme(uiTheme) {
  return createMuiTheme({
    palette: {
      type: uiTheme.paletteType,
      text: {
        ok: uiTheme.paletteType === 'light' ? green[700] : green[500],
        error: uiTheme.paletteType === 'light' ? red[700] : red[500],
      },
    },
    typography: {
      useNextVariants: true,
    },
  });
}

function withRoot(Component) {
  const WithRoot = ({ uiTheme, ...other }) => (
    <MuiThemeProvider theme={getTheme(uiTheme)}>
      <CssBaseline />
      <Component {...other} />
    </MuiThemeProvider>
  );

  WithRoot.propTypes = {
    uiTheme: PropTypes.shape({
      paletteType: PropTypes.string.isRequired,
    }).isRequired,
  };

  return connect(state => ({ uiTheme: state.theme }))(WithRoot);
}

export default withRoot;
