import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/auth.service";
import userService from "../services/user.service";

function UserWidget() {
    const [src, setSrc] = useState(require('../resources/avatar.webp'));

    useEffect(() => {
        if (authService.getCurrentUser() == null)
            return;
        userService.getUserDetails(authService.getCurrentUser().username).then(details => {
            if (details.data.profilePicture != null) {
                setSrc(details.data.profilePicture);
            }
        });
    }, [])

    return (
        <>
            {
                !authService.getCurrentUser() &&
                <Link to="/login" className="btn btn-ghost">
                    Login
                </Link>
            }
            {
                authService.getCurrentUser() &&
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost avatar">
                        <div className="w-10 rounded-full">
                            <img src={src} />
                        </div>
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-3">
                        <li><Link className="btn btn-ghost" to="/profile">{authService.getCurrentUser().username}</Link></li>
                        <li><button className="btn btn-ghost" onClick={authService.logout}>Logout</button></li>
                    </ul>
                </div>


            }
        </>
    );
}

export default UserWidget;