import React from "react";
import axios from "axios";
//import { Link } from "react-router-dom";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import otherProfile from "./otherProfile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./otherProfile";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
        };
        this.updateImage = this.updateImage.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    async componentDidMount() {
        await axios
            .get("/user")
            .then(({ data }) => {
                for (const prop in data) {
                    this.setState({ [prop]: data[prop] }, () =>
                        console.log("this.state :", this.state)
                    );
                }
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
        console.log("updateImage was fired!", url);
        this.setState({
            profile_pic: url,
        });
    }
    updateBio(newBio) {
        console.log("updateBio was fired!", newBio);
        this.setState({
            bio: newBio,
        });
    }
    render() {
        return (
            <BrowserRouter>
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
                    <Uploader updateImage={this.updateImage} />
                )}
                <Route
                    exact
                    path="/"
                    render={() => {
                        return (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                url={this.state.profile_pic}
                                bio={this.state.bio}
                                updateBio={this.updateBio}
                                toggleModal={() => {
                                    this.toggleModal();
                                }}
                            />
                        );
                    }}
                />
                <Route path="/other-profile/" component={OtherProfile} />
            </BrowserRouter>
        );
    }
}
