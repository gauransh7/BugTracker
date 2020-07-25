import React, {Component} from 'react'
import axios from 'axios'
import { tokenConfig } from '../../actions/auth'
import { connect} from 'react-redux'
import {store} from '../../index'
import { getUsers } from '../../actions/auth'
import { Grid,Icon, Button,Menu,Breadcrumb,Card,Image, Feed, Segment, Embed} from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import NavBar  from '../navbar'
import { Date} from 'prismic-reactjs';
import Moment from 'moment'
import parse from 'html-react-parser';
import { deleteProject , getProjects} from '../../actions/projectAction'
import { AuthenticateUser } from '../../actions/auth'
// import { returnErrors } from '../../actions/messages'
import propTypes from 'prop-types'
import '../../css/singleproject.css'



const rightItems = [
    { as: "a", content: "home", key: "home" },
    { as: "a", content: "Login", key: "login" }
  ];
  


class singleproject extends Component{ 

  constructor(props) {
    super(props);
    //this.state = {};
  }

    static propTypes = {
        tokenConfig : propTypes.func.isRequired,
        deleteProject : propTypes.func.isRequired,
        AuthenticateUser: propTypes.func.isRequired,
        getProjects : propTypes.func.isRequired,
      getUsers : propTypes.func.isRequired
    }


    state = {
        count : ''
    }

    componentDidMount(){
      this.props.getUsers()
      this.props.AuthenticateUser()
      this.props.getProjects()

      console.log(this.state)
        console.log(this.props);
        const id =  this.props.match.params.id;
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
        axios.get(`http://localhost:8000/BugTracker/projects/${this.props.match.params.id}/bugs/`,tokenConfig(store.getState))
            .then(res =>{
                console.log(Object.keys(res.data).length)
                this.setState({
                    ...this.state,
                    count : Object.keys(res.data).length
                })
            }

            )
    }
    render(){
      const { projects } = this.props
      console.log(projects)
      console.log(this.props.match.params.id)
      console.log(this.props.auth.users.find((use) => use.first_name === this.state.createdbyname) ? this.props.auth.users.find((use) => use.first_name === this.state.createdbyname).image : '')
      if(projects && this.props.match.params.id){
        const show = projects.filter(proj => proj.id === parseInt(this.props.match.params.id)).length ? true : false
        console.log(!show)
        if(!show){
          return <Redirect to='/' />
        }
      }
        console.log(this.state)
        const date = Date(this.state.created_on);
        const formattedDate = Moment(date).format("LL");
        const teammembers = this.state.usernames ? this.state.usernames.map(user => {
          console.log(this.props.auth.users.find((dum) => dum.first_name===user))
          return <Feed.Event>
            {this.props.auth.users.find((dum) => dum.first_name===user).image ? <Feed.Label> <img className='circular' src={this.props.auth.users.find((dum) =>dum.first_name===user).image} /></Feed.Label> : <Feed.Label icon='user' />}
            <Feed.Content>
              <Feed.Summary>
                {user}
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        }) : null

        return (
          <div className='container ui'> 
            <NavBar rightItems={rightItems} />
            <div className="container ui">
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
                      <Breadcrumb.Section style={{ color: "black" }} link>
                        {this.state.name}
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </Menu.Item>
                </Menu>
              </div>





              <Card fluid style={{'font': '-webkit-mini-control',
    'font-size': 'medium'}}>
                <Card.Content style={{'line-height' : '2em'}}>
                  {/* <Button
                    as={Link}
                    to={`/project/${this.props.match.params.id}/addbug/`}
                    size="small"
                    floated="right"
                    basic
                    icon
                    color="black"
                    labelPosition="right"
                  >
                    <Icon style={{'color':'black !important'}} name="add" size="normal" basic>
                    </Icon>
                    BUG
                  </Button> */}
                  <Card.Header style={{ color: "chocolate" }}>
                  {this.state.image ? (
                    <Image floated="right" size="mini" src={this.state.image} />
                  ) : (
                    <Icon
                      name="cubes"
                      className="right floated"
                      size="normal"
                    />
                  )}
                    PROJECT : {this.state.name}
                  </Card.Header>
                  <Card.Meta>{formattedDate}</Card.Meta>
                  <Card.Description>
                    <strong style={{'color':'chocolate'}}>CREATED BY : </strong><span>
                    <Feed  style={{'font-size':'large'}}> 
                    <Feed.Event >           
                    {this.props.auth.users.find((use) => use.first_name === this.state.createdbyname) ? <Feed.Label> <img className='circular' src={this.props.auth.users.find((use) => use.first_name === this.state.createdbyname).image} /></Feed.Label> : <Feed.Label icon='user' />}
            <Feed.Content>
              <Feed.Summary>
                {this.state.createdbyname}
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event></Feed></span>
                  </Card.Description>
                  <Card.Description>
                    <strong style={{'color':'chocolate'}}>TEAM MEMBERS : </strong><span><Feed style={{'font-size':'large'}}>{teammembers}</Feed></span>
                  </Card.Description>
                </Card.Content>
                {this.state.attachment ? (
              this.state.attachment.endsWith("webm") ||
              this.state.attachment.endsWith("mp4") ||
              this.state.attachment.endsWith("mov") ? (
                <Embed url={this.state.attachment} wrapped />
              ) : (
                <Image src={this.state.attachment} wrapped />
              )
            ) : null}
                <Card.Content>
                <p>{parse(`${this.state.wiki}`)}</p>
                </Card.Content>
                <Card.Content extra>
                  <Button className='delbuttonsp' inverted floated="right" color="red" onClick={this.props.deleteProject.bind(this,this.state.id)} >
                    Delete
                  </Button>
                  <Icon className='deliconsp right floated' size='normal' name='trash' color="red" onClick={this.props.deleteProject.bind(this,this.state.id)}/>
                  <Link to={`/project/${this.props.match.params.id}/edit/`} ><Icon size='normal' className='editiconsp right floated' name='pencil' color="green" /></Link>
                  <Button className='editbuttonsp' as={Link} to={`/project/${this.props.match.params.id}/edit/`} inverted floated="right" color="green">
                    Edit
                  </Button>
                  <Link to={`/project/${this.props.match.params.id}/bugs/`} ><Icon size='normal' className='bugiconsp left floated' name='bug' color="red" /></Link>
                  <Link to={`/project/${this.props.match.params.id}/addbug/`} ><Icon size='normal' className='addbugiconsp left floated' name='add' color="black" /></Link>
                  <Button
                  className='bugbuttonsp'
                  as={Link}
                  to={`/project/${this.props.match.params.id}/bugs/`}
                    floated="left"
                    color="blue"
                    content="bugs"
                    icon="bug"
                    label={{
                      basic: true,
                      color: "blue",
                      pointing: "left",
                      content: this.state.countbugs,
                    }}
                  />
                  <Button
                  className='addbugbuttonsp'
                    as={Link}
                    to={`/project/${this.props.match.params.id}/addbug/`}
                    size="small"
                    floated="left"
                    basic
                    icon
                    color="black"
                    labelPosition="right"
                  >
                    <Icon style={{'color':'black !important'}} name="add" size="normal" basic>
                    </Icon>
                    BUG
                  </Button>
                </Card.Content>
              </Card>
            </div>
          </div> 
        );
    }
}

const mapStateToProps = (state) => {
  return {
    projects : state.project.posts,
    auth : state.auth
  }
}

  export default connect(mapStateToProps,{deleteProject,getProjects,getUsers,AuthenticateUser})(singleproject)