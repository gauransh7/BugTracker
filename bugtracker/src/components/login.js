import React from 'react'
// import { Link } from 'react-router-dom'
// import {
//     Button,
//   } from "semantic-ui-react";

  const Login = () =>{
      return(
      // <Link to="http://internet.channeli.in/oauth/authorise">
      // <Button className="ui primary button" >Login with omniport</Button>
      // </Link>
      <a href="https://internet.channeli.in/oauth/authorise/?client_id=9M2ddc3zJkHFly9xXBuYD8aQjtsNGNqxIDiSADNv&redirect_url=http://localhost:8000/BugTracker/auth&state=success">Login</a>
      )
    }

  export default Login