import axiosInstance from "./AxiosInstance";

const TOKEN_BASE_RESP_API_URL = 'http://localhost:9898/api/token';

class TokenService {
    generateToken() {
        return axiosInstance.get(`${TOKEN_BASE_RESP_API_URL}/generate`);
    }

    validateToken(token) {
        return axiosInstance.get(`${TOKEN_BASE_RESP_API_URL}/${token}`);
    }

    saveTokenInfo(token) {
        return axiosInstance.post(`${TOKEN_BASE_RESP_API_URL}`, token);
    }

    isAvailableEvent() {
        return axiosInstance.get(`${TOKEN_BASE_RESP_API_URL}/available`);
    }

    getTokenInfo() {
        return axiosInstance.get(`${TOKEN_BASE_RESP_API_URL}`);
    }

}

export default new TokenService();