import {
  FETCH_POD_DESCRIBE_BEGIN,
  FETCH_POD_DESCRIBE_SUCCESS,
  FETCH_POD_DESCRIBE_FAILURE
} from '../actions/pod';

const initialState = {
  pod: null,
  loading: false,
  error: null
};

export default function podReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_POD_DESCRIBE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_POD_DESCRIBE_SUCCESS:
      return {
        ...state,
        loading: false,
        pod: action.payload.pod
      };

    case FETCH_POD_DESCRIBE_FAILURE:
      return {
        pod: null,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
}
