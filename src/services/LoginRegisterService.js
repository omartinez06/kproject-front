import axios from 'axios'

const AUTH_BASE_RESP_API_URL = 'http://localhost:9898/api/authentication';

class LoginRegisterService {

    createGym(gym) {
        return axios.post(`${AUTH_BASE_RESP_API_URL}/create`, gym);
    }

    login(login) {
        return axios.post(`${AUTH_BASE_RESP_API_URL}/auth`, login);
    }
}

export default new LoginRegisterService();