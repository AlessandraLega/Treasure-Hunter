import React from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import { getFriendsWannabes, accept, deleteFriend } from "./actions.js";

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

    console.log("wannabes", wannabes);

    return (
        <>
            <p>friend requests</p>
            {wannabes &&
                wannabes.map((user, i) => {
                    return (
                        <div className="wannabe" key={i}>
                            <img src={user.profile_pic}></img>
                            <p>
                                {user.first} {user.last}
                            </p>
                            <button onClick={dispatch(accept(user.id))}>
                                Accept
                            </button>
                        </div>
                    );
                })}
            <p>friends</p>
            {friends &&
                friends.map((user, i) => (
                    <div className="friend" key={i}>
                        <img src={user.profile_pic}></img>
                        <p>
                            {user.first} {user.last}
                        </p>
                        <button onClick={dispatch(deleteFriend(user.id))}>
                            Delete
                        </button>
                    </div>
                ))}
        </>
    );
}
