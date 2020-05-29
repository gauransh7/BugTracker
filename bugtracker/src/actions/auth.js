import axios from 'axios'
// import {returnErrors} from './messages'

export const LoadUser = () => (dispatch, getState) => {
    dispatch ({ type: 'USER_LOADING' });

    const token = getState().auth.token;
    console.log(token)

    const config = {
        headers : {
            'Content-Type' : 'application/json'
        }
    };

    if(token){
        config.headers['Authorization'] = `Token ${token}`;
    }

    axios.get('http://localhost:8000/BugTracker/api-auth/user/',config)
        .then(res => {
            console.log("done")
            dispatch({
                type : 'USER_LOADED',
                payload : res.data
            })
            }).catch(error => 
            {
            console.log(error)
            // dispatch(returnErrors(err.response.data,err.response.status));
            dispatch({
                type : 'AUTH_ERROR',
            });
        });
    }



