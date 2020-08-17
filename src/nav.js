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
            <Link to={"/findPeople"}>
                <span className="nav-link">find Friends</span>
            </Link>
            <span> | </span>
            <Link to={"/friends"}>
                <span className="nav-link">my Friends</span>
                {!!num && <span>({num})</span>}
            </Link>
            <span> | </span>
            <Link to={"/"}>
                <span className="nav-link">my Profile</span>
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
