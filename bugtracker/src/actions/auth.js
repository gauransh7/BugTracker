import React from 'react'

import axios from 'axios'
import { Redirect } from 'react-router-dom';
// import { store } from '..';
// import {push} from 'react-router-redux'
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





    export const AuthenticateUser = (props) => (dispatch, getState) => {
        dispatch ({ type: 'USER_LOADING' });
    
        const token = getState().auth.token;
        console.log(token)

        if (getState().auth.token){
            console.log('fist cond.')
            if (localStorage.getItem('token')){
                console.log('sec cond.')
                if(localStorage.getItem('token')===getState().auth.token){
                    console.log('third cond.')
                    axios.get('http://localhost:8000/BugTracker/api-auth/user/',tokenConfig(getState))
                    .then(res => {
                        console.log("axios")
                        dispatch({
                            type : 'USER_AUTHENTICATED',
                            payload : res.data
                        });
                        }).catch(error => 
                        {
                        console.log(error)
                        // dispatch(returnErrors(err.response.data,err.response.status));
                        dispatch({
                            type : 'AUTH_ERROR',
                        });
                        return <Redirect to='/Login' />
                    });
                }
                else{
                    localStorage.removeItem('token')
                    localStorage.setItem(token)
                    AuthenticateUser()
                }

                }
                else{
                    localStorage.setItem(token)
                    AuthenticateUser()
                }
            }
            else{
                console.log('props')
                window.location.href='http://localhost:3000/Login'
            }
        }
    





    export const tokenConfig = (getState) => {
        // Get token from state
        const token = getState().auth.token;
      
        // Headers
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
      
        // If token, add to headers config
        if (token) {
          config.headers['Authorization'] = `Token ${token}`;
        }
      
        return config;
      };


     
     
     
     
     
     
      export const Logout = () => (dispatch, getState) => {
    
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
    
        axios.post('http://localhost:8000/BugTracker/api-auth/logout/',null,config)
            .then(res => {
                console.log("done")
                dispatch({
                    type : 'LOGOUT'
                });
                window.location.href='http://localhost:3000/Login';
                }).catch(error => 
                {
                console.log(error)
                // dispatch(returnErrors(err.response.data,err.response.status));
            });
        }
    
    
