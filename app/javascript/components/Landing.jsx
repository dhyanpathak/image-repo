import React, { Component } from 'react';
import { Jumbotron, Container, Modal, Button } from 'react-bootstrap';

import Signin from './auth/Signin';
import Signup from './auth/Signup';

import '../../assets/stylesheets/landing.css';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signin: false,
            signup: false
        };
    }

    componentDidMount() {
        return this.props.loggedInStatus ? this.props.history.push('/app') : null;
    }

    handleShow = (name) => {
        this.setState({
            [name]: true
        })
    }

    handleClose = (name) => {
        this.setState({
            [name]: false
        })
    }

    render() {
        return (
            <Jumbotron fluid>
                <Container id="landing-container">
                    <h1>ImageRepo</h1>
                    <p>Post and explore pictures. Made by Dhyan.</p>
                    <p>
                        <Button variant="light" name="login" onClick={() => this.handleShow('signin')}>Login</Button>{' '}
                        <Button variant="dark" name="signup" onClick={() => this.handleShow('signup')}>Signup</Button><br />
                        <Modal centered show={this.state.signup} onHide={() => this.handleClose('signup')}>
                            <Modal.Header closeButton>
                                <Modal.Title>Signup</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Signup {...this.props} />                                
                            </Modal.Body>
                        </Modal>
                        <Modal centered show={this.state.signin} onHide={() => this.handleClose('signin')}>
                            <Modal.Header closeButton>
                                <Modal.Title>Login</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Signin {...this.props} />                                
                            </Modal.Body>
                        </Modal>
                    </p>
                </Container>
            </Jumbotron>
        )
    }
};

export default Landing;