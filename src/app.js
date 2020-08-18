import React from "react";
import axios from "./axios";
// import Profile from "./profile";
import Home from "./home";
import Upload from "./upload";
import Item from "./item";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { socket } from "./socket";
import Nav from "./nav";
import SavedSearches from "./saved-searches";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <BrowserRouter>
                <header>
                    <nav>
                        <Nav />
                    </nav>
                    <h1>Treasure Hunter</h1>
                    <Link to="/upload">
                        <button>Upload treasure</button>
                    </Link>
                </header>

                <Route exact path="/" component={Home} />
                <Route path="/upload" component={Upload} />
                <Route path="/item/:id" component={Item} />
                <Route path="/my-searches" component={SavedSearches}></Route>
                <Route path="/search/:search" component={Home} />
            </BrowserRouter>
        );
    }
}
