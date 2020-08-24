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

    const convertTime = (date) => {
        let timestamp = new Date(date);
        let now = new Date();

        let timeElapsed = now - timestamp;

        function convertMS(milliseconds) {
            var day, hour, minute, second;
            second = Math.floor(milliseconds / 1000);
            minute = Math.floor(second / 60);
            second = second % 60;
            hour = Math.floor(minute / 60);
            minute = minute % 60;
            day = Math.floor(hour / 24);
            hour = hour % 24;

            if (day > 1) {
                return `${day}days, ${hour}h ${minute}m ago`;
            } else if (day > 0) {
                return `${day}day, ${hour}h ${minute}m ago`;
            } else if (hour > 0) {
                return `${hour}h ${minute}m ago`;
            } else {
                return `${minute}m ago`;
            }
        }
        return convertMS(timeElapsed);
    };

    const setColor = (date) => {
        let timestamp = new Date(date);
        let now = new Date();
        let twoHours = 1000 * 60 * 60 * 2;
        let sixHours = 1000 * 60 * 60 * 6;
        let timeElapsed = now - timestamp;

        if (timeElapsed < twoHours) {
            return { backgroundColor: "green", color: "green" };
        } else if (timeElapsed < sixHours) {
            return { backgroundColor: "yellow", color: "yellow" };
        } else {
            return { backgroundColor: "red", color: "red" };
        }
    };

    const toggleFav = (e, id) => {
        e.preventDefault();
        let elem = document.getElementById(`${id}`);
        if (elem.classList.contains("fav")) {
            axios.post("/delete-fav", { id }).then(({ data }) => {
                if (data.success) {
                    elem.classList.remove("fav");
                }
                // if i'm in fav >> setResults
                else {
                    console.log("error");
                }
            });
            elem.classList.remove("fav");
        } else {
            axios.post("/make-it-fav", { id }).then(({ data }) => {
                if (data.success) {
                    elem.classList.add("fav");
                } else {
                    console.log("error");
                }
            });
        }
    };

    const isItFav = (itemId) => {
        axios.get("/is-it-fav/" + itemId).then(({ data }) => {
            if (data.length) {
                let elem = document.getElementById(`${itemId}`);
                elem.classList.add("fav");
            } else {
                return;
            }
        });
    };

    return (
        <div>
            <div id="single-item-container">
                <img id="single-item-img" src={item.picture_url}></img>
                <div className="single-item-content">
                    <div className="description-star">
                        <p className="description">{item.description}</p>
                        <svg
                            className="star"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                                toggleFav(e, item.id);
                            }}
                        >
                            <path
                                id={item.id}
                                className={isItFav(item.id)}
                                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
                            />
                        </svg>
                    </div>
                    <p className="address">{item.address}</p>
                    <div
                        className="circle"
                        style={setColor(item.created_at)}
                    ></div>
                    <p className="time">{convertTime(item.created_at)}</p>
                </div>
                <hr />
                <Comments id={item.id} />
            </div>
        </div>
    );
}
