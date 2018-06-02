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

const Processes = ({ currentPod, currentContainer, containerInfo }) => (
  <ContainerInfo
    info="ps"
    title="Processes"
    kubectl={{ command: 'exec', params: currentPod + ' --container ' + currentContainer + ' ps auxwwH' }}
  >
    <WrapSwitch />
    <TextOutput>
      {containerInfo.content}
    </TextOutput>
  </ContainerInfo>
);

Processes.propTypes = {
  containerInfo: PropTypes.shape({
    content: PropTypes.string.isRequired,
  }).isRequired,
  currentContainer: PropTypes.string.isRequired,
  currentPod: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps)(Processes));
