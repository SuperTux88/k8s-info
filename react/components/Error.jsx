import React from 'react';

import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    textAlign: 'center',
  },
};

const Error = ({ classes, message }) => (
  <div className={classes.root}>
    <Typography>
      Error: {message}
    </Typography>
  </div>
);

export default withStyles(styles)(Error);
