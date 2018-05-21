import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core/styles';

import { fetchPodDescribe } from '../actions/pod';

import Loading from '../components/Loading';
import Error from '../components/Error';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
  },
});

const mapStateToProps = (state, { match }) => ({
  pod: state.pod,
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
  currentPod: match.params.pod,
});

class PodDescribe extends Component {
  fetchContent = () => {
    const { currentContext, currentNamespace, currentPod } = this.props;
    this.props.dispatch(fetchPodDescribe(currentContext, currentNamespace, currentPod));
  };

  componentDidMount() {
    this.fetchContent();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentContext !== prevProps.currentContext ||
      this.props.currentNamespace !== prevProps.currentNamespace ||
      this.props.currentPod !== prevProps.currentPod) {
      this.fetchContent();
    }
  }

  render() {
    const { classes, pod } = this.props;

    if (pod.loading) {
      return (
        <div>
          <Loading/>
        </div>
      );
    } else if (pod.error) {
      return (
        <div>
          <Error message={pod.error.message}/>
        </div>
      );
    } else {
      return (
        <Paper className={classes.root}>
          TODO
        </Paper>
      );
    }
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(PodDescribe)));
