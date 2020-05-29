import projectReducer from './projectReducer'
import { combineReducers } from 'redux'
import errorReducer from './errors'
import messageReducer from './meassages'
import authReducer from './auth'


const rootReducer = combineReducers({
    project : projectReducer,
    errors : errorReducer,
    messages : messageReducer,
    auth : authReducer
})

export default rootReducer

