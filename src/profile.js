import React from "react";
import ProfilePic from "./profilePic";
import Bio from "./bio";
import Wall from "./wall";

export default function Profile(props) {
    const { id, first, last, url, bio, updateBio, toggleModal } = props;
    // console.log("id in profile :", id);
    return (
        <div className="profile-container">
            <div id="profile">
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
            </div>
            <div id="wall">
                <Wall id={id} />
            </div>
        </div>
    );
}
