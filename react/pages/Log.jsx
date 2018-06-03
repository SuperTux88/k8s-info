import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import qs from 'query-string';

import MenuItem from '@material-ui/core/MenuItem';

import ContainerInfo from '../components/containerInfo/ContainerInfo';
import WrapSwitch from '../components/containerInfo/WrapSwitch';
import TextOutput from '../components/containerInfo/TextOutput';

const mapStateToProps = (state, { match, location }) => ({
  currentPod: match.params.pod,
  currentContainer: match.params.container,
  containerInfo: state.containerInfo,
  previous: qs.parse(location.search).previous === 'true',
});

const Log = ({ currentPod, currentContainer, containerInfo, previous }) => (
  <ContainerInfo
    info={'log' + (previous ? '?previous=true' : '')}
    title={previous ? 'Previous logs' : 'Logs'}
    kubectl={{
      command: 'logs',
      params: currentPod + ' --container ' + currentContainer + ' --tail 1000' + (previous ? ' --previous' : ''),
    }}
    menuItems={[
      <MenuItem key="wrap-switch">
        <WrapSwitch />
      </MenuItem>,
    ]}
  >
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
  previous: PropTypes.bool.isRequired,
};

export default withRouter(connect(mapStateToProps)(Log));
