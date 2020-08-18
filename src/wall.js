/* import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function Wall({ id }) {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/all-posts/" + id);
            setPosts(
                data.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                )
            );
        })();
    }, []);

    const savePost = () => {
        (async () => {
            const { data } = await axios.post("/new-post/", { newPost, id });
            document.querySelector("textarea").value = "";
            setPosts(
                data.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                )
            );
        })();
        document.querySelector("textarea").value = "";
    };


    return (
        <div id="wall">
            <textarea
                onChange={(e) => setNewPost(e.target.value)}
                rows="2"
                cols="45"
                placeholder="write something nice for your friend!"
            ></textarea>
            <button onClick={() => savePost()} id="button-wall">
                Post
            </button>
            {posts &&
                posts.map((post, i) => {
                    return (
                        <div className="post-container" key={i}>
                            <p className="sender">
                                {post.first} {post.last}{" "}
                                <span className="date">{post.created_at}</span>
                            </p>
                            <div className="pic-message">
                                <img
                                    className="sender-pic"
                                    src={post.profile_pic}
                                />
                                <p className="message">{post.post}</p>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
 */
