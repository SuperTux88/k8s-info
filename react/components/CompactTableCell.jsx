import React from 'react';

import TableCell from '@material-ui/core/TableCell';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  cell: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
});

const CompactTableCell = ({ classes, className, children, ...props }) => {
  return (
    <TableCell {...props} className={[classes.cell, className]}>{children}</TableCell>
  )
};

export default withStyles(styles)(CompactTableCell);
