import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "./app";
import axios from "./axios";

export default function Nav() {
    const [notificationSearch, setNotificationSearch] = useState(0);
    const [notificationFav, setNotificationFav] = useState(0);

    useEffect(() => {
        console.log("useEffect running");

        socket.emit("requestSearch");
        socket.emit("requestFav");

        socket.on("requestNumSearch", (notificationNum) => {
            console.log("notificationNum search:", notificationNum);
            setNotificationSearch(notificationNum);
        });

        socket.on("requestNumFav", (notificationNum) => {
            console.log("notificationNum fav:", notificationNum);
            setNotificationFav(notificationNum);
        });

        socket.on("notificationSearch", (data) => {
            console.log("received notificationSearch :", data);
            setNotificationSearch(notificationSearch + 1);
        });
        socket.on("notificationFav", (data) => {
            console.log("received notificationFav :", data);
            setNotificationSearch(notificationFav + 1);
        });

        const cleanup = () => {
            socket.off("notificationSearch");
            socket.off("notificationFav");
        };

        return cleanup();
    }, []);

    const resetNotificationsSearch = () => {
        setNotificationSearch(0);
    };

    const resetNotificationsFav = () => {
        setNotificationFav(0);
    };

    return (
        <nav>
            <Link to={"/"}>
                <span className="nav-link">find treasures</span>
            </Link>
            <span> | </span>
            <Link to={"/saved-treasures"} onClick={resetNotificationsFav}>
                <span className="nav-link">saved treasures</span>
                {<span>({notificationFav})</span>}
            </Link>
            <span> | </span>
            <Link to={"/my-searches"} onClick={resetNotificationsSearch}>
                <span className="nav-link">my searches</span>
                {<span>({notificationSearch})</span>}
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
