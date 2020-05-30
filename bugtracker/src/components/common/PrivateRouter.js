import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
// import propTypes from 'Prop-Types'


const PrivateRouter = ({ component : Component, auth, 
    ...rest}) => (
    <Route 
        {...rest}
        render = {(props) => {
            if (auth.isLoading){
                return <h2>Loading...</h2>;
            }
            else if(auth.isAuthenticated===false){
                console.log(auth);
                return <Redirect to='/Login' />;
            }
            else{
                return <p>you are not logged in</p>;
            }
        }}
    />
)

const mapStateToProps = (state) => ({
    auth : state.auth
})


export default connect(mapStateToProps)(PrivateRouter)


// import React, { Component } from 'react'
// import { Route} from 'react-router-dom'
// import {connect} from 'react-redux'

// class PrivateRouter extends Component {
//     render() {
//         const component  = this.props.component
//         return (
//             <Route 
//                 path = {this.props.path}
//                 render = {this.props.auth.isLoading?
//                     (props) => (
//                         <h2>Loading...</h2>
//                     )
//                     : this.props.auth.isAuthenticated?
//                     (props) => (
//                         component
//                     )
//                     :
//                     (props) => (
//                         <h2>you are not logged in</h2>
//                     )
//                 }
//             />
//         )
//     }
// }

// const mapStateToProps = (state) => ({
//     auth : state.auth
// })


// export default connect(mapStateToProps)(PrivateRouter)