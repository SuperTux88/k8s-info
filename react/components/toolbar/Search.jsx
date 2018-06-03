import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import qs from 'query-string';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import { withStyles } from '@material-ui/core/styles';

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import IsolatedScroll from 'react-isolated-scroll';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  textField: {
    width: 250,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    minWidth: 250,
    maxWidth: 400,
    maxHeight: 300,
    overflowY: 'auto',
    boxShadow: theme.shadows[2],
  },
  suggestionsList: {
    marginTop: theme.spacing.unit,
    marginBottom: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    marginTop: -theme.spacing.unit,
  },
  clearFilter: {
    marginRight: -theme.spacing.unit * 2,
    marginLeft: 0,
  },
});

/* eslint-disable react/no-multi-comp */

const SearchInput = ({ ref, ...other }) => (
  <TextField
    InputProps={{
      inputRef: ref,
      ...other,
    }}
  />
);

SearchInput.propTypes = {
  ref: PropTypes.func.isRequired,
};

const SuggestionsContainer = ({ containerProps, children }) => {
  const { ref, ...restContainerProps } = containerProps;
  const callRef = isolatedScroll => {
    if (isolatedScroll !== null) {
      ref(isolatedScroll.component);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-bind
    <IsolatedScroll ref={callRef} {...restContainerProps}>
      <Paper square>
        {children}
      </Paper>
    </IsolatedScroll>
  );
};

SuggestionsContainer.propTypes = {
  children: PropTypes.node.isRequired,
  containerProps: PropTypes.object.isRequired,
};

const Suggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion, query);
  const parts = parse(suggestion, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <strong key={String(index)}>{part.text}</strong>
          ) : (
            <span key={String(index)}>{part.text}</span>
          );
        })}
      </div>
    </MenuItem>
  );
};

const mapStateToProps = (state, { match, location }) => ({
  pods: state.pods,
  currentNamespace: match.params.namespace,
  filter: qs.parse(location.search).filter,
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      podPrefixes: [],
      suggestions: [],
      value: props.filter || '',
    };
  }

  componentDidMount() {
    this.getPodPrefixes();
  }

  componentDidUpdate(prevProps) {
    const { currentNamespace, pods } = this.props;

    if (currentNamespace !== prevProps.currentNamespace ||
      pods.items !== prevProps.pods.items) {
      this.getPodPrefixes();
    }
  }

  getPodPrefixes = () => {
    const { pods, currentNamespace } = this.props;
    const currentPods = pods.items.filter(pod => (!currentNamespace || pod.metadata.namespace === currentNamespace));

    const podPrefixes = [...new Set(currentPods.reduce((acc, pod) => {
      let name = pod.metadata.name;
      if (pod.metadata.owner_references) {
        const refs = pod.metadata.owner_references;
        if (refs.filter(ref => ref.kind === 'ReplicaSet').length > 0) {
          name = name.substring(0, name.lastIndexOf('-', name.lastIndexOf('-') - 1));
        } else if (refs.filter(ref => ref.kind === 'DaemonSet').length > 0) {
          name = name.substring(0, name.lastIndexOf('-'));
        }
      }

      let result = [];
      let numberOfResults = currentPods.filter(pod => pod.metadata.name.startsWith(name)).length;
      result.push(name);

      for (let i = name.length; i > 0; i--) {
        if (name[i] === '-') {
          const prefix = name.slice(0, i);
          const prefixNumberOfResults = currentPods.filter(pod => pod.metadata.name.startsWith(prefix)).length;
          if (prefixNumberOfResults !== numberOfResults) {
            result.push(prefix);
            numberOfResults = prefixNumberOfResults;
          }
        }
      }

      return acc.concat(result);
    }, []))].sort((a, b) => {
      const levelDiff = a.split('-').length - b.split('-').length;
      if (levelDiff !== 0) return levelDiff;

      if (a > b) return 1;
      if (a < b) return -1;

      return 0;
    });

    this.setState({ podPrefixes });
  };

  handleChange = (event, { newValue }) => {
    this.setState({ value: newValue });
  };

  shouldRenderSuggestions = () => true; // render suggestions when input is empty

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  getSuggestionValue = suggestion => suggestion;

  getSuggestions = value => {
    const { podPrefixes } = this.state;
    const inputValue = value.trim().toLowerCase();

    if (inputValue.length === 0) {
      return podPrefixes;
    } else {
      return podPrefixes.filter(prefix => prefix.toLowerCase().includes(inputValue));
    }
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    const { history, location } = this.props;

    history.push(location.pathname + '?filter=' + suggestion);
  };

  handleClearFilter = () => {
    const { history, location } = this.props;

    this.setState({ value: '' });
    history.push(location.pathname);
  };

  render() {
    const { classes, filter } = this.props;
    const { suggestions, value } = this.state;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={SearchInput}
        renderSuggestionsContainer={SuggestionsContainer}
        renderSuggestion={Suggestion}
        suggestions={suggestions}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        onSuggestionSelected={this.handleSuggestionSelected}
        highlightFirstSuggestion
        inputProps={{
          value,
          className: classes.textField,
          onChange: this.handleChange,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value || filter
            ? (
              <InputAdornment
                position="end"
                className={classes.clearFilter}
              >
                <Tooltip id="clear-filter" title="Clear filter" enterDelay={300}>
                  <IconButton
                    onClick={this.handleClearFilter}
                    aria-labelledby="clear-filter"
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
        }}
      />
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  currentNamespace: PropTypes.string,
  filter: PropTypes.string,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pods: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    items: PropTypes.array.isRequired,
  }).isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Search)));
