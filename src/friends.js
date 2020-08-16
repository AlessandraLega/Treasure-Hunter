import React from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import { getFriendsWannabes, accept, deleteFriend } from "./actions.js";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriendsWannabes());
    }, []);

    const friends = useSelector((state) => {
        return (
            state.friendsWannabes &&
            state.friendsWannabes.filter((person) => person.accepted == true)
        );
    });
    console.log("friends", friends);

    const wannabes = useSelector((state) => {
        return (
            state.friendsWannabes &&
            state.friendsWannabes.filter((person) => person.accepted == false)
        );
    });

    if (!wannabes || !friends) {
        return null;
    }

    return (
        <>
            {!!wannabes.length && <h3>Friend requests</h3>}
            <div className="friends-wannabes-container">
                {wannabes &&
                    wannabes.map((user, i) => {
                        return (
                            <div key={i}>
                                <img
                                    src={user.profile_pic}
                                    className="profile-pic"
                                    style={{
                                        height: "100px",
                                        width: "100px",
                                    }}
                                ></img>
                                <p>
                                    {user.first} {user.last}
                                </p>
                                <button
                                    onClick={() => {
                                        dispatch(accept(user.id));
                                    }}
                                >
                                    Accept
                                </button>
                            </div>
                        );
                    })}
            </div>
            {!!friends.length && <h3>Friends</h3>}
            <div className="friends-wannabes-container">
                {friends &&
                    friends.map((user, i) => (
                        <div className="friend-wannabe" key={i}>
                            <Link to={"/other-profile/" + user.id}>
                                <img
                                    src={user.profile_pic}
                                    className="profile-pic"
                                    style={{ height: "100px", width: "100px" }}
                                ></img>
                                <p>
                                    {user.first} {user.last}
                                </p>
                                <button
                                    onClick={() => {
                                        dispatch(deleteFriend(user.id));
                                    }}
                                >
                                    Delete
                                </button>
                            </Link>
                        </div>
                    ))}
            </div>
        </>
    );
}
