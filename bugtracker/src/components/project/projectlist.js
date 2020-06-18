import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Card,
  Icon,
  Breadcrumb,
  Menu,
  Button,
  Segment,
  Image,
  CardGroup,
  Label,
  Popup,
} from "semantic-ui-react";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { getProjects } from "../../actions/projectAction";
import { deleteProject } from "../../actions/projectAction";
// import {LoadUser} from '../../actions/auth'
import { AuthenticateUser } from "../../actions/auth";
import NavBar from "../navbar";
import axios from "axios";
import { tokenConfig } from "../../actions/auth";
// import { returnErrors } from '../../actions/messages';
import { store } from "../../index";
import "../../css/projectlist.css";
import finallogo from "../../media/finallogowbg.png";
import Moment from "moment";
import { Date } from "prismic-reactjs";

const rightItems = [
  { as: "a", content: "home", key: "home" },
  { as: "a", content: "Login", key: "login" },
];

class Projectlist extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    projects: propTypes.array.isRequired,
    getProjects: propTypes.func.isRequired,
    deleteProject: propTypes.func.isRequired,
    AuthenticateUser: propTypes.func.isRequired,
    tokenConfig: propTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.AuthenticateUser();
    this.props.getProjects();
  }

  editclick = (id) => {
    return <Redirect to={`/project/${id}/edit/`} />;
  };

  render() {
    const { posts } = this.props;
    const postlisttesting = posts.filter((post) => post.launched === false)
      .length ? (
      posts
        .filter((post) => post.launched === false)
        .map((post) => {
          return (
            <Card color="red" key={post.id}>
              <Card.Content>
                <Card.Header>
                  {post.image ? (
                    <Image floated="right" size="mini" src={post.image} />
                  ) : (
                    <Icon
                      name="cubes"
                      className="right floated"
                      size="normal"
                    />
                  )}
                  <Link to={`/project/${post.id}`}>
                    <span style={{ color: "black" }}>{post.name}</span>
                  </Link>
                </Card.Header>
                <Card.Meta>
                  <span className="date">
                    {Moment(Date(post.created_on)).format("LL")}
                  </span>
                </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <Link to={`/project/${post.id}/bugs`}>
                  <Icon name="bug" color="red" />
                  {post.countbugs}
                </Link>

                {this.state.staff ||
                this.props.auth.id === post.creator ||
                this.props.auth.User in post.user ? (
                  <span>
                    <Popup
                      trigger={
                        <Icon
                          name="delete"
                          color="red"
                          className="right floated delpro"
                          onClick={this.props.deleteProject.bind(this, post.id)}
                        />
                      }
                      content="Clicking on this will permanently DELETE this project"
                    />
                    <Popup
                      trigger={
                        <Link to={`/project/${post.id}/edit/`}>
                          <Icon
                            name="pencil"
                            color="green"
                            className="right floated delpro"
                          />
                        </Link>
                      }
                      content="Edit Project"
                    />
                  </span>
                ) : (
                  ""
                )}
              </Card.Content>
            </Card>
          );
        })
    ) : (
      <div>No Projects for testing</div>
    );

    const postlistlaunched = posts.filter((post) => post.launched === true)
      .length ? (
      posts
        .filter((post) => post.launched === true)
        .map((post) => {
          return (
            <Card color="green" key={post.id}>
              <Card.Content>
                <Card.Header>
                  {post.image ? (
                    <Image floated="right" size="mini" src={post.image} />
                  ) : (
                    <Icon
                      name="cubes"
                      className="right floated"
                      size="normal"
                    />
                  )}
                  <Link to={`/project/${post.id}`}>
                    <span style={{ color: "black" }}>{post.name}</span>
                  </Link>
                </Card.Header>
                <Card.Meta>
                  <span className="date">
                    {Moment(Date(post.created_on)).format("LL")}
                  </span>
                </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <Link to={`/project/${post.id}/bugs`}>
                  <Icon name="bug" color="red" />
                  {post.countbugs}
                </Link>
                {this.state.staff ||
                this.props.auth.id === post.creator ||
                this.props.auth.User in post.user ? (
                  <span>
                    <Popup
                      trigger={
                        <Icon
                          name="delete"
                          color="red"
                          className="right floated delpro"
                          onClick={this.props.deleteProject.bind(this, post.id)}
                        />
                      }
                      content="Clicking on this will permanently DELETE this project"
                    />
                    <Popup
                      trigger={
                        <Link to={`/project/${post.id}/edit/`}>
                          <Icon
                            name="pencil"
                            color="green"
                            className="right floated delpro"
                          />
                        </Link>
                      }
                      content="Edit Project"
                    />
                  </span>
                ) : (
                  ""
                )}
              </Card.Content>
            </Card>
          );
        })
    ) : (
      <div>No Projects Launched</div>
    );

    return (
      <div>
        <NavBar rightItems={rightItems} />
        <div className="ui">
          <div className="container ui">
            <Menu borderless className="ui plmenu">
              <Menu.Item>
                <Breadcrumb>
                  <Breadcrumb.Section style={{ color: "black" }} link>
                    Projects
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider
                    icon="right chevron"
                    style={{ color: "darkblue" }}
                  />
                </Breadcrumb>
              </Menu.Item>
              <Menu.Item position="right" as={Link} to="/addproject">
                <Button basic icon labelPosition="right">
                  <Icon name="add" size="normal" />
                  Add Project
                </Button>
              </Menu.Item>
            </Menu>
          </div>
          <div className="segment">
            <Segment color="red" className="testing-segment">
              <Label as="a" color="red" attached="top left" ribbon>
                Testing
              </Label>
              <CardGroup>{postlisttesting}</CardGroup>
            </Segment>
            <Segment color="green" className="launched-segment">
              <Label as="a" color="green" attached="top left" ribbon>
                Launched
              </Label>
              <CardGroup>{postlistlaunched}</CardGroup>
            </Segment>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    posts: state.project.posts,
    auth: state.auth,
  };
};

export default connect(mapStateToProps, {
  getProjects,
  tokenConfig,
  AuthenticateUser,
  deleteProject,
})(Projectlist);
