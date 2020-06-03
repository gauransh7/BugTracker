import React, { Component } from 'react';
// import _ from "lodash";
import { connect } from 'react-redux'
import {Logout} from '../actions/auth'

// import { AuthenticateUser } from '../actions/auth'
import {
    Menu,
    Image,
    Icon,
    Dropdown
  } from "semantic-ui-react";
import finallogo from '../media/finallogowbg.png'
import '../css/navbardesktop.css'
import { Link } from 'react-router-dom';


// const trigger = (
//   <span>
//     <Image avatar src={finallogo} /> {this.props.auth.User.first_name}
//   </span>
// )

const options = [
  { key: 'user', text: 'Account', icon: 'user' },
  { key: 'settings', text: 'Settings', icon: 'settings' },
  { key: 'sign-out', text: 'Sign Out', icon: 'sign out', onMouseDown : () => {this.props.Logout()} },
]



class NavBarDesktop extends Component{ 
  componentDidMount(){
    // this.setState({
      
    // })
    console.log(this.props.auth)
  }

  state = {
    username : this.props.auth.first_name
  }
  render(){
    // let { isAuthenticated } = this.state.isAuthenticated;
    // console.log(this.state.isAuthenticated);
    console.log(this.props.auth)
    // this.setState({
    //   username:this.props.auth.User.first_name
    // })
    return   <Menu inverted secondary className='nbmenu' fixed="top" >
    <Menu.Item>
      <Image size="mini" className='circular' src={finallogo} />
    </Menu.Item>
    <Menu.Menu position="right">
    {/* <h2 style={{ color: 'red' }}>{this.props.auth.User ? `Hello ${this.props.auth.User.first_name}` : ``}</h2> */}
    {/* <Link to='/' > */}
    <Menu.Item as={Link} to='/'
          name='Projects'
          
          // active={activeItem === 'home'}
          
        />
        {/* </Link> */}
    <Menu.Item>
      <Icon size='normal' name="bell" />
    </Menu.Item>
    <Menu.Item>
    <Dropdown
    trigger= { <span>
    <Icon name='user' /> {this.props.auth.User ? `${this.props.auth.User.first_name}` : `user`}
  </span>}
    options={[
  { key: 'user', text: 'Account', icon: 'user' },
  { key: 'settings', text: 'Settings', icon: 'settings' },
  { key: 'sign-out', text: 'Sign Out', icon: 'sign out', onMouseDown : () => {this.props.Logout()} },
]}
    pointing='top left'
    icon={null}
  />
  </Menu.Item>
      {/* { this.props.auth.isAuthenticated ? <Button onClick={() => this.props.Logout()}>Logout</Button> : <Button>Login</Button>} */}
      {/* {_.map(rightItems, item => <Menu.Item {...item} />)} */}
    </Menu.Menu>
  </Menu>
  }

}


  const mapStateToProps = (state) => {
    return {
      auth : state.auth
    }
  }

export default connect(mapStateToProps,{Logout})(NavBarDesktop);