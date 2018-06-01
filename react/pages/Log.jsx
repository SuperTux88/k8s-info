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

const Log = ({ containerInfo }) => (
  <ContainerInfo
    info="log"
    title="Logs"
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
};

export default withRouter(connect(mapStateToProps)(Log));
