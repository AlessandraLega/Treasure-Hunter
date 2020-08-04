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
        console.log("toggle");
        this.setState({
            editOpen: !this.state.editOpen,
        });
    }
    render() {
        return (
            <>
                <h3>Bio</h3>
                {this.state.editOpen && (
                    <>
                        <textarea
                            name="bio"
                            onChange={(e) => this.handleChange(e)}
                        ></textarea>
                        <button onClick={() => this.submit()}>
                            Change bio!
                        </button>
                    </>
                )}
                {this.state.editOpen || (
                    <>
                        {this.props.bio && (
                            <>
                                <p>{this.props.bio}</p>
                                <img
                                    onClick={() => this.toggleTextArea()}
                                    src="pencil.png"
                                    alt="edit"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                    }}
                                ></img>
                            </>
                        )}

                        {this.props.bio || (
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
