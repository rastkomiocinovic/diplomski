import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/auth.service";
import UserWidget from "./UserWidget";

function NavBar() {
  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
      </div>
      <div className="navbar-center">
        <Link to="" className="btn btn-ghost normal-case text-xl font-mono">middleman</Link>
      </div>
      <div className="navbar-end">
        <Link to="/explore" className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </Link>
        {authService.getCurrentUser() != null && <Link to="/messages" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
        </Link>}
        <UserWidget />
      </div>
    </div>
  );
}

export default NavBar;