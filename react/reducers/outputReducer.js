import { CHANGE_OUTPUT_WRAP } from '../actions/output';

const initialState = {
  wrapped: JSON.parse(localStorage.getItem('wrapTextOutput')) || false,
};

export default function themeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_OUTPUT_WRAP:
      localStorage.setItem('wrapTextOutput', action.payload.wrapOutput);
      return {
        wrapped: action.payload.wrapOutput,
      };

    default:
      return state;
  }
}
