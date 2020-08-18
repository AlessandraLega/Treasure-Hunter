import React, { useEffect, useState } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Item from "./item";

export default function Results({ search }) {
    const [results, setResults] = useState([]);
    useEffect(() => {
        (async () => {
            if (search == "") {
                const lastItems = await axios.get("/last-items");
                setResults(lastItems.data);
            } else {
                const response = await axios.get("/get-search/" + search);
                setResults(response.data);
            }
        })();
    }, [search]);
    return (
        <div>
            <h1>results</h1>
            {!!results.length &&
                results.map((item, i) => {
                    return (
                        <Link to={`/item/${item.id}`} key={i}>
                            <div>
                                <img
                                    src={item.picture_url}
                                    style={{ height: 150, width: 150 }}
                                ></img>
                                <p>{item.description}</p>
                                <p>{item.address}</p>
                            </div>
                        </Link>
                    );
                })}
        </div>
    );
}
