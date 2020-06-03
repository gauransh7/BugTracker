import React, { Component } from 'react'
import {Button,Image,Transition} from 'semantic-ui-react'
import '../../css/loginpage.css'
import loginpage from '../../media/loginpage.png'
import Typewriter from 'typewriter-effect';
import bug from '../../media/finallogo.png';

export class Login extends Component {
    state = { animation: 'jiggle', duration: 500, visible: true }
    toggleVisibility = () =>
    this.setState((prevState) => ({ visible: !prevState.visible }))
    render() {
        const { animation, duration, visible } = this.state
        return (
          <div className="container main-login background">
          <div className='vl'></div>
            <Transition
             animation={animation}
            duration={duration}
            visible={visible}
          >
            <Image className='image2' size='x-small' src={bug} onClick={this.toggleVisibility} />
          </Transition>
            <Image src={loginpage} size="large" className="centered image1" />
            <h1 className='h1'>BugTracker</h1>
            <p className='starter p'>
                Got Bugs ?         </p><p className='p'>    <Typewriter
              options={{
                strings: ["Assign them", "Resolve them !" , 'Fast and Efficient' ],
                autoStart: true,
                loop: true,
              }}
            />
            </p>
            <Button className="button" inverted color="black">
              <a
                className="a"
                href="https://internet.channeli.in/oauth/authorise/?client_id=9M2ddc3zJkHFly9xXBuYD8aQjtsNGNqxIDiSADNv&redirect_url=http://localhost:3000/&state=success"
              >
                Login With Omniport
              </a>
            </Button>
            {/* OR
                <Button><a href="https://internet.channeli.in/oauth/authorise/?client_id=9M2ddc3zJkHFly9xXBuYD8aQjtsNGNqxIDiSADNv&redirect_url=http://localhost:3000/&state=success">Sign-Up With Omniport</a></Button> */}
          </div>
        );
    }
}

export default Login
