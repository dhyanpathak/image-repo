import React, { Component } from 'react';
import axios from 'axios';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import '../../assets/stylesheets/main.css';

import Feed from './Feed';
import Upload from './Upload';
import Profile from './Profile';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feed: true,
            upload: false,
            profile: false,
            updatedImages: [],
            updateType: '' //ADD, EDIT or DELETE
        };
    }
    componentDidMount() {
        this.props.handleLogin();
    }
    
    handleSelected = (e) => {
        switch (e.target.name) {
            case "feed":
                this.setState({ feed: true, upload: false, profile: false });
                break;
            case "upload":
                this.setState({ feed: false, upload: true, profile: false });
                break;
            case "profile":
                this.setState({ feed: false, upload: false, profile: true })
        }
    }

    logout = () => {
        axios.delete('/logout', { withCredentials: true })
            .then(response => {
                this.props.handleLogout();
                this.props.history.push('/');
            })
            .catch(error => console.log(error))
    }

    update = (updatedImages, updateType) => {
        this.setState({ updatedImages, updateType });
    }

    styles = {
        selectedTab: {
            color: 'white',
            fontWeight: 500
        }
    }

    render() {
        return (
            <div id="main">
                <Navbar bg="dark" variant="dark" fixed="top">
                    <Navbar.Brand>ImageRepo</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link name="feed" onClick={this.handleSelected} style={this.state.feed ? this.styles.selectedTab : {}}>Feed</Nav.Link>
                            <Nav.Link name="upload" onClick={this.handleSelected} style={this.state.upload ? this.styles.selectedTab : {}}>Upload</Nav.Link>
                        </Nav>
                        <NavDropdown title={this.props.user.full_name} id="basic-nav-dropdown">
                            <NavDropdown.Item name="profile" onClick={this.handleSelected}>Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Navbar>

                <div id="content">
                    <Feed isActive={this.state.feed} updatedImages={this.state.updatedImages} updateType={this.state.updateType} />
                    <Upload isActive={this.state.upload} update={this.update} />
                    <Profile isActive={this.state.profile} user={this.props.user} updatedImages={this.state.updatedImages} update={this.update} updateType={this.state.updateType} />
                </div>
            </div>
        );
    }
};

export default Main;