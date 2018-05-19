import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  header: {
    textAlign: 'center',
    backgroundColor: '#222',
    padding: '20px',
    marginBottom: '100px',
  },
  logo: {
    animation: 'k8s-logo-spin infinite 20s linear',
    height: '150px',
  },
};

class K8sLogoHeader extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.header}>
        <img src="/static/images/favicon.png" className={classes.logo} alt="k8s-logo" />
      </div>
    );
  }
}

export default withStyles(styles)(K8sLogoHeader);
