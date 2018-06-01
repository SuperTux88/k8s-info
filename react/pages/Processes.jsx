import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ContainerInfo from '../components/containerInfo/ContainerInfo';
import WrapSwitch from '../components/containerInfo/WrapSwitch';
import TextOutput from '../components/containerInfo/TextOutput';

const mapStateToProps = (state) => ({
  containerInfo: state.containerInfo,
});

const Processes = ({ containerInfo }) => (
  <ContainerInfo
    info="ps"
    title="Processes"
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
};

export default withRouter(connect(mapStateToProps)(Processes));
