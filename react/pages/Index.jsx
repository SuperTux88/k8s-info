import React from 'react';
import { connect } from 'react-redux';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ContextIcon from '@material-ui/icons/Storage';

import { withStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';

import K8sLogoHeader from '../components/K8sLogoHeader';
import Error from '../components/Error';
import Loading from '../components/Loading';

const styles = {
  root: {
    marginTop: '100px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
};

const mapStateToProps = state => ({
  contexts: state.contexts
});

const Index = ({ classes, contexts }) => {
  if (contexts.loading) {
    return (
      <div>
        <K8sLogoHeader/>
        <Loading/>
      </div>
    );
  } else if (contexts.error) {
    return (
      <div>
        <K8sLogoHeader/>
        <Error message={contexts.error.message}/>
      </div>
    );
  } else {
    return (
      <div>
        <K8sLogoHeader/>
        <div className={classes.root}>
          <List subheader={<ListSubheader>Context</ListSubheader>}>
            {contexts.items.map(context => (
              <ListItem button component={Link} to={"/" + context} key={context}>
                <Avatar><ContextIcon/></Avatar>
                <ListItemText primary={context}/>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
  }
};

export default connect(mapStateToProps)(withStyles(styles)(Index));
