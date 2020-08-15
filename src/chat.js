import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const [message, setMessage] = useState();

    useEffect(() => {
        socket.emit("chatMessages");
    }, []);

    const lastTen = useSelector((state) => {
        return (
            state.lastTen &&
            state.lastTen.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            )
        );
    });

    const sendEmpty = (e) => {
        e.preventDefault();
        socket.emit("chatMessage", message);
        document.querySelector("textarea").value = "";
    };

    return (
        <div>
            <div id="chat">
                {lastTen &&
                    lastTen.map((message, i) => {
                        return (
                            <div className="chat-bubble" key={i}>
                                <p className="sender">
                                    {message.first} {message.last}
                                </p>
                                <div className="pic-message">
                                    <img
                                        className="sender-pic"
                                        src={message.profile_pic}
                                    />
                                    <p className="message">{message.message}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <textarea
                name="message"
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button onClick={(e) => sendEmpty(e)}>Send</button>
        </div>
    );
}
