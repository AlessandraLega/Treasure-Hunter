import React from "react";
import ProfilePic from "./profilePic";
import Bio from "./bio";

export default function Profile(props) {
    const { first, last, url, bio, updateBio, toggleModal } = props;
    return (
        <React.Fragment>
            <ProfilePic
                first={first}
                last={last}
                url={url}
                toggleModal={toggleModal}
                className="bigPic"
            />
            <p>
                {first} {last}
            </p>
            <Bio bio={bio} updateBio={updateBio} />
        </React.Fragment>
    );
}
