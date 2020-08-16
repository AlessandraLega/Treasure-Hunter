import React from "react";
import axios from "./axios";
//import { Link } from "react-router-dom";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import Friends from "./friends";
import Chat from "./chat";

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
                    this.setState({ [prop]: data[prop] });
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
                <header>
                    <nav>
                        <Link to={"/findPeople"}>
                            <span className="nav-link">find Friends</span>
                        </Link>
                        <span> | </span>
                        <Link to={"/friends"}>
                            <span className="nav-link">my Friends</span>
                        </Link>
                        <span> | </span>
                        <Link to={"/"}>
                            <span className="nav-link">my Profile</span>
                        </Link>
                        <span> | </span>
                        <Link to={"/chat"}>
                            <span className="nav-link">Chat</span>
                        </Link>
                        <span> | </span>
                        <a id="logout" href="/logout">
                            Log out
                        </a>
                    </nav>
                    <img src="/heart.png" alt="logo" id="logo" />
                    <h1 id="title">Compliments</h1>
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        url={this.state.profile_pic}
                        toggleModal={() => {
                            this.toggleModal();
                        }}
                        className="avatar"
                    />
                </header>
                <div className="container">
                    {this.state.uploaderIsVisible && (
                        <Uploader updateImage={this.updateImage} />
                    )}
                    <Route
                        exact
                        path="/"
                        render={() => {
                            return (
                                <Profile
                                    id={this.state.id}
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
                    <Route path="/other-profile/:id" component={OtherProfile} />
                    <Route path="/findPeople" component={FindPeople} />
                    <Route path="/friends" component={Friends} />
                    <Route path="/chat" component={Chat} />
                </div>
            </BrowserRouter>
        );
    }
}
