import React from "react";
import axios from "axios";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <h3>Reset your password</h3>
                <p>E-mail:</p>
                <p>
                    Please enter your e-mail below. Please don't close this
                    window, we'll send you an email soon!
                </p>
                <input
                    type="text"
                    name="email"
                    id="email"
                    onChange={(e) => this.handleChange(e)}
                    placeholder="e-mail"
                ></input>
                <button>Submit</button>
            </div>
        );
    }
}
