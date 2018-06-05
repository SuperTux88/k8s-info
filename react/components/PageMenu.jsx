import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Tooltip from '@material-ui/core/Tooltip';

import ContentCopyIcon from '@material-ui/icons/ContentCopy';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import CommandDialog from './CommandDialog';

class PageMenu extends Component {
  state = {
    anchorEl: null,
    commandDialogOpen: false,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleCommandDialogOpen = () => {
    this.handleClose();
    this.setState({ commandDialogOpen: true });
  };

  handleCommandDialogClose = () => {
    this.setState({ commandDialogOpen: false });
  };

  render() {
    const { kubectl, apiPath, menuItems, className } = this.props;
    const { anchorEl, commandDialogOpen } = this.state;

    return (
      <div className={className}>
        <Tooltip id="open-copy-dialog" title="Copy commands" enterDelay={300}>
          <IconButton
            aria-labelledby="open-copy-dialog"
            onClick={this.handleCommandDialogOpen}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
        {menuItems &&
          <IconButton
            aria-label="More"
            aria-owns={anchorEl ? 'page-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        }
        <Menu
          id="page-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {menuItems}
        </Menu>
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
  kubectl: PropTypes.object.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.node),
};

export default PageMenu;
