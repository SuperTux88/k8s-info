import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withStyles } from '@material-ui/core/styles';

import { fetchPods } from '../actions/pods';

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
});


class NamespaceDropdown extends Component {
  componentDidMount() {
    this.props.dispatch(fetchPods(this.props.currentContext));
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentContext !== prevProps.currentContext) {
      this.props.dispatch(fetchPods(this.props.currentContext));
    }
  }

  render() {
    const {classes, currentContext, currentNamespace, pods} = this.props;

    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="namespace-dropdown">Namespace</InputLabel>
        <Select
          value={currentNamespace || "all"}
          inputProps={{
            name: 'namespace',
            id: 'namespace-dropdown',
          }}
        >
          <MenuItem component={Link} to={"/" + currentContext} value="all">All</MenuItem>
          {[...new Set(pods.items.map(pod => pod.metadata.namespace))].map(namespace => (
            <MenuItem component={Link} to={"/" + currentContext + "/" + namespace} value={namespace} key={namespace}>
              {namespace}
            </MenuItem>
          ))}
          {pods.loading && currentNamespace && <MenuItem value={currentNamespace}>{currentNamespace}</MenuItem>}
          {pods.loading && <MenuItem><CircularProgress/></MenuItem>}
          {pods.error && <MenuItem>Error!</MenuItem>}
        </Select>
      </FormControl>
    );
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(NamespaceDropdown)));
