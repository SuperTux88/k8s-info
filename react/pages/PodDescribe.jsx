import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import { withStyles } from '@material-ui/core/styles';

import { fetchPodDescribe } from '../actions/pod';

import Loading from '../components/Loading';
import Error from '../components/Error';
import DescribeInfoRow from '../components/DescribeInfoRow';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
  },
  table: {
    width: 'auto',
  },
  nestedTable: {
    marginTop: -theme.spacing.unit/2,
    marginBottom: -theme.spacing.unit/2,
  },
});

const mapStateToProps = (state, { match }) => ({
  pod: state.pod,
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
  currentPod: match.params.pod,
});

class PodDescribe extends Component {
  fetchContent = () => {
    const { currentContext, currentNamespace, currentPod } = this.props;
    this.props.dispatch(fetchPodDescribe(currentContext, currentNamespace, currentPod));
  };

  componentDidMount() {
    this.fetchContent();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentContext !== prevProps.currentContext ||
      this.props.currentNamespace !== prevProps.currentNamespace ||
      this.props.currentPod !== prevProps.currentPod) {
      this.fetchContent();
    }
  }

  render() {
    const { classes, pod } = this.props;

    if (pod.error) {
      return (
        <div>
          <Error message={pod.error.message}/>
        </div>
      );
    } else if (pod.loading || !pod.pod) {
      return (
        <div>
          <Loading/>
        </div>
      );
    } else {
      const metadata = pod.pod.metadata;
      const spec = pod.pod.spec;
      const status = pod.pod.status;

      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableBody>
              <DescribeInfoRow title="Name">{metadata.name}</DescribeInfoRow>
              <DescribeInfoRow title="Namespace">{metadata.namespace}</DescribeInfoRow>
              <DescribeInfoRow title="Status">{status.phase}</DescribeInfoRow>
              <DescribeInfoRow title="Node">{spec.node_name || "None"}</DescribeInfoRow>
              <DescribeInfoRow title="Node IP">{status.host_ip || "None"}</DescribeInfoRow>
              <DescribeInfoRow title="Pod IP">{status.pod_ip || "None"}</DescribeInfoRow>
              {metadata.owner_references && <DescribeInfoRow title="Controlled by">{metadata.owner_references.map(ref => (
                <div key={ref.name}>{ref.kind}/{ref.name}</div>
              ))}</DescribeInfoRow>}
              <DescribeInfoRow title="QoS Class">{status.qos_class}</DescribeInfoRow>
              {spec.node_selector && <DescribeInfoRow title="Node-Selectors">
                <Table className={classes.nestedTable}>
                  <TableBody>
                    {Object.keys(spec.node_selector).map(key => (
                      <DescribeInfoRow title={key} key={key}>{spec.node_selector[key]}</DescribeInfoRow>
                    ))}
                  </TableBody>
                </Table>
              </DescribeInfoRow>}
              {spec.tolerations && <DescribeInfoRow title="Tolerations">{spec.tolerations.map(toleration => (
                <div key={toleration.key}>{toleration.key}:{toleration.effect} for {toleration.toleration_seconds}s</div>
              ))}</DescribeInfoRow>}
              <DescribeInfoRow title="Labels">
                <Table className={classes.nestedTable}>
                  <TableBody>
                    {Object.keys(metadata.labels).map(key => (
                      <DescribeInfoRow title={key} key={key}>{metadata.labels[key]}</DescribeInfoRow>
                    ))}
                  </TableBody>
                </Table>
              </DescribeInfoRow>
              <DescribeInfoRow title="Containers">TODO!</DescribeInfoRow>
              <DescribeInfoRow title="Conditions">TODO!</DescribeInfoRow>
              <DescribeInfoRow title="Volumes">TODO!</DescribeInfoRow>
              <DescribeInfoRow title="Events">TODO!</DescribeInfoRow>
            </TableBody>
          </Table>
        </Paper>
      );
    }
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(PodDescribe)));
