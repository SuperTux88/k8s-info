import React, { Component } from 'react';

import axios from 'axios';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ContextIcon from '@material-ui/icons/Storage';

import { withStyles } from '@material-ui/core/styles';

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

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      contexts: []
    };
  }

  componentDidMount() {
    axios.get("/api/contexts")
      .then(res => {
        this.setState({
          isLoaded: true,
          contexts: res.data.contexts
        });
      })
      .catch(error => {
        this.setState({
          isLoaded: true,
          error
        });
      })
  }

  render() {
    const { classes } = this.props;
    const { error, isLoaded, contexts } = this.state;

    if (error) {
      return (
        <div>
          <K8sLogoHeader />
          <Error message={error.message} />
        </div>
      );
    } else if (!isLoaded) {
      return (
        <div>
          <K8sLogoHeader />
          <Loading />
        </div>
      );
    } else {
      return (
        <div>
          <K8sLogoHeader />
          <div className={classes.root}>
            <List subheader={<ListSubheader>Context</ListSubheader>}>
              {contexts.map(context => (
                <ListItem key={context}>
                  <Avatar><ContextIcon /></Avatar>
                  <ListItemText primary={context} />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(Index);
