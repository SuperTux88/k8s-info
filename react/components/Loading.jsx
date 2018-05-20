import React from 'react';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    marginTop: '50px',
    textAlign: 'center',
  },
  text: {
    marginBottom: '20px',
  },
};

const Loading = ({ classes }) => (
  <div className={classes.root}>
    <Typography className={classes.text}>
      Loading ...
    </Typography>
    <CircularProgress size={50} />
  </div>
);

export default withStyles(styles)(Loading);
