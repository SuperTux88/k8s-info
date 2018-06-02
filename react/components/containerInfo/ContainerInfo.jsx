import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import LoadingPage from '../LoadingPage';

import { fetchContainerInfo, getApiPath } from '../../actions/containerInfo';

const mapStateToProps = (state, { match }) => ({
  context: match.params.context,
  namespace: match.params.namespace,
  pod: match.params.pod,
  container: match.params.container,
  containerInfo: state.containerInfo,
});

class ContainerInfo extends Component {
  fetchContent() {
    const { context, namespace, pod, container, info, dispatch } = this.props;

    dispatch(fetchContainerInfo(context, namespace, pod, container, info));
  }

  componentDidMount() {
    this.fetchContent();
  }

  componentDidUpdate(prevProps) {
    const { context, namespace, pod, container, info } = this.props;

    if (context !== prevProps.context ||
      namespace !== prevProps.namespace ||
      pod !== prevProps.pod ||
      container !== prevProps.container ||
      info !== prevProps.info) {
      this.fetchContent();
    }
  }

  render() {
    const { title, kubectl, context, namespace, pod, container, info, containerInfo, children } = this.props;

    return (
      <LoadingPage
        loading={containerInfo.loading}
        error={containerInfo.error}
        title={title + ': ' + namespace + ' / ' + pod + ' / ' + container}
        kubectl={kubectl}
        apiPath={getApiPath(context, namespace, pod, container, info)}
      >
        {children}
      </LoadingPage>
    );
  }
}

ContainerInfo.propTypes = {
  children: PropTypes.node,
  container: PropTypes.string.isRequired,
  containerInfo: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }).isRequired,
  context: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  info: PropTypes.string.isRequired,
  kubectl: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  pod: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps)(ContainerInfo));
