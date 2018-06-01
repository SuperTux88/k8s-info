export const CHANGE_OUTPUT_WRAP = 'CHANGE_OUTPUT_WRAP';

export const changeOutputWrap = wrapOutput => ({
  type: CHANGE_OUTPUT_WRAP,
  payload: { wrapOutput },
});
