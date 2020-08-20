import React, { useEffect, useState } from "react";
import axios from "./axios";

export default function SavedItems() {
    const [favs, setFavs] = useState();

    useEffect(() => {
        axios.get("/get-favs").then(({ data }) => {
            setFavs(data);
        });
    }, []);

    const changeFavs = function (itemId)
    return (<>
    <p>favs</p>
    </>);
}
