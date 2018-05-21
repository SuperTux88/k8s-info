import { combineReducers } from 'redux'

import contextsReducer from './contextsReducer'
import podsReducer from './podsReducer'
import podReducer from './podReducer'
import containerInfoReducer from './containerInfoReducer'

export default combineReducers({
  contexts: contextsReducer,
  pods: podsReducer,
  pod: podReducer,
  containerInfo: containerInfoReducer,
})
