import React, {Component} from 'react'
import axios from 'axios'
import { tokenConfig } from '../../actions/auth'
import { connect} from 'react-redux'
import {store} from '../../index'
import { Grid,Icon, Button,Menu,Breadcrumb} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NavBar  from '../navbar'
import { Date} from 'prismic-reactjs';
import Moment from 'moment'
import { deleteProject} from '../../actions/projectAction'
import { AuthenticateUser } from '../../actions/auth'
// import { returnErrors } from '../../actions/messages'
import propTypes from 'prop-types'



const rightItems = [
    { as: "a", content: "home", key: "home" },
    { as: "a", content: "Login", key: "login" }
  ];
  


class singleproject extends Component{ 

    static propTypes = {
        tokenConfig : propTypes.func.isRequired,
        deleteProject : propTypes.func.isRequired,
        AuthenticateUser: propTypes.func.isRequired
    }


    state = {
        count : ''
    }

    componentDidMount(){
        console.log(this.props);
        const id =  this.props.match.params.id;
        console.log(tokenConfig(store.getState))
        axios.get(`http://localhost:8000/BugTracker/projects/${id}/`, tokenConfig(store.getState))
            .then(res =>{
                console.log(res.data)
                this.setState({
                    ...this.state,
                   ...res.data
                })
                console.log(this.state)

            }

            ).catch(err => console.log(err))
        axios.get(`http://localhost:8000/BugTracker/projects/${this.props.match.params.id}/bugs/`,tokenConfig(store.getState))
            .then(res =>{
                console.log(Object.keys(res.data).length)
                this.setState({
                    ...this.state,
                    count : Object.keys(res.data).length
                })
            }

            )
    }
    render(){

        const date = Date(this.state.created_on);
        const formattedDate = Moment(date).format("LL");

        return (
          <div>
            <NavBar rightItems={rightItems} />
            <div className="ui">
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
                        {this.state.name}
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </Menu.Item>
                </Menu>
              </div>
              <nav className="nav-wrapper blue container ui segment black-text darken-1">
                <Grid>
                  <Grid.Column width={8} textAlign="left" className="border">
                    <div className="large bold left">{this.state.name}</div>
                  </Grid.Column>
                  <Grid.Column width={3}>{formattedDate}</Grid.Column>
                  <Grid.Column width={3}>
                    <Icon name="bug">{this.state.countbugs}</Icon>
                  </Grid.Column>
                  <Grid.Column width={2}>
                    <Link to="/addproject">
                      <Icon aligned="right" name="add">
                        Bug
                      </Icon>
                    </Link>
                    <Link to={`/project/${this.state.id}/bugs`}>
                      <Button>Bugs</Button>
                    </Link>
                  </Grid.Column>
                  <div className="large bold left">
                    {this.state.createdbyname}
                    {this.state.usernames}
                  </div>
                </Grid>
              </nav>
              <div className="container ui segment">{this.state.wiki}</div>
            </div>
          </div>
        );
    }
}

  export default connect(null,{deleteProject,AuthenticateUser})(singleproject)