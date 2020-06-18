import React, { Component } from 'react'
import {connect} from 'react-redux'
import { AuthenticateUser } from '../actions/auth'
import propTypes from 'prop-types'
import {getProjects,deleteProject} from '../actions/projectAction'
import { tokenConfig } from '../actions/auth'
import {Header,Icon, Segment, SegmentGroup, Card, Label,Table,Popup,CardGroup} from 'semantic-ui-react'
import NavBar from './navbar'
import Moment from 'moment'
import {Link} from 'react-router-dom'
import {store} from '../index'
import '../css/mypage.css'
import axios from 'axios'
import { createMessage } from '../actions/messages'
import {returnErrors} from '../actions/messages'

class MyPage extends Component {

    static propTypes = {
        getProjects : propTypes.func.isRequired,
        deleteProject : propTypes.func.isRequired,
        AuthenticateUser : propTypes.func.isRequired,
        tokenConfig : propTypes.func.isRequired
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




        return (
          <div>
            <NavBar />
            <div className="ui">
              <div className="container ui">
                <Header as="h2" icon textAlign="center">
                  <Icon name="code" circular />
                  <Header.Content>YOUR ACTIVITIES</Header.Content>
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
                      <Segment color="red" className="">
                        <Label as="a" color="red" attached="top left" ribbon>
                          Testing
                        </Label>
                        <CardGroup>{postlisttestingcreator}</CardGroup>
                      </Segment>
                      <Segment color="green" className="">
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
                      <Segment color="red" className="testing-segment">
                        <Label as="a" color="red" attached="top left" ribbon>
                          Testing
                        </Label>
                        <CardGroup>{postlisttestinguser}</CardGroup>
                      </Segment>
                      <Segment color="green" className="launched-segment">
                        <Label as="a" color="green" attached="top left" ribbon>
                          Launched
                        </Label>
                        <CardGroup>{postlistlauncheduser}</CardGroup>
                      </Segment>
                    </Segment>
                  </Segment.Group>
                </Segment>
                <Segment>
                  <Header as="h4" icon textAlign="center">
                    <Icon name="bug" circular />
                    <Header.Content>BUGS ASSIGNED</Header.Content>
                  </Header>
                  {fullassignedbuglist}
                </Segment>
                <Segment>
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


export default connect(mapStateToProps,{AuthenticateUser,deleteProject,tokenConfig,getProjects})(MyPage)
