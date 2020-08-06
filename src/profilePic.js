import React from "react";

export default function profilePic({
    first,
    last,
    url,
    toggleModal,
    className,
}) {
    const fullName = first + " " + last;
    url = url || "/user.png";
    return (
        <img
            id="profile-pic"
            src={url}
            alt={fullName}
            onClick={() => toggleModal()}
            className={className}
        ></img>
    );
}
