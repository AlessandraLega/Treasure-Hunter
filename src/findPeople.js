import React, { useState, useEffect } from "react";
import axios from "axios";

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

    console.log({ people });

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        let abort;
        (async () => {
            if (search) {
                try {
                    const response = await axios.get(`/search/${search}`);
                    console.log("reseponse :", response);
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
            <input name="search" type="text" onChange={handleChange}></input>
            {people.map((person, i) => {
                return (
                    <div key={i}>
                        <img className="avatar" src={person.profile_pic}></img>
                        <p>
                            {person.first} {person.last}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
