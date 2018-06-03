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

const LoadingPage = ({ classes, loading, error, title, kubectl, apiPath, menuItems, children }) => {
  if (loading) {
    return <Loading />;
  } else if (error) {
    return <Error message={error.message} />;
  } else {
    return (
      <Paper className={classes.root}>
        <div className={classes.titleFlex}>
          <Typography variant="title" className={classes.title}>
            {title}
          </Typography>
          <PageMenu kubectl={kubectl} apiPath={apiPath} menuItems={menuItems} className={classes.menuButton} />
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
  kubectl: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(LoadingPage);
