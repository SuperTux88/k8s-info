import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

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
    display: 'table-row',
  },
  expansionPanelSummary: {
    minHeight: (theme.spacing.unit * 4) + "px !important",
    backgroundColor: darken(theme.palette.background.paper, 0.1),
  },
  expansionPanelSummaryContent: {
    margin: theme.spacing.unit * -1.5,
    marginRight: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
  },
  expansionPanelSummaryContentInfo: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  expansionPanelDetails: {
    display: 'block',
    padding: theme.spacing.unit * 2,
  },
  buttons: {
    margin: -theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const mapStateToProps = (state, { match }) => ({
  pod: state.pod,
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
  currentPod: match.params.pod,
});

const camelCase = (string) => {
  return string.replace (/(?:^|[-_])(\w)/g, function (_, c) {
    return c ? c.toUpperCase () : '';
  });
};

const probeToString = (probe) => {
  if (probe.http_get) {
    return "http-get " + probe.http_get.scheme.toLowerCase() + "://" + (probe.http_get.host || "") + ":" + probe.http_get.port + probe.http_get.path +
      " delay=" + probe.initial_delay_seconds + "s timeout=" + probe.timeout_seconds + "s period=" + probe.period_seconds + "s " +
      "#success=" + probe.success_threshold + " #failure=" + probe.failure_threshold;
  } else {
    return "TODO"
  }
};

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
    const { classes, currentContext, pod } = this.props;

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
              <DescribeInfoRow title="Containers">
                {spec.containers.map(container => {
                  const linkPrefix = "/" + currentContext + "/" + metadata.namespace + "/" + metadata.name + "/" + container.name + "/";

                  const containerStatus = status.container_statuses.find(status => status.name === container.name);
                  const state = Object.keys(containerStatus.state).find(state => containerStatus.state[state]);
                  const lastState = Object.keys(containerStatus.last_state).find(state => containerStatus.last_state[state]);

                  return (
                    <ExpansionPanel className={classes.expansionPanel} key={container.name}>
                      <ExpansionPanelSummary className={classes.expansionPanelSummary} expandIcon={<ExpandMoreIcon />}>
                        <div style={{width: '100%'}} className={classes.expansionPanelSummaryContent}>
                          <Typography className={classes.expansionPanelSummaryContentInfo}>{container.name}</Typography>
                          <Typography className={classes.expansionPanelSummaryContentInfo} style={containerStatus.ready ? {color: green[500]} : {}}>{containerStatus.ready ? "Ready" : "Not Ready"}</Typography>
                          <Typography className={classes.expansionPanelSummaryContentInfo} style={containerStatus.restart_count === 0 ? {color: green[500]} : {color: red[500]}}>{containerStatus.restart_count + " Restarts"}</Typography>
                        </div>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                        <div className={classes.buttons}>
                          <Button variant="outlined" className={classes.button} component={Link} to={linkPrefix + "log"}>Log</Button>
                          <Button variant="outlined" className={classes.button} component={Link} to={linkPrefix + "ps"}>Processes</Button>
                          <Button variant="outlined" className={classes.button} component={Link} to={linkPrefix + "env"}>Env</Button>
                        </div>
                        <div>
                          <Table className={classes.nestedTable}>
                            <TableBody>
                              <DescribeInfoRow title="Container ID">{containerStatus.container_id}</DescribeInfoRow>
                              <DescribeInfoRow title="Image">{containerStatus.image}</DescribeInfoRow>
                              <DescribeInfoRow title="Image ID">{containerStatus.image_id}</DescribeInfoRow>
                              {container.ports.length > 0 && <DescribeInfoRow title="Ports">
                                <Table className={classes.nestedTable}>
                                  <TableHead>
                                    <TableRow className={classes.nestedTableTitle}>
                                      <CompactTableCell>Port</CompactTableCell>
                                      <CompactTableCell>Host Port</CompactTableCell>
                                      <CompactTableCell>Protocol</CompactTableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {container.ports.map(port => (
                                      <TableRow className={classes.nestedTableRow} key={port.container_port}>
                                        <CompactTableCell>{port.container_port}</CompactTableCell>
                                        <CompactTableCell>{port.host_port || "None"}</CompactTableCell>
                                        <CompactTableCell>{port.protocol}</CompactTableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DescribeInfoRow>}
                              <DescribeInfoRow title="State">
                                <Table className={classes.nestedTable}>
                                  <TableBody>
                                    <DescribeInfoRow title={camelCase(state)}/>
                                    {Object.keys(containerStatus.state[state]).map(key => (
                                      <DescribeInfoRow title={camelCase(key)} key={key}>
                                        {containerStatus.state[state][key]}
                                      </DescribeInfoRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DescribeInfoRow>
                              {lastState && <DescribeInfoRow title="Last State">
                                <Table className={classes.nestedTable}>
                                  <TableBody>
                                    <DescribeInfoRow title={camelCase(lastState)}/>
                                    {Object.keys(containerStatus.last_state[lastState]).map(key => (
                                      <DescribeInfoRow title={camelCase(key)} key={key}>
                                        {containerStatus.last_state[lastState][key]}
                                      </DescribeInfoRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DescribeInfoRow>}
                              {container.resources.requests && <DescribeInfoRow title="Requests">
                                <Table className={classes.nestedTable}>
                                  <TableBody>
                                    {Object.keys(container.resources.requests).map(key => (
                                      <DescribeInfoRow title={key} key={key}>
                                        {container.resources.requests[key]}
                                      </DescribeInfoRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DescribeInfoRow>}
                              {container.resources.limits && <DescribeInfoRow title="Limits">
                                <Table className={classes.nestedTable}>
                                  <TableBody>
                                    {Object.keys(container.resources.limits).map(key => (
                                      <DescribeInfoRow title={key} key={key}>
                                        {container.resources.limits[key]}
                                      </DescribeInfoRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DescribeInfoRow>}
                              {container.liveness_probe && <DescribeInfoRow title="Liveness Probe">
                                {probeToString(container.liveness_probe)}
                              </DescribeInfoRow>}
                              {container.readiness_probe && <DescribeInfoRow title="Readiness Probe">
                                {probeToString(container.liveness_probe)}
                              </DescribeInfoRow>}
                              {container.env.length > 0 && <DescribeInfoRow title="Environment">
                                <Table className={classes.nestedTable}>
                                  <TableBody>
                                    {container.env.map(env => (
                                      <DescribeInfoRow title={env.name} key={env.name}>
                                        {env.value}
                                      </DescribeInfoRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DescribeInfoRow>}
                              <DescribeInfoRow title="Mounts">
                                <Table className={classes.nestedTable}>
                                  <TableHead>
                                    <TableRow className={classes.nestedTableTitle}>
                                      <CompactTableCell>Path</CompactTableCell>
                                      <CompactTableCell>Name</CompactTableCell>
                                      <CompactTableCell>Read only</CompactTableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {container.volume_mounts.map(mount => (
                                      <TableRow className={classes.nestedTableRow} key={mount.mount_path}>
                                        <CompactTableCell>{mount.mount_path}</CompactTableCell>
                                        <CompactTableCell>{mount.name}</CompactTableCell>
                                        <CompactTableCell>{mount.read_only ? "True" : "False"}</CompactTableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DescribeInfoRow>
                            </TableBody>
                          </Table>
                        </div>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  )
                })}
              </DescribeInfoRow>
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
