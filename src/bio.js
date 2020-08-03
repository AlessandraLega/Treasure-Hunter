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
                console.log(response.data.bio);
                self.props.updateBio(response.data.bio);
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
            <React.Fragment>
                <p>{this.state.bio}</p>
                <img
                    onClick={() => this.toggleTextArea()}
                    src="pencil.png"
                    alt="edit"
                ></img>
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
            </React.Fragment>
        );
    }
}
