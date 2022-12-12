
import React from 'react';
import { Outlet } from "react-router-dom";

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import NavBar from '../components/NavBar';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwb2hvbGljYXIiLCJhIjoiY2w5YjZmMG84MG1wZDN1bXpoaGFxMXo4MiJ9.6OPYbFGtqfDA6jBm1HrrQQ';

function Layout() {

    return (
        <div className="flex flex-col h-screen bg-base-100">
            <NavBar className="flex h-32 w-4/5"></NavBar>
            <div className="flex-1 h-full">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
