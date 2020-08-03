import React from "react";
import axios from "axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    save(e) {
        this.setState({
            file: e.target.files[0],
        });
    }
    upload(e) {
        let self = this;
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(function (resp) {
                console.log("it worked:", resp.data.profile_pic);
                self.props.updateImage(resp.data.profile_pic);
            })
            .catch(function (err) {
                console.log("error in post /upload: ", err);
            });
    }
    render() {
        return (
            <div
                style={{
                    position: "fixed",
                    top: "30px",
                    left: "30%",
                    width: "40%",
                    backgroundColor: "teal",
                }}
            >
                <p>Upload your image!</p>
                <input
                    onChange={(e) => this.save(e)}
                    type="file"
                    name="file"
                    accept="image/*"
                />
                <button onClick={(e) => this.upload(e)}>submit</button>
            </div>
        );
    }
}
