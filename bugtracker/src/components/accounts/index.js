import React, { Component } from 'react'
import {Button} from 'semantic-ui-react'

export class Login extends Component {
    render() {
        return (
            <div className="container">
                <Button><a href="https://internet.channeli.in/oauth/authorise/?client_id=9M2ddc3zJkHFly9xXBuYD8aQjtsNGNqxIDiSADNv&redirect_url=http://localhost:3000/&state=success">Login With Omniport</a></Button>
                OR
                <Button><a href="https://internet.channeli.in/oauth/authorise/?client_id=9M2ddc3zJkHFly9xXBuYD8aQjtsNGNqxIDiSADNv&redirect_url=http://localhost:3000/&state=success">Sign-Up With Omniport</a></Button>
            </div>
        )
    }
}

export default Login
