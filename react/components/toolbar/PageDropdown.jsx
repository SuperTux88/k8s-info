import React from 'react';
import PropTypes from 'prop-types';
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
  currentContext: match.params.context,
  currentNamespace: match.params.namespace,
  currentPod: match.params.pod,
  currentContainer: match.params.container,
  currentPage: match.params.page,
});

const PageDropdown = ({ classes, currentContext, currentNamespace, currentPod, currentContainer, currentPage }) => {
  const linkPrefix = '/' + currentContext + '/' + currentNamespace + '/' + currentPod + '/' + currentContainer + '/';

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="page-dropdown">Page</InputLabel>
      <Select
        value={currentPage}
        inputProps={{
          name: 'page',
          id: 'page-dropdown',
        }}
      >
        <MenuItem component={Link} to={linkPrefix + 'log'} value="log">Log</MenuItem>
        <MenuItem component={Link} to={linkPrefix + 'ps'} value="ps">Processes</MenuItem>
        <MenuItem component={Link} to={linkPrefix + 'env'} value="env">Env</MenuItem>
      </Select>
    </FormControl>
  );
};

PageDropdown.propTypes = {
  classes: PropTypes.object.isRequired,
  currentContainer: PropTypes.string.isRequired,
  currentContext: PropTypes.string.isRequired,
  currentNamespace: PropTypes.string.isRequired,
  currentPage: PropTypes.string.isRequired,
  currentPod: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(PageDropdown)));
