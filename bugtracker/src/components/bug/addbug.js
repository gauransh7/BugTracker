import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  Form, Breadcrumb,Menu,Divider
} from 'semantic-ui-react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import propTypes from 'prop-types'
import { AuthenticateUser, tokenConfig } from '../../actions/auth'
import NavBar from '../navbar'
import axios from 'axios'
import { Link } from 'react-router-dom'
import {store} from '../../index'
import '../../css/addproject.css'
import {createMessage} from '../../actions/messages'

// const options = [
//   { key: 'm', text: 'Male', value: 'male' },
//   { key: 'f', text: 'Female', value: 'female' },
//   { key: 'o', text: 'Other', value: 'other' },
// ]




class AddBug extends Component {

componentDidMount(){
    this.props.AuthenticateUser()

    axios.get('http://localhost:8000/BugTracker/tags/',tokenConfig(store.getState))
    .then(res =>{
      this.setState({
        ...this.state,
        tags : [...res.data.map(tag => {return {key: parseInt(`${tag.id}`), text: `${tag.tag_name}`, value: parseInt(`${tag.id}`)}})]
      })
      console.log(this.state.tags)
    }

    )



    let id =  this.props.match.params.id;
    console.log(id)
    axios.get(`http://localhost:8000/BugTracker/projects/${id}/`,tokenConfig(store.getState))
        .then(res => {
            this.setState({
                ...this.state,
                project : res.data.name
            })
            console.log(this.state.project)
        })
    // this.setState({
    //     ...this.state,
    //     project : this.props.projects.get(id=id).name
    // })

  console.log("component mounted")
}


static propTypes = {
  AuthenticateUser : propTypes.func.isRequired
}

  state = {
      heading : '',
      description : '',
      tags : [],
      tag : [],
      status : 'new',
      user :  this.props.auth.id ? this.props.auth.id : null,
      media:null,
      project : '',
      addtag : ''
  }

//   handleChange = (e, { value }) => this.setState({ value })
//   handleChange = (e) =>{
//       this.setState({
//             [e.target.id] : e.target.value
//       })
//   }

handleChange = (e, { name, value }) => this.setState({ [name]: value })

array = (input) => input.split(" ")

handleChangeSelect = (e,data) => {
  console.log(this.state.tag.map(usr => parseInt(usr)))
  this.setState({
    ...this.state,
    tag : data.value
  })
}


handleImageChange = (e) => {
  const image = e.target.files[0]
  console.log(image)
  this.setState({
    ...this.state,
    media: image
  })
};

handleEditorChange = (event, editor) => {
  this.setState({description : editor.getData()})
}

// handleChangeSelect = (e,data) => {
//   console.log(this.props.auth.User.id)
//   console.log(this.state.user.map(usr => parseInt(usr)))
//   this.setState({
//     ...this.state,
//     user : data.value
//   })
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


  handleSubmitTag = (e) => {
    e.preventDefault()
    console.log('adding tag')
    console.log(this.array(this.state.addtag))
    if(this.state.addtag){
      for(let i=0;i<this.array(this.state.addtag).length;i++){
        console.log(this.array(this.state.addtag)[i])
        let formdata = new FormData()
        formdata.append('tag_name',this.array(this.state.addtag)[i])
        axios.post('http://localhost:8000/BugTracker/tags/',formdata,tokenConfig(store.getState))
          .then(res => console.log('tag added'))
          .catch(err => console.log(err))
      }
      this.setState({
        ...this.state,
        addtag : ''
      })
      this.componentDidMount()
    }
    else{
      alert('type something')
    }
  }




