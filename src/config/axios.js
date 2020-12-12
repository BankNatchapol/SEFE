import axios from 'axios';
import localStorageService from '../services/localStorageService';
import { notification } from 'antd';

axios.defaults.baseURL = "https://peaceful-island-81313.herokuapp.com";

axios.interceptors.request.use(
    config => {
        if (config.url.includes("/login") || config.url.includes("/register")) return config;

        const token = localStorageService.getToken();

        if (token){
            config.headers["Authorization"] = `Bearer ${token}`
        }

        return config;
    },
    err => {
        Promise.reject(err);
    }
)

axios.interceptors.response.use(
    response => {
        return response;
    },
    err => {
        if (err.response?.status === 401){
            localStorageService.removeToken();
            window.location.reload();
            notification.error({
                message: "Please login again."
            });
            return Promise.reject(err);
        }
        return Promise.reject(err);
    }
)
export default axios;