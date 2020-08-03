import React from "react";

export default function profilePic({ first, last, url, toggleModal }) {
    const fullName = first + " " + last;
    url = url || "/user.png";
    return (
        <img
            style={{ height: "50px", width: "50px" }}
            src={url}
            alt={fullName}
            onClick={() => toggleModal()}
        ></img>
    );
}
