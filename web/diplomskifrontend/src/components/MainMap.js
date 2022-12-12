import { React } from "react";
import { useRef, useState, useEffect } from "react";

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import userService from "../services/user.service";
import authHeader from "../services/auth-header";
import authService from "../services/auth.service";

function MainMap() {

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
            center: [lng, lat],
            zoom: zoom
        });

        userService.getUserDetailsByLocation('').then(details => {
            console.log(details.data);
            for (let detail of details.data) {
                // Create a DOM element for each marker.
                const el = document.createElement('img');
                el.className = 'marker mask mask-circle hover:w-20 w-16 cursor-pointer';
                el.src = detail.profilePicture != null ? detail.profilePicture : require('../resources/avatar.webp');
                el.onclick = () => {
                    if (authService.getCurrentUser() == null)
                        document.location.href = "/login";
                    userService.addContact(detail).then(() => {
                        document.location.href = "/messages";
                    });
                };
                // Add markers to the map.
                new mapboxgl.Marker(el)
                    .setLngLat({ lat: detail.lat, lng: detail.lng })
                    .addTo(map.current);
            }
        });

    });

    return (
        <div className="flex-1 h-full">
            <div ref={mapContainer} className="map-container h-full" />
        </div>
    );
}

export default MainMap;