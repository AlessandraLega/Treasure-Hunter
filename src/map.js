import React, { useState } from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

//const libraries = "places";
const mapContainerStyle = {
    width: "500px",
    height: "500px",
};
const center = {
    lat: 52.52233,
    lng: 13.41274,
};

const secrets = require("../secrets");

import mapStyles from "../mapstyles";

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
};

//const geocoder = new window.google.maps.Geocoder();

export default function Map() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: secrets.REACT_APP_GOOGLE_MAPS_API_KEY,
        //libraries,
    });
    const [markers, setMarkers] = useState([{ lat: 52.522331, lng: 13.41274 }]);
    const [selected, setSelected] = React.useState(null);

    const onMapClick = React.useCallback((e) => {
        setMarkers((current) => [
            ...current,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                time: new Date(),
            },
        ]);
    }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    /*     const geocoder = new window.google.maps.Geocoder();
    const getCoordinates = async (address) => {
        let coordinates = await geocoder.geocode(
            { address: address },
            function (results, status) {
                return results;
            }
        );
        console.log(coordinates);
    };

    getCoordinates("Warthestrasse 8 Berlin"); */

    /*   const translateAddress = async (address) => {
        const geocode = await getGeocode(address);
        console.log("geocode :", geocode);
        return geocode;
    };

    translateAddress("Warthestrasse 8 berlin"); */
    /* const geocodeAddress = (geocoder, resultsMap) => {
        const address = document.getElementById("address").value;
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === "OK") {
                resultsMap.setCenter(results[0].geometry.location);
                new window.google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location,
                }); 
            } else {
                alert(
                    "Geocode was not successful for the following reason: " +
                        status
                );
            }
        });
    }; */
    const handleSelect = async (address) => {
        // setValue(addr, false);
        // clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            console.log("lat,lng :", lat, lng);
            console.log("results[0] :", results[0]);
        } catch (err) {
            console.log("error in handleSelect: ", err);
        }
    };
    handleSelect("warthestrasse 8 berlin");
    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={center}
                mapStyles={mapStyles}
                options={options}
                onClick={onMapClick}
            >
                {markers &&
                    markers.map((marker, i) => (
                        <Marker
                            key={i}
                            position={{ lat: marker.lat, lng: marker.lng }}
                        />
                    ))}
            </GoogleMap>
        </div>
    );
}
