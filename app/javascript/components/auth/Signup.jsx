import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmed_password: '',
            errors: ''
        };
    }
    redirect = () => {
        this.props.history.push('/app');
    }
    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        });
        if (name == "confirmed_password" && this.state.password !== value) {
            this.setState({errors: "Passwords don't match"});
        } else {
            this.setState({errors: ""})
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { full_name, email, password, confirmed_password } = this.state;
        
        if(full_name.length == 0 || email.length == 0 || confirmed_password.length == 0) {
            this.setState({errors: "Please enter all the fields."});
            return;
        };
        
        let user = {
            full_name,
            email,
            password,
            password_confirmation: confirmed_password
        };
        axios.post('/api/users', { user }, { withCredentials: true })
            .then(resp => {
                if (resp.data.status === 'created') {
                    this.props.handleLogin(resp.data);
                    this.redirect();
                } else {
                    this.setState({
                        errors: resp.data.errors
                    })
                }
            })
            .catch(err => console.log("API ERROR", err));
    };

    redirect = () => {
        this.props.history.push('/app');
    }

    render() {
        const { errors, full_name, email, password, confirmed_password } = this.state

        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        name="full_name"
                        autoComplete="none" 
                        placeholder="Enter your name"
                        value={full_name}
                        onChange={this.handleChange} 
                    />
                </Form.Group>
                
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

                <Form.Group controlId="passwordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        placeholder="******"
                        type="password"
                        name="confirmed_password"
                        value={confirmed_password}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <p>{errors}</p>
                <br />
                <div style={{textAlign: 'center'}}>
                    <Button variant="primary" type="submit">Submit</Button>
                </div>
            </Form>
        );
    }
}
export default Signup;