import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  Form, Breadcrumb,Menu
} from 'semantic-ui-react'
import propTypes from 'prop-types'
import { createProject } from '../../actions/projectAction';
import { AuthenticateUser, tokenConfig } from '../../actions/auth'
import NavBar from '../navbar'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import {store} from '../../index'
import '../../css/addproject.css'

// const options = [
//   { key: 'm', text: 'Male', value: 'male' },
//   { key: 'f', text: 'Female', value: 'female' },
//   { key: 'o', text: 'Other', value: 'other' },
// ]




class AddProject extends Component {

componentDidMount(){

  axios.get('http://localhost:8000/BugTracker/users/',tokenConfig(store.getState))
    .then(res =>{
      this.setState({
        ...this.state,
        users : [...res.data.map(user => {return {key: parseInt(`${user.id}`), text: `${user.first_name}`, value: parseInt(`${user.id}`)}})]
      })
      console.log(this.state.users)
    }

    )

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
      users : [],
      user : [],
      image:null,
      attachment : null,
      creator : this.props.auth.id ? this.props.auth.id : null
  }

//   handleChange = (e, { value }) => this.setState({ value })
//   handleChange = (e) =>{
//       this.setState({
//             [e.target.id] : e.target.value
//       })
//   }

handleChange = (e, { name, value }) => this.setState({ [name]: value })

handleImageChange = (e) => {
  const image = e.target.files[0]
  console.log(image)
  this.setState({
    ...this.state,
    image: image
  })
};

handleAttachmentChange = (e) => {
  const attachment = e.target.files[0]
  console.log(attachment)
  this.setState({
    ...this.state,
    attachment: attachment
  })
};


handleChangeSelect = (e,data) => {
  console.log(this.props.auth.User.id)
  console.log(this.state.user.map(usr => parseInt(usr)))
  this.setState({
    ...this.state,
    user : data.value
  })
  // var value = [];
  // for (var i = 0, l = this.state.users.length; i < l; i++) {
  //   console.log(this.state.users[i].selected)
  //   if (this.state.users[i].selected) {
  //     value.push(this.state.users[i].key);
  //   }
  // }
  // let target = e.target
	// 	let name = target.name
    //here
  //   let values = Array.from(e.target.selectedOptions, option => option.value);
  //   this.setState({
  //     [e.target.name]: values
  //   });
  // console.log(values)
}

  handleSubmit = (e) => {
      e.preventDefault()
      console.log(this.state.user)
      const { name, wiki, user ,image,creator } = this.state
      // const project = { name, wiki, user,image ,creator : parseInt(creator) }
      let formdata = new FormData()
      formdata.append('name',this.state.name)
      formdata.append('wiki',this.state.wiki)
      if (this.state.image)
      {
         formdata.append('image',this.state.image) 
      }
      if (this.state.attachment)
      {
         formdata.append('attachment',this.state.attachment) 
      }
      formdata.append('creator',parseInt(this.props.auth.User.id))
      formdata.append('status',true)
      formdata.append('launched',false)
      for (let i=0;i<this.state.user.length;i++){
        formdata.append('user',this.state.user[i])
      }
      console.log(this.state.creator)
      this.props.createProject(formdata)
      // console.log(project)
      this.setState(
        {name : '',
        wiki : '',
        user : [],
        image: null,
        creator : this.props.auth.User.id
        })
  }

  render() {
    console.log(this.state)
    const { name,wiki,image } = this.state
    return (
      <div>
      <NavBar />
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
                        AddProject
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </Menu.Item>
                </Menu>
              </div>
      <div className='ui proadddiv'>
      <div className='container ui segment inverted proadddiv2'>
      <Form className='addproform' center ui inverted onSubmit={this.handleSubmit} >
        <Form.Input
              placeholder='Name'
              name='name'
              label='Name : '
              value = {name}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder='Media'
              name='image'
              label='Add Media : '
              id="image"
              type='file'
              accept="image/png, image/jpeg"
              // value = {this.state.image}
              onChange={this.handleImageChange}
            />
            <Form.Input
              placeholder='ATTACHMENT'
              name='attachment'
              label='Add Attachment : '
              id="attachment"
              type='file'
              // accept="image/png, image/jpeg"
              // value = {this.state.image}
              onChange={this.handleAttachmentChange}
            />
            <Form.Select
              search
              multiple
              placeholder='TeamMembers'
              name='selectedusers'
              options = {this.state.users}
              label = 'Team Members : '
              value = {this.state.user}
              name = 'user'
              onChange = {this.handleChangeSelect}
            />
        <Form.TextArea
              placeholder='wiki'
              name='wiki'
              label='Describe Your Project : '
              value={wiki}
              onChange={this.handleChange}
            />
            <Form.Button style={{'background-color':'white','color':'black'}} content='Submit' />
      </Form>
      </div>
      </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        auth : state.auth
    }
}


export default connect(mapStateToProps, { createProject, AuthenticateUser })(AddProject)