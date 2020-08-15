import React from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";
import Bio from "./bio";
import FriendButton from "./friendButton";
import Wall from "./wall";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }
    async componentDidMount() {
        const { id } = this.props.match.params;
        await axios.get("/other-user/" + id).then(({ data }) => {
            if (data.sameUser) {
                this.props.history.push("/");
            } else if (!data) {
                this.setState({ error: true });
            } else {
                this.setState({ error: false });
                for (const prop in data) {
                    this.setState({ [prop]: data[prop] });
                }
            }
        });
    }
    render() {
        return (
            <div className="profile-container">
                {this.state.error && <p>this user doesn't exist!</p>}
                <div id="profile">
                    <p>
                        {this.state.first} {this.state.last}
                    </p>
                    <img
                        style={{ height: "200px", width: "200px" }}
                        src={this.state.profile_pic}
                        alt={this.state.first}
                        className="profile-pic"
                    ></img>
                    <p>{this.state.bio}</p>
                    {/* if not friend */}
                    <FriendButton otherId={this.props.match.params.id} />
                </div>
                {/* if friend */}
                <div id="wall">
                    <Wall id={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}
