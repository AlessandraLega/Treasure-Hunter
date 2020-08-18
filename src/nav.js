import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Nav() {
    const num = useSelector((state) => state.requestNum);

    useEffect(() => {
        socket.emit("request");
    });

    return (
        <nav>
            <Link to={"/"}>
                <span className="nav-link">find treasures</span>
            </Link>
            <span> | </span>
            <Link to={"/saved-treasures"}>
                <span className="nav-link">saved treasures</span>
                {!!num && <span>({num})</span>}
            </Link>
            <span> | </span>
            <Link to={"/my-searches"}>
                <span className="nav-link">my searches</span>
            </Link>
            <span> | </span>
            <Link to={"/chat"}>
                <span className="nav-link">Chat</span>
            </Link>
            <span> | </span>
            <a id="logout" href="/logout">
                Log out
            </a>
        </nav>
    );
}
