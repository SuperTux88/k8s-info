import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

import ContainerInfo from '../components/containerInfo/ContainerInfo';
import DescribeInfoRow from '../components/describe/DescribeInfoRow';

const styles = theme => ({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: darken(theme.palette.background.paper, 0.1),
    },
  },
});

const mapStateToProps = (state, { match }) => ({
  currentPod: match.params.pod,
  currentContainer: match.params.container,
  containerInfo: state.containerInfo,
});

const Env = ({ classes, currentPod, currentContainer, containerInfo }) => (
  <ContainerInfo
    info="env"
    title="Environment"
    kubectl={{ command: 'exec', params: currentPod + ' --container ' + currentContainer + ' printenv' }}
  >
    <Table>
      <TableBody>
        {Object.keys(containerInfo.data).map(key => (
          <DescribeInfoRow title={key} key={key} className={classes.row}>
            {containerInfo.data[key]}
          </DescribeInfoRow>
        ))}
      </TableBody>
    </Table>
  </ContainerInfo>
);

Env.propTypes = {
  classes: PropTypes.object.isRequired,
  containerInfo: PropTypes.shape({
    data: PropTypes.object.isRequired,
  }).isRequired,
  currentContainer: PropTypes.string.isRequired,
  currentPod: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Env)));
