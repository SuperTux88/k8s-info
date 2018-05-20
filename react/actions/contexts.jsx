import axios from 'axios';

export const FETCH_CONTEXTS_BEGIN   = 'FETCH_CONTEXTS_BEGIN';
export const FETCH_CONTEXTS_SUCCESS = 'FETCH_CONTEXTS_SUCCESS';
export const FETCH_CONTEXTS_FAILURE = 'FETCH_CONTEXTS_FAILURE';

export const fetchContextsBegin = () => ({
  type: FETCH_CONTEXTS_BEGIN
});

export const fetchContextsSuccess = contexts => ({
  type: FETCH_CONTEXTS_SUCCESS,
  payload: { contexts }
});

export const fetchContextsError = error => ({
  type: FETCH_CONTEXTS_FAILURE,
  payload: { error }
});

export function fetchContexts() {
  return dispatch => {
    dispatch(fetchContextsBegin());
    axios.get("/api/contexts")
      .then(res => dispatch(fetchContextsSuccess(res.data.contexts)))
      .catch(error => dispatch(fetchContextsError(error)));
  };
}
