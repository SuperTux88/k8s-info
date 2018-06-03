import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  ok: {
    color: theme.palette.text.ok,
  },
  error: {
    color: theme.palette.text.error,
  },
});

const StatusText = ({ classes, className, type, children, ...props }) => {
  const classNames = (type === 'ok' ? [classes.ok] : (type === 'error' ? [classes.error] : []));
  if (className) classNames.push(className);

  return <div {...props} className={classNames.join(' ')}>{children}</div>;
};

StatusText.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  type: PropTypes.string,
};

export default withStyles(styles)(StatusText);
