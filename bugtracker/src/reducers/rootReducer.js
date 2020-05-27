import projectReducer from './projectReducer'
import { combineReducers } from 'redux'


const rootReducer = combineReducers({
    project : projectReducer,
})

export default rootReducer

