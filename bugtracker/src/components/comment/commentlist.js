import React, {Component} from 'react'
import axios from 'axios'
import { tokenConfig } from '../../actions/auth'
import { connect} from 'react-redux'
import {store} from '../../index'
import {createMessage} from '../../actions/messages'
import { Grid, Segment, ModalContent, Icon,Label ,Button,Card,Image, Embed,Comment,Form,Header, Divider,Popup} from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import NavBar  from '../navbar'
import { Table,Breadcrumb,Menu,Dropdown } from 'semantic-ui-react'
import { Date} from 'prismic-reactjs';
import Moment from 'moment'
// import { deleteProject} from '../../actions/projectAction'
import { AuthenticateUser } from '../../actions/auth'
// import { returnErrors } from '../../actions/messages'
import propTypes from 'prop-types'
import ReactPlayer from 'react-player'
import FileViewer from 'react-file-viewer';
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/fr'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'



const rightItems = [
    { as: "a", content: "home", key: "home" },
    { as: "a", content: "Login", key: "login" }
  ];
  


class commentlist extends Component{ 

    static propTypes = {
        tokenConfig : propTypes.func.isRequired,
        // deleteProject : propTypes.func.isRequired,
        AuthenticateUser:propTypes.func.isRequired
    }

    deletebug = (project) =>
    {
      if(this.state.id){
        axios.delete(`http://localhost:8000/BugTracker/bugs/${this.state.id}/`,tokenConfig(store.getState))
          .then(() =>{
              store.dispatch(createMessage({ BugDelete: 'Bug Deleted'}))
              window.location.href =`http://localhost:3000/project/${project}/bugs`
            
          })
      }
      else{
        alert('problem in deleting')
      }
    }

    handleassignchange = (key,name) => {
      key && name?  
      axios.patch(`http://localhost:8000/BugTracker/bugs/${this.props.match.params.id}/`,{'assign_to':key,'assign_by':this.props.auth.id},tokenConfig(store.getState))
          .then(res =>{
            store.dispatch(createMessage({ BUGASSIGNED: `BUG ASSIGNED TO : ${name}`}));
            this.setState({
              ...this.state,
              assign_to : key,
              assign_by : this.props.auth.id,
              assigntouser : name
            })
            console.log('bug assigned to ' + key)

            
          }
          )
          .catch(err => console.log(err)) : alert('error') 
    }

    changebool = (key) => {
      alert(document.getElementById(key).style.display)
      document.getElementById(key).style.display = document.getElementById(key).style.display==='none' ? 'visible' : 'none'
    }

