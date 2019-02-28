import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import Loading from './elements/Loading';
import Error from './elements/Error';

import PageMenu from './PageMenu';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
  },
  titleFlex: {
    display: 'flex',
  },
  title: {
    marginBottom: theme.spacing.unit,
    flex: 1,
  },
  menuButton: {
    marginTop: -theme.spacing.unit * 1.5,
    marginRight: -theme.spacing.unit * 1.5,
  },
});

const LoadingPage = ({ classes, loading, error, title, kubectl, apiPath, extraMenu, children }) => {
  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Error message={error.message} />;
  } else {
    return (
      <Paper className={classes.root}>
        <div className={classes.titleFlex}>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <PageMenu kubectl={kubectl} apiPath={apiPath} extraMenu={extraMenu} className={classes.menuButton} />
        </div>
        {children}
      </Paper>
    );
  }
};

LoadingPage.propTypes = {
  apiPath: PropTypes.string.isRequired,
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  extraMenu: PropTypes.node,
  kubectl: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(LoadingPage);
