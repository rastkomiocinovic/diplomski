import axios from 'axios';
import authHeader from './auth-header';
import authService from './auth.service';

const USER_API_URL = 'http://localhost:8080/user/';

class UserService {
    getUserDetails(username) {
        return axios.get(USER_API_URL + username, { headers: authHeader() });
    }

    updateUserDetails(details) {
        return axios.put(USER_API_URL + authService.getCurrentUser().username, details, { headers: authHeader() });
    }

    getUserDetailsByLocation(location) {
        return axios.get(USER_API_URL + 'location/' + location, { headers: authHeader() });
    }

    getContacts() {
        return axios.get(USER_API_URL + authService.getCurrentUser().username + '/contacts', { headers: authHeader() });
    }

    addContact(user) {
        return axios.put(USER_API_URL + authService.getCurrentUser().username + '/contacts', user, { headers: authHeader() });
    }
}

export default new UserService();
