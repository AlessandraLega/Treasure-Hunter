import React from "react";
import axios from "axios";
import ProfilePic from "./profilePic";
import Bio from "./bio";
import FriendButton from "./friendButton";

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
            } else {
                console.log("data:", data);
                for (const prop in data) {
                    this.setState({ [prop]: data[prop] });
                }
            }
        });
    }
    render() {
        return (
            <>
                {this.state.error && <p>this user doesn't exist!</p>}

                <p>
                    {this.state.first} {this.state.last}
                </p>
                <img
                    style={{ height: "50px", width: "50px" }}
                    src={this.state.profile_pic}
                    alt={this.state.first}
                ></img>
                <p>{this.state.bio}</p>
                <FriendButton otherId={this.props.match.params.id} />
            </>
        );
    }
}
