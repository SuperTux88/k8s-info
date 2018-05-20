import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import Loading from '../components/Loading';
import Error from '../components/Error';
import {fetchPods} from "../actions/pods";

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
});

const mapStateToProps = (state, { match }) => ({
  pods: state.pods,
  currentContext: match.params.context,
});

class PodList extends Component {
  componentDidMount() {
    this.props.dispatch(fetchPods(this.props.currentContext));
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentContext !== prevProps.currentContext) {
      this.props.dispatch(fetchPods(this.props.currentContext));
    }
  }

  render() {
    const { classes, pods } = this.props;

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
              </TableRow>
            </TableHead>
            <TableBody>
              {pods.items.map(pod => {
                const restarts = pod.status.container_statuses.reduce((sum, container) => {
                  return sum + container.restart_count
                }, 0);
                const containers = pod.status.container_statuses.length;
                const ready = pod.status.container_statuses.filter(c => c.ready).length;

                return (
                  <TableRow className={classes.row} key={pod.metadata.name}>
                    <TableCell>{pod.metadata.namespace}</TableCell>
                    <TableCell>{pod.metadata.name}</TableCell>
                    <TableCell style={(containers === ready) ? {color: green[500]} : {}}>{ready}/{containers}</TableCell>
                    <TableCell>{pod.status.phase}</TableCell>
                    <TableCell numeric style={(restarts === 0) ? {color: green[500]} : {color: red[500]}}>{restarts}</TableCell>
                    <TableCell numeric>{pod.metadata.age}</TableCell>
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
