import React from "react";
import ProfilePic from "./profilePic";
import Bio from "./bio";

export default function Profile({ first, last, url, bio, updateBio }) {
    return (
        <React.Fragment>
            <p>
                {first} {last}
            </p>
            <ProfilePic first={first} last={last} url={url} />
            <Bio bio={bio} updateBio={updateBio} />
        </React.Fragment>
    );
}
