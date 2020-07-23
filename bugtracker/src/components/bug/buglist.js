import React, {Component} from 'react'
import axios from 'axios'
import { tokenConfig } from '../../actions/auth'
import { connect} from 'react-redux'
import {store} from '../../index'
import { Grid,Search,Icon,Label, Button,Menu,Breadcrumb, Popup, Segment,Loader,Dimmer} from 'semantic-ui-react'
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


  constructor(props){
    super(props)
    this.state = {
      deletingbug : false,
        staff : false,
        bugs : [],
        statuses : [
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
        ],
        isloading : true,
        loaderror : false
    }
}

    static propTypes = {
        tokenConfig : propTypes.func.isRequired,
        deleteProject : propTypes.func.isRequired,
        AuthenticateUser:propTypes.func.isRequired,
        createMessage : propTypes.func.isRequired,
        returnErrors : propTypes.func.isRequired
    }


    

    deletebug = (id) => {
      axios.delete(`http://localhost:8000/BugTracker/bugs/${id}/`,tokenConfig(store.getState))
        .then(resp => { store.dispatch(createMessage({ BugDelete: 'Bug Deleted'}))
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

              if(res.status === 200 && res.data.id){
                console.log(res.data)
                this.setState({
                    ...this.state,
                   ...res.data,
                })
                console.log(this.state)
            }
            else{
                this.setState({...this.state,
                  loaderror:true})
            }

                


            }

            ).catch(err => {
              if(err.response && err.response.status === 401){
                window.location.href = 'http://loacalhost:3000/Login'
            }
            this.setState({loaderror:true,isLoading:false })})
        axios.get(`http://localhost:8000/BugTracker/projects/${id}/bugs/`,tokenConfig(store.getState))
            .then(res => {
              if(res.status === 200 && res.data){
                console.log(Object.keys(res.data).length)
                this.setState({
                    ...this.state,
                    bugs : [...res.data]
                })
              }
              else{
                this.setState({...this.state,
                  loaderror:true})
              }
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
            .catch(err => {
              if(err.response && err.response.status === 401){
                window.location.href = 'http://loacalhost:3000/Login'
            }
            this.setState({loaderror:true,isLoading:false })})

            this.setState({
                staff : this.props.auth.is_staff
              })
              console.log(this.props)

    }

    getstatuses = () => {
      this.state.bugs.map(bug => {
          let x = false;
          for(let i=0;i<this.state.statuses.length;i++){
              if(this.state.statuses[i]===bug.status){
                x=true;
                break;
              }

          }
          if(!x){
            this.setState({
                ...this.state,
                statuses : [...this.state.statuses,bug.status]
            })
          }
      })
  }
    render(){
      var permission = false;
      this.getstatuses()
      if (this.state.user && this.props.auth.id){
        for(let x=0;x<this.state.user.length;x++){
          if(this.state.user[x]===this.props.auth.id){
            permission=true;
            break;
          }
        }
      }

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
                            <Table.Cell className='center aligned six column wide'><Link style={{'color':"black"}} to={`/bugs/${bug.id}/comments`}><Icon name='eye' style={{'float':'left'}} size='normal' className='left floated' /> {bug.heading}</Link></Table.Cell>
                            <Table.Cell className='center aligned six column wide'>{formattedDate}</Table.Cell>
                            <Table.Cell className='trbuglist center aligned six column wide'>
                              {bug.assigntouser ? (
                                bug.assigntouser
                              ) : (
                                <span>--NOT ASSIGNED--</span>
                              )}

                                {this.props.auth.is_staff ? (
                                  true
                                ) : false ||
                                  this.props.auth.id === this.state.creator ||
                                  permission||
                                  this.props.auth.id === bug.user ||
                                  this.props.auth.id === bug.assign_to ? (
                                    <span>
                                  <Popup
                                    trigger={
                                      <Icon
                                      style={{'float':'right'}}
                                        name="trash"
                                        color="red"
                                      />
                                    }
                                    
                                    content="Clicking on this will permanently DELETE this bug"
                                  />
                                  </span>
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


        return (
          <div>
                {this.state.isLoading?<Segment className='fullscreen' style={{'background-color':'black','height':'-webkit-fill-available','width':'auto'}}>
            <Dimmer className='fullscreen' active>
              <Loader className='center' indeterminate>GOOD THINGS TAKE TIME</Loader>
            </Dimmer>
          </Segment>:
                (this.state.loaderror)?<Segment className='fullscreen' style={{'background-color':'black','height':'-webkit-fill-available','width':'auto'}}>
            <Dimmer className='fullscreen' active>
              <span><p>SOMETHING WRONG HAPPENED ! </p><p> -- CHECK THE URL YOU WANT TO ACCESS --  </p><p> -- PLEASE TRY RELOAD OR CONTACT ADMIN -- </p></span>
            </Dimmer>
          </Segment> :
                <div>
            <NavBar rightItems={rightItems} />
            <div className="ui">
              <div className="container ui">
                <Menu borderless className="ui plmenu">
                  <Menu.Item>
                    <Breadcrumb>
                      <Breadcrumb.Section
                        style={{ color: "black" }}
                        as={Link}
                        to="/"
                      >
                        Projects
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider
                        icon="right chevron"
                        style={{ color: "darkblue" }}
                      />
                      <Breadcrumb.Section
                        style={{ color: "black" }}
                        as={Link}
                        to={`/project/${this.props.match.params.id}`}
                      >
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
                  <Menu.Item position="right" as={Link} to={`/project/${this.props.match.params.id}/addbug/`}>
                    <Button basic icon labelPosition="right">
                      <Icon name="add" size="normal" />
                      Add Bug
                    </Button>
                  </Menu.Item>
                </Menu>
              </div>
              <div className="blsegment ">
                <Segment basic color={"black"} className="buglistmain ">
                  <Label as="a" color={"black"} attached="top left" ribbon>
                    Header
                  </Label>
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell className="center aligned six column wide">
                          Heading
                        </Table.HeaderCell>
                        <Table.HeaderCell className="center aligned six column wide">
                          Date
                        </Table.HeaderCell>
                        <Table.HeaderCell className="center aligned six column wide">
                          Assign To
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                  </Table>
                </Segment>
                {fullbuglist}
              </div>
            </div>
          </div>
                }
            </div>






          
        );
    }
}

const mapStateToProps = (state) => {
    return{
        auth : state.auth,
        posts : state.project.posts
    }
}
  export default connect(mapStateToProps,{deleteProject,createMessage,tokenConfig,returnErrors,AuthenticateUser})(buglist)