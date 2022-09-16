import axios from 'axios'

const axiosInstance = axios.create({
    baseUrl: `http://localhost:9898/api/`
});

axiosInstance.interceptors.request.use((config) => {
    console.log(config);
    config.headers = config.headers || {};
    config.headers['Authorization'] = localStorage.getItem('token');
    config.headers['Content-Type'] = 'application/json';
    return config;
});

export default axiosInstance;