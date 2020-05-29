import axios from 'axios'
import { createMessage }  from './messages'

// export const createProject = (project) => {
//     return  (dispatch, getState ) =>{
//         // asnc task
//         dispatch({type:'CREATE_PROJECT' , project});
//     } 
// };

export const createProject = (project) => dispatch => {
    axios.post(`http://localhost:8000/BugTracker/projects/`,project)
        .then(res =>{
            dispatch(createMessage({ ProjectAdd: 'Project Added Without Error'}));
            dispatch(
                {
                    type:'CREATE_PROJECT',
                    payload : res.data
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


export const getProjects = () => dispatch =>{
    axios.get('http://localhost:8000/BugTracker/projects/')
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

export const deleteProject = (id) => dispatch => {
    axios.delete(`http://localhost:8000/BugTracker/projects/${id}/`)
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
}