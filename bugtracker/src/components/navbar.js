import React,{Component} from 'react';
import NavBarDesktop from './navbardesktop';
// import NavBarMobile from './navbarmobile';
import {
    Responsive,
    // Container
  } from "semantic-ui-react";


// const NavBarChildren = ({ children }) => (
//   <Container style={{ marginTop: "5em" }}>{children}</Container>
// );


class NavBar extends Component {
  // state = {
  //   visible: false
  // };

  // handlePusher = () => {
  //   const { visible } = this.state;

  //   if (visible) this.setState({ visible: false });
  // };

  // handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    // const { children } = this.props;
    // const { visible } = this.state;

    return (
      <div className='ui segment'>
         {/* <Responsive {...Responsive.onlyMobile}>
           <NavBarMobile */}
      {/* //       onPusherClick={this.handlePusher}
      //       onToggle={this.handleToggle}
            // visible={visible}
          // > */}
            {/* <NavBarChildren>{children}</NavBarChildren> */}
          {/* </NavBarMobile>
        </Responsive> */}
        {/* <Responsive minWidth={Responsive.onlyTablet.minWidth}> */}
          <NavBarDesktop/>
          {/* <NavBarChildren>{children}</NavBarChildren> */}
        {/* </Responsive> */}
      </div>
    );
  }
  }
  

  export default NavBar;