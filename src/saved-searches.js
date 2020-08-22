import React, { useState, useEffect } from "react";
import useStateWithCallback from "use-state-with-callback";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function SavedSearches() {
    const [results, setResults] = useStateWithCallback([], () => {
        axios.post("/reset-notifications-search").then(({ data }) => {
            console.log("data :", data);
            for (let i = 0; i < data.length; i++) {
                document
                    .getElementById(`div-${data[i].search}`)
                    .classList.add("new");
            }
        });
    });

    useEffect(() => {
        axios.get("/saved-searches").then((response) => {
            if (response.data.length) {
                setResults(response.data);
            } else {
                setResults([]);
            }
        });
    }, []);

    const remove = (item, e) => {
        e.preventDefault();
        console.log("remove running");
        axios.post("/remove-from-search", { item }).then((response) => {
            if (response.data.length) {
                setResults(response.data);
            } else {
                setResults([]);
            }
            //location.href = "/my-searches";
        });
    };
    return (
        <div>
            {!!results.length &&
                results.map((search, i) => {
                    return (
                        <div key={i} id={`div-${search.search}`}>
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
                    );
                })}
            {!results.length && <p>You did not save any searches!</p>}
        </div>
    );
}
