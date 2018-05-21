import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import InfoIcon from '@material-ui/icons/Info';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import Loading from '../components/Loading';
import Error from '../components/Error';
import ContainerMenu from '../components/ContainerMenu';

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
  }
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
                <TableCell>Namespace</TableCell>
                <TableCell>Pod Name</TableCell>
                <TableCell>Ready</TableCell>
                <TableCell>Status</TableCell>
                <TableCell numeric>Restarts</TableCell>
                <TableCell numeric>Age</TableCell>
                <TableCell>Describe</TableCell>
                <TableCell>Containers</TableCell>
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

                return (
                  <TableRow className={classes.row} key={podName}>
                    <TableCell>{namespace}</TableCell>
                    <TableCell>{podName}</TableCell>
                    <TableCell style={(readyCount === containerCount) ? {color: green[500]} : {}}>
                      {readyCount}/{containerCount}
                    </TableCell>
                    <TableCell>{pod.status.phase}</TableCell>
                    <TableCell numeric style={(restarts === 0) ? {color: green[500]} : {color: red[500]}}>
                      {restarts}
                    </TableCell>
                    <TableCell numeric>
                      <Tooltip title={pod.metadata.creation_timestamp} placement="top">
                        <span>{pod.metadata.age}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Describe" placement="top">
                        <IconButton
                          className={classes.describeButton}
                          component={Link}
                          to={"/" + currentContext + "/" + namespace + "/" + podName}
                        >
                          <InfoIcon className={classes.describeIcon}/>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {containers.map(container => {
                        return (
                          <div className={classes.containerInfo} key={container.name}>
                            <div className={classes.containerName}>{container.name}</div>
                            <ContainerMenu context={currentContext} namespace={namespace} pod={podName} container={container.name}/>
                          </div>
                        );
                      })}
                    </TableCell>
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
