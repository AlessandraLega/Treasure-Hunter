import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [people, setPeople] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/newUsers");
                setPeople(data);
            } catch (err) {
                console.log("error in get /newUsers: ", err);
            }
        })();
    }, []);

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        let abort;
        (async () => {
            if (search) {
                try {
                    const response = await axios.get(`/search/${search}`);
                    setPeople(response.data);
                    if (!abort) {
                        setPeople(response.data);
                    }
                } catch (err) {
                    console.log("error in get /search: ", err);
                }
            } else {
                return;
            }
        })();
        return () => {
            abort = true;
        };
    }, [search]);

    return (
        <div>
            <div id="find-people-input">
                <p>Find new friends!</p>
                <input
                    name="search"
                    type="text"
                    onChange={handleChange}
                ></input>
            </div>
            <div id="find-people-container">
                {people.map((person, i) => {
                    return (
                        <div key={i} className="find-people">
                            <Link to={"/other-profile/" + person.id}>
                                <img
                                    className="profile-pic"
                                    src={person.profile_pic}
                                    style={{ height: "100px", width: "100px" }}
                                ></img>
                                <p>
                                    {person.first} {person.last}
                                </p>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
