import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'
import { store } from '../index'
import {returnErrors} from '../actions/messages'

export class getauth extends Component {

    componentDidMount(){
        if (this.props.location.search) {
          console.log('inside')
          axios.get(`http://localhost:8000/BugTracker/auth${this.props.location.search}`)
                .then(res =>{
                  console.log(res.data)
                    store.dispatch({
                      type : 'LOGIN_SUCCESS',
                      payload : res.data
                    });
                }
                ).catch(err => {returnErrors(err.response.data,err.response.status)
                  store.dispatch({
                    type : 'LOGIN_FAIL'
                  })
                }
                )
        }
      }

    render(){
        if(this.props.auth.token ){
            console.log("redirecting");
            return <Redirect to='/' />
        }
        // // const queryString = require('query-string');
        // // const parsed = queryString.parse(this.props.location.search);
        // axios.get(`http://localhost:8000/BugTracker/auth${this.props.location.search}`)
        //     .then(res =>{
        //         console.log(res.data);
        //     }
        //     ).catch(err => {console.log(err)})
        return (
            <div>Something Wrong Happenned ... Retry</div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth : state.auth
    }
}


export default connect(mapStateToProps)(getauth)
