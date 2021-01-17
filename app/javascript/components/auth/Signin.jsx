import React, { Component } from 'react';
import axios from 'axios';

import { Form, Button } from 'react-bootstrap';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: ''
        };
    }

    redirect = () => {
        this.props.history.push('/app');
    }

    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            errors: ''
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { email, password } = this.state;
        let user = {
            email,
            password
        };
        axios.post('/login', { user }, { withCredentials: true })
            .then(resp => {
                if (resp.data.logged_in) {
                    this.props.handleLogin(resp.data);
                    this.redirect();
                } else {
                    this.setState({
                        errors: resp.data.errors
                    })
                }
            })
            .catch(err => console.log('API ERROR', err))
    };

    render() {
        const { email, errors, password } = this.state

        return (
            <Form onSubmit={this.handleSubmit}>              
                <Form.Group controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email"
                        name="email"
                        autoComplete="none"
                        value={email}
                        onChange={this.handleChange} 
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        name="password"
                        type="password"
                        placeholder="******"
                        autoComplete="none"
                        value={password}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <p>{errors}</p>
                <br />
                <div style={{textAlign: 'center'}}>
                    <Button variant="primary" type="submit">Enter</Button>
                </div>
            </Form>
        );
    }
}

export default Signin;