import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import qs from 'query-string';

import MenuItem from '@material-ui/core/MenuItem';

import ContainerInfo from '../components/containerInfo/ContainerInfo';
import WrapSwitch from '../components/containerInfo/WrapSwitch';
import TextOutput from '../components/containerInfo/TextOutput';

const mapStateToProps = (state, { match, location }) => ({
  pods: state.pods.items,
  currentPod: match.params.pod,
  currentContainer: match.params.container,
  containerInfo: state.containerInfo,
  previous: qs.parse(location.search).previous === 'true',
});

const Log = ({ pods, currentPod, currentContainer, containerInfo, location, previous }) => {
  const pod = pods.find(pod => pod.metadata.name === currentPod);
  const lastState = pod ? pod.status.container_statuses.find(status => status.name === currentContainer).last_state : {};

  return (
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
        (!previous && Object.keys(lastState).find(key => lastState[key]) &&
          <MenuItem key="show-previous-log" component={Link} to={location.pathname + '?previous=true'}>
            Show previous log
          </MenuItem>
        ),
        (previous &&
          <MenuItem key="show-current-log" component={Link} to={location.pathname}>
            Show current log
          </MenuItem>
        ),
      ]}
    >
      <TextOutput>
        {containerInfo.content}
      </TextOutput>
    </ContainerInfo>
  );
};

Log.propTypes = {
  containerInfo: PropTypes.shape({
    content: PropTypes.string.isRequired,
  }).isRequired,
  currentContainer: PropTypes.string.isRequired,
  currentPod: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  pods: PropTypes.array.isRequired,
  previous: PropTypes.bool.isRequired,
};

export default withRouter(connect(mapStateToProps)(Log));