  handleSubmit = (e) => {
      e.preventDefault()
      // console.log(this.props.auth.id)
      // console.log(this.array(this.state.tags))
      // for(let i=0;i<this.array(this.state.tag).length;i++){
      //   console.log(this.array(this.state.tags)[i])
      // }
    //   const { name, wiki, user ,image,creator } = this.state
      // const project = { name, wiki, user,image ,creator : parseInt(creator) }
      let formdata = new FormData()
      formdata.append('heading',this.state.heading)
      formdata.append('description',this.state.description)
      if (this.state.media !== null){
        formdata.append('media',this.state.media)
      }
      formdata.append('user',parseInt(this.props.auth.User.id))
      formdata.append('status','new')
      formdata.append('project',this.props.match.params.id)
      for (let i=0;i<this.state.tag.length;i++){
        formdata.append('tag',this.state.tag[i])
      }
      console.log(formdata)
      // console.log(typeof(this.array(this.state.tags)))
      // Get token from state
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
     console.log(formdata)
      axios.post(`http://localhost:8000/BugTracker/bugs/`,formdata,config)
      .then(res =>{
          store.dispatch(createMessage({ BugAdd: 'Bug Added'}));
          window.location.href=`http://localhost:3000/project/${this.props.match.params.id}/bugs`
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
        {      heading : '',
        description : '',
        status : 'new',
        user :  this.props.auth.id ? this.props.auth.id : null,
        media:null,
        project : ''
        })
  }

  render() {
    const { heading,description,media ,tag} = this.state
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
                      <Breadcrumb.Section style={{ color: "black" }} as={Link} to={`/project/${this.props.match.params.id}`}>
                        {this.state.project}
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider
                        icon="right chevron"
                        style={{ color: "darkblue" }}
                      />
                      <Breadcrumb.Section style={{ color: "black" }} link>
                        Add Bug
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </Menu.Item>
                </Menu>
              </div>
      <div className='ui proadddiv'>
      <div className='container ui segment inverted proadddiv2'>
      <Form className='addproform' center ui inverted onSubmit={this.handleSubmit} >
        <Form.Input
              placeholder='Heading'
              name='heading'
              label='Heading : '
              value = {heading}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder='Media'
              name='media'
              label='Add Media : '
              id="media"
              type='file'
              accept="image/png, image/jpeg"
              // value = {this.state.image}
              onChange={this.handleImageChange}
            />
            <Form.Select
              search
              multiple
              placeholder='Tags'
              name='tag'
              options = {this.state.tags}
              label = 'Tags : '
              value = {this.state.tag}
              name = 'tag'
              onChange = {this.handleChangeSelect}
            />
        {/* <Form.TextArea
              placeholder='Description'
              name='description'
              label='Describe Your Project : '
              value={description}
              onChange={this.handleChange}
            /> */}
        <Form.Field className = "ckeditor" >
                <CKEditor
                
                 style = {{color:'#000 !important'}}
                  //placeholder='wiki'
                  editor={ClassicEditor}
                  //name='wiki'
                  //label='Describe Your Project : '
                  //value={wiki}
                  onChange={this.handleEditorChange}
                  config={{
                    placeholder: "Explain the bug....",
                    // toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'insertTable',
                    //     'tableColumn', 'tableRow', 'mergeTableCells', '|', 'undo', 'redo','colorButton_colors'],
                    // colorButton_colors : 'CF5D4E,454545,FFF,CCC,DDD,CCEAEE,66AB16'
                    //colorButton_enableAutomatic : false
                  }}
                />
              </Form.Field>


            <Form.Button style={{'background-color':'white','color':'black'}} content='Submit' />
      </Form>
      <Divider />
      <Form onSubmit={this.handleSubmitTag}>
      <Form.TextArea
              placeholder='Tags you want to add to above list.'
              name='addtag'
              label='Add tags separated by spaces : '
              value={this.state.addtag}
              onChange={this.handleChange}
            />
            <Form.Button style={{'background-color':'white','color':'black'}} content='Add Tag' />
            </Form>
      </div>
      </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        projects : state.project,
        auth : state.auth
    }
}


export default connect(mapStateToProps, {  AuthenticateUser })(AddBug)