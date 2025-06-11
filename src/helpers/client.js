// src/helpers/client.js

import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Import your auth store

const client = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Adjust your Spring Boot backend URL here
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

// Response Interceptor: Handle errors, e.g., 401 Unauthorized
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            authStore.logout(); // Log out if token is expired or invalid
            // Optionally, redirect to login page here using router, but be careful
            // with direct router access in interceptors. Better to handle in components.
        }
        return Promise.reject(error);
    }
);

export default client;