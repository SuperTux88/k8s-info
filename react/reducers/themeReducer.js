import { CHANGE_THEME_PALETTE_TYPE } from '../actions/theme';

const initialState = {
  paletteType: localStorage.getItem('uiTheme') || 'dark',
};

export default function themeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_THEME_PALETTE_TYPE:
      localStorage.setItem('uiTheme', action.payload.paletteType);
      return {
        paletteType: action.payload.paletteType,
      };

    default:
      return state;
  }
}
