export const CHANGE_THEME_PALETTE_TYPE   = 'CHANGE_THEME_PALETTE_TYPE';

export const changeThemePaletteType = paletteType => ({
  type: CHANGE_THEME_PALETTE_TYPE,
  payload: { paletteType }
});
