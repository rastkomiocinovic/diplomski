import { React } from "react";
import { useRef, useState, useEffect } from "react";

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import userService from "../services/user.service";
import authService from "../services/auth.service";

function SellerCard({ details }) {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(10);
    const [lat, setLat] = useState(30);
    const [zoom, setZoom] = useState(1.9);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [details.lng, details.lat],
            zoom: details.zoom
        });
        map.current['scrollZoom'].disable();
        map.current['boxZoom'].disable();
        map.current['dragRotate'].disable();
        map.current['dragPan'].disable();
        map.current['keyboard'].disable();
        map.current['doubleClickZoom'].disable();
        map.current['touchZoomRotate'].disable();
    });

    const onClickGetInTouch = () => {
        userService.addContact(details).then(() => {
            document.location.href = "/messages";
        });
    }

    return (
        <div className="card w-96 bg-base-100 shadow-xl grid col-span-12 md:col-span-6 lg:col-span-4 2xl:col-span-3">
            <div ref={mapContainer} className="map-container h-44 w-full" />
            <div className="card-body">
                <h2 className="card-title"><span className="w-12"><img className="mask mask-circle" src={details.profilePicture != null ? details.profilePicture : require('../resources/avatar.webp')} /></span> {details.firstname} {details.lastname}</h2>
                <p>{details.bio}</p>
                <div className="card-actions justify-end">
                    {authService.getCurrentUser() != null && <button className="btn btn-primary" onClick={onClickGetInTouch}>Get in touch</button>}
                </div>
            </div>
        </div>
    );
}

export default SellerCard;