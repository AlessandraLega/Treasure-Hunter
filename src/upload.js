import React, { useState } from "react";
import axios from "./axios";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
const secrets = require("../secrets");
import { socket } from "./socket";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";

export default function Upload() {
    const [input, setInput] = useState({});
    const save = (e) => {
        if (e.target.files) {
            setInput({
                ...input,
                file: e.target.files[0],
            });
        } else {
            setInput({
                ...input,
                [e.target.name]: e.target.value,
            });
        }
    };

    /*     const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: secrets.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    }); */

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {
                lat: () => 52.522331,
                lng: () => 13.41274,
            },
            radius: 100 * 1000,
            debounce: 300,
        },
    });

    /* const convertAddress = async (address) => {
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            console.log("lat, lng :", lat, lng);
            setInput({
                ...input,
                [lat]: lat,
            });
            setInput({
                ...input,
                [lng]: lng,
            });
            console.log("input :", input);
        } catch (err) {
            console.log("error in convertAddress: ", err);
        }
    }; */

    const upload = async (e) => {
        e.preventDefault();
        let address = input.address;
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        console.log("lat, lng :", lat, lng);
        var formData = new FormData();
        console.log("input: ", input);
        formData.append("file", input.file);
        formData.append("description", input.description);
        formData.append("address", input.address);
        formData.append("lat", lat);
        formData.append("lng", lng);

        axios
            .post("/upload", formData)
            .then(function ({ data }) {
                socket.emit("newItem", {
                    newItemId: data.id,
                    description: data.description,
                });
                location.href = "/";
            })
            .catch(function (err) {
                console.log("error in post /upload: ", err);
            });
    };

    const handleSelect = (address) => {
        setValue(address, false);
        setInput({
            ...input,
            address: address,
        });
        clearSuggestions();
    };
    return (
        <div>
            <h1>Upload a treasure</h1>
            <p>picture:</p>
            <input onChange={save} type="file" name="file" accept="image/*" />
            <p>description:</p>
            <input onChange={save} type="text" name="description"></input>
            <p>address:</p>
            <Combobox onSelect={handleSelect}>
                <ComboboxInput
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    disabled={!ready}
                    placeholder="Search your location"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                            data.map(({ description, i }) => (
                                <ComboboxOption key={i} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
            <br />
            <button onClick={upload}>Upload!</button>
        </div>
    );
}
