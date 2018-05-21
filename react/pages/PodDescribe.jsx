import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

import { fetchPodDescribe } from '../actions/pod';

import Loading from '../components/Loading';
import Error from '../components/Error';
import DescribeInfoRow from '../components/DescribeInfoRow';
import CompactTableCell from '../components/CompactTableCell';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    overflow: 'auto',
  },
  table: {
    width: 'auto',
  },
  nestedTable: {
    width: 'auto',
    marginTop: -theme.spacing.unit/2,
    marginBottom: -theme.spacing.unit/2,
  },
  nestedTableTitle: {
    height: '32px',
  },
  nestedTableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: darken(theme.palette.background.paper, 0.1),
    },
    height: '32px',
  },
  expansionPanel: {
    display: 'table-cell',
  },
  expansionPanelSummary: {
    minHeight: (theme.spacing.unit * 4) + "px !important",
    backgroundColor: darken(theme.palette.background.paper, 0.1),
  },
  expansionPanelSummaryContent: {
    margin: theme.spacing.unit * -1.5,
    marginTop: theme.spacing.unit * -1.25,
    marginRight: theme.spacing.unit * 2,
  },
  expansionPanelDetails: {
    padding: theme.spacing.unit * 2,
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
                <div key={toleration.key + ":" + toleration.effect}>{toleration.key}:{toleration.effect}{toleration.toleration_seconds && " for " + toleration.toleration_seconds + "s"}</div>
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
              <DescribeInfoRow title="Volumes">
                {spec.volumes.map(volume => {
                  const type = Object.keys(volume).find(key => key !== 'name' && volume[key]);

                  return (
                    <ExpansionPanel className={classes.expansionPanel} key={volume.name}>
                      <ExpansionPanelSummary className={classes.expansionPanelSummary} expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.expansionPanelSummaryContent}>{volume.name}</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                        <Table className={classes.nestedTable}>
                          <TableBody>
                            <DescribeInfoRow title="Type">{type}</DescribeInfoRow>
                            <DescribeInfoRow title="Optional">{volume[type].optional ? "True" : "False"}</DescribeInfoRow>
                          </TableBody>
                        </Table>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  )
                })}
              </DescribeInfoRow>
              <DescribeInfoRow title="Conditions">
                <Table className={classes.nestedTable}>
                  <TableHead>
                    <TableRow className={classes.nestedTableTitle}>
                      <CompactTableCell>Type</CompactTableCell>
                      <CompactTableCell>Status</CompactTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {status.conditions.map(condition => (
                      <TableRow className={classes.nestedTableRow} key={condition.type}>
                        <CompactTableCell>{condition.type}</CompactTableCell>
                        <CompactTableCell>{condition.status}</CompactTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DescribeInfoRow>
              <DescribeInfoRow title="Events">
                {pod.pod.events.length == 0 && "None"}
                {pod.pod.events.length > 0 && <Table className={classes.nestedTable}>
                  <TableHead>
                    <TableRow className={classes.nestedTableTitle}>
                      <CompactTableCell>Type</CompactTableCell>
                      <CompactTableCell>Reason</CompactTableCell>
                      <CompactTableCell numeric>Age</CompactTableCell>
                      <CompactTableCell>From</CompactTableCell>
                      <CompactTableCell>Message</CompactTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pod.pod.events.map(event => (
                      <TableRow className={classes.nestedTableRow} key={event.reason}>
                        <CompactTableCell>{event.type}</CompactTableCell>
                        <CompactTableCell>{event.reason}</CompactTableCell>
                        <CompactTableCell numeric>{event.metadata.age}</CompactTableCell>
                        <CompactTableCell>{event.source.component}{event.source.host && ", " + event.source.host}</CompactTableCell>
                        <CompactTableCell>{event.message}</CompactTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>}
              </DescribeInfoRow>
            </TableBody>
          </Table>
        </Paper>
      );
    }
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(PodDescribe)));
