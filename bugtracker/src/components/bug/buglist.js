import React, {Component} from 'react'
import axios from 'axios'
import { tokenConfig } from '../../actions/auth'
import { connect} from 'react-redux'
import {store} from '../../index'
import { Grid,Search,Icon, Button} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NavBar  from '../navbar'
import { Table } from 'semantic-ui-react'
import { Date} from 'prismic-reactjs';
import Moment from 'moment'
import { deleteProject} from '../../actions/projectAction'
import { AuthenticateUser } from '../../actions/auth'
// import { returnErrors } from '../../actions/messages'
import propTypes from 'prop-types'



const rightItems = [
    { as: "a", content: "home", key: "home" },
    { as: "a", content: "Login", key: "login" }
  ];
  


class buglist extends Component{ 

    static propTypes = {
        tokenConfig : propTypes.func.isRequired,
        deleteProject : propTypes.func.isRequired,
        AuthenticateUser:propTypes.func.isRequired
    }


    state = {
        bugs : []
    }

    componentDidMount(){
        console.log(this.props);
        let id =  this.props.match.params.id;
        console.log(tokenConfig(store.getState))
        axios.get(`http://localhost:8000/BugTracker/projects/${id}/`, tokenConfig(store.getState))
            .then(res =>{
                console.log(res.data)
                this.setState({
                    ...this.state,
                   ...res.data
                })
                console.log(this.state)

            }

            ).catch(err => console.log(err))
        axios.get(`http://localhost:8000/BugTracker/projects/${id}/bugs/`,tokenConfig(store.getState))
            .then(res => {
                console.log(Object.keys(res.data).length)
                this.setState({
                    ...this.state,
                    bugs : [...res.data]
                })
                console.log(this.state)
                console.log(this.state.name)
            })

    }
    render(){

        const buglist = this.state.bugs.length ? (
            this.state.bugs.map(bug => {
                const date = Date(bug.listed_on);
                const formattedDate = Moment(date).format("LL");
                return  <Table.Row key={bug.id}>
                <Table.Cell>{bug.heading}</Table.Cell>
                <Table.Cell>{formattedDate}</Table.Cell>
                <Table.Cell>{bug.assigntouser ? bug.assigntouser : <Button>Assign Bug</Button>}</Table.Cell>
              </Table.Row>
            })) : (
                <Table.Row key='1'>
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>No</Table.Cell>
              </Table.Row>
            )


        return (<div>
            <NavBar rightItems={rightItems} />
            <nav className="nav-wrapper blue container ui segment black-text darken-1">
            <Grid>
            <Grid.Column width={11} textAlign="left" className="border">
                <div className="large bold left" >{this.state.name}</div>
            </Grid.Column>
            <Grid.Column width={3}>
                <Search aligned='right' />
            </Grid.Column>
            <Grid.Column width={2}>
                <Link to='/addproject' ><Icon aligned='right' name="add">Bug</Icon></Link>
            </Grid.Column>
            </Grid>
            </nav>
            <div className='container ui segment'>
            <Table color={'red'} >
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Heading</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Assign To</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
                {buglist}
            </Table.Body>
            </Table>
            </div>
            </div>
                )
    }
}

  export default connect(null,{deleteProject,AuthenticateUser})(buglist)