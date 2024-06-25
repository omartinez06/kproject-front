import axios from 'axios';

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

axiosInstance.interceptors.response.use((config) => {
    console.log(config);
    return config;
}, error => {
    console.log(error)
    if(error.response.status === 401){
        localStorage.removeItem('token');
        window.location = "/";
    }
    return Promise.reject(error);
});

export default axiosInstance;