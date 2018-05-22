import React from 'react';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { withStyles } from '@material-ui/core/styles';

import CompactTableCell from '../CompactTableCell';

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

const DescribeInfoRow = ({ classes, className, title, children }) => {
  return (
    <TableRow className={[classes.row, className].join(' ')}>
      <TableCell className={classes.title}>{title}</TableCell>
      <CompactTableCell className={classes.value}>{children}</CompactTableCell>
    </TableRow>
  )
};

export default withStyles(styles)(DescribeInfoRow);
