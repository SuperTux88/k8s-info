import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    textAlign: 'center',
  },
};

class Error extends Component {
  render() {
    const { classes, message } = this.props;

    return (
      <div className={classes.root}>
        <Typography>
          Error: {message}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Error);
