import React from "react";

export default function profilePic({
    first,
    last,
    url,
    toggleModal,
    className,
}) {
    const classNames = `${className} profile-pic`;
    const fullName = first + " " + last;
    url = url || "/user.png";
    return (
        <img
            src={url}
            alt={fullName}
            onClick={() => toggleModal()}
            className={classNames}
        ></img>
    );
}
