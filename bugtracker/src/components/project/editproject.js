import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  Form, Breadcrumb,Menu,Checkbox,Image, Button
} from 'semantic-ui-react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import propTypes from 'prop-types'
import { createProject } from '../../actions/projectAction';
import { AuthenticateUser, tokenConfig } from '../../actions/auth'
import NavBar from '../navbar'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import {store} from '../../index'
import '../../css/addproject.css'
import {createMessage} from '../../actions/messages'

// const options = [
//   { key: 'm', text: 'Male', value: 'male' },
//   { key: 'f', text: 'Female', value: 'female' },
//   { key: 'o', text: 'Other', value: 'other' },
// ]




class EditProject extends Component {

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

    axios.get(`http://localhost:8000/BugTracker/projects/${this.props.match.params.id}/`,tokenConfig(store.getState))
        .then(res => {
            const data = res.data
            console.log(data)
            this.setState({
                ...this.state,
                ...data,
                imageupload : data.image
            })
            if(this.state.image!==null){
                this.setState({
                    ...this.state,
                    visible : 'visible'
                })
            }
            else{
                this.setState(({
                    ...this.state,
                    visible : 'none'
                }))
            }
            // this.setState({
            //     ...this.state,
            //     id : data.id,
            //     name : data.name,
            //     wiki : data.wiki,
            //     user : data.user,
            //     image : data.image,
            //     status : data.status,
            //     launched : data.launched,
            //     visible : 'visible'
            // })
        })

  console.log("component mounted")
  console.log(this.state)
  this.props.AuthenticateUser()
}


static propTypes = {
  createProject : propTypes.func.isRequired,
  AuthenticateUser : propTypes.func.isRequired
}

  state = {
      id : this.props.match.params.id,
      name : '',
      wiki : '',
      users : [],
      user : [],
      image:null,
      status : null,
      launched : null,
      changed : false
  }

//   handleChange = (e, { value }) => this.setState({ value })
//   handleChange = (e) =>{
//       this.setState({
//             [e.target.id] : e.target.value
//       })
//   }

handleChange = (e, { name, value }) => this.setState({ [name]: value })

handleEditorChange = (event, editor) => {
  this.setState({wiki : editor.getData()})
}



updatestatus = (e) => this.setState({status:!this.state.status})
updatelaunched = (e) => this.setState({launched:!this.state.launched})

