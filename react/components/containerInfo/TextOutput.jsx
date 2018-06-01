import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pre: {
    overflow: 'auto',
    fontFamily: ['Roboto Mono', 'monospace'],
    fontSize: theme.typography.pxToRem(12),
  },
});

const mapStateToProps = (state) => ({
  wrapped: state.output.wrapped,
});

const TextOutput = ({ classes, children, wrapped }) => (
  <Typography
    component='pre'
    className={classes.pre}
    style={wrapped ? { whiteSpace: 'pre-wrap', wordBreak: 'break-all' } : {}}
  >
    {children}
  </Typography>
);

TextOutput.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  wrapped: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(TextOutput));
