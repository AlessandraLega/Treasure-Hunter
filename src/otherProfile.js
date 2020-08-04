import React from "react";
import axios from "axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        const { id } = this.props.match.params;
        console.log("this.props :", this.props);
        await axios.get("/other-user/" + id).then((response) => {
            console.log("response.data: ", response.data);
        });
    }
    render() {
        return (
            <>
                <p>other profile</p>
            </>
        );
    }
}
