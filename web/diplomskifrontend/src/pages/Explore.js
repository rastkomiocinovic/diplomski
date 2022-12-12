import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";
import userService from "../services/user.service";
import SellerCard from "../components/SellerCard";

export default function Explore() {

    const [sellers, setSellers] = useState([]);
    const searchInput = useRef(null);

    useEffect(() => {
        try {
            userService.getUserDetailsByLocation('').then(res => {
                setSellers(res.data);
            });
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    function handleSearch() {
        try {
            userService.getUserDetailsByLocation(searchInput.current.value).then(res => {
                setSellers(res.data);
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <>
            <div className="grid grid-cols-12 gap-5 w-full justify-items-center content-start pb-24" >
                <div className="col-span-12 input-group mt-14 justify-center mb-10">
                    <input type="text" placeholder="Search…" className="input input-bordered w-80" ref={searchInput} />
                    <button className="btn btn-square" onClick={handleSearch} >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>

                {sellers.map((details) => {
                    return <SellerCard details={details} />
                })}
            </div>
        </>
    );
}

