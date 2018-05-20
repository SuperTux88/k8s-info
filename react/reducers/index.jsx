import { combineReducers } from 'redux'

import contextsReducer from './contextsReducer'
import podsReducer from './podsReducer'

export default combineReducers({
  contexts: contextsReducer,
  pods: podsReducer,
})
