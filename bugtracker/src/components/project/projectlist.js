import React, {Component}from 'react'
import { Link } from 'react-router-dom'
import {
    Card,Icon,Breadcrumb, Menu,Button, Segment,Image, CardGroup,Label, Popup
  } from "semantic-ui-react";
import {connect} from 'react-redux'
import propTypes from 'prop-types'
import { getProjects } from '../../actions/projectAction'
import { deleteProject} from '../../actions/projectAction'
// import {LoadUser} from '../../actions/auth'
import { AuthenticateUser } from '../../actions/auth'
import NavBar from '../navbar'
import axios from 'axios'
import {tokenConfig} from '../../actions/auth'
// import { returnErrors } from '../../actions/messages';
import {store} from '../../index'
import '../../css/projectlist.css'
import finallogo from '../../media/finallogowbg.png'
import Moment from 'moment'
import {Date} from 'prismic-reactjs'
 


const rightItems = [
  { as: "a", content: "home", key: "home" },
  { as: "a", content: "Login", key: "login" }
];


class Projectlist extends Component{

  state = {
    staff : false,
    count : []
  }

  static propTypes = {
    projects : propTypes.array.isRequired,
    getProjects : propTypes.func.isRequired,
    deleteProject : propTypes.func.isRequired,
    AuthenticateUser : propTypes.func.isRequired,
    tokenConfig : propTypes.func.isRequired
  }

  componentDidMount(){
    this.props.AuthenticateUser()
    this.props.getProjects()
    console.log(this.props.auth)
    this.setState({
      staff : this.props.auth.is_staff
    })
    // if (this.props.location.search) {
    //   console.log('inside')
    //   axios.get(`http://localhost:8000/BugTracker/auth${this.props.location.search}`)
    //         .then(res =>{
    //           console.log(res.data)
    //             store.dispatch({
    //               type : 'LOGIN_SUCCESS',
    //               payload : res.data
    //             });
    //         }
    //         ).catch(err => {returnErrors(err.response.data,err.response.status)
    //           store.dispatch({
    //             type : 'LOGIN_FAIL'
    //           })
    //         }
    //         )
    // }

    const {posts} = this.props;
    posts.map(post => {
      axios.get(`http://localhost:8000/BugTracker/projects/${post.id}/bugs/`,tokenConfig(store.getState))
      .then(res =>{
          console.log(Object.keys(res.data).length)
          this.setState({
              ...this.state,
              
          })
      }
    )
    })
    console.log(this.state.count)
  }


