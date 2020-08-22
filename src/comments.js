import React, { useState, useEffect } from "react";
import axios from "./axios";
import { socket } from "./app";

export default function Comments({ id }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState([]);

    useEffect(() => {
        if (id) {
            (async () => {
                const { data } = await axios.get("/all-comments/" + id);
                setComments(
                    data.sort(
                        (a, b) =>
                            new Date(a.created_at) - new Date(b.created_at)
                    )
                );
            })();
        }
    }, [id]);

    const saveComment = () => {
        socket.emit("newComment", { itemId: id });
        (async () => {
            const { data } = await axios.post("/new-comment/", {
                newComment,
                id,
            });
            document.querySelector("textarea").value = "";
            setComments(
                data.sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                )
            );
        })();
        document.querySelector("textarea").value = "";
    };

    const convertDate = (date) => {
        let newDate = new Date(date);
        return newDate.toLocaleString("de-DE", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    return (
        <div id="wall">
            <textarea
                onChange={(e) => setNewComment(e.target.value)}
                rows="2"
                cols="45"
            ></textarea>
            <button onClick={() => saveComment()} id="button-wall">
                Post
            </button>
            {comments &&
                comments.map((comment, i) => {
                    return (
                        <div className="post-container" key={i}>
                            <p className="sender">
                                {comment.first} {comment.last}{" "}
                                <span className="date">
                                    {convertDate(comment.created_at)}
                                </span>
                            </p>
                            <p className="message">{comment.comment}</p>
                        </div>
                    );
                })}
        </div>
    );
}
