import axios from 'axios'


// export const createProject = (project) => {
//     return  (dispatch, getState ) =>{
//         // asnc task
//         dispatch({type:'CREATE_PROJECT' , project});
//     } 
// };

export const createProject = (project) => dispatch => {
    axios.post(`http://localhost:8000/BugTracker/projects/`,project)
        .then(res =>{
            dispatch(
                {
                    type:'CREATE_PROJECT',
                    payload : res.data
                }
            )
        }
        )
        .catch(err => console.log(err.response.data))
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
            dispatch(
                {
                    type:'DELETE_PROJECT',
                    payload : id
                }
            )
        }
        )
}