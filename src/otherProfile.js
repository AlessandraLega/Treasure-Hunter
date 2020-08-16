import React from "react";
import axios from "./axios";
import FriendButton from "./friendButton";
import Wall from "./wall";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            friends: false,
        };
    }
    async componentDidMount() {
        const { id } = this.props.match.params;
        axios.get("/other-user/" + id).then(({ data }) => {
            if (data.sameUser) {
                this.props.history.push("/");
            } else if (!data) {
                this.setState({ error: true });
            } else {
                this.setState({ error: false });
                for (const prop in data) {
                    this.setState({ [prop]: data[prop] });
                }
                this.state.profile_pic = this.state.profile_pic || "/user.png";
                axios.get("/friendship/" + id).then(({ data }) => {
                    if (data.accepted) {
                        this.setState({ friends: true });
                    }
                });
            }
        });
    }
    render() {
        return (
            <div id="profile-container">
                {this.state.error && <p>this user does not exist!</p>}
                <div id="profile">
                    <h2>
                        {this.state.first} {this.state.last}
                    </h2>
                    <img
                        style={{ height: "200px", width: "200px" }}
                        src={this.state.profile_pic}
                        alt={this.state.first}
                        className="profile-pic"
                    ></img>
                    <p>{this.state.bio}</p>
                    <FriendButton otherId={this.props.match.params.id} />
                </div>

                <div id="wall">
                    {this.state.friends && (
                        <Wall id={this.props.match.params.id} />
                    )}
                </div>
            </div>
        );
    }
}
