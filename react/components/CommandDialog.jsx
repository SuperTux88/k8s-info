import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import CopyTextField from './CopyTextField';

const mapStateToProps = (state, { match }) => {
  return ({
    currentContext: match.params.context,
    currentNamespace: match.params.namespace,
    origin: window.location.origin,
  });
};

const CommandDialog = ({ kubectl, apiPath, currentContext, currentNamespace, origin, open, onClose }) => (
  <Dialog aria-labelledby="command-dialog-title" open={open} onClose={onClose} fullWidth>
    <DialogTitle id="command-dialog-title">Copy commands</DialogTitle>
    <DialogContent>
      <CopyTextField
        id="kubectl-command"
        label="kubectl"
        value={
          'kubectl ' + kubectl.command + ' --context ' + currentContext +
          (currentNamespace ? ' --namespace ' + currentNamespace : ' --all-namespaces') +
          (kubectl.params ? ' ' + kubectl.params : '')
        }
      />
      <CopyTextField
        id="curl-command"
        label="curl"
        value={'curl ' + origin + apiPath}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

CommandDialog.propTypes = {
  apiPath: PropTypes.string.isRequired,
  currentContext: PropTypes.string.isRequired,
  currentNamespace: PropTypes.string,
  kubectl: PropTypes.shape({
    command: PropTypes.string.isRequired,
    params: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  origin: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps)(CommandDialog));
