import {
  FETCH_CONTAINER_INFO_BEGIN,
  FETCH_CONTAINER_INFO_SUCCESS,
  FETCH_CONTAINER_INFO_FAILURE
} from '../actions/containerInfo';

const initialState = {
  content: null,
  loading: false,
  error: null
};

export default function containerInfoReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_CONTAINER_INFO_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CONTAINER_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        content: action.payload.content
      };

    case FETCH_CONTAINER_INFO_FAILURE:
      return {
        content: null,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
}