  render(){
    const { posts } = this.props;
    const postlisttesting = posts.filter(post => post.launched===false).length ? (
      posts.filter(post => post.launched===false).map(post => {


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
              
              {  this.state.staff || this.props.auth.id === post.creator || this.props.auth.User in post.user ? <Popup trigger={<Icon name="delete" color="red" className='right floated delpro' onClick={this.props.deleteProject.bind(this,post.id)}/>} content='Clicking on this will permanently DELETE this project' /> : ''}
          </Card.Content>
        </Card>
      })
    ) : (
      <div>No Projects for testing</div>
    )

    const postlistlaunched = posts.filter(post => post.launched===true).length ? (
      posts.filter(post => post.launched===true).map(post => {
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
              {  this.state.staff || this.props.auth.id === post.creator || this.props.auth.User in post.user ? <Popup trigger={<Icon name="delete" color="red" className='right floated delpro' onClick={this.props.deleteProject.bind(this,post.id)}/>} content='Clicking on this will permanently DELETE this project' />  : ''}
          </Card.Content>
        </Card>
      })
    ) : (
      <div>No Projects Launched</div>
    )

    return(<div>
    <NavBar rightItems={rightItems} />
    <div className="ui">
    {/* // <Link to="http://internet.channeli.in/oauth/authorise">
    // <Button className="ui primary button" >Login with omniport</Button>
    // </Link>
    //<a href="https://internet.channeli.in/oauth/authorise/?client_id=9M2ddc3zJkHFly9xXBuYD8aQjtsNGNqxIDiSADNv&redirect_url=http://localhost:8000/BugTracker/auth&state=success">Login</a> */}
    {/* <nav className="nav-wrapper blue container ui segment black-text darken-1">
      <Grid>
      <Grid.Column width={11} textAlign="left" className="border">
          <div className="large bold left" >Projects</div>
      </Grid.Column>
      <Grid.Column width={3}>
          <Search aligned='right' />
      </Grid.Column>
      <Grid.Column width={2}>
          <Link to='/addproject' ><Icon aligned='right' name="add">AddProject</Icon></Link>
      </Grid.Column>
      </Grid>
      </nav> */}
      <div className='container ui'>
      <Menu borderless className='ui plmenu'>
      <Menu.Item>
      <Breadcrumb >
      <Breadcrumb.Section style={{'color' : 'black'}} link>Projects</Breadcrumb.Section>
      <Breadcrumb.Divider icon='right chevron' style={{'color' : 'darkblue'}} />
      </Breadcrumb>
      </Menu.Item>
      <Menu.Item position='right' as={Link} to='/addproject'>
      <Button basic icon labelPosition='right'>
      <Icon name='add' size='normal' />
      Add Project
      </Button>
      </Menu.Item>
      </Menu>
      </div>
      <div className='segment'>
      <Segment color='red' className='testing-segment'>
      <Label as='a' color='red' attached='top left' ribbon>
          Testing
        </Label>
      <CardGroup>
      { postlisttesting }
      </CardGroup>
      </Segment>
      <Segment color='green' className='launched-segment'>
      <Label as='a' color='green' attached='top left' ribbon>
          Launched
        </Label>
        <CardGroup>
        {postlistlaunched}
        </CardGroup>
      </Segment>
      </div>
      

    </div>
    </div>
    )

  }
}











// const Login = () =>{
//       return(<div className="container">
//       {/* // <Link to="http://internet.channeli.in/oauth/authorise">
//       // <Button className="ui primary button" >Login with omniport</Button>
//       // </Link>
//       //<a href="https://internet.channeli.in/oauth/authorise/?client_id=9M2ddc3zJkHFly9xXBuYD8aQjtsNGNqxIDiSADNv&redirect_url=http://localhost:8000/BugTracker/auth&state=success">Login</a> */}
//       <nav className="nav-wrapper blue container ui segment black-text darken-1">
//         <Grid>
//         <Grid.Column width={11} textAlign="left" className="border">
//             <div className="large bold left" >Projects</div>
//         </Grid.Column>
//         <Grid.Column width={3}>
//             <Search aligned='right' />
//         </Grid.Column>
//         <Grid.Column width={2}>
//             <Icon aligned='right' name="add">AddProject</Icon>
//         </Grid.Column>
//         </Grid>
//         </nav>
//       <Card >
//       <Card.Content>
//         <Card.Header>
//         {/* <Image className="right" src='https://react.semantic-ui.com/assets/images/avatar/large/matthew.png' /> */}
//           BugTracker
//           <Icon className="large right" name="book" />
//     </Card.Header>
//         <Card.Meta>
//           <span className='date'>
//             09/04/2001
//       </span>
//         </Card.Meta>
//         <Card.Description>
//           Keep your bugs tracked
//           <Icon className="right-align" name="bug" >35</Icon>
//     </Card.Description>
//       </Card.Content>
//       <Card.Content extra>
//           <Icon name='user' />
//           Gauransh Dingwani
//       </Card.Content>
//     </Card>
//       </div>
//       )
//     }



    const mapStateToProps = (state) => {
      return{
          posts : state.project.posts,
          auth : state.auth
      }
  }

  export default connect(mapStateToProps, { getProjects ,tokenConfig, AuthenticateUser, deleteProject})(Projectlist)