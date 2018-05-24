import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

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
    height: '32px',
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
    alignItems: 'center',
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
    minHeight: theme.spacing.unit * 3,
    minWidth: theme.spacing.unit * 6,
    paddingTop: theme.spacing.unit / 4,
    paddingBottom: theme.spacing.unit / 4,
  },
});

const mapStateToProps = (state, { match }) => ({
  pods: state.pods,
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
});

class PodList extends Component {
  componentDidMount() {
    if (this.props.pods.items.length > 0) {
      this.props.dispatch(fetchPods(this.props.currentContext));
    }
  }

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
                <CompactTableCell numeric>Age</CompactTableCell>
                <CompactTableCell>Ready</CompactTableCell>
                <CompactTableCell>Status</CompactTableCell>
                <CompactTableCell numeric>Restarts</CompactTableCell>
                <CompactTableCell>Containers</CompactTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pods.items.filter(pod => (!currentNamespace || pod.metadata.namespace === currentNamespace)).map(pod => {
                const namespace = pod.metadata.namespace;
                const podName = pod.metadata.name;
                const podLink = "/" + currentContext + "/" + namespace + "/" + podName;

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
                    <CompactTableCell>
                      <div className={classes.podName}>
                        <Link className={classes.podLink} to={podLink}>{podName}</Link>
                        <Button size="small" variant="outlined" className={classes.button} component={Link} to={podLink}>Describe</Button>
                      </div>
                    </CompactTableCell>
                    <CompactTableCell numeric>
                      <span>{pod.metadata.age}</span>
                    </CompactTableCell>
                    <CompactTableCell className={readyCount === containerCount ? classes.ok : null}>
                      {readyCount}/{containerCount}
                    </CompactTableCell>
                    <CompactTableCell className={stateClassName}>{state}</CompactTableCell>
                    <CompactTableCell numeric className={restarts === 0 ? classes.ok : classes.error}>
                      {restarts}
                    </CompactTableCell>
                    <CompactTableCell>
                      {containers.map(container => {
                        const linkPrefix = "/" + currentContext + "/" + namespace + "/" + podName + "/" + container.name + "/";

                        const containerClasses = [classes.containerName];
                        if (container.ready) {
                          containerClasses.push(classes.ok);
                        } else if (!container.state.running) {
                          containerClasses.push(classes.error);
                        }

                        return (
                          <div className={classes.containerInfo} key={container.name}>
                            <div className={containerClasses.join(' ')}>{container.name}</div>
                            <Button size="small" variant="outlined" className={classes.button} component={Link} to={linkPrefix + "log"}>Log</Button>
                            <Button size="small" variant="outlined" className={classes.button} component={Link} to={linkPrefix + "ps"}>Processes</Button>
                            <Button size="small" variant="outlined" className={classes.button} component={Link} to={linkPrefix + "env"}>Env</Button>
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
