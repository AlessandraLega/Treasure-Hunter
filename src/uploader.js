/* import React from "react";
import axios from "./axios";

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
            <div id="uploader">
                <label htmlFor="file">Upload your image!</label>
                <input
                    onChange={(e) => this.save(e)}
                    type="file"
                    name="file"
                    id="file"
                    className="input-file"
                    accept="image/*"
                />
                <br />
                <button onClick={(e) => this.upload(e)}>submit</button>
            </div>
        );
    }
}
 */
