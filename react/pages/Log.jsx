import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import qs from 'query-string';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { withStyles } from '@material-ui/core/styles';

import ContainerInfo from '../components/containerInfo/ContainerInfo';
import WrapSwitch from '../components/containerInfo/WrapSwitch';
import TextOutput from '../components/containerInfo/TextOutput';

const styles = theme => ({
  tabsBar: {
    marginLeft: -theme.spacing.unit * 2,
    marginRight: -theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: 'auto',
  },
});

const mapStateToProps = (state, { match, location }) => ({
  pods: state.pods.items,
  currentPod: match.params.pod,
  currentContainer: match.params.container,
  containerInfo: state.containerInfo,
  previous: qs.parse(location.search).previous === 'true',
});

const Log = ({ classes, pods, currentPod, currentContainer, containerInfo, location, previous }) => {
  const pod = pods.find(pod => pod.metadata.name === currentPod);
  const lastState = pod ? pod.status.container_statuses.find(status => status.name === currentContainer).last_state : {};

  return (
    <ContainerInfo
      info={'log' + (previous ? '?previous=true' : '')}
      title="Logs"
      kubectl={{
        command: 'logs',
        params: currentPod + ' --container ' + currentContainer + ' --tail 1000' + (previous ? ' --previous' : ''),
      }}
      extraMenu={<WrapSwitch />}
    >
      <AppBar position="static" color="default" component="div" className={classes.tabsBar}>
        <Tabs
          value={previous ? 1 : 0}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          centered
        >
          <Tab
            label="Current log"
            component={Link}
            to={location.pathname}
          />
          <Tab
            label="Previous log"
            component={Link}
            to={location.pathname + '?previous=true'}
            disabled={!Object.keys(lastState).find(key => lastState[key])}
          />
        </Tabs>
      </AppBar>
      <TextOutput>
        {containerInfo.content}
      </TextOutput>
    </ContainerInfo>
  );
};

Log.propTypes = {
  classes: PropTypes.object.isRequired,
  containerInfo: PropTypes.shape({
    content: PropTypes.string.isRequired,
  }).isRequired,
  currentContainer: PropTypes.string.isRequired,
  currentPod: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  pods: PropTypes.array.isRequired,
  previous: PropTypes.bool.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Log)));
