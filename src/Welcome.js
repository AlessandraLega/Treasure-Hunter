import React from "react";
import Register from "./register";
import Login from "./login";
// import ResetPassword from "./resetpassword";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <h1>Welcome!!</h1>
            <p>here will be an amazing logo!</p>
            <Route exact path="/" component={Register} />
            <Route path="/login" component={Login} />
            {/*<Route path="/reset-password" component={ResetPassword} /> */}
        </HashRouter>
    );
}
