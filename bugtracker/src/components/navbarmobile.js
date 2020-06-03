import React from 'react';
// import _ from "lodash";
import finallogo from '../media/finallogowbg.png'

import {
    Icon,
    Image,
    Menu,
    // Sidebar,
  } from "semantic-ui-react";
  
  const NavBarMobile = ({
    // children,
    // leftItems,
    // onPusherClick,
    // onToggle,
    // visible
  }) => (
    // <Sidebar.Pushable>
    // <Sidebar
    //   as={Menu}
    //   animation="overlay"
    //   icon="labeled"
    //   inverted
    //   items={leftItems}
    //   vertical
    //   visible={visible}
    // />
    // <Sidebar.Pusher
    //   dimmed={visible}
    //   onClick={onPusherClick}
    //   style={{ minHeight: "100vh" }}
    // >
      <Menu className='nbmenu' fixed="top" inverted>
        <Menu.Item>
          <Image size="mini" circular src={finallogo} />
        </Menu.Item>
        <Menu.Menu position="right">
        <Menu.Item>
          <Icon name="bell" />
        </Menu.Item>
        <Menu.Item >
          <Icon name="sidebar" />
        </Menu.Item>
        </Menu.Menu>
      </Menu>
  //     {children}
  //   </Sidebar.Pusher>
  // </Sidebar.Pushable>
  );




export default NavBarMobile;