import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "./socket";
import { chatMessages } from "./actions";

export default function Chat() {
    const [message, setMessage] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        socket.emit("chatMessages");
    }, [message]);

    const lastTen = useSelector((state) => {
        return (
            state.lastTen &&
            state.lastTen.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            )
        );
    });

    const sendEmpty = (e) => {
        e.target.value = "";
        socket.emit("chatMessage", message);
    };
    console.log("lastTen :", lastTen);

    return (
        <div>
            <div id="chat">
                {lastTen &&
                    lastTen.map((message, i) => {
                        return <p>{message.message}</p>;
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
