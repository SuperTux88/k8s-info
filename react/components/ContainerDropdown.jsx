import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

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
  currentContainer: match.params.container,
  currentPage: match.params.page,
});

const ContainerDropdown = ({ classes, currentContext, currentNamespace, currentPod, currentContainer, currentPage, pods }) => {
  const pod = pods.items.find(pod => pod.metadata.name === currentPod);

  return (
    <FormControl className={classes.formControl} disabled={!pod || pod.status.container_statuses.length === 1}>
      <InputLabel htmlFor="container-dropdown">Container</InputLabel>
      <Select
        value={currentContainer}
        inputProps={{
          name: 'container',
          id: 'container-dropdown',
        }}
      >
        {pod && pod.status.container_statuses.map(container => (
          <MenuItem component={Link} to={"/" + currentContext + "/" + currentNamespace + "/" + currentPod + "/" + container.name + "/" + currentPage} value={container.name} key={container.name}>
            {container.name}
          </MenuItem>
        ))}
        {!pod && <MenuItem value={currentContainer}>{currentContainer}</MenuItem>}
      </Select>
    </FormControl>
  );
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(ContainerDropdown)));
