import React from "react";
import ReactDOM from "react-dom";
//import axios from "axios";
import Welcome from "./welcome";
//import Home from "./home";
import App from "./app";
/*add logic to determine what to pass to ReactDOM.render
if the url is /welcome, render your Welcome component
if the url is not /welcome, render your small logo*/

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let isLoggedIn = location.pathname != "/welcome";

let elem;

if (isLoggedIn) {
    elem = (
        <Provider store={store}>
            <App />;
        </Provider>
    );
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
