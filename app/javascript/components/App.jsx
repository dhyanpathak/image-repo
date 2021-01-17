import React, { Component } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "../components/Landing";
import Main from "../components/Main";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            user: {}
        };
    }

    componentDidMount() {
        this.loginStatus();
    }

    loginStatus = () => {
        axios.get('/logged_in',
            { withCredentials: true })
            .then(resp => {
                if (resp.data.logged_in) {
                    this.handleLogin(resp.data);
                } else {
                    this.handleLogout()
                }
            })
            .catch(error => console.log('API ERROR:', error))
    }

    handleLogin = (data) => {
        let user = data.user;
        user.images = data.user_images;
        this.setState({
            loggedIn: true,
            user
        })
    }

    handleLogout = () => {
        this.setState({
            loggedIn: false,
            user: {}
        });
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact render={props => (
                        <Landing
                            {...props}
                            handleLogin={this.handleLogin}
                            loggedInStatus={this.state.loggedIn} />
                    )} />
                    <Route path="/app" exact render={props => (
                        <Main
                            {...props}
                            user={this.state.user}
                            handleLogin={this.loginStatus}
                            loggedInStatus={this.state.loggedIn}
                            handleLogout={this.handleLogout}
                        />
                    )} />
                </Switch>
            </Router>
        );
    }
};

export default App;