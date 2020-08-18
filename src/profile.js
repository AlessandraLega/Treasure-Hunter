/* import React from "react";
import ProfilePic from "./profilePic";
import Bio from "./bio";
import Wall from "./wall";

export default function Profile(props) {
    const { id, first, last, url, bio, updateBio, toggleModal } = props;
    // console.log("id in profile :", id);
    return (
        <div id="profile-container">
            <div id="profile">
                <h2>
                    {first} {last}
                </h2>
                <ProfilePic
                    first={first}
                    last={last}
                    url={url}
                    toggleModal={toggleModal}
                    className="bigPic"
                />
                <Bio bio={bio} updateBio={updateBio} />
            </div>
            <div id="wall">
                <Wall id={id} />
            </div>
        </div>
    );
}
 */
