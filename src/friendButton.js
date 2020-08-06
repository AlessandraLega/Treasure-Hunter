import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FriendButton({ otherId }) {
    const [button, setButton] = useState();
    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/friendship/" + otherId);
            if (data.friendship == "none") {
                setButton("ask friendship");
            } else if (data.accepted) {
                setButton("delete friend");
            } else {
                if (data.sender_id == data.myId) {
                    setButton("cancel request");
                } else {
                    setButton("accept request");
                }
            }
        })();
    }, []);

    const handleButton = () => {
        axios
            .post("/update-friendship", {
                button, // ES6 for {button: button},
                otherId,
            })
            .then(() => {
                if (button == "ask friendship") {
                    setButton("cancel request");
                } else if (button == "cancel request") {
                    //delete row
                    setButton("ask friendship");
                } else if (button == "accept request") {
                    //set to true
                    setButton("delete friend");
                } else if (button == "delete friend") {
                    //delete row (reuse from above)
                    setButton("ask friendship");
                }
            })
            .catch((err) => {
                console.log("error in post /update-friendship: ", err);
            });
    };

    return <button onClick={handleButton}>{button}!</button>;
}
