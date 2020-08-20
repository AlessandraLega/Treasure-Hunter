import React, { useState, useEffect } from "react";
import axios from "./axios";
import Results from "./results";
import Map from "./map";

export default function Home(props) {
    const item = props.match.params.search;

    useEffect(() => {
        if (item) {
            setSearch(item);
        }
    }, []);

    const [search, setSearch] = useState("");
    const [searchSaved, setSearchSaved] = useState(false);
    const [error, setError] = useState(false);
    const [searching, setSearching] = useState(false);

    const handleChange = (e) => {
        setSearchSaved(false);
        setSearch(e.target.value);
        setSearching(true);
        console.log(e.target.value);
    };
    const saveSearch = () => {
        axios.post("/save-search", { search: search }).then((response) => {
            if (response.data.success) {
                setSearchSaved(true);
            } else {
                setError(true);
            }
        });
    };
    return (
        <div id="main-container">
            <p>What treasure are you looking for?</p>
            <input
                type="text"
                name="search"
                autoComplete="off"
                onChange={handleChange}
            />
            <Map />
            {!searchSaved && searching && (
                <button onClick={saveSearch}>Save this search</button>
            )}
            {error && (
                <p className="error">
                    we could not save your search, please try again!
                </p>
            )}
            {searchSaved && <p>Search succesfully saved</p>}
            <Results search={search} />
        </div>
    );
}
