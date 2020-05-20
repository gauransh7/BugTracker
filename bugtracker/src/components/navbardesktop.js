import React from 'react';
import _ from "lodash";
import {
    Menu,
  } from "semantic-ui-react";

const NavBarDesktop = ({ rightItems }) => (
    <Menu fixed="top" inverted>
      <Menu.Item>
        {/* <Image size="mini" src="https://react.semantic-ui.com/logo.png" /> */}
        <h1>BugTracker</h1>
      </Menu.Item>
      {/* {_.map(leftItems, item => <Menu.Item {...item} />)} */}
      <Menu.Menu position="right">
        {_.map(rightItems, item => <Menu.Item {...item} />)}
      </Menu.Menu>
    </Menu>
  );

export default NavBarDesktop;