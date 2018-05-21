import { combineReducers } from 'redux'

import contextsReducer from './contextsReducer'
import podsReducer from './podsReducer'
import containerInfoReducer from './containerInfoReducer'

export default combineReducers({
  contexts: contextsReducer,
  pods: podsReducer,
  containerInfo: containerInfoReducer,
})
