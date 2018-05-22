import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    height: theme.spacing.unit * 3,
    width: theme.spacing.unit * 3,
  },
  icon: {
    height: theme.spacing.unit * 2,
    width: theme.spacing.unit * 2,
  },
  menuItem: {
    height: theme.spacing.unit * 2,
  },
});

class ContainerMenu extends Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, context, namespace, pod, container } = this.props;
    const { anchorEl } = this.state;
    const menuId = namespace + "-" + pod + "-" + container + "-menu";
    const linkPrefix = "/" + context + "/" + namespace + "/" + pod + "/" + container + "/";

    return (
      <div>
        <IconButton
          className={classes.root}
          aria-label="Container-Info"
          aria-owns={anchorEl ? menuId : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon className={classes.icon}/>
        </IconButton>
        <Menu
          id={menuId}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem className={classes.menuItem} component={Link} to={linkPrefix + "log"}>Log</MenuItem>
          <MenuItem className={classes.menuItem} component={Link} to={linkPrefix + "ps"}>Processes</MenuItem>
          <MenuItem className={classes.menuItem} component={Link} to={linkPrefix + "env"}>Env</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(ContainerMenu);
