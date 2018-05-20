import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { fetchContexts } from '../actions/contexts'
import { fetchPods } from '../actions/pods'

const mapStateToProps = (state, { match }) => ({
  currentContext: match.params.context
});

class Refresh extends Component {
  handleRefresh = () => {
    this.props.dispatch(fetchContexts());
    this.props.dispatch(fetchPods(this.props.currentContext));
  };

  render() {
    return (
      <IconButton onClick={this.handleRefresh}>
        <RefreshIcon />
      </IconButton>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Refresh));
