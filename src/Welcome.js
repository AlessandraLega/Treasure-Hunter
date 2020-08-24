import React from "react";
import Register from "./register";
import Login from "./login";
import ResetPassword from "./resetPassword";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div id="welcome">
                <div id="welcome-text">
                    <p id="first-line-welcome">welcome to</p>
                    <h1>Treasure Hunter</h1>
                    <p>
                        a network for finding and sharing treasures found in
                        Berlin!
                    </p>
                    <p>Start hunting today!</p>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetPassword" component={ResetPassword} />
                </div>
                <div id="welcome-logo-container">
                    <img
                        src="./box.png"
                        style={{ height: 400, width: 400 }}
                    ></img>
                </div>
            </div>
        </HashRouter>
    );
}
