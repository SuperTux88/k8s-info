import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';

import Loading from '../components/Loading';

class PodList extends Component {
  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <Loading />
        <Typography component="div">
          <p>TODO!</p>
          <p>Current context: {this.props.match.params.context}</p>
        </Typography>
      </div>
    );
  }
}

export default PodList;
