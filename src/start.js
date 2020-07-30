import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Welcome from "./Welcome";

/*add logic to determine what to pass to ReactDOM.render
if the url is /welcome, render your Welcome component
if the url is not /welcome, render your small logo*/

let isLoggedIn = location.pathname != "/welcome";

if (isLoggedIn) {
    ReactDOM.render(<Home />, document.querySelector("main"));
} else {
    ReactDOM.render(<Welcome />, document.querySelector("main"));
}

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
