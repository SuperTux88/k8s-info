import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ContainerInfo from '../components/containerInfo/ContainerInfo';
import WrapSwitch from '../components/containerInfo/WrapSwitch';
import TextOutput from '../components/containerInfo/TextOutput';

const mapStateToProps = (state, { match }) => ({
  currentPod: match.params.pod,
  currentContainer: match.params.container,
  containerInfo: state.containerInfo,
});

const Log = ({ currentPod, currentContainer, containerInfo }) => (
  <ContainerInfo
    info="log"
    title="Logs"
    kubectl={{
      command: 'logs',
      params: currentPod + ' --container ' + currentContainer + ' --tail 1000',
    }}
  >
    <WrapSwitch />
    <TextOutput>
      {containerInfo.content}
    </TextOutput>
  </ContainerInfo>
);

Log.propTypes = {
  containerInfo: PropTypes.shape({
    content: PropTypes.string.isRequired,
  }).isRequired,
  currentContainer: PropTypes.string.isRequired,
  currentPod: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps)(Log));
