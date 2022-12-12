import { useState, useRef } from "react";
import { createMemoryRouter, Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { useEffect } from "react";


import AuthService from "../services/auth.service";
import authService from "../services/auth.service";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "mapbox-gl-geocoder";
import userService from "../services/user.service";



mapboxgl.accessToken = 'pk.eyJ1IjoibWFwb2hvbGljYXIiLCJhIjoiY2w5YjZmMG84MG1wZDN1bXpoaGFxMXo4MiJ9.6OPYbFGtqfDA6jBm1HrrQQ';

export default function Profile() {
    const addressRef = useRef(null);
    const cityRef = useRef(null);
    const countryRef = useRef(null);
    const phoneRef = useRef(null);
    const pictureRef = useRef(null);
    const pictureInput = useRef(null);
    const isSellerRef = useRef(null);
    const bioRef = useRef(null);
    const [location, setLocation] = useState(null);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const geocoderContainer = useRef(null);
    const geocoder = useRef(null);
    const bioInput = useRef(null);
    const [lng, setLng] = useState(10);
    const [lat, setLat] = useState(30);
    const [zoom, setZoom] = useState(1.9);
    const [isSeller, setIsSeller] = useState(false);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        geocoder.current = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            marker: new mapboxgl.Marker({
                color: 'orange'
            }),
            type: 'Feature',
            mapboxgl: mapboxgl
        });
        map.current.addControl(geocoder.current);
        // geocoderContainer.current.appendChild(geocoder.current.onAdd(map.current));
        map.current['scrollZoom'].disable();
        map.current['boxZoom'].disable();
        map.current['dragRotate'].disable();
        map.current['dragPan'].disable();
        map.current['keyboard'].disable();
        map.current['doubleClickZoom'].disable();
        map.current['touchZoomRotate'].disable();
    });

    useEffect(() => {
        try {
            userService.getUserDetails(authService.getCurrentUser().username).then(details => {
                addressRef.current.value = details.data.address;
                cityRef.current.value = details.data.city;
                countryRef.current.value = details.data.country;
                phoneRef.current.value = details.data.phone;
                setIsSeller(details.data.isSeller);
                bioInput.current.disabled = !details.data.isSeller;
                bioInput.current.value = details.data.bio;
                pictureRef.current.src = details.data.profilePicture;
                geocoder.current.setInput(details.data.location);
                setLocation(details.data.location);
                map.current.setZoom(details.data.zoom);
                map.current.setCenter({ lng: details.data.lng, lat: details.data.lat });
                //geocoder.current.setInput('New York')._geocode('New York');
                // console.log(geocoder.current._typeahead.selected.place_name);
            });
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    function onChangeSeller() {
        setIsSeller(!isSeller);
        bioInput.current.disabled = isSeller;
    }

    function onClickProfilePicture() {
        pictureInput.current.click();
    }

    function handlePictureChange(event) {
        let file = event.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onloadend = function () {
            pictureRef.current.src = reader.result;
        }
        reader.readAsDataURL(file);
    }

    function handleSaveChanges() {
        let details = {
            username: authService.getCurrentUser().username,
            address: addressRef.current.value,
            city: cityRef.current.value,
            country: countryRef.current.value,
            phone: phoneRef.current.value,
            lng: map.current.getCenter().lng,
            lat: map.current.getCenter().lat,
            zoom: map.current.getZoom(),
            bio: bioInput.current.value,
            isSeller: isSeller,
            profilePicture: pictureRef.current.src
        }
        //geocoder.current.setInput('New York')._geocode('New York');
        // console.log(geocoder.current._typeahead.selected.place_name);
        if (geocoder.current._typeahead.selected != null) {
            details.location = geocoder.current._typeahead.selected.place_name;
        } else {
            details.location = location;
        }

        userService.updateUserDetails(details);
    }

    return (
        <>
            <div className="grid grid-cols-3 h-full w-full justify-items-center pt-10" >
                <div className="col-span-3 mb-32 pb-16">
                    <div className="grid grid-cols-2 gap-2 justify-items-center h-0">
                        <div className="w-36 h-36 avatar btn btn-ghost btn-circle" onClick={onClickProfilePicture}>
                            <div className="m-2 rounded-full">
                                <img ref={pictureRef} src={require('../resources/avatar.webp')} />
                            </div>
                        </div>
                        <input type="file" ref={pictureInput} onChange={handlePictureChange} accept="image/*" className="hidden" />
                        <h1 className="my-auto"><div className="font-bold text-4xl">{authService.getCurrentUser().username}</div><div className=" text-3xl">Rastko Miocinovic</div></h1>
                    </div>
                </div>
                {/* <div className="h-full w-2/3 col-span-2 mask mask-squircle">
                    <div ref={mapContainer} className="map-container h-full" />
                </div>
                <div ref={geocoderContainer} className="col-span-2" /> */}
                <div className="h-3/4 w-2/3 row-span-2 col-span-1 justify-items-center mb-20 pb-32">
                    <h1 className="text-xl font-bold">Aproximate Location:</h1>
                    <div className="h-full w-full justify-items-center mt-12">
                        <div ref={mapContainer} className="map-container h-full" />
                    </div>
                    <div ref={geocoderContainer} className="text-center w-1/3 ml-80" />
                </div>
                <div className="justify-items-start text-start w-full row-span-2">
                    <h1 className="text-xl font-bold pb-10">Shipping Information:</h1>
                    <div className="form-control w-full max-w-full pr-36">
                        <label className="label">
                            <span className="label-text ">Address:</span>
                        </label>
                        <input className="textarea input-bordered" ref={addressRef} placeholder=""></input>
                    </div>
                    <div className="form-control w-full max-w-full pr-36">
                        <label className="label">
                            <span className="label-text ">City:</span>
                        </label>
                        <input className="textarea input-bordered" ref={cityRef} placeholder=""></input>
                    </div>
                    <div className="form-control w-full max-w-full pr-36">
                        <label className="label">
                            <span className="label-text ">Country:</span>
                        </label>
                        <input className="textarea input-bordered" ref={countryRef} placeholder=""></input>
                    </div>
                    <div className="form-control w-full max-w-full pr-36">
                        <label className="label">
                            <span className="label-text ">Phone:</span>
                        </label>
                        <input className="textarea input-bordered" ref={phoneRef} placeholder=""></input>
                    </div>
                </div>
                <div className="justify-items-start text-start w-full row-span-2">
                    <h1 className="text-xl font-bold pb-10">Seller Description:</h1>
                    <div className="form-control w-52">
                        <label className="cursor-pointer label">
                            <span className="label-text font-bold text-lg">I am a seller</span>
                            <input type="checkbox" className="toggle toggle-accent" onChange={onChangeSeller} value={isSeller} checked={isSeller} />
                        </label>
                    </div>
                    <div className="form-control w-full max-w-full pr-40 h-2/3">
                        <label className="cursor-pointer label">
                            <span>Bio:</span>
                        </label>
                        <textarea ref={bioInput} className="textarea input-bordered h-2/4" placeholder="Bio" disabled></textarea>
                    </div>
                </div>
                <div className="col-span-3">
                    <label htmlFor="modal-save" className="btn btn-success">save changes</label>
                </div>
                <div />
            </div>
            <input type="checkbox" id="modal-save" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure?</h3>
                    <p className="mt-2">Changes will be published as soon as you save them!</p>
                    <div className="modal-action">
                        <label htmlFor="modal-save" className="btn btn-success" onClick={handleSaveChanges}>Save Changes</label>
                        <label htmlFor="modal-save" className="btn">Cancel</label>
                    </div>
                </div>
            </div>
        </>
    );
}

