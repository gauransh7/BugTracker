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
import AddBug from "./components/bug/addbug";
import singleproject from "./components/project/singleproject";
import commentlist from './components/comment/commentlist'
import editproject from "./components/project/editproject";
import MyPage from "./components/mypage";
import admin from "./components/admin"




class App extends Component{
//   constructor(props) {
//     super(props);

//     this.state = {
//         ws: null
//     };
// }

// single websocket instance for the own application and constantly trying to reconnect.


  componentDidMount(){
    // this.connect();
    store.dispatch(LoadUser())
  }



  // timeout = 250; // Initial timeout duration as a class variable

  //   /**
  //    * @function connect
  //    * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
  //    */
  //   connect = () => {
  //       var ws = new WebSocket("ws://localhost:3000/ws");
  //       let that = this; // cache the this
  //       var connectInterval;

  //       // websocket onopen event listener
  //       ws.onopen = () => {
  //           console.log("connected websocket main component");

  //           this.setState({ ws: ws });

  //           that.timeout = 250; // reset timer to 250 on open of websocket connection 
  //           clearTimeout(connectInterval); // clear Interval on on open of websocket connection
  //       };

  //       // websocket onclose event listener
  //       ws.onclose = e => {
  //           console.log(
  //               `Socket is closed. Reconnect will be attempted in ${Math.min(
  //                   10000 / 1000,
  //                   (that.timeout + that.timeout) / 1000
  //               )} second.`,
  //               e.reason
  //           );

  //           that.timeout = that.timeout + that.timeout; //increment retry interval
  //           connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
  //       };

  //       // websocket onerror event listener
  //       ws.onerror = err => {
  //           console.error(
  //               "Socket encountered error: ",
  //               err.message,
  //               "Closing socket"
  //           );

  //           ws.close();
  //       };
  //   };

    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
     */
    // check = () => {
    //     const { ws } = this.state;
    //     if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    // };



  render(){
    return(
      <Router>
        <Alert />
      <div className="App">
        <Switch>
        <Route exact path='/' component={Projectlist} />
        <Route exact path='/project/:id/bugs' component={buglist} />
        <Route exact path='/bugs/:id/comments' component={commentlist} />
        <Route exact path='/project/:id' component={singleproject} />
        <Route exact path='/mypage/:id' component={MyPage} />
        <Route exact path='/project/:id/addbug' component={AddBug} />
        <Route exact path='/admin' component={admin} />
        <Route exact path='/project/:id/edit' component={editproject} />
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



