import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("error in register: ", err);
                this.setState({
                    error: true,
                });
            });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <p className="error">
                        Something went wrong! Please try again.
                    </p>
                )}
                <p>e-mail:</p>
                <input
                    type="text"
                    name="email"
                    id="email"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="e-mail"
                    autoComplete="off"
                />
                <p>Password:</p>
                <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="password"
                    autoComplete="off"
                />
                <button id="submit" onClick={() => this.submit()}>
                    Log in!
                </button>
                <p>
                    have you forgotten your password?{" "}
                    <Link to="/resetPassword">Reset your password here!</Link>
                </p>
            </div>
        );
    }
}
