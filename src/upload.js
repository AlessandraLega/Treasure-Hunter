import React, { useState } from "react";
import axios from "./axios";

export default function Upload() {
    const [input, setInput] = useState({});
    const save = (e) => {
        // console.log("e.target.files :", e.target.files);
        // console.log("e.target.value :", e.target.value);
        if (e.target.files) {
            console.log("i'm in save > file");
            setInput({
                ...input,
                file: e.target.files[0],
            });
        } else {
            setInput({
                ...input,
                [e.target.name]: e.target.value,
            });
        }
    };
    const upload = (e) => {
        e.preventDefault();
        var formData = new FormData();
        console.log(input);
        formData.append("file", input.file);
        formData.append("description", input.description);
        formData.append("address", input.address);

        axios
            .post("/upload", formData)
            .then(function (resp) {
                location.href = "/";
            })
            .catch(function (err) {
                console.log("error in post /upload: ", err);
            });
    };
    return (
        <div>
            <h1>Upload a treasure</h1>
            <p>picture:</p>
            <input onChange={save} type="file" name="file" accept="image/*" />
            <p>description:</p>
            <input onChange={save} type="text" name="description"></input>
            <p>address:</p>
            <input onChange={save} type="text" name="address"></input>
            <button onClick={upload}>Upload!</button>
        </div>
    );
}
