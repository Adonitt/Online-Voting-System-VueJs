import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const client = axios.create({
    baseURL: 'https://online-voting-system-rest-api-5.onrender.com/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use((config) => {
    // Merr store-në në mënyrë manuale, jashtë reactive context
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default client;
