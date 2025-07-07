import axios from 'axios';
import {useAuthStore} from '@/stores/authStore';

const client = axios.create({
    baseURL: 'https://online-voting-system-rest-api-xw5q.onrender.com/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default client;
