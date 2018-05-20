import { combineReducers } from 'redux'

import contextsReducer from './contextsReducer'

export default combineReducers({
  contexts: contextsReducer,
})
