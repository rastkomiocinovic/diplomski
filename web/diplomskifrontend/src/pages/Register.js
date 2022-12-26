import { useRef } from "react";
import { Link } from "react-router-dom";
import authService from "../services/auth.service";

export default function Register() {
    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const firstnameRef = useRef(null);
    const lastnameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmRef = useRef(null);

    function validate() {
        if (emailRef.current.value == '' || usernameRef.current.value == ''
            || firstnameRef.current.value == '' || lastnameRef.current.value == ''
            || passwordRef.current.value == '' || confirmRef.current.value == '')
            return false;
        if (passwordRef.current.value != confirmRef.current.value || passwordRef.current.value.length < 8)
            return false;
        return true;
    }

    function onClickRegister() {
        if (!validate()) {
            alert("Ne valja");
            return;
        }

        authService.register(usernameRef.current.value, emailRef.current.value, firstnameRef.current.value, lastnameRef.current.value, passwordRef.current.value);
        window.location.href = "/login";
    }

    return (
        <>
            <div className="flex-1 grid grid-cols-1 gap-5 h-full w-full justify-items-center content-start ">
                <h1 className="text-5xl font-bold w-full text-center m-12">Welcome to middleman</h1>
                <label className="input-group max-w-lg w-full">
                    <span>Email</span>
                    <input type="email" placeholder="john@doe.com" className="input input-bordered w-full" ref={emailRef} />
                </label>
                <label className="input-group max-w-lg w-full">
                    <span>Username</span>
                    <input type="text" placeholder="john" className="input input-bordered w-full" ref={usernameRef} />
                </label>
                <label className="input-group max-w-lg w-full">
                    <span>First Name</span>
                    <input type="text" placeholder="John" className="input input-bordered w-full" ref={firstnameRef} />
                </label>
                <label className="input-group max-w-lg w-full">
                    <span>Last Name</span>
                    <input type="text" placeholder="Doe" className="input input-bordered w-full" ref={lastnameRef} />
                </label>
                <label className="input-group max-w-lg w-full">
                    <span>Password</span>
                    <input type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="input input-bordered w-full" ref={passwordRef} />
                </label>
                <label className="input-group max-w-lg w-full">
                    <span>Confirm Password</span>
                    <input type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="input input-bordered w-full" ref={confirmRef} />
                </label>
                <button type="button" className="btn btn-success max-w-lg w-full" onClick={onClickRegister}>Create a new account</button>
                <Link to="/login" className="link link-hover">Already have an account?</Link>
            </div>
        </>
    );
}