    handlestatuschange = (key,permission) => {

      // console.log(this.props.auth.is_staff)
      console.log(this.state.projectcreator)
      console.log(this.state.user)
      console.log(this.props.auth.id)

      if (this.props.auth.id){
        if (this.props.auth.is_staff || this.props.auth.id === this.state.projectcreator || permission || this.props.auth.id === this.state.user)
          {
            console.log(key)
        
        axios.patch(`http://localhost:8000/BugTracker/bugs/${this.props.match.params.id}/`,{'status':key},tokenConfig(store.getState))
          .then(res =>{
            store.dispatch(createMessage({ StatusChange: `STATUS CHANGED : ${key}`}));
            this.setState({
              ...this.state,
              status : key
            })
            console.log('status changed to ' + key)

            
          }
          )
          .catch(err => console.log(err))
          }
          else{
            store.dispatch(createMessage({ StatusPermission: `You are not allowed to change the status !`}));
          }
        }
    }
    state = {
        comments : [],
        bugs : [],
        count : '',
        comment : '',
        permission : false,
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
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
    ],
    bool : [false,false,false,false,false,false]
    }

  //   sendMessage=(data)=>{
  //     const {websocket} = this.props // websocket instance passed as props to the child component.
      
  //     try {
  //         websocket.send(data) //send data to the server
  //     } catch (error) {
  //         console.log(error) // catch error
  //     }
  // }

    componentDidMount(){
      this.props.AuthenticateUser()
        console.log(this.props);
        let id =  this.props.match.params.id;
        console.log(tokenConfig(store.getState))
        axios.get(`http://localhost:8000/BugTracker/bugs/${id}/`, tokenConfig(store.getState))
            .then(res =>{
                console.log(res.data)
                this.setState({
                    ...this.state,
                   ...res.data
                })
                
                console.log(this.state)

            }

            ).catch(err => console.log(err))

        axios.get(`http://localhost:8000/BugTracker/bugs/${id}/comments/`,tokenConfig(store.getState))
            .then(res => {
                console.log(Object.keys(res.data).length)
                this.setState({
                    ...this.state,
                    comments : [...res.data],
                    count : Object.keys(res.data).length
                })

                const ws = new WebSocket('ws://localhost:8000/ws/chat/'+id+'/'+this.props.auth.token)
                ws.onopen = () =>{
                    console.log('connected')
                }
                ws.onclose = () =>{
                    console.log('disconnected')
                }
                ws.onmessage = evt =>{
                    const message = JSON.parse(evt.data)
                    this.setState({comments: [...this.state.comments,message]})
                }
                this.setState({ws:ws})

                console.log(this.state)
                // console.log(this.state.name)
            })
            .catch(err => console.log(err))

            console.log(this.props.auth.is_staff)
            console.log(this.state.projectuser)
            console.log(this.state.user)
            console.log(this.props.auth.id)
            
    }
    
    handleChange = (event) => {
      const name = event.target.name
      const value = event.target.value
      console.log(event)
      this.setState({[name] : value})
  }

  handleSubmit = (id) => (event) => {
      event.preventDefault()
      let data = {
          message:this.state.comment,
          parent : id
          }
      this.state.ws.send(JSON.stringify(data))
      this.setState({comment:''})
  }

  onError = (e) => {
    console.log(e)
  }


    render(){
      console.log(this.state)
      console.log(this.props.auth.id)
      var permission = false;
      if (this.state.projectuser && this.props.auth.id){
        for(let x=0;x<this.state.projectuser.length;x++){
          if(this.state.projectuser[x]===this.props.auth.id){
            permission=true;
            break;
          }
        }
      }
      console.log(permission)
        const commentlist = this.state.comments.length ? (
            this.state.comments.filter((post) => post.parent === null).map(comment => {
                const date = Date(comment.listed_on);
                const formattedDate = Moment(date).format("LL");
                return (
                  <Comment key={comment.id}>
                    <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
                    <Comment.Content>
                      <Comment.Author as="a">{comment.username}</Comment.Author>
                      <Comment.Metadata>
                        <div>
                          <TimeAgo date={comment.listed_on} />
                        </div>
                      </Comment.Metadata>
                      <Comment.Text>{comment.description}</Comment.Text>
                      <Comment.Actions>
                        <Comment.Action onClick={() => this.changebool(comment.id)}>Reply</Comment.Action>
                      </Comment.Actions>
                      <Form onSubmit={this.handleSubmit(comment.id)} encType="multipart/form-data" reply>
                        <Form.TextArea label="Add a Reply"
                    placeholder="Reply.."
                    name='comment'
                    onChange={this.handleChange}
                    value={this.state.comment} />
                        <Button
                          content="Add Reply"
                          labelPosition="left"
                          icon="edit"
                          primary
                        />
                      </Form>
                    </Comment.Content>
                    <Comment.Group>
                      {this.state.comments
                        .filter((post) => post.parent === comment.id)
                        .map((cmnt) => {
                          return (
                            <Comment>
                              <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
                              <Comment.Content>
                                <Comment.Author as="a">
                                  {cmnt.username}
                                </Comment.Author>
                                <Comment.Metadata>
                                  <div>
                                    <TimeAgo date={cmnt.listed_on} />
                                  </div>
                                </Comment.Metadata>
                                <Comment.Text>{cmnt.description}</Comment.Text>
                                {/* <Comment.Actions>
                          <Comment.Action>Reply</Comment.Action>
                        </Comment.Actions> */}
                              </Comment.Content>
                            </Comment>
                          );
                        })}
                    </Comment.Group>
                  </Comment>
                );   
            })) : (
                <span>-- NO COMMENTS --</span>
            )

            const tag = this.state.tagname ? this.state.tagname.map(item => {
              return <Label size='medium' color={this.state.colors[this.state.tagname.indexOf(item)]} as="a">
                <Icon name="tag" />
                {item}
              </Label>;
            }) : ''

            const teammembers = this.state.projectuser ? this.state.projectuser.length ? 
              this.state.projectusername.map((item) => {
                return <Dropdown.Item
                 onClick={() => {
                   this.handleassignchange(this.state.projectuser[this.state.projectusername.indexOf(item)],item);
                 }}
               >
                 {item}
               </Dropdown.Item>
              }) 
             : '' : ''


        return (
          <div>
            <NavBar rightItems={rightItems} />
            <div className="container ui">
              <div className="container ui">
                <Menu borderless className="ui plmenu">
                  <Menu.Item>
                    <Breadcrumb>
                      {/* <Breadcrumb.Section style={{ color: "black" }} as={Link} to='/' >
                        Projects
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider
                        icon="right chevron"
                        style={{ color: "darkblue" }}
                      /> */}
                      <Breadcrumb.Section
                        style={{ color: "black" }}
                        as={Link}
                        to={this.state.project ? `/project/${this.state.project}/` : `/`}
                      >
                        {this.state.projectname}
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider
                        icon="right chevron"
                        style={{ color: "darkblue" }}
                      />
                      <Breadcrumb.Section
                        style={{ color: "black" }}
                        as={Link}
                        to={`/project/${this.state.project}/bugs`}
                      >
                        Bugs
                      </Breadcrumb.Section>
                      <Breadcrumb.Divider
                        icon="right chevron"
                        style={{ color: "darkblue" }}
                      />
                      <Breadcrumb.Section
                        style={{ color: "black" }}
                        as={Link}
                        to={`/bugs/${this.state.id}/comments/`}
                      >
                        {this.state.heading}
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </Menu.Item>
                </Menu>
              </div>
              {/* <nav className="nav-wrapper blue container ui segment black-text darken-1">
            <Grid>
            <Grid.Column width={11} textAlign="left" className="border">
                <div className="large bold left" >{this.state.heading}</div>
            </Grid.Column>
            <Grid.Column width={3}>
                {Moment(Date(this.state.listed_on)).format("LL")}
            </Grid.Column>
            <Grid.Column width={2}>
                comments - {this.state.count}
            </Grid.Column>
            </Grid>

            </nav> */}
              {/* <Card fluid>
                <Card.Content
                  borderless
                  header
                  style={{ color: "red", "font-size": "1.5rem" }}
                >
                  <h3>
                    <Icon name="slack hash" />
                    ISSUE : {this.state.heading}
                  </h3>
                </Card.Content>
                <Card.Content description>
                  <Icon name="user" />
                  Reported By - {this.state.createdbyname}
                  <Button
                    size="small"
                    floated="right"
                    basic
                    icon
                    color="black"
                    labelPosition="right"
                  >
                    <Icon name="edit" size="normal" basic />
                    {this.state.status}
                  </Button>
                </Card.Content>
                <Card.Content extra>
                  Date:
                  <span style={{ color: "grey" }} className="date">{`${Moment(
                    Date(this.state.listed_on)
                  ).format("LL")}`}</span>
                  <Breadcrumb.Divider
                    icon="right chevron"
                    style={{ color: "darkblue" }}
                  />
                  Edits :
                  <span style={{ color: "grey" }} className="date">
                    {Moment(Date(this.state.updated_on)).format("LL") !==
                    Moment(Date(this.state.listed_on)).format("LL")
                      ? Moment(Date(this.state.updated_on)).format("LL")
                      : "Not Updated"}
                  </span>
                  <Button inverted floated="right" color="red">
                    Delete
                  </Button>
                  <Button
                    floated="right"
                    color="blue"
                    content="comments"
                    icon="comment"
                    label={{
                      basic: true,
                      color: "blue",
                      pointing: "left",
                      content: this.state.count,
                    }}
                  />
                </Card.Content>
              </Card> */}

              <Card fluid>
                <Card.Content>
                  {/* <Button
                    size="small"
                    floated="right"
                    basic
                    icon
                    color="black"
                    labelPosition="right"
                  >
                    <Icon name="edit" size="normal" basic> */}
                  <Label
                    size="medium"
                    tag
                    className="right floated"
                    color="black"
                    as="a"
                  >
                    <Dropdown
                      icon="pencil"
                      labelPosition="left"
                      text={this.state.status}
                      pointing="right"
                      className="link item right floated"
                    >
                      <Dropdown.Menu pointing="right">
                        {this.state.statuses.map((stat) => (
                          <Dropdown.Item
                            onClick={() => {
                              this.handlestatuschange(stat, permission);
                            }}
                          >
                            {stat}
                          </Dropdown.Item>
                        ))}
                        {/* <Dropdown.Item>Inbox</Dropdown.Item>
                          <Dropdown.Item>Starred</Dropdown.Item>
                          <Dropdown.Item>Sent Mail</Dropdown.Item>
                          <Dropdown.Item>Drafts (143)</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item>Spam (1009)</Dropdown.Item>
                          <Dropdown.Item>Trash</Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Label>
                  {/* </Icon>
                    {this.state.status}
                  </Button> */}
                  <Card.Header style={{ color: "red", "font-size": "x-large" }}>
                    ISSUE : {this.state.heading}
                  </Card.Header>
                  <Card.Meta style={{ "font-size": "large" }}>
                    {this.state.createdbyname}
                  </Card.Meta>
                  <Card.Description style={{ "margin-top": "16px" }}>
                    <Label size="medium" as="a" color="black">
                      <strong>
                        <Icon name="time" />
                      </strong>
                      <span className="date">{`${Moment(
                        Date(this.state.listed_on)
                      ).format("LL")}`}</span>
                    </Label>
                    {/* <Breadcrumb.Divider
                      icon="right chevron"
                      style={{ color: "darkblue" }}
                    />
                    <strong>Edits : </strong>
                    <span style={{ color: "black" }} className="date">
                      {Moment(Date(this.state.updated_on)).format("LL") !==
                      Moment(Date(this.state.listed_on)).format("LL")
                        ? Moment(Date(this.state.updated_on)).format("LL")
                        : "Not Updated"}
                    </span> */}
                    {/* </Card.Description>
                    <Card.Description> */}
                    {this.state.assign_to ? (
                      <strong>
                        <Label
                          size="medium"
                          as="a"
                          className="right floated"
                          color="yellow"
                          image
                        >
                          <img src="https://react.semantic-ui.com/images/avatar/small/christian.jpg" />
                          {this.state.assigntouser}
                          <Label.Detail>Assigned User</Label.Detail>
                          {this.props.auth.is_staff ||
                      this.props.auth.id === this.state.projectcreator ||
                      permission ||
                      this.props.auth.id === this.state.user ? (<Dropdown icon='pencil'>
                          <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {
                              this.handleassignchange(this.state.projectcreator,this.state.projectcreatorname);
                            }}>{this.state.projectcreatorname}</Dropdown.Item>
                            {teammembers}
                        </Dropdown.Menu>
                        </Dropdown>) : ''}
                        </Label>
                      </strong>
                    ) : this.props.auth.is_staff ||
                      this.props.auth.id === this.state.projectcreator ||
                      permission || this.state.assign_to === this.props.auth.id ||
                      this.props.auth.id === this.state.user ? (
                      <Dropdown
                        text="Assign User"
                        icon = 'pencil'
                        // pointing="left"
                        className="link item right floated"
                      >
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {
                              this.handleassignchange(this.state.projectcreator,this.state.projectcreatorname);
                            }}>{this.state.projectcreatorname}</Dropdown.Item>
                            {teammembers}
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      ""
                    )}
                  </Card.Description>
                  <Card.Description style={{ "margin-top": "6px" }}>
                    {tag}
                  </Card.Description>
                </Card.Content>
                <Embed url={this.state.media} wrapped />
                <Card.Description>{this.state.description}</Card.Description>
                <Card.Content extra>
                  {
                    this.props.auth.is_staff ||
                      this.props.auth.id === this.state.projectcreator ||
                      permission || this.state.assign_to===this.props.auth.id ||
                      this.props.auth.id === this.state.user ?<Button
                    inverted
                    floated="right"
                    color="red"
                    style={{ visible: this.state.permission }}
                    onClick={() => this.deletebug(this.state.project)}
                  >
                    Delete
                  </Button> : ''}
                  <Button
                    floated="left"
                    color="blue"
                    content="comments"
                    icon="comment"
                    label={{
                      basic: true,
                      color: "blue",
                      pointing: "left",
                      content: this.state.count,
                    }}
                  />
                </Card.Content>

                {/* <FileViewer
        fileType='png'
        filePath={this.state.media}
        onError={this.onError}/> */}
              </Card>

              {/* <div className="container ui segment">
                <Table color={"red"}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>description</Table.HeaderCell>
                      <Table.HeaderCell>Date</Table.HeaderCell>
                      <Table.HeaderCell>User</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>{commentlist}</Table.Body>
                </Table>
              </div> */}
              <Comment.Group className='container'>
                <Header as="h3" dividing>
                  Comments
                </Header>

                <Comment>{commentlist}</Comment>

                <Form
                  onSubmit={this.handleSubmit}
                  encType="multipart/form-data"
                  reply
                >
                  <Form.TextArea
                    label="Add a comment"
                    placeholder="Comment.."
                    name="comment"
                    onChange={this.handleChange}
                    value={this.state.comment}
                  />
                  <Button
                    content="Add Reply"
                    labelPosition="left"
                    icon="edit"
                    primary
                  />
                </Form>
              </Comment.Group>
            </div>
          </div>
        );
    }
}


const mapStateToProps = (state) => {
    return{
        auth : state.auth
    }
}

  export default connect(mapStateToProps,{AuthenticateUser})(commentlist)