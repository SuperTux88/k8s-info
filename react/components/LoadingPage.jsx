import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import Loading from './Loading';
import Error from './Error';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
  },
  title: {
    marginBottom: theme.spacing.unit,
  },
});

const LoadingPage = ({ classes, loading, error, title, children }) => {
  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Error message={error.message} />;
  } else {
    return (
      <Paper className={classes.root}>
        <Typography variant="title" className={classes.title}>
          {title}
        </Typography>
        {children}
      </Paper>
    );
  }
};

LoadingPage.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  loading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(LoadingPage);
