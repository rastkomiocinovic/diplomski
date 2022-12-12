import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

export default function Login() {
    const [state, setState] = useState({
        username: "",
        password: "",
        loading: false,
        error: false,
        message: ""
    });
    const [checkBtn, setCheckBtn] = useState();

    function onChangeUsername(e) {
        setState({
            ...state,
            username: e.target.value
        });
    }

    function onChangePassword(e) {
        setState({
            ...state,
            password: e.target.value
        });
    }

    function validateState() {
        return state.username.length > 0 && state.password.length > 0;
    }

    function handleLogin(e) {
        e.preventDefault();

        setState({
            ...state,
            message: "",
            loading: true
        });

        if (validateState()) {
            AuthService.login(state.username, state.password).then(
                () => {
                    window.location.href = "/";
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setState({
                        loading: false,
                        error: true,
                        message: resMessage
                    });
                }
            );
        } else {
            setState({
                ...state,
                loading: false
            });
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-5 h-full w-full justify-items-center content-start" onSubmit={handleLogin}>
                <h1 className="text-5xl font-bold w-full text-center m-12">Welcome to middleman</h1>
                <input type="text" placeholder="username" className="input input-bordered input-md max-w-lg w-full" value={state.username} onChange={onChangeUsername} />
                <input type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="input input-bordered input-md max-w-lg w-full" value={state.password} onChange={onChangePassword} />
                <div className={state.error ? "alert alert-error shadow-lg max-w-lg" : "hidden"}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Username or password are not correct!</span>
                    </div>
                </div>
                <button type="button" className="btn btn-success max-w-lg w-full" onClick={handleLogin}>Login</button>
                <Link to="/register" className="link link-hover">Don't have an account?</Link>
            </div>
        </>
    );
}