handleImageChange = (e) => {
  const image = e.target.files[0]
  console.log(image)
  this.setState({
    ...this.state,
    imageupload: image
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

deleteimage = (e) => {
    this.setState({
        image : null,
        imageupload : null,
        changed : true
    })
}



  handleSubmit = (e) => {
      e.preventDefault()
      console.log(this.state.user)
      const { name, wiki, user ,image,creator } = this.state
      // const project = { name, wiki, user,image ,creator : parseInt(creator) }
      let formdata = new FormData()
      formdata.append('name',this.state.name)
      formdata.append('wiki',this.state.wiki)
      if(this.state.changed){
        if (this.state.imageupload)
        {
          formdata.append('image',this.state.imageupload) 
        }
    }
      formdata.append('creator',parseInt(this.props.auth.User.id))
      formdata.append('status',this.state.status)
      formdata.append('launched',this.state.launched)
      for (let i=0;i<this.state.user.length;i++){
        formdata.append('user',this.state.user[i])
      }
      console.log(this.state.creator)
      const token = store.getState().auth.token;
      
     // Headers
     const config = {
       headers: {
        //  'Content-Type': 'application/json'
       },
     };
   
     // If token, add to headers config
     if (token) {
       config.headers['Authorization'] = `Token ${token}`;
    //    config.headers['Accept'] = 'multipart/form-data'
     }
      axios.put(`http://localhost:8000/BugTracker/projects/${this.props.match.params.id}/`,formdata,config)
      .then(res =>{
          store.dispatch(createMessage({ ProjectEdit: 'Project edited'}));
          window.location.href=`http://localhost:3000/`
      }
      )
      .catch(err => {
          console.log(err.response.data)
          const error = {
              msg : err.response.data,
              status : err.response.status
          }
          store.dispatch(
              {
                  type : 'GET_ERRORS',
                  payload : error
              }
          )
      })
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
                <Breadcrumb.Section style={{ color: "black" }} as={Link} to="/">
                  Projects
                </Breadcrumb.Section>
                <Breadcrumb.Divider
                  icon="right chevron"
                  style={{ color: "darkblue" }}
                /><Breadcrumb.Section style={{ color: "black" }} as={Link} to="/">
                  {this.state.name}
                </Breadcrumb.Section>
                <Breadcrumb.Divider
                  icon="right chevron"
                  style={{ color: "darkblue" }}
                />
                <Breadcrumb.Section style={{ color: "black" }} link>
                  Edit
                </Breadcrumb.Section>
              </Breadcrumb>
            </Menu.Item>
          </Menu>
        </div>
        <div className="ui proadddiv">
          <div className="container ui segment inverted proadddiv2">
            <Form
              className="addproform"
              center
              ui
              inverted
              onSubmit={this.handleSubmit}
            >
              <Form.Input
                placeholder="Name"
                name="name"
                label="Name : "
                value={name}
                onChange={this.handleChange}
              />
              {this.state.image ? <div>
              <Image src={this.state.image} size='small' />
              <Button onClick={()=>{this.deleteimage()}} style={{ "background-color": "white", color: "black" }}>Delete</Button>
              </div> : <Form.Input
                placeholder="Media"
                name="image"
                label="Add Media : "
                id="image"
                files = {image}
                type="file"
                accept="image/png, image/jpeg"
                // value = {this.state.image}
                onChange={this.handleImageChange}
              />}
              {/* <Form.Input
                placeholder="Media"
                name="image"
                label="Add Media : "
                id="image"
                files = {image}
                type="file"
                accept="image/png, image/jpeg"
                // value = {this.state.image}
                onChange={this.handleImageChange}
              />
              <div style={{'display':this.state.visible}}>
              <Image src={this.state.image} size='small' />
              <Button style={{ "background-color": "white", color: "black" }}>Delete</Button>
              </div> */}
              <Form.Select
                search
                multiple
                placeholder="TeamMembers"
                name="selectedusers"
                options={this.state.users}
                label="Team Members : "
                value={this.state.user}
                name="user"
                onChange={this.handleChangeSelect}
              />
              {/* <Form.TextArea
                placeholder="wiki"
                name="wiki"
                label="Describe Your Project : "
                value={wiki}
                onChange={this.handleChange}
              /> */}
              <Form.Field className = "ckeditor" >
              
                <CKEditor
                label = "Change project description"
                 style = {{color:'#000 !important'}}
                  //placeholder='wiki'
                  editor={ClassicEditor}
                  //name='wiki'
                  //label='Describe Your Project : '
                  data={wiki}
                  onChange={this.handleEditorChange}
                  config={{
                    //placeholder: "Tell something about your project....",
                    // toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'insertTable',
                    //     'tableColumn', 'tableRow', 'mergeTableCells', '|', 'undo', 'redo','colorButton_colors'],
                    // colorButton_colors : 'CF5D4E,454545,FFF,CCC,DDD,CCEAEE,66AB16'
                    //colorButton_enableAutomatic : false
                  }}
                />
                </Form.Field>
              <Form.Field
                control={Checkbox}
                label={<label>status : </label>}
                checked={this.state.status}
                onClick={() => this.updatestatus()}
                name='status'
              />
              <Form.Field
                control={Checkbox}
                label={<label>Launch It : </label>}
                checked={this.state.launched}
                onClick={() => this.updatelaunched()}
                name='launched'
              />
              <Form.Button
                style={{ "background-color": "white", color: "black" }}
                content="Submit"
              />
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        auth : state.auth
    }
}


export default connect(mapStateToProps, { createProject, AuthenticateUser })(EditProject)