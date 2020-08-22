import React, { useEffect, useState } from "react";
import axios from "./axios";
import Comments from "./comments";

export default function Item(props) {
    const itemId = props.match.params.id;
    const [item, setItem] = useState({});
    useEffect(() => {
        if (itemId) {
            (async () => {
                const { data } = await axios.get("/get-item/" + itemId);
                setItem(data);
            })();
        }
    }, [itemId]);
    console.log("item: ", item);
    return (
        <div>
            <img
                src={item.picture_url}
                style={{ width: 200, height: 200 }}
            ></img>
            <p>{item.description}</p>
            <p>{item.address}</p>
            <Comments id={item.id} />
        </div>
    );
}
