import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

import { fetchContainerInfo } from '../actions/containerInfo';

import Loading from '../components/Loading';
import Error from '../components/Error';
import DescribeInfoRow from '../components/describe/DescribeInfoRow';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
  },
  switch: {
    marginTop: -theme.spacing.unit,
  },
  pre: {
    overflow: 'auto',
    fontFamily: ['Roboto Mono', 'monospace'],
    fontSize: theme.typography.pxToRem(12),
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: darken(theme.palette.background.paper, 0.1),
    },
  },
});

const mapStateToProps = (state, { match }) => ({
  context: match.params.context,
  namespace: match.params.namespace,
  pod: match.params.pod,
  container: match.params.container,
  page: match.params.page,
  containerInfo: state.containerInfo,
});

class ContainerInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wrapped: JSON.parse(localStorage.getItem('wrapTextOutput')),
    };
  }

  handleWrapChange = event => {
    localStorage.setItem('wrapTextOutput', event.target.checked);
    this.setState({ wrapped: event.target.checked });
  }

  fetchContent() {
    const { context, namespace, pod, container, page, dispatch } = this.props;

    dispatch(fetchContainerInfo(context, namespace, pod, container, page));
  }

  componentDidMount() {
    this.fetchContent();
  }

  componentDidUpdate(prevProps) {
    const { context, namespace, pod, container, page } = this.props;

    if (context !== prevProps.context ||
      namespace !== prevProps.namespace ||
      pod !== prevProps.pod ||
      container !== prevProps.container ||
      page !== prevProps.page) {
      this.fetchContent();
    }
  }

  render() {
    const { classes, containerInfo } = this.props;
    const { wrapped } = this.state;

    if (containerInfo.error) {
      return (
        <div>
          <Error message={containerInfo.error.message} />
        </div>
      );
    } else if (containerInfo.loading || !containerInfo.content) {
      return (
        <div>
          <Loading />
        </div>
      );
    } else {
      return (
        <Paper className={classes.root}>
          {typeof containerInfo.content === 'string' &&
            <div>
              <FormControlLabel
                control={
                  <Switch
                    checked={wrapped}
                    onChange={this.handleWrapChange}
                    color="primary"
                  />
                }
                label="Wrap output"
                className={classes.switch}
              />
              <Typography component='pre' className={classes.pre} style={wrapped ? { whiteSpace: 'pre-wrap', wordBreak: 'break-all' } : {}}>
                {containerInfo.content}
              </Typography>
            </div>
          }
          {typeof containerInfo.content === 'object' &&
            <Table>
              <TableBody>
                {Object.keys(containerInfo.content).map(key => (
                  <DescribeInfoRow title={key} key={key} className={classes.row}>
                    {containerInfo.content[key]}
                  </DescribeInfoRow>
                ))}
              </TableBody>
            </Table>
          }
        </Paper>
      );
    }
  }
}

ContainerInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.string.isRequired,
  containerInfo: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }).isRequired,
  context: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
  pod: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(ContainerInfo)));
