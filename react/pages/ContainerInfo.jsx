import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import { fetchContainerInfo } from "../actions/containerInfo";

import Loading from '../components/Loading';
import Error from '../components/Error';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
  },
  pre: {
    overflow: 'auto',
    fontFamily: ["Roboto Mono", "monospace"],
  }
});

const mapStateToProps = (state, { match }) => ({
  context: match.params.context,
  namespace: match.params.namespace,
  pod: match.params.pod,
  container: match.params.container,
  page: match.params.page,
  containerInfo: state.containerInfo,
});

class ContainerInfo extends Component {
  fetchContent = () => {
    const { context, namespace, pod, container, page } = this.props;
    this.props.dispatch(fetchContainerInfo(context, namespace, pod, container, page));
  };

  componentDidMount() {
    this.fetchContent();
  }

  componentDidUpdate(prevProps) {
    if (this.props.context !== prevProps.context ||
      this.props.namespace !== prevProps.namespace ||
      this.props.pod !== prevProps.pod ||
      this.props.container !== prevProps.container ||
      this.props.page !== prevProps.page) {
      this.fetchContent();
    }
  }

  render() {
    const { classes, containerInfo } = this.props;

    if (containerInfo.loading) {
      return (
        <div>
          <Loading/>
        </div>
      );
    } else if (containerInfo.error) {
      return (
        <div>
          <Error message={containerInfo.error.message}/>
        </div>
      );
    } else {
      return (
        <Paper className={classes.root}>
          <Typography component='pre' className={classes.pre}>
            {containerInfo.content}
          </Typography>
        </Paper>
      );
    }
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(ContainerInfo)));
