import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import withRoot from './withRoot';

import { fetchContexts } from './actions/contexts';

import AppToolbar from './components/AppToolbar';

import Index from './pages/Index';
import PodList from './pages/PodList';
import PodDescribe from './pages/PodDescribe';
import Log from './pages/Log';
import Processes from './pages/Processes';
import Env from './pages/Env';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchContexts());
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/:context/:namespace?/:pod?/:container?/:page?" component={AppToolbar} />
          <Route exact path="/" component={Index} />
          <Route exact path="/:context/:namespace?" component={PodList} />
          <Route exact path="/:context/:namespace/:pod" component={PodDescribe} />
          <Route exact path="/:context/:namespace/:pod/:container/log" component={Log} />
          <Route exact path="/:context/:namespace/:pod/:container/ps" component={Processes} />
          <Route exact path="/:context/:namespace/:pod/:container/env" component={Env} />
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(withRoot(App));
