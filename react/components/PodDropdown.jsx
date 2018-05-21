import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

const mapStateToProps = (state, { match }) => ({
  pods: state.pods,
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
  currentPod: match.params.pod,
});

const PodDropdown = ({ classes, currentContext, currentNamespace, currentPod, pods }) => {
  return (
    <FormControl className={classes.formControl} disabled>
      <InputLabel htmlFor="pod-dropdown">Pod</InputLabel>
      <Select
        value={currentPod}
        inputProps={{
          name: 'pod',
          id: 'pod-dropdown',
        }}
      >
        <MenuItem value={currentPod}>{currentPod}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(PodDropdown)));
