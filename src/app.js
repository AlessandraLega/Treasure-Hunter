import React from "react";
import Home from "./home";
import Upload from "./upload";
import Item from "./item";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Nav from "./nav";
import SavedSearches from "./saved-searches";
import Map from "./map";
import * as io from "socket.io-client";

export let socket;

if (!socket) {
    socket = io.connect();
}
export default function App() {
    return (
        <BrowserRouter>
            <header>
                <nav>
                    <Nav />
                </nav>
                <img id="logo" src="/box.png"></img>
                <h1 id="title">Treasure Hunter</h1>

                <button id="upload">
                    <Link to="/upload">Upload treasure</Link>
                </button>
            </header>

            <Route exact path="/" component={Home} />
            <Route path="/upload" component={Upload} />
            <Route path="/item/:id" component={Item} />
            <Route path="/my-searches" component={SavedSearches}></Route>
            <Route path="/search/:search" component={Home} />
            <Route path="/saved-treasures" component={Home} />
            <Route path="/map" component={Map} />
        </BrowserRouter>
    );
}
