import React, { useState, useEffect } from "react";
import useStateWithCallback from "use-state-with-callback";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function SavedSearches() {
    const [results, setResults] = useStateWithCallback([], () => {
        axios.post("/reset-notifications-search").then(({ data }) => {
            for (let i = 0; i < data.length; i++) {
                document
                    .getElementById(`div-${data[i].search}`)
                    .classList.add("new");
            }
        });
    });

    let [newItems, setNewItems] = useState({});
    useEffect(() => {
        console.log("newItems in effect:", newItems);
        axios.get("/saved-searches").then((response) => {
            if (response.data.length) {
                setResults(response.data);
                response.data.forEach((search) => {
                    axios
                        .get(`/get-last-three/${search.search}`)
                        .then(({ data }) => {
                            setNewItems((newItems) => {
                                return { ...newItems, [search.search]: data };
                            });
                        });
                });
            } else {
                setResults([]);
            }
        });
    }, []);

    const remove = (item, e) => {
        e.preventDefault();
        axios.post("/remove-from-search", { item }).then((response) => {
            if (response.data.length) {
                setResults(response.data);
            } else {
                setResults([]);
            }
        });
    };
    return (
        <div id="container-saved-searches">
            {!!results.length &&
                results.map((search, i) => {
                    let description = search.search;
                    return (
                        <div
                            key={i}
                            id={`div-${search.search}`}
                            className="single-search"
                        >
                            <div className="search-button">
                                <Link to={`/search/${search.search}`}>
                                    <p>{search.search}</p>
                                </Link>
                                <button
                                    onClick={(e) => {
                                        remove(search.search, e);
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="last-three-container">
                                {!!newItems &&
                                    !!newItems &&
                                    !!newItems[search.search] &&
                                    !!newItems[search.search].length &&
                                    newItems[search.search].map((item, j) => {
                                        return (
                                            <Link
                                                to={`/item/${item.id}`}
                                                key={j}
                                            >
                                                <img
                                                    className="last-three-item"
                                                    src={item.picture_url}
                                                ></img>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    );
                })}
            {!results.length && <p>You did not save any searches!</p>}
        </div>
    );
}
