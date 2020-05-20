import React, { Component } from "react";
// import NavBar from './components/navbar';
// import { Icon } from "semantic-ui-react";
import Login from "./components/login";
import { BrowserRouter, Route } from "react-router-dom";

// const leftItems = [
//   { as: "a", content: "Home", key: "home" },
//   { as: "a", content: "Users", key: "users" }
// ];
// const rightItems = [
//   { as: "a", content: "Home", key: "home" },
//   { as:"a", content:Icon, key:"icon"},
//   { as: "a", content: "User", key: "user" }
// ];

class App extends Component{
  render(){
    return(
      <BrowserRouter>
      <div className="App">
        {/* <NavBar rightItems={rightItems} /> */}
        <Route path='/login' component={Login} />
      </div>
      </BrowserRouter>
    );
  }
}

export default App



