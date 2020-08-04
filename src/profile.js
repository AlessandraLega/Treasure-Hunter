import React from "react";
import ProfilePic from "./profilePic";
import Bio from "./bio";

export default function Profile(props) {
    console.log("props in Profile: ", props);
    const { first, last, url, bio, updateBio, toggleModal } = props;
    return (
        <React.Fragment>
            <p>
                {first} {last}
            </p>
            <ProfilePic
                first={first}
                last={last}
                url={url}
                toggleModal={toggleModal}
            />
            <Bio bio={bio} updateBio={updateBio} />
        </React.Fragment>
    );
}
