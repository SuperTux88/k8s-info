import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import qs from 'query-string';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

import get from 'lodash/get';

import { fetchPods, getApiPath } from '../actions/pods';

import LoadingPage from '../components/LoadingPage';
import CompactTableCell from '../components/elements/CompactTableCell';
import StatusText from '../components/elements/StatusText';

const styles = theme => ({
  root: {
    margin: -theme.spacing.unit * 2,
    marginTop: -theme.spacing.unit,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: darken(theme.palette.background.paper, 0.1),
    },
    height: 32,
  },
  podName: {
    display: 'flex',
    alignItems: 'center',
  },
  podLink: {
    flex: 1,
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  containerInfo: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 24,
    '&:not(:last-child)': {
      marginBottom: theme.spacing.unit / 4,
    },
  },
  containerName: {
    flex: 1,
  },
  button: {
    marginLeft: theme.spacing.unit,
    minHeight: 24,
    minWidth: theme.spacing.unit * 6,
    paddingTop: theme.spacing.unit / 4,
    paddingBottom: theme.spacing.unit / 4,
  },
});

const mapStateToProps = (state, { match, location }) => ({
  pods: state.pods,
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
  filter: qs.parse(location.search).filter,
});

class PodList extends Component {
  componentDidMount() {
    const { pods, currentContext, dispatch } = this.props;

    if (pods.items.length > 0) {
      dispatch(fetchPods(currentContext));
    }
  }

  filterPods() {
    const { pods, currentNamespace, filter } = this.props;
    const displayedPods = pods.items.filter(pod => (!currentNamespace || pod.metadata.namespace === currentNamespace));

    if (filter) {
      return displayedPods.filter(pod => pod.metadata.name.startsWith(filter));
    }

    return displayedPods;
  }

  render() {
    const { classes, currentContext, currentNamespace, pods } = this.props;

    return (
      <LoadingPage
        loading={pods.loading}
        error={pods.error}
        title={'Pod list: ' + currentContext + (currentNamespace ? ' / ' + currentNamespace : '')}
        kubectl={{ command: 'get pods' }}
        apiPath={getApiPath(currentContext)}
      >
        <div className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                <CompactTableCell>Namespace</CompactTableCell>
                <CompactTableCell>Pod Name</CompactTableCell>
                <CompactTableCell numeric>Age</CompactTableCell>
                <CompactTableCell>Status</CompactTableCell>
                <CompactTableCell numeric>Restarts</CompactTableCell>
                <CompactTableCell>Containers</CompactTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.filterPods().map(pod => {
                const namespace = pod.metadata.namespace;
                const podName = pod.metadata.name;
                const podLink = '/' + currentContext + '/' + namespace + '/' + podName;

                const containers = pod.status.container_statuses;

                let state = pod.status.phase;
                if (pod.metadata.deletion_timestamp) {
                  state = 'Terminating';
                }

                let stateType = state === 'Running' ? 'ok' : (state === 'Failed' ? 'error' : null);
                if (!pod.metadata.deletion_timestamp) {
                  const containerState = [...new Set(containers.map(container => {
                    return container.state[Object.keys(container.state).find(key => container.state[key])].reason;
                  }).filter(Boolean))];
                  if (containerState.length === 1) {
                    state = containerState[0];
                    stateType = state === 'ContainerCreating' ? null : 'error';
                  }
                }

                return (
                  <TableRow className={classes.row} key={podName}>
                    <CompactTableCell>{namespace}</CompactTableCell>
                    <CompactTableCell>
                      <div className={classes.podName}>
                        <Link className={classes.podLink} to={podLink}>{podName}</Link>
                        <Button size="small" variant="outlined" className={classes.button} component={Link} to={podLink}>Describe</Button>
                      </div>
                    </CompactTableCell>
                    <CompactTableCell numeric>
                      <Tooltip title={pod.metadata.creation_timestamp} placement="top">
                        <span>{pod.metadata.age}</span>
                      </Tooltip>
                    </CompactTableCell>
                    <CompactTableCell><StatusText type={stateType}>{state}</StatusText></CompactTableCell>
                    <CompactTableCell>
                      {containers.map(container => (
                        <StatusText
                          className={classes.containerInfo}
                          type={container.restart_count === 0 ? 'ok' : 'error'}
                          key={container.name + '-restarts'}
                        >
                          {container.restart_count}
                        </StatusText>
                      ))}
                    </CompactTableCell>
                    <CompactTableCell>
                      {containers.map(container => {
                        const linkPrefix = '/' + currentContext + '/' + namespace + '/' + podName + '/' + container.name + '/';

                        let containerStatus = null;
                        if (container.ready) {
                          containerStatus = 'ok';
                        } else if (!container.state.running &&
                          get(container.state, 'waiting.reason') !== 'ContainerCreating' &&
                          get(container.state, 'terminated.reason') !== 'Completed') {
                          containerStatus = 'error';
                        }

                        return (
                          <div className={classes.containerInfo} key={container.name}>
                            <StatusText className={classes.containerName} type={containerStatus}>{container.name}</StatusText>
                            <Button size="small" variant="outlined" className={classes.button} component={Link} to={linkPrefix + 'log'}>Log</Button>
                            <Button size="small" variant="outlined" className={classes.button} component={Link} to={linkPrefix + 'ps'}>Processes</Button>
                            <Button size="small" variant="outlined" className={classes.button} component={Link} to={linkPrefix + 'env'}>Env</Button>
                          </div>
                        );
                      })}
                    </CompactTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </LoadingPage>
    );
  }
}

PodList.propTypes = {
  classes: PropTypes.object.isRequired,
  currentContext: PropTypes.string.isRequired,
  currentNamespace: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  filter: PropTypes.string,
  pods: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    items: PropTypes.array.isRequired,
  }).isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(PodList)));
