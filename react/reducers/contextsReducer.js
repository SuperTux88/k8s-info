import {
  FETCH_CONTEXTS_BEGIN,
  FETCH_CONTEXTS_SUCCESS,
  FETCH_CONTEXTS_FAILURE
} from '../actions/contexts';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export default function contextsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONTEXTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CONTEXTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.contexts,
      };

    case FETCH_CONTEXTS_FAILURE:
      return {
        items: [],
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
}
