import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
        };
    }
    handleSendEmail() {
        axios
            .post("/step1", {
                email: this.state.email,
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ step: 2 });
                } else {
                    this.setState({ error: true });
                }
            });
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    changePassword() {
        axios
            .post("/step2", {
                code: this.state.code,
                newPassword: this.state.newPassword,
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 3,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }
    render() {
        return (
            <>
                {this.state.step == 1 && (
                    <div>
                        <h3>Reset your password</h3>
                        <p>Please enter your e-mail below.</p>
                        <p>
                            Please do not close this window, we will send you an
                            email soon!
                        </p>
                        {this.state.error && (
                            <p className="error">
                                Something went wrong, please try again!
                            </p>
                        )}
                        <div className="form">
                            <p>E-mail:</p>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                onChange={(e) => this.handleChange(e)}
                                placeholder="e-mail"
                            ></input>
                            <br />
                            <button
                                id="submit"
                                onClick={() => this.handleSendEmail()}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
                {this.state.step == 2 && (
                    <div>
                        {this.state.error && (
                            <p className="error">
                                Something went wrong, please try again!
                            </p>
                        )}
                        <p>
                            Please insert your secret code and the new password!
                        </p>
                        <input
                            type="text"
                            name="code"
                            id="code"
                            onChange={(e) => this.handleChange(e)}
                            placeholder="secret code"
                            autoComplete="off"
                        ></input>
                        <br />
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            onChange={(e) => this.handleChange(e)}
                            placeholder="new password"
                        ></input>
                        <br />
                        <button
                            id="submit"
                            onClick={() => this.changePassword()}
                        >
                            Submit
                        </button>
                    </div>
                )}
                {this.state.step == 3 && (
                    <div>
                        <p>Thank you for changing your password!</p>
                        <p>
                            Now you can <Link to="/login">log in</Link>!{" "}
                        </p>
                    </div>
                )}
            </>
        );
    }
}
