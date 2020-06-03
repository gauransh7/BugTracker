import React, {Component} from 'react'
import axios from 'axios'
import { tokenConfig } from '../../actions/auth'
import { connect} from 'react-redux'
import {store} from '../../index'
import { Grid,Search,Icon,Label, Button,Menu,Breadcrumb, Popup, Segment} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NavBar  from '../navbar'
import { Table } from 'semantic-ui-react'
import { Date} from 'prismic-reactjs';
import Moment from 'moment'
import '../../css/buglistpage.css'
import { deleteProject} from '../../actions/projectAction'
import { AuthenticateUser } from '../../actions/auth'
// import { returnErrors } from '../../actions/messages'
import propTypes from 'prop-types'
import { createMessage, returnErrors } from '../../actions/messages'




const rightItems = [
    { as: "a", content: "home", key: "home" },
    { as: "a", content: "Login", key: "login" }
  ];
  

  // const deletebug = (id) => {
  //   this.setState({
  //     deletingbug : true
  //   })
  //   axios.delete(`http://localhost:8000/BugTracker/bugs/${id}/`,tokenConfig(store.getState))
  //     .then(res => { store.dispatch(createMessage({ BugDelete: 'Bug Deleted Without Error'}))})
  //     .catch(err => {returnErrors(err.response.data,err.response.status)})
  //     this.setState({
  //       deletingbug : false
  //     })
  // }


class buglist extends Component{ 

    static propTypes = {
        tokenConfig : propTypes.func.isRequired,
        deleteProject : propTypes.func.isRequired,
        AuthenticateUser:propTypes.func.isRequired,
        createMessage : propTypes.func.isRequired,
        returnErrors : propTypes.func.isRequired
    }


    state = {
      deletingbug : false,
        staff : false,
        bugs : [],
        statuses : [
            'new',
            'assigned',
            'duplicate',
            'not a bug',
            'open',
            'fixed',
            'retesting',
            'verified',
            'closed',
        ],
        colors : [
            'red',
            'orange',
            'yellow',
            'olive',
            'green',
            'teal',
            'blue',
            'violet',
            'purple',
        ]
    }

    deletebug = (id) => {
      axios.delete(`http://localhost:8000/BugTracker/bugs/${id}/`,tokenConfig(store.getState))
        .then(resp => { store.dispatch(createMessage({ BugDelete: 'Bug Deleted Without Error'}))
        axios.get(`http://localhost:8000/BugTracker/projects/${this.props.match.params.id}/bugs/`,tokenConfig(store.getState))
        .then(res => {
            console.log(Object.keys(res.data).length)
            this.setState({
                ...this.state,
                bugs : [...res.data]
            })
    //        console.log(this.state)
     //       console.log(this.state.name)
            // console.log(this.props.auth)
            // this.state.statuses.map(stat => {
            //     if (this.state.bugs.map(bug => bug.status==stat).length===0){
            //         let statuses = this.state.statuses.filter(st => {
            //             console.log(st)
            //             console.log(this.state.bugs.map(bug => bug.status==stat).length)
            //             return st!==stat
            //         })
            //         this.setState({
            //             statuses : statuses
    
            //         })
            //     }
            //     else{
    
            //     }
            // })
        })
      })
        .catch(err => {returnErrors(err.response.data,err.response.status)})
      
    }

