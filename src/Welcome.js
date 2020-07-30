import React from "react";
import axios from "axios";

export default class Welcome extends React.Component {
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
                <label for="first">
                    <p>First name:</p>
                </label>
                <input
                    type="text"
                    name="first"
                    id="first"
                    onChange={(e) => this.handleChange(e.target.value)}
                    placeholder="first name"
                    autocomplete="off"
                />
                <label for="last">
                    <p>Last name:</p>
                </label>
                <input
                    type="text"
                    name="last"
                    id="last"
                    onChange={(e) => this.handleChange(e.target.value)}
                    placeholder="last name"
                    autocomplete="off"
                />
                <label for="e-mail">
                    <p>e-mail:</p>
                </label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    onChange={(e) => this.handleChange(e.target.value)}
                    placeholder="e-mail"
                    autocomplete="off"
                />
                <label for="password">
                    <p>Password:</p>
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => this.handleChange(e.target.value)}
                    placeholder="password"
                    autocomplete="off"
                />
                <button id="submit" onClick={(e) => this.submit()}>
                    Sign up!
                </button>
            </div>
        );
    }
}
