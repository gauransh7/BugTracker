import React, { Component } from "react";
import NavBar from './components/navbar';
// import { Icon } from "semantic-ui-react";
import projectlist from "./components/project/projectlist";
import AddProject from './components/project/addProject';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Alert from './components/layout/alert'
import Login from './components/accounts'
import PrivateRouter from './components/common/PrivateRouter'
import {LoadUser} from './actions/auth'
import { store } from './index'
import singleproject from './components/project/singleproject'
import getauth from "./components/getauth";


const rightItems = [
  { as: "a", content: "home", key: "home" },
  { as: "a", content: "Login", key: "login" }
];


class App extends Component{
  componentDidMount(){
    store.dispatch(LoadUser())
  }

  render(){
    return(
      <Router>
        <NavBar rightItems={rightItems} />
        <Alert />
      <div className="App">
        <Switch>
        <PrivateRouter exact path='/' component={projectlist} />
        <PrivateRouter exact path='/project/:id' component={singleproject} />
        <Route exact path='/getauth' component={getauth} />
        <Route exact path='/Login' component={Login} />
        <PrivateRouter exact path='/addproject' component={AddProject} />
        </Switch>
      </div>
      </Router>

    );
  }
}
export default App