    componentDidMount(){
      this.props.AuthenticateUser()
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
        //        console.log(this.state)
         //       console.log(this.state.name)
                // console.log(this.props.auth)
                // this.state.statuses.map(stat => {
                //     if (this.state.bugs.map(bug => bug.status==stat).length===0){
                //         let statuses = this.state.statuses.filter(st => {
                //             console.log(st)
                //             console.log(this.state.bugs.map(bug => bug.status==stat).length)
                //             return st!==stat
                //         })
                //         this.setState({
                //             statuses : statuses
        
                //         })
                //     }
                //     else{
        
                //     }
                // })
            })
            this.setState({
                staff : this.props.auth.is_staff
              })
              console.log(this.props)

    }
    render(){

        // const showsegment = (name) =>{
        //     document.getElementById(name).style.display='visible'
        // }
        
        // console.log(this.props)
        const fullbuglist = this.state.statuses.map(stat =>{
           // console.log(this.state.statuses.indexOf(stat))
            this.state.bugs.map(bug => console.log(bug.status))
            return (
                <Segment id={stat} className='statussegment' basic color={this.state.colors[this.state.statuses.indexOf(stat)]}>
                 <Label
                as="a"
                color={this.state.colors[this.state.statuses.indexOf(stat)]}
                attached="top left"
                ribbon
              >
                {stat}
              </Label>
              <Table
              
                key={stat}
              >
                             
                <Table.Body>
                  {this.state.bugs.filter((bug) => bug.status === stat)
                    .length ? (
                    this.state.bugs
                      .filter((bug) => bug.status === stat)
                      .map((bug) => {
                    //    console.log(this.state.staff || this.props.auth.id === this.state.creator || this.props.auth.id in this.state.user || this.props.auth.id === bug.user || this.props.auth.id === bug.assign_to)
                        console.log(this.state.user)
                        const date = Date(bug.listed_on);
                        const formattedDate = Moment(date).format("LL");
                        return (
                          <Table.Row key={bug.id}>
                            <Table.Cell className='center aligned six column wide'>{bug.heading}</Table.Cell>
                            <Table.Cell className='center aligned six column wide'>{formattedDate}</Table.Cell>
                            <Table.Cell  className='trbuglist center aligned six column wide'>
                              {bug.assigntouser ? (
                                bug.assigntouser
                              ) : (
                                <span>--NOT ASSIGNED--</span>
                              )}

                              
                                {this.props.auth.is_staff ? (
                                  true
                                ) : false ||
                                  this.props.auth.id === this.state.creator ||
                                  this.props.auth.id in this.state.user ? (
                                  true
                                ) : false ||
                                  this.props.auth.id === bug.user ||
                                  this.props.auth.id === bug.assign_to ? (
                                    <Label basic className='right floated' floating onClick = {() => {this.deletebug(bug.id)}} >
                                  <Popup
                                    trigger={
                                      <Icon
                                        name="delete"
                                        color="red"
                                      />
                                    }
                                    
                                    content="Clicking on this will permanently DELETE this bug"
                                  />
                                  </Label>
                                ) : (
                                  ""
                                )}
                              
                            </Table.Cell>
                          </Table.Row>
                        );
                      })
                                    ) : (
                    ''
                  )}
                </Table.Body>
              </Table>
              </Segment>
            );
        })

        

        // const buglist = this.state.bugs.filter(bug => bug.status).length ? (
        //     this.state.bugs.map(bug => {
        //         console.log(bug)
        //         const date = Date(bug.listed_on);
        //         const formattedDate = Moment(date).format("LL");
        //         return  <Table.Row key={bug.id}>
        //         <Table.Cell>{bug.heading}</Table.Cell>
        //         <Table.Cell>{formattedDate}</Table.Cell>
        //         <Table.Cell>{bug.status}</Table.Cell>
        //         <Table.Cell>{bug.assigntouser ? bug.assigntouser : <Button>Assign Bug</Button>}</Table.Cell>
        //       </Table.Row>
        //     })) : (
        //         <Table.Row key='1'>
        //         <Table.Cell>NO</Table.Cell>
        //         <Table.Cell>NO</Table.Cell>
        //         <Table.Cell>No</Table.Cell>
        //       </Table.Row>
        //     )


        return (<div>
            <NavBar rightItems={rightItems} />
            <div className="ui">
              <div className="container ui">
                <Menu borderless className="ui plmenu">
                  <Menu.Item>
                    <Breadcrumb>
                      <Breadcrumb.Section style={{ color: "black" }} as={Link} to='/' >
                        Projects
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider
                        icon="right chevron"
                        style={{ color: "darkblue" }}
                      />
                      <Breadcrumb.Section style={{ color: "black" }} as={Link} to={`/project/${this.props.match.params.id}`}>
                        {this.state.name}
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider
                        icon="right chevron"
                        style={{ color: "darkblue" }}
                      />
                      <Breadcrumb.Section style={{ color: "black" }} link>
                        All Bugs
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </Menu.Item>
                </Menu>
              </div>
            <div className='blsegment '>
            <Segment basic color={'black'}  className='buglistmain ' >
            <Label
                as="a"
                color={'black'}
                attached="top left"
                ribbon
              >
                Header
              </Label>
            <Table>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell className='center aligned six column wide'>Heading</Table.HeaderCell>
                <Table.HeaderCell className='center aligned six column wide'>Date</Table.HeaderCell>
                <Table.HeaderCell className='center aligned six column wide'>Assign To</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            </Table>
            </Segment>
                {fullbuglist}
            </div>

            </div>
            </div>
                )
    }
}

const mapStateToProps = (state) => {
    return{
        auth : state.auth,
        posts : state.project.posts
    }
}
  export default connect(mapStateToProps,{deleteProject,createMessage,tokenConfig,returnErrors,AuthenticateUser})(buglist)