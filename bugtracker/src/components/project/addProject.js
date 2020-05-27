import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  Form,
} from 'semantic-ui-react'
import propTypes from 'prop-types'
import { createProject } from '../../actions/projectAction';

// const options = [
//   { key: 'm', text: 'Male', value: 'male' },
//   { key: 'f', text: 'Female', value: 'female' },
//   { key: 'o', text: 'Other', value: 'other' },
// ]




class AddProject extends Component {


static propTypes = {
  createProject : propTypes.func.isRequired
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
    )
  }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         createProject : (project) => dispatch(createProject(project))
//     }
// }


export default connect(null, { createProject })(AddProject)