import React, { Component } from 'react'
import {connect} from 'react-redux'
import { AuthenticateUser } from '../actions/auth'
import propTypes from 'prop-types'
import {getProjects,deleteProject} from '../actions/projectAction'
import { getUsers } from '../actions/auth'
import { tokenConfig } from '../actions/auth'
import {Header,Icon, Segment, SegmentGroup, Image,Card, Label,Table,Popup,CardGroup} from 'semantic-ui-react'
import NavBar from './navbar'
import Moment from 'moment'
import {Link} from 'react-router-dom'
import {store} from '../index'
import '../css/mypage.css'
import axios from 'axios'
import { createMessage } from '../actions/messages'
import {returnErrors} from '../actions/messages'

class MyPage extends Component {
  constructor(props) {
    super(props);
    //this.state = {};
  }

    static propTypes = {
        getProjects : propTypes.func.isRequired,
        deleteProject : propTypes.func.isRequired,
        AuthenticateUser : propTypes.func.isRequired,
        tokenConfig : propTypes.func.isRequired,
        getUsers : propTypes.func.isRequired
      }

    state = {
        assigned:[],
        reported:[],
        assignedstatuses:[
        ],
        reportedstatuses:[],
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

    componentDidMount(){
        console.log(this.props.match.params.id)
        console.log("assigned" in this.state.assignedstatuses)
        this.props.AuthenticateUser()
        this.props.getProjects()
        this.props.getUsers()
        if(this.props.match.params.id)
            {   console.log(this.props.auth.id)
                axios.get(`http://localhost:8000/BugTracker/users/${this.props.match.params.id}/bug_assigned/`,tokenConfig(store.getState)) 
                .then(res => {
                    console.log(res.data)
                    this.setState({
                        ...this.state,
                        assigned : [...res.data]
                    })
                    console.log(res.data)
                })
                .catch(err => console.log(err))

            axios.get(`http://localhost:8000/BugTracker/users/${this.props.match.params.id}/bugs/`,tokenConfig(store.getState)) 
                .then(res => {
                    this.setState({
                        ...this.state,
                        reported : [...res.data]
                    })
                })
                .catch(err => createMessage(err.response.data,err.response.status))}
        
    }
    checkprojectuser = (project) => {
        if (project.user && this.props.auth.id){
            for(let x=0;x<project.user.length;x++){
              if(project.user[x]===parseInt(this.props.match.params.id)){
                return true
              }
            }
            return false
          }
      }

      getassignedstatuses = () => {
          this.state.assigned.map(bug => {
              let x = false;
              for(let i=0;i<this.state.assignedstatuses.length;i++){
                  if(this.state.assignedstatuses[i]===bug.status){
                    x=true;
                    break;
                  }

              }
              if(!x){
                this.setState({
                    ...this.state,
                    assignedstatuses : [...this.state.assignedstatuses,bug.status]
                })
              }
          })
      }
      getreportedstatuses = () => {
        this.state.reported.map(bug => {
            let x = false;
            for(let i=0;i<this.state.reportedstatuses.length;i++){
                if(this.state.reportedstatuses[i]===bug.status){
                  x=true;
                  break;
                }

            }
            if(!x){
              this.setState({
                  ...this.state,
                  reportedstatuses : [...this.state.reportedstatuses,bug.status]
              })
            }
        })
    }

    reload = () =>{
        this.componentDidMount()
        this.render()
    }
    deletebug = (id) => {
        axios.delete(`http://localhost:8000/BugTracker/bugs/${id}/`,tokenConfig(store.getState))
          .then(resp => { store.dispatch(createMessage({ BugDelete: 'Bug Deleted Without Error'}))
          axios.get(`http://localhost:8000/BugTracker/projects/${this.props.match.params.id}/bugs/`,tokenConfig(store.getState))
          .then(res => this.reload())
          })
          .catch(err => {returnErrors(err.response.data,err.response.status)})
        
      }


    render() {
        this.getassignedstatuses()
        this.getreportedstatuses()
        console.log(this.state)
        console.log(this.props.match.params.id)
        var projectcreator = this.props.projects.filter(pro => pro.creator===parseInt(this.props.match.params.id))
        var projectuser = this.props.projects.filter(pro => this.checkprojectuser(pro))
        console.log(projectcreator)
        console.log(projectuser)


        const projectsascreator = projectcreator.map(project => {
            return <Card color='red' header={project.name} />
        })
        const projectsasmember = projectuser.map(project => {
            return <Card color='red' header={project.name} />
        })



        const postlisttestingcreator = projectcreator.filter(post => post.launched===false).length ? (
            projectcreator.filter(post => post.launched===false).map(post => {
      
      
                return <Card color='red' key={post.id}>
                <Card.Content>
                  <Card.Header>
                  {/* <Image src={finallogo} floated='right' size='mini' /> */}
                  <Icon name='cubes' className='right floated' size='normal' />
                  {/* <Image className="right" src='https://react.semantic-ui.com/assets/images/avatar/large/matthew.png' /> */}
                    <Link to={`/project/${post.id}`}><span style={{'color':'black'}} >{ post.name }</span></Link>
              </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                     {Moment(Date(post.created_on)).format("LL")}
                </span>
                  </Card.Meta>
                  {/* <Card.Description>
                    {post.wiki}
                    <Icon className="right-align" name="bug" >35</Icon>
              </Card.Description> */}
                </Card.Content>
                <Card.Content extra>
                <Link to={`/project/${post.id}/bugs`} >
                    <Icon name='bug' color='red' />
                    {post.countbugs}
                    </Link>
                    
                    <Popup trigger={<Icon name="delete" color="red" className='right floated delpro' onClick={this.props.deleteProject.bind(this,post.id)}/>} content='Clicking on this will permanently DELETE this project' />
                </Card.Content>
              </Card>
            })
          ) : (
            <div>No Projects for testing</div>
          )
      
          const postlistlaunchedcreator = projectcreator.filter(post => post.launched===true).length ? (
            projectcreator.filter(post => post.launched===true).map(post => {
                return <Card color='green' key={post.id}>
                <Card.Content>
                  <Card.Header>
                  {/* <Image src={finallogo} floated='right' size='mini' /> */}
                  <Icon name='cubes' className='right floated' size='normal' />
                  {/* <Image className="right" src='https://react.semantic-ui.com/assets/images/avatar/large/matthew.png' /> */}
                    <Link to={`/project/${post.id}`}><span style={{'color':'black'}} >{ post.name }</span></Link>
              </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                     {Moment(Date(post.created_on)).format("LL")}
                </span>
                  </Card.Meta>
                  {/* <Card.Description>
                    {post.wiki}
                    <Icon className="right-align" name="bug" >35</Icon>
              </Card.Description> */}
                </Card.Content>
                <Card.Content extra>
                <Link to={`/project/${post.id}/bugs`} >
                    <Icon name='bug' color='red' />
                    {post.countbugs}
                    </Link>
                    <Popup trigger={<Icon name="delete" color="red" className='right floated delpro' onClick={this.props.deleteProject.bind(this,post.id)}/>} content='Clicking on this will permanently DELETE this project' /> 
                </Card.Content>
              </Card>
            })
          ) : (
            <div>No Projects Launched</div>
          )



          const postlisttestinguser = projectuser.filter(post => post.launched===false).length ? (
            projectuser.filter(post => post.launched===false).map(post => {
      
      
                return <Card color='red' key={post.id}>
                <Card.Content>
                  <Card.Header>
                  {/* <Image src={finallogo} floated='right' size='mini' /> */}
                  <Icon name='cubes' className='right floated' size='normal' />
                  {/* <Image className="right" src='https://react.semantic-ui.com/assets/images/avatar/large/matthew.png' /> */}
                    <Link to={`/project/${post.id}`}><span style={{'color':'black'}} >{ post.name }</span></Link>
              </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                     {Moment(Date(post.created_on)).format("LL")}
                </span>
                  </Card.Meta>
                  {/* <Card.Description>
                    {post.wiki}
                    <Icon className="right-align" name="bug" >35</Icon>
              </Card.Description> */}
                </Card.Content>
                <Card.Content extra>
                <Link to={`/project/${post.id}/bugs`} >
                    <Icon name='bug' color='red' />
                    {post.countbugs}
                    </Link>
                    
                    <Popup trigger={<Icon name="delete" color="red" className='right floated delpro' onClick={this.props.deleteProject.bind(this,post.id)}/>} content='Clicking on this will permanently DELETE this project' />
                </Card.Content>
              </Card>
            })
          ) : (
            <div>No Projects for testing</div>
          )
      
          const postlistlauncheduser = projectuser.filter(post => post.launched===true).length ? (
            projectuser.filter(post => post.launched===true).map(post => {
                return <Card color='green' key={post.id}>
                <Card.Content>
                  <Card.Header>
                  {/* <Image src={finallogo} floated='right' size='mini' /> */}
                  <Icon name='cubes' className='right floated' size='normal' />
                  {/* <Image className="right" src='https://react.semantic-ui.com/assets/images/avatar/large/matthew.png' /> */}
                    <Link to={`/project/${post.id}`}><span style={{'color':'black'}} >{ post.name }</span></Link>
              </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                     {Moment(Date(post.created_on)).format("LL")}
                </span>
                  </Card.Meta>
                  {/* <Card.Description>
                    {post.wiki}
                    <Icon className="right-align" name="bug" >35</Icon>
              </Card.Description> */}
                </Card.Content>
                <Card.Content extra>
                <Link to={`/project/${post.id}/bugs`} >
                    <Icon name='bug' color='red' />
                    {post.countbugs}
                    </Link>
                    <Popup trigger={<Icon name="delete" color="red" className='right floated delpro' onClick={this.props.deleteProject.bind(this,post.id)}/>} content='Clicking on this will permanently DELETE this project' /> 
                </Card.Content>
              </Card>
            })
          ) : (
            <div>No Projects Launched</div>
          )




        const fullassignedbuglist = this.state.assignedstatuses.map(stat =>{
            // console.log(this.state.statuses.indexOf(stat))
             this.state.assigned.map(bug => console.log(bug.status))
             return (
                 <Segment style={{'align-self':'center'}} id={stat} className='statussegment' basic color={this.state.colors[this.state.statuses.indexOf(stat)]}>
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
                   {this.state.assigned.filter((bug) => bug.status === stat)
                     .length ? (
                     this.state.assigned
                       .filter((bug) => bug.status === stat)
                       .map((bug) => {
                     //    console.log(this.state.staff || this.props.auth.id === this.state.creator || this.props.auth.id in this.state.user || this.props.auth.id === bug.user || this.props.auth.id === bug.assign_to)
                         console.log(this.state.user)
                         const date = Date(bug.listed_on);
                         const formattedDate = Moment(date).format("LL");
                         return (
                           <Table.Row key={bug.id}>
                             <Table.Cell className='center aligned six column wide'><Link style={{'color':"black"}} to={`/bugs/${bug.id}/comments`}><Icon name='eye' size='normal' className='left floated' /> {bug.heading}</Link></Table.Cell>
                             <Table.Cell className='center aligned six column wide'>{formattedDate}</Table.Cell>
                             <Table.Cell  className='trbuglist center aligned six column wide'>
                               {bug.assigntouser ? (
                                 bug.assigntouser
                               ) : (
                                 <span>--NOT ASSIGNED--</span>
                               )}
 
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


         const fullreportedbuglist = this.state.reportedstatuses.map(stat =>{
            // console.log(this.state.statuses.indexOf(stat))
             this.state.reported.map(bug => console.log(bug.status))
             return (
                 <Segment style={{'align-self':'center'}} id={stat} className='statussegment' basic color={this.state.colors[this.state.statuses.indexOf(stat)]}>
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
                   {this.state.reported.filter((bug) => bug.status === stat)
                     .length ? (
                     this.state.reported
                       .filter((bug) => bug.status === stat)
                       .map((bug) => {
                     //    console.log(this.state.staff || this.props.auth.id === this.state.creator || this.props.auth.id in this.state.user || this.props.auth.id === bug.user || this.props.auth.id === bug.assign_to)
                         console.log(this.state.user)
                         const date = Date(bug.listed_on);
                         const formattedDate = Moment(date).format("LL");
                         return (
                           <Table.Row key={bug.id}>
                             <Table.Cell className='center aligned six column wide'><Link style={{'color':"black"}} to={`/bugs/${bug.id}/comments`}><Icon name='eye' size='normal' className='left floated' /> {bug.heading}</Link></Table.Cell>
                             <Table.Cell className='center aligned six column wide'>{formattedDate}</Table.Cell>
                             <Table.Cell  className='trbuglist center aligned six column wide'>
                               {bug.assigntouser ? (
                                 bug.assigntouser
                               ) : (
                                 <span>--NOT ASSIGNED--</span>
                               )}
 
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

         console.log(this.props.auth.users)
         console.log(this.props.match.params.id)
         console.log(this.props.auth.users.find((use) => use.id == this.props.match.params.id))

        return (
          <div>
            <NavBar />
            <div className="ui">
              <div className="container ui">
                <Card centered style={{'margin-top': '10%'}}>
                  <Image
                    src={this.props.auth.users.find((use) => use.id == this.props.match.params.id) ? this.props.auth.users.find(use => use.id == this.props.match.params.id).image : 'data:image/png;base64,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'  }
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    <Card.Header>{this.props.auth.users.find((use) => use.id == this.props.match.params.id) ? this.props.auth.users.find(use => use.id == this.props.match.params.id).first_name : 'user'  }</Card.Header>
                    <Card.Meta>
                      <span className="date">Year : {this.props.auth.users.find((use) => use.id == this.props.match.params.id) ? this.props.auth.users.find(use => use.id == this.props.match.params.id).cur_yr : 'Year'  }</span>
                    </Card.Meta>
                    <Card.Description>
                      Toatal bugs reported : {this.props.auth.users.find((use) => use.id == this.props.match.params.id) ? this.props.auth.users.find(use => use.id == this.props.match.params.id).countbugs : '0'  } 
                    </Card.Description>
                  </Card.Content>
                </Card>
                <Header as="h2" icon textAlign="center">
                  <Icon name="code" circular />
                  <Header.Content>ACTIVITIES</Header.Content>
                </Header>
              </div>
              <Segment.Group className="container mypagemainsegment">
                <Segment>
                  <Header as="h4" icon textAlign="center">
                    <Icon name="cubes" circular />
                    <Header.Content>PROJECTS</Header.Content>
                  </Header>
                  <Segment.Group className="ui">
                    <Segment className="ui">
                      <Label as="a" color="pink" attached="top left" ribbon>
                        as Creator
                      </Label>
                      <Segment style={{'align-self':'center'}} color="red" className="">
                        <Label as="a" color="red" attached="top left" ribbon>
                          Testing
                        </Label>
                        <CardGroup>{postlisttestingcreator}</CardGroup>
                      </Segment>
                      <Segment color="green" style={{'align-self':'center'}} className="">
                        <Label as="a" color="green" attached="top left" ribbon>
                          Launched
                        </Label>
                        <CardGroup>{postlistlaunchedcreator}</CardGroup>
                      </Segment>
                    </Segment>
                    <Segment className="ui">
                      <Label as="a" color="yellow" attached="top left" ribbon>
                        as Team Member
                      </Label>
                      <Segment style={{'align-self':'center'}} color="red" className="testing-segment">
                        <Label as="a" color="red" attached="top left" ribbon>
                          Testing
                        </Label>
                        <CardGroup>{postlisttestinguser}</CardGroup>
                      </Segment>
                      <Segment style={{'align-self':'center'}} color="green" className="launched-segment">
                        <Label as="a" color="green" attached="top left" ribbon>
                          Launched
                        </Label>
                        <CardGroup>{postlistlauncheduser}</CardGroup>
                      </Segment>
                    </Segment>
                  </Segment.Group>
                </Segment>
                <Segment style={{'align-self':'center'}}>
                  <Header as="h4" icon textAlign="center">
                    <Icon name="bug" circular />
                    <Header.Content>BUGS ASSIGNED</Header.Content>
                  </Header>
                  {fullassignedbuglist}
                </Segment>
                <Segment style={{'align-self':'center'}}>
                  <Header as="h4" icon textAlign="center">
                    <Icon name="bug" circular />
                    <Header.Content>BUGS REPORTED</Header.Content>
                  </Header>
                  {fullreportedbuglist}
                </Segment>
              </Segment.Group>
            </div>
          </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        projects : state.project.posts,
        auth : state.auth
    }
}


export default connect(mapStateToProps,{AuthenticateUser,deleteProject,getUsers,tokenConfig,getProjects})(MyPage)
