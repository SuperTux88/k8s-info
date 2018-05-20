import {
  FETCH_PODS_BEGIN,
  FETCH_PODS_SUCCESS,
  FETCH_PODS_FAILURE
} from '../actions/pods';

const initialState = {
  items: [],
  loading: false,
  error: null
};

export default function podsReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_PODS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_PODS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.pods
      };

    case FETCH_PODS_FAILURE:
      return {
        items: [],
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
}
