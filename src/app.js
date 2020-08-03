import React from "react";
import axios from "axios";
//import { Link } from "react-router-dom";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
        };
    }
    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                for (const prop in data) {
                    this.setState({ [prop]: data[prop] });
                }
                console.log(this.state.first);
            })
            .catch((err) => {
                console.log("error in get user: ", err);
            });
    }
    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    updateImage(url) {
        this.setState({
            profile_pic: url,
        });
    }
    render() {
        return (
            <React.Fragment>
                <p>the logo will be here!</p>
                <img src="./logo.png" alt="logo"></img>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    url={this.state.profile_pic}
                    toggleModal={() => {
                        this.toggleModal();
                    }}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        updateImage={() => {
                            this.updateImage();
                        }}
                    />
                )}
                <p>Welcome back {this.state.first}!</p>
                <h3>Bio</h3>
                <p>{this.state.bio}</p>
                <p>I am in app!</p>
            </React.Fragment>
        );
    }
}
