import axios from 'axios';

// eslint-disable-next-line no-multi-spaces
export const FETCH_POD_DESCRIBE_BEGIN   = 'FETCH_POD_DESCRIBE_BEGIN';
export const FETCH_POD_DESCRIBE_SUCCESS = 'FETCH_POD_DESCRIBE_SUCCESS';
export const FETCH_POD_DESCRIBE_FAILURE = 'FETCH_POD_DESCRIBE_FAILURE';

export const fetchPodDescribeBegin = () => ({
  type: FETCH_POD_DESCRIBE_BEGIN,
});

export const fetchPodDescribeSuccess = pod => ({
  type: FETCH_POD_DESCRIBE_SUCCESS,
  payload: { pod },
});

export const fetchPodDescribeError = error => ({
  type: FETCH_POD_DESCRIBE_FAILURE,
  payload: { error },
});

export function fetchPodDescribe(context, namespace, pod) {
  return dispatch => {
    dispatch(fetchPodDescribeBegin());
    axios.get(getApiPath(context, namespace, pod))
      .then(res => dispatch(fetchPodDescribeSuccess(res.data)))
      .catch(error => dispatch(fetchPodDescribeError(error)));
  };
}

export function getApiPath(context, namespace, pod) {
  return '/api/context/' + context + '/namespace/' + namespace + '/pod/' + pod + '/describe';
}
