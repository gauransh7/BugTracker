import React, { Component } from "react";
// import { Icon } from "semantic-ui-react";
import Projectlist from "./components/project/projectlist";
import AddProject from './components/project/addProject';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Alert from './components/layout/alert'
import Login from './components/accounts'
// import PrivateRouter from './components/common/PrivateRouter'
import {LoadUser} from './actions/auth'
import { store } from './index'
// import singleproject from './components/project/singleproject'
import getauth from "./components/getauth";
import buglist from "./components/bug/buglist";
import singleproject from "./components/project/singleproject";




class App extends Component{
  componentDidMount(){
    store.dispatch(LoadUser())
  }

  render(){
    return(
      <Router>
        <Alert />
      <div className="App">
        <Switch>
        <Route exact path='/' component={Projectlist} />
        <Route exact path='/project/:id/bugs' component={buglist} />
        <Route exact path='/project/:id' component={singleproject} />
        <Route exact path='/getauth' component={getauth} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/addproject' component={AddProject} />
        </Switch>
      </div>
      </Router>

    );
  }
}
export default App



