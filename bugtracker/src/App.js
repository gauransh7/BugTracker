import React, { Component } from "react";
import NavBar from './components/navbar';
// import { Icon } from "semantic-ui-react";
import projectlist from "./components/project/projectlist";
import AddProject from './components/project/addProject';
import { BrowserRouter, Route } from "react-router-dom";

const rightItems = [
  { as: "a", content: "home", key: "home" },
  { as: "a", content: "Login", key: "login" }
];

class App extends Component{
  render(){
    return(
      <BrowserRouter>
      <div className="App">
        <NavBar rightItems={rightItems} />
        <Route exact path='/' component={projectlist} />
        <Route path='/addproject' component={AddProject} />
      </div>
      </BrowserRouter>
    );
  }
}
export default App



