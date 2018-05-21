import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { fetchContexts } from '../actions/contexts'
import { fetchPods } from '../actions/pods'
import { fetchContainerInfo } from '../actions/containerInfo'

const mapStateToProps = (state, { match }) => ({
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
  currentPod: match.params.pod,
  currentContainer: match.params.container,
  currentPage: match.params.page,
});

class Refresh extends Component {
  handleRefresh = () => {
    const { currentContext, currentNamespace, currentPod, currentContainer, currentPage } = this.props;

    this.props.dispatch(fetchContexts());
    this.props.dispatch(fetchPods(currentContext));

    if (currentNamespace && currentPod && currentContainer && currentPage) {
      this.props.dispatch(fetchContainerInfo(currentContext, currentNamespace, currentPod, currentContainer, currentPage));
    }
  };

  render() {
    return (
      <IconButton onClick={this.handleRefresh}>
        <RefreshIcon />
      </IconButton>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Refresh));
