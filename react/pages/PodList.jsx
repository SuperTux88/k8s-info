import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';

import InfoIcon from '@material-ui/icons/Info';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

import Loading from '../components/Loading';
import Error from '../components/Error';
import ContainerMenu from '../components/ContainerMenu';
import CompactTableCell from '../components/CompactTableCell';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: darken(theme.palette.background.paper, 0.1),
    },
    height: '32px',
  },
  describeButton: {
    height: theme.spacing.unit * 3,
    width: theme.spacing.unit * 3,
  },
  describeIcon: {
    height: theme.spacing.unit * 2,
    width: theme.spacing.unit * 2,
  },
  containerInfo: {
    display: 'flex',
    alignItems: 'center',
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
});

const mapStateToProps = (state, { match }) => ({
  pods: state.pods,
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
});

class PodList extends Component {
  render() {
    const { classes, currentContext, currentNamespace, pods } = this.props;

    if (pods.loading) {
      return (
        <div>
          <Loading/>
        </div>
      );
    } else if (pods.error) {
      return (
        <div>
          <Error message={pods.error.message}/>
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
                <CompactTableCell>Ready</CompactTableCell>
                <CompactTableCell>Status</CompactTableCell>
                <CompactTableCell numeric>Restarts</CompactTableCell>
                <CompactTableCell numeric>Age</CompactTableCell>
                <CompactTableCell>Describe</CompactTableCell>
                <CompactTableCell>Containers</CompactTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pods.items.filter(pod => (!currentNamespace || pod.metadata.namespace === currentNamespace)).map(pod => {
                const namespace = pod.metadata.namespace;
                const podName = pod.metadata.name;

                const restarts = pod.status.container_statuses.reduce((sum, container) => {
                  return sum + container.restart_count
                }, 0);
                const containers = pod.status.container_statuses;
                const containerCount = containers.length;
                const readyCount = containers.filter(c => c.ready).length;

                let state = pod.status.phase;
                let stateClassName = state === "Running" ? classes.ok : (state === "Failed" ? classes.error : null);
                const containerState = [...new Set(containers.map(container => {
                  return container.state[Object.keys(container.state).find(key => container.state[key])].reason
                }).filter(Boolean))];
                if (containerState.length === 1) {
                  state = containerState[0];
                  stateClassName = classes.error;
                }

                return (
                  <TableRow className={classes.row} key={podName}>
                    <CompactTableCell>{namespace}</CompactTableCell>
                    <CompactTableCell>{podName}</CompactTableCell>
                    <CompactTableCell className={readyCount === containerCount ? classes.ok : null}>
                      {readyCount}/{containerCount}
                    </CompactTableCell>
                    <CompactTableCell className={stateClassName}>{state}</CompactTableCell>
                    <CompactTableCell numeric className={restarts === 0 ? classes.ok : classes.error}>
                      {restarts}
                    </CompactTableCell>
                    <CompactTableCell numeric>
                      <span>{pod.metadata.age}</span>
                    </CompactTableCell>
                    <CompactTableCell>
                      <IconButton
                        className={classes.describeButton}
                        component={Link}
                        to={"/" + currentContext + "/" + namespace + "/" + podName}
                      >
                        <InfoIcon className={classes.describeIcon}/>
                      </IconButton>
                    </CompactTableCell>
                    <CompactTableCell>
                      {containers.map(container => {
                        const containerClasses = [classes.containerName];
                        if (container.ready) {
                          containerClasses.push(classes.ok);
                        } else if (!container.state.running) {
                          containerClasses.push(classes.error);
                        }

                        return (
                          <div className={classes.containerInfo} key={container.name}>
                            <div className={containerClasses.join(' ')}>{container.name}</div>
                            <ContainerMenu context={currentContext} namespace={namespace} pod={podName} container={container.name}/>
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

export default withRouter(connect(mapStateToProps)(withStyles(styles)(PodList)));
