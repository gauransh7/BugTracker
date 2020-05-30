import React, { Component } from 'react';
// import _ from "lodash";
import { connect } from 'react-redux'
import {Logout} from '../actions/auth'
// import { AuthenticateUser } from '../actions/auth'
import {
    Menu,
    Image,
    Icon,
    Button
  } from "semantic-ui-react";


class NavBarDesktop extends Component{ 
  render(){
    // let { isAuthenticated } = this.state.isAuthenticated;
    // console.log(this.state.isAuthenticated);
    console.log(this.props.auth.isAuthenticated);
    return   <Menu fixed="top" inverted>
    <Menu.Item>
      <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
    </Menu.Item>
    <Menu.Menu position="right">
    <h2 style={{ color: 'red' }}>{this.props.auth.User ? `Hello ${this.props.auth.User.first_name}` : ``}</h2>
    <Menu.Item>
      <Icon name="bell" />
    </Menu.Item>
      { this.props.auth.isAuthenticated ? <Button onClick={() => this.props.Logout()}>Logout</Button> : <Button>Login</Button>}
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