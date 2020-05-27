import React from 'react';
// import _ from "lodash";

import {
    Icon,
    Image,
    Menu,
    Sidebar,
  } from "semantic-ui-react";
  
  const NavBarMobile = ({
    children,
    leftItems,
    onPusherClick,
    onToggle,
    rightItems,
    visible
  }) => (
    <Sidebar.Pushable>
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      items={leftItems}
      vertical
      visible={visible}
    />
    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: "100vh" }}
    >
      <Menu fixed="top" inverted>
        <Menu.Item>
          <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
        </Menu.Item>
        <Menu.Menu position="right">
        <Menu.Item>
          <Icon name="bell" />
        </Menu.Item>
        <Menu.Item onClick={onToggle}>
          <Icon name="sidebar" />
        </Menu.Item>
        </Menu.Menu>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
  );




export default NavBarMobile;