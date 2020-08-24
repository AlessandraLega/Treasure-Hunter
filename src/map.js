import React, { useState, useEffect } from "react";
import axios from "./axios";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import { Link } from "react-router-dom";

//const libraries = "places";
const mapContainerStyle = {
    width: "550px",
    height: "500px",
};
const center = {
    lat: 52.52233,
    lng: 13.41274,
};

import mapStyles from "../mapstyles";

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
};

//const geocoder = new window.google.maps.Geocoder();

export default function Map() {
    /* const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: secrets.REACT_APP_GOOGLE_MAPS_API_KEY,
    }); */
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        axios.get("/get-all").then(({ data }) => {
            console.log("data fr :", data);
            setMarkers(data);
        });
    }, []);

    console.log("selected :", selected);

    return (
        <div>
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={center}
                mapStyles={mapStyles}
                options={options}
                //  onClick={onMapClick}
            >
                {markers &&
                    markers.map((marker, i) => (
                        <Marker
                            key={i}
                            position={{
                                lat: Number(marker.lat),
                                lng: Number(marker.lng),
                            }}
                            onClick={() => {
                                setSelected(marker);
                            }}
                            icon={{
                                url: `/box.png`,
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(15, 15),
                                scaledSize: new window.google.maps.Size(30, 30),
                            }}
                        />
                    ))}
                {selected ? (
                    <InfoWindow
                        position={{
                            lat: Number(selected.lat),
                            lng: Number(selected.lng),
                        }}
                        onCloseClick={() => {
                            setSelected(null);
                        }}
                    >
                        <Link to={`/item/${selected.id}`} key={selected.id}>
                            <div>
                                <img
                                    src={selected.picture_url}
                                    style={{ width: "150px", height: "150px" }}
                                />
                                <p>{selected.description}</p>
                                <p>{selected.address}</p>
                            </div>
                        </Link>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    );
}
