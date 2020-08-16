import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const [message, setMessage] = useState();
    const elemRef = useRef();

    useEffect(() => {
        socket.emit("chatMessages");
    }, []);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        console.log(
            "elemRef.current.scrollHeight :",
            elemRef.current.scrollHeight
        );
        console.log(
            "elemRef.current.clientHeight :",
            elemRef.current.clientHeight
        );
    });

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
            <div id="chat" ref={elemRef}>
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
            <div id="textarea-button">
                <textarea
                    name="message"
                    rows="5"
                    cols="33"
                    placeholder="write something nice for everyone!"
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button id="button-chat" onClick={(e) => sendEmpty(e)}>
                    Send
                </button>
            </div>
        </div>
    );
}
