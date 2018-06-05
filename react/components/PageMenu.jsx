import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import ContentCopyIcon from '@material-ui/icons/ContentCopy';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTerminal from '@fortawesome/fontawesome-free-solid/faTerminal';

import CommandDialog from './CommandDialog';

class PageMenu extends Component {
  state = {
    commandDialogOpen: false,
  };

  handleCommandDialogOpen = () => {
    this.setState({ commandDialogOpen: true });
  };

  handleCommandDialogClose = () => {
    this.setState({ commandDialogOpen: false });
  };

  render() {
    const { kubectl, apiPath, extraMenu, className } = this.props;
    const { commandDialogOpen } = this.state;

    return (
      <div className={className}>
        {extraMenu}
        <Tooltip id="open-copy-dialog" title="Copy commands" enterDelay={300}>
          <IconButton
            aria-labelledby="open-copy-dialog"
            onClick={this.handleCommandDialogOpen}
          >
            <FontAwesomeIcon icon={faTerminal} style={{ width: 24 }} />
          </IconButton>
        </Tooltip>
        <CommandDialog
          kubectl={kubectl}
          apiPath={apiPath}
          onClose={this.handleCommandDialogClose}
          open={commandDialogOpen}
        />
      </div>
    );
  }
}

PageMenu.propTypes = {
  apiPath: PropTypes.string.isRequired,
  className: PropTypes.string,
  extraMenu: PropTypes.node,
  kubectl: PropTypes.object.isRequired,
};

export default PageMenu;
