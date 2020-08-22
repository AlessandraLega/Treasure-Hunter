import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as io from "socket.io-client";
import axios from "./axios";

export default function Nav() {
    const [notification, setNotification] = useState(0);
    useEffect(() => {
        console.log("useEffect running");
        let socket;

        if (!socket) {
            socket = io.connect();
        }

        socket.emit("request");

        socket.on("requestNum", (notificationNum) => {
            console.log("notificationNum :", notificationNum);
            setNotification(notificationNum);
        });

        socket.on("notification", (data) => {
            console.log("received notification :", data);
            setNotification(notification + 1);
        });

        return socket.off("notification");
    }, []);

    const resetNotifications = () => {
        setNotification(0);
        axios.post("/reset-notifications");
    };

    return (
        <nav>
            <Link to={"/"}>
                <span className="nav-link">find treasures</span>
            </Link>
            <span> | </span>
            <Link to={"/saved-treasures"}>
                <span className="nav-link">saved treasures</span>
                {<span>({notification})</span>}
            </Link>
            <span> | </span>
            <Link to={"/my-searches"} onClick={resetNotifications}>
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
