import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import qs from 'query-string';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

import get from 'lodash/get';

import { fetchPods } from '../actions/pods';

import Loading from '../components/Loading';
import Error from '../components/Error';
import CompactTableCell from '../components/CompactTableCell';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
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
  ok: {
    color: theme.palette.text.ok,
  },
  error: {
    color: theme.palette.text.error,
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
    const { classes, currentContext, pods } = this.props;

    if (pods.loading) {
      return (
        <div>
          <Loading />
        </div>
      );
    } else if (pods.error) {
      return (
        <div>
          <Error message={pods.error.message} />
        </div>
      );
    } else {
      return (
        <Paper className={classes.root}>
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

                let stateClassName = state === 'Running' ? classes.ok : (state === 'Failed' ? classes.error : null);
                if (!pod.metadata.deletion_timestamp) {
                  const containerState = [...new Set(containers.map(container => {
                    return container.state[Object.keys(container.state).find(key => container.state[key])].reason;
                  }).filter(Boolean))];
                  if (containerState.length === 1) {
                    state = containerState[0];
                    stateClassName = state === 'ContainerCreating' ? null : classes.error;
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
                      <span>{pod.metadata.age}</span>
                    </CompactTableCell>
                    <CompactTableCell className={stateClassName}>{state}</CompactTableCell>
                    <CompactTableCell>
                      {containers.map(container => {
                        const colorClass = container.restart_count === 0 ? classes.ok : classes.error;

                        return (
                          <div className={[classes.containerInfo, colorClass].join(' ')} key={container.name + '-restarts'}>
                            {container.restart_count}
                          </div>
                        );
                      })}
                    </CompactTableCell>
                    <CompactTableCell>
                      {containers.map(container => {
                        const linkPrefix = '/' + currentContext + '/' + namespace + '/' + podName + '/' + container.name + '/';

                        const containerClasses = [classes.containerName];
                        if (container.ready) {
                          containerClasses.push(classes.ok);
                        } else if (!container.state.running &&
                          get(container.state, 'waiting.reason') !== 'ContainerCreating' &&
                          get(container.state, 'terminated.reason') !== 'Completed') {
                          containerClasses.push(classes.error);
                        }

                        return (
                          <div className={classes.containerInfo} key={container.name}>
                            <div className={containerClasses.join(' ')}>{container.name}</div>
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
        </Paper>
      );
    }
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
