import React from 'react';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  row: {
    height: '24px',
    verticalAlign: 'top',
  },
  title: {
    border: 'none',
    paddingLeft: 0,
    paddingRight: theme.spacing.unit * 2,
    fontWeight: 'bold',
  },
  value: {
    border: 'none',
  },
});

const DescribeInfoRow = ({ classes, title, children }) => {
  return (
    <TableRow className={classes.row}>
      <TableCell className={classes.title}>{title}</TableCell>
      <TableCell className={classes.value}>{children}</TableCell>
    </TableRow>
  )
};

export default withStyles(styles)(DescribeInfoRow);
