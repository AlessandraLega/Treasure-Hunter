import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Register extends React.Component {
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
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
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
                        Something went wrong! Please try again!
                    </p>
                )}
                <p>First name:</p>
                <input
                    type="text"
                    name="first"
                    id="first"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="first name"
                    autoComplete="off"
                />
                <p>Last name:</p>
                <input
                    type="text"
                    name="last"
                    id="last"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="last name"
                    autoComplete="off"
                />
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
                <br></br>
                <button id="submit" onClick={() => this.submit()}>
                    Sign up!
                </button>
                <p>
                    Have you already registered? Then{" "}
                    <Link to="/login">log in</Link> here!
                </p>
            </div>
        );
    }
}
