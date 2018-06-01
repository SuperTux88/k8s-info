import { combineReducers } from 'redux';

import contextsReducer from './contextsReducer';
import podsReducer from './podsReducer';
import podReducer from './podReducer';
import containerInfoReducer from './containerInfoReducer';
import themeReducer from './themeReducer';
import outputReducer from './outputReducer';

export default combineReducers({
  contexts: contextsReducer,
  pods: podsReducer,
  pod: podReducer,
  containerInfo: containerInfoReducer,
  theme: themeReducer,
  output: outputReducer,
});
