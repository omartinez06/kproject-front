import axiosInstance from "./AxiosInstance";

const TOKEN_BASE_RESP_API_URL = 'http://localhost:9898/api/token';

class TokenService {
    generateToken() {
        return axiosInstance.get(TOKEN_BASE_RESP_API_URL);
    }

    validateToken(token) {
        return axiosInstance.get(`${TOKEN_BASE_RESP_API_URL}/${token}`);
    }

}

export default new TokenService();