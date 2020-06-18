import React, { Component } from 'react'
import axios from 'axios';
import { tokenConfig } from '../actions/auth';
import { store } from '..';
import { Table, Tab ,Segment,Dimmer,Loader, Icon,Checkbox} from 'semantic-ui-react';
import NavBar from './navbar';
import { createMessage } from '../actions/messages';
import {connect} from 'react-redux'

class admin extends Component {
    constructor(props){
        super(props);
        this.state={
            isLoading : true,
            loadError : false,
            users : []
        }
    }

    componentDidMount(){
        axios.get('http://localhost:8000/BugTracker/users/',tokenConfig(store.getState))
            .then(res => {
                console.log(res.data)
                if(res){
                    this.setState({
                        ...this.state,
                        users : [...res.data],
                        isLoading : false,
                    })
                }
                else{
                    this.setState({
                        ...this.state,
                        isLoading : false,
                        loadError : true
                    })
                }
            })
            .catch(err => {console.log(err)
                this.setState({
                    loadError : true,
                    isLoading : false
                })})
    }

    changebool = (field,name) => (event) => {
        console.log(name)
        console.log(field)
        console.log(this.state.users.filter(user => user.id===field)[0][name])
        axios.patch(`http://localhost:8000/BugTracker/users/${field}/`,{[name]:!this.state.users.filter(user => user.id===field)[0][name]},tokenConfig(store.getState))
            .then(res => {
                console.log(`${name} : ${field} : changed`)
                console.log(res)
                window.location.href='http://localhost:3000/admin/'
            //     this.componentDidMount()
            //     this.setState({
            //         ...this.state,
            //         users : this.state.users.map(user => { if(user.id===field){user[name]=!this.state.users.filter(user => user.id===field)[0][name]}})
            // })
            
    }
            )
            .catch(err => console.log(err.response))
}

    render()
    {
        console.log(this.state)
        const userlist = this.state.users.map(user => {
            console.log(user.first_name)
            return <Table.Row key={user.id}>
                <Table.Cell><div>{this.state.users.indexOf(user)+1}</div></Table.Cell>
                <Table.Cell><div>{user.first_name}</div></Table.Cell>
                <Table.Cell >{user.is_active ? <Checkbox onClick={this.changebool(user.id,'is_active')} toggle checked/> : <Checkbox onClick={this.changebool(user.id,'is_active')} toggle />}</Table.Cell>
                <Table.Cell >{user.is_staff ? <Checkbox onClick={this.changebool(user.id,'is_staff')} toggle checked/> : <Checkbox name='is_staff' onClick={this.changebool(user.id,'is_staff')} toggle />}</Table.Cell>
                <Table.Cell>{user.cur_yr}</Table.Cell>
            </Table.Row>
        })
        return (
            !this.state.isLoading ? !this.state.loadError ? this.props.auth.User.is_staff ?
            <div className='ui'>
            <NavBar />
            <div className='ui segment container'>
                <Table>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>S. no.</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Staff</Table.HeaderCell>
                    <Table.HeaderCell>Year</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {userlist}
                    </Table.Body>
                </Table>
            </div> 
            </div> :<Segment className='fullscreen' style={{'background-color':'black','height':'-webkit-fill-available','width':'auto'}}>
            <Dimmer className='fullscreen' active>
              You are not allowed to view this page.
            </Dimmer>
          </Segment> :<Segment className='fullscreen' style={{'background-color':'black','height':'-webkit-fill-available','width':'auto'}}>
            <Dimmer className='fullscreen' active>
              Some Error Occurred.
            </Dimmer>
          </Segment> : <Segment className='fullscreen' style={{'background-color':'black','height':'-webkit-fill-available','width':'auto'}}>
            <Dimmer className='fullscreen' active>
              <Loader className='center' indeterminate>GOOD THINGS TAKE TIME</Loader>
            </Dimmer>
          </Segment>
        )
    }
}
 const mapStateToProps = (state) => {
     return {
         auth : state.auth
     }
 }

export default connect(mapStateToProps)(admin)
