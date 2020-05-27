import projectReducer from './projectReducer'
import { combineReducers } from 'redux'
import errorReducer from './errors'
import messageReducer from './meassages'


const rootReducer = combineReducers({
    project : projectReducer,
    errors : errorReducer,
    messages : messageReducer
})

export default rootReducer

