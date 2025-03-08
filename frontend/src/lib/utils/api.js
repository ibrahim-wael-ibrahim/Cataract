import axios from 'axios';

// src/lib/utils/api.js
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        "Content-Type": "application/json"
    }
});

// Add request interceptor
api.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config},
    error => {
        return Promise.reject(error);
    }
);

export default api;