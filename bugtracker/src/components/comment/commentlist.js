import React, {Component} from 'react'
import axios from 'axios'
import { tokenConfig } from '../../actions/auth'
import { connect} from 'react-redux'
import {store} from '../../index'
import { Grid, Segment, ModalContent, Icon,Label ,Button,Card} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NavBar  from '../navbar'
import { Table,Breadcrumb,Menu } from 'semantic-ui-react'
import { Date} from 'prismic-reactjs';
import Moment from 'moment'
// import { deleteProject} from '../../actions/projectAction'
import { AuthenticateUser } from '../../actions/auth'
// import { returnErrors } from '../../actions/messages'
import propTypes from 'prop-types'



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


    state = {
        comments : [],
        count : '',
    }

    componentDidMount(){
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
                console.log(this.state)
                // console.log(this.state.name)
            })

    }
    render(){
        const commentlist = this.state.comments.length ? (
            this.state.comments.map(comment => {
                const date = Date(comment.listed_on);
                const formattedDate = Moment(date).format("LL");
                return  <Table.Row key={comment.id}>
                <Table.Cell>{comment.description}</Table.Cell>
                <Table.Cell>{formattedDate}</Table.Cell>
                <Table.Cell>{comment.username ? comment.username : ''}</Table.Cell>
              </Table.Row>
            })) : (
                <Table.Row key='1'>
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>No</Table.Cell>
              </Table.Row>
            )


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
                        to={`/project/${this.state.project}`}
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
                  <Card.Header style={{'color':'red'}}>
                    ISSUE : {this.state.heading}
                  </Card.Header>
                  <Card.Meta>
                  {this.state.createdbyname}</Card.Meta>
                  <Card.Description>
                  <strong>Date : </strong>
                  <span style={{ color: "black" }} className="date">{`${Moment(
                    Date(this.state.listed_on)
                  ).format("LL")}`}</span>
                  <Breadcrumb.Divider
                    icon="right chevron"
                    style={{ color: "darkblue" }}
                  />
                  <strong>Edits : </strong>
                  <span style={{ color: "black" }} className="date">
                    {Moment(Date(this.state.updated_on)).format("LL") !==
                    Moment(Date(this.state.listed_on)).format("LL")
                      ? Moment(Date(this.state.updated_on)).format("LL")
                      : "Not Updated"}
                  </span>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                <Button inverted floated="right" color="red">
                    Delete
                  </Button>
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
              </Card>

              <div className="container ui segment">
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
              </div>
            </div>
          </div>
        );
    }
}

  export default connect(null,{AuthenticateUser})(commentlist)