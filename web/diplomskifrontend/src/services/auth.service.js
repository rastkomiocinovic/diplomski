import axios from "axios";


const API_URL = "http://localhost:8080/api/auth/";

class AuthService {

    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
        window.location.href = "/";
    }

    register(username, email, firstname, lastname, password) {
        return axios.post(API_URL + "signup", {
            username,
            firstname,
            lastname,
            email,
            password
        });
    }
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();