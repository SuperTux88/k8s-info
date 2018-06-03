import React from 'react';
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  cell: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
});

const CompactTableCell = ({ classes, className, children, ...props }) => (
  <TableCell {...props} className={[classes.cell, className].join(' ')}>{children}</TableCell>
);

CompactTableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CompactTableCell);
