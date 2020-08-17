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
                    <p id="first-line">welcome to</p>
                    <h1>Compliment</h1>
                    <p>
                        The world would be a better place, if we made each other
                        more compliments!
                    </p>
                    <p>Make people happy today, start making compliments!</p>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetPassword" component={ResetPassword} />
                </div>
                <div id="welcome-logo-container">
                    <img
                        src="./heart.png"
                        style={{ height: 400, width: 400 }}
                    ></img>
                </div>
            </div>
        </HashRouter>
    );
}
