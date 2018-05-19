import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    textAlign: 'center',
  },
  text: {
    marginBottom: '20px',
  },
};

class Loading extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography className={classes.text}>
          Loading ...
        </Typography>
        <CircularProgress className={classes.progress} size={50} />
      </div>
    );
  }
}

export default withStyles(styles)(Loading);
