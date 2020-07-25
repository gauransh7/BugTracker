import React, {Component} from 'react'
import axios from 'axios'
import { tokenConfig } from '../../actions/auth'
import { connect} from 'react-redux'
import {store} from '../../index'
import parse from 'html-react-parser'
import {createMessage} from '../../actions/messages'
import { getUsers } from '../../actions/auth'
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
  constructor(props) {
    super(props);
    //this.state = {};
  }

    static propTypes = {
        tokenConfig : propTypes.func.isRequired,
        // deleteProject : propTypes.func.isRequired,
        AuthenticateUser:propTypes.func.isRequired,
        getUsers : propTypes.func.isRequired
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
      this.props.getUsers()
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
                this.state.comments.filter((post) => post.parent === null).map(comment => {
                  this.setState({[comment.id]:''})
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
      if(id===0){
        if(this.state.comment===''){
          console.log('TYPE SOMETHING BEFORE SUBMITTING !')
          store.dispatch(createMessage({ EMPTYCOMMENT: 'TYPE SOMETHING BEFORE SUBMITTING !'}));
        }
        else{
        console.log(id)
      console.log(this.state.comment)
      let data = {
          message: this.state.comment,
          parent : id
          }
      this.state.ws.send(JSON.stringify(data))
      this.setState({comment:'',count:this.state.count+1})
      console.log(this.state)
        }
      }
      else{
        if(this.state[id]===''){
          console.log('TYPE SOMETHING BEFORE SUBMITTING !')
          store.dispatch(createMessage({ EMPTYCOMMENT: 'TYPE SOMETHING BEFORE SUBMITTING !'}));
        }
        else{
        console.log(id)
      console.log(this.state[id])
      let data = {
          message: this.state[id],
          parent : id
          }
      this.state.ws.send(JSON.stringify(data))
      this.setState({[id]:'',count:this.state.count+1})
      console.log(this.state);
        }
      }
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
              const cmntid = comment.id;
                const date = Date(comment.listed_on);
                const formattedDate = Moment(date).format("LL");
                console.log(this.props.auth.users)
                //this.setState({...this.state,[cmntid]:''})
                return (
                  <Comment key={comment.id}>
                    <Comment.Avatar src={this.props.auth.users.find((use) => use.id===comment.user) ? this.props.auth.users.find((use) => use.id===comment.user).image : 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F550731-user-icon-vector&psig=AOvVaw3jM_VuMR3IuCP0VJWUQxlO&ust=1595686600332000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLj1nfqJ5uoCFQAAAAAdAAAAABAI'} />
                    <Comment.Content>
                      <Comment.Author as="a">{comment.username}</Comment.Author>
                      <Comment.Metadata>
                        <div>
                          <TimeAgo date={comment.listed_on} />
                        </div>
                      </Comment.Metadata>
                      <Comment.Text>{comment.description}</Comment.Text>
                      {/* <Comment.Actions>
                        <Comment.Action onClick={() => this.changebool(comment.id)}>Reply</Comment.Action>
                      </Comment.Actions> */}
                      <Form onSubmit={this.handleSubmit(comment.id)} encType="multipart/form-data" reply>
                        <Form.TextArea 
                        style={{height:'3em'}}
                    placeholder="Reply.."
                    name={cmntid}
                    onChange={this.handleChange}
                    value={this.state.cmntid} />
                        <Button
                        floated="right"
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
                            <Comment.Avatar src={this.props.auth.users.find((use) => use.id===cmnt.user) ? this.props.auth.users.find((use) => use.id===cmnt.user).image : 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F550731-user-icon-vector&psig=AOvVaw3jM_VuMR3IuCP0VJWUQxlO&ust=1595686600332000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLj1nfqJ5uoCFQAAAAAdAAAAABAI'} />
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
                          <img src={this.props.auth.users.find((use) => use.id===this.state.assign_to) ? this.props.auth.users.find((use) => use.id===this.state.assign_to).image : 'data:image/png;base64,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'} />
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
                {/* <Embed url={this.state.media} wrapped /> */}


                {this.state.media ?  
                  this.state.media.endsWith("webm") || this.state.media.endsWith("mp4") || this.state.media.endsWith("mov") ? <Embed url={this.state.media} wrapped /> : <Image src={this.state.media} wrapped />
                  : null}




                <Card.Content><p>{parse(`${this.state.description}`)}</p></Card.Content>
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
                  onSubmit={this.handleSubmit(0)}
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
                    content="Add Comment"
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
        auth : state.auth,
    }
}

  export default connect(mapStateToProps,{AuthenticateUser,getUsers})(commentlist)