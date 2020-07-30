import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Welcome from "./welcome";
import Home from "./home";
/*add logic to determine what to pass to ReactDOM.render
if the url is /welcome, render your Welcome component
if the url is not /welcome, render your small logo*/

let isLoggedIn = location.pathname != "/welcome";

let elem;

if (isLoggedIn) {
    elem = <Home />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
/* ReactDOM.render(
    <HelloWorld />,
    document.querySelector('main')
);

function HelloWorld() {
    return (
        <div>Hello, World!</div>
    );
}
 */
