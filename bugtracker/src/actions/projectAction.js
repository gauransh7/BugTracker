import axios from 'axios'
import { createMessage }  from './messages'
import {tokenConfig} from './auth'
import { Redirect } from 'react-router-dom';

// export const createProject = (project) => {
//     return  (dispatch, getState ) =>{
//         // asnc task
//         dispatch({type:'CREATE_PROJECT' , project});
//     } 
// };

export const createProject = (formData) => (dispatch,getState) => {
     // Get token from state
     const token = getState().auth.token;
      
     // Headers
     const config = {
       headers: {
        //  'Content-Type': 'application/json'
       },
     };
   
     // If token, add to headers config
     if (token) {
       config.headers['Authorization'] = `Token ${token}`;
    //    config.headers['Accept'] = 'multipart/form-data'
     }
    axios.post(`http://localhost:8000/BugTracker/projects/`,formData,config)
        .then(res =>{
            dispatch(createMessage({ ProjectAdd: 'Project Added Without Error'}));
            dispatch(
                {
                    type:'CREATE_PROJECT',
                    payload : res.data
                }
            )
            window.location.href='http://localhost:3000/'
        }
        )
        .catch(err => {
            console.log(err.response.data)
            const error = {
                msg : err.response.data,
                status : err.response.status
            }
            dispatch(
                {
                    type : 'GET_ERRORS',
                    payload : error
                }
            )
        })
}


export const getProjects = () => (dispatch,getState) =>{
    axios.get('http://localhost:8000/BugTracker/projects/',tokenConfig(getState))
        .then(res => {
            dispatch(
                {
                    type: 'GET_PROJECTS',
                    payload : res.data
                }
            )
            
        }

        )
        .catch(err => console.log(err))
};

export const deleteProject = (id) => (dispatch,getState) => {
    axios.delete(`http://localhost:8000/BugTracker/projects/${id}/`,tokenConfig(getState))
        .then(res =>{
            dispatch(createMessage({ ProjectDelete: 'Project Deleted Without Error'}));
            dispatch(
                {
                    type:'DELETE_PROJECT',
                    payload : id
                }
            )
        }
        )
        .catch(err => {
            console.log(err.response.data)
            const error = {
                msg : err.response.data,
                status : err.response.status
            }
            dispatch(
                {
                    type : 'GET_ERRORS',
                    payload : error
                }
            )
        })
}