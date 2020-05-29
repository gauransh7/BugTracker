import React, {Component}from 'react'
import { Link } from 'react-router-dom'
import {
    Card,Icon,Grid,Search
  } from "semantic-ui-react";
import {connect} from 'react-redux'
import propTypes from 'prop-types'
import { getProjects } from '../../actions/projectAction'
import { deleteProject} from '../../actions/projectAction'
// import axios from 'axios'
// import { returnErrors } from '../../actions/messages';
// import {store} from '../../index'
  
class Projectlist extends Component{

  static propTypes = {
    projects : propTypes.array.isRequired,
    getProjects : propTypes.func.isRequired,
    deleteProject : propTypes.func.isRequired
  }

  componentDidMount(){
    this.props.getProjects()
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
  }


  render(){
    const { posts } = this.props;
    const postlist = posts.length ? (
      posts.map(post => {
          return <Card key={post.id}>
          <Card.Content>
            <Card.Header>
            {/* <Image className="right" src='https://react.semantic-ui.com/assets/images/avatar/large/matthew.png' /> */}
              <Link to={`/project/${post.id}`}>{ post.name }</Link>
              <Icon className="large right" name="book" />
        </Card.Header>
            <Card.Meta>
              <span className='date'>
                09/04/2001
          </span>
            </Card.Meta>
            <Card.Description>
              {post.wiki}
              <Icon className="right-align" name="bug" >35</Icon>
        </Card.Description>
          </Card.Content>
          <Card.Content extra>
              <Icon name='user' />
              Gauransh Dingwani
              <Icon name="delete" color="red" onClick={this.props.deleteProject.bind(this,post.id)} />
          </Card.Content>
        </Card>
      })
    ) : (
      <div>No Projects for testing</div>
    )

    return(<div className="container">
    {/* // <Link to="http://internet.channeli.in/oauth/authorise">
    // <Button className="ui primary button" >Login with omniport</Button>
    // </Link>
    //<a href="https://internet.channeli.in/oauth/authorise/?client_id=9M2ddc3zJkHFly9xXBuYD8aQjtsNGNqxIDiSADNv&redirect_url=http://localhost:8000/BugTracker/auth&state=success">Login</a> */}
    <nav className="nav-wrapper blue container ui segment black-text darken-1">
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
      </nav>
      { postlist }
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
          posts : state.project.posts
      }
  }

  export default connect(mapStateToProps, { getProjects , deleteProject})(Projectlist)