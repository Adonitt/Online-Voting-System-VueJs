// src/helpers/client.js

import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Import your auth store

const client = axios.create({
    baseURL: 'https://online-voting-system-rest-api-5.onrender.com', // Adjust your Spring Boot backend URL here
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add the JWT token to every outgoing request
client.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore(); // Get a fresh instance of the store
        const token = authStore.token; // Access the token from the store

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

client.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore(); // ❌ Problem këtu
        const token = authStore.token;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;