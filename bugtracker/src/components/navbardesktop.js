import React from 'react';
import _ from "lodash";
import {
    Menu,
    Image,
    Icon
  } from "semantic-ui-react";

const NavBarDesktop = ({ rightItems }) => (
  <Menu fixed="top" inverted>
    <Menu.Item>
      <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
    </Menu.Item>
    <Menu.Menu position="right">
    <Menu.Item>
      <Icon name="bell" />
    </Menu.Item>
      {_.map(rightItems, item => <Menu.Item {...item} />)}
    </Menu.Menu>
  </Menu>
  );

export default NavBarDesktop;