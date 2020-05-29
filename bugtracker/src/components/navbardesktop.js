import React, { Component } from 'react';
// import _ from "lodash";
import { connect } from 'react-redux'
import {
    Menu,
    Image,
    Icon,
    Button
  } from "semantic-ui-react";


class NavBarDesktop extends Component{ 
  render(){
    const { isAuthenticated } = this.props.auth.isAuthenticated;
    return   <Menu fixed="top" inverted>
    <Menu.Item>
      <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
    </Menu.Item>
    <Menu.Menu position="right">
    <Menu.Item>
      <Icon name="bell" />
    </Menu.Item>
      { isAuthenticated ? <Button>Logout</Button> : <Button>Login</Button>}
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

export default connect(mapStateToProps)(NavBarDesktop);