import React from 'react';
import { connect } from 'react-redux';


import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

const mapStateToProps = state => ({
  contexts: state.contexts
});

const ContextDropdown = ({ classes, match, contexts }) => {
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="context-dropdown">Context</InputLabel>
      <Select
        value={match.params.context}
        inputProps={{
          name: 'context',
          id: 'context-dropdown',
        }}
      >
        {contexts.items.map(context => (
          <MenuItem component={Link} to={"/" + context} value={context} key={context}>
            {context}
          </MenuItem>
        ))}
        {contexts.loading && <MenuItem value={match.params.context}>{match.params.context}</MenuItem>}
        {contexts.loading && <MenuItem><CircularProgress /></MenuItem>}
        {contexts.error && <MenuItem>Error!</MenuItem>}
      </Select>
    </FormControl>
  );
};

export default connect(mapStateToProps)(withStyles(styles)(ContextDropdown));
