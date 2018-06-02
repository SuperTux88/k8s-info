import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import ContentCopyIcon from '@material-ui/icons/ContentCopy';

import { CopyToClipboard } from 'react-copy-to-clipboard';

class CopyTextField extends Component {
  handleFocus = (event) => {
    event.target.select();
  };

  render() {
    const { id, label, value } = this.props;

    return (
      <TextField
        id={id}
        inputProps={{
          readOnly: true,
          onFocus: this.handleFocus,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip id={id + '-copy'} title="Copy to clipboard" enterDelay={300}>
                <CopyToClipboard text={value}>
                  <IconButton aria-labelledby={id + '-copy'}>
                    <ContentCopyIcon />
                  </IconButton>
                </CopyToClipboard>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        margin="dense"
        fullWidth
        label={label}
        value={value}
      />
    );
  }
}

CopyTextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default CopyTextField;
