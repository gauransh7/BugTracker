import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  Form,
} from 'semantic-ui-react'
import propTypes from 'prop-types'
import { createProject } from '../../actions/projectAction';
import { AuthenticateUser } from '../../actions/auth'
import NavBar from '../navbar'

// const options = [
//   { key: 'm', text: 'Male', value: 'male' },
//   { key: 'f', text: 'Female', value: 'female' },
//   { key: 'o', text: 'Other', value: 'other' },
// ]


const rightItems = [
  { as: "a", content: "home", key: "home" },
  { as: "a", content: "Login", key: "login" }
];


class AddProject extends Component {

componentDidMount(){
  console.log("component mounted")
  this.props.AuthenticateUser()
}


static propTypes = {
  createProject : propTypes.func.isRequired,
  AuthenticateUser : propTypes.func.isRequired
}

  state = {
      name : '',
      wiki : '',
      creator : ''
  }

//   handleChange = (e, { value }) => this.setState({ value })
//   handleChange = (e) =>{
//       this.setState({
//             [e.target.id] : e.target.value
//       })
//   }

handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = (e) => {
      e.preventDefault()
      const { name, wiki, creator } = this.state
      const project = { name, wiki, creator : parseInt(creator) }
      this.props.createProject(project)
      console.log(project)
      this.setState(
        {name : '',
        wiki : '',
        creator : ''
        })
  }

  render() {
    const { name, creator,wiki } = this.state
    return (
      <div>
      <NavBar rightItems = { rightItems } />
      <Form onSubmit={this.handleSubmit}>
        <Form.Group widths='equal'>
        <Form.Input
              placeholder='Name'
              name='name'
              value = {name}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder='Creator'
              name='creator'
              value = {creator}
              onChange={this.handleChange}
              type = "number"
              parse={value => parseInt(value, 10)}
            />
        </Form.Group>
        <Form.TextArea
              placeholder='wiki'
              name='wiki'
              value={wiki}
              onChange={this.handleChange}
            />
            <Form.Button content='Submit' />
      </Form>
      </div>
    )
  }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         createProject : (project) => dispatch(createProject(project))
//     }
// }


export default connect(null, { createProject, AuthenticateUser })(AddProject)