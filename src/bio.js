import React from "react";
import axios from "axios";

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editOpen: false,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        let self = this;
        axios
            .post("/bio", { bio: this.state.bio })
            .then((response) => {
                self.props.updateBio(response.data.bio);
                self.toggleTextArea();
            })
            .catch((err) => {
                console.log("error in post/bio: ", err);
            });
    }
    toggleTextArea() {
        this.setState({
            editOpen: !this.state.editOpen,
        });
    }
    render() {
        return (
            <>
                {this.state.editOpen && (
                    <>
                        <h3>Bio</h3>
                        <textarea
                            name="bio"
                            onChange={(e) => this.handleChange(e)}
                            defaultValue={this.props.bio}
                        ></textarea>
                        <button onClick={() => this.submit()}>
                            Change bio!
                        </button>
                    </>
                )}
                {!this.state.editOpen && (
                    <>
                        {this.props.bio && (
                            <>
                                <h3 className="inline">Bio</h3>
                                <img
                                    id="edit"
                                    onClick={() => this.toggleTextArea()}
                                    src="pencil.png"
                                    alt="edit bio"
                                ></img>
                                <p>{this.props.bio}</p>
                            </>
                        )}
                        {!this.props.bio && (
                            <>
                                <button onClick={() => this.toggleTextArea()}>
                                    Add Bio!
                                </button>
                            </>
                        )}
                    </>
                )}
            </>
        );
    }
}
