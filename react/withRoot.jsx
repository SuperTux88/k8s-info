import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    text: {
      ok: green[500],
      error: red[500],
    },
  },
});

function withRoot(Component) {
  function WithRoot(props) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
