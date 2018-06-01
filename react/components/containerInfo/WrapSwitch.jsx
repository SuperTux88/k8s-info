import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { changeOutputWrap } from '../../actions/output';

const mapStateToProps = (state) => ({
  wrapped: state.output.wrapped,
});

class WrapSwitch extends Component {
  handleWrapChange = event => {
    const { dispatch } = this.props;

    dispatch(changeOutputWrap(event.target.checked));
  };

  render() {
    const { wrapped } = this.props;

    return (
      <FormControlLabel
        control={
          <Switch
            checked={wrapped}
            onChange={this.handleWrapChange}
            color="primary"
          />
        }
        label="Wrap output"
      />
    );
  }
}

WrapSwitch.propTypes = {
  dispatch: PropTypes.func.isRequired,
  wrapped: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(WrapSwitch);
