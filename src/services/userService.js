import axios from "axios";
import client from "@/helpers/client.js";

class UserService {
    async getAllUsers() {
        const response = await client.get('users');
        return response.data;
        console.log(response.data);
    }

    async getUserById(id) {
        const response = await client.get(`users/${id}`);
        return response.status === 200 ? response.data : null;
    }

    async registerUser(userData) {
        const response = await client.post('users/register', userData);
        return response.status === 200 || response.status === 201 ? response.data : null;
    }

    async forgotPassword(email) {
        try {
            const response = await client.post('users/forgot-password', {
                email: email.trim().toLowerCase()
            });

            if (response.data.success) {
                return response.data;
            }
            throw new Error(response.data.error || "Request failed");

        } catch (error) {
            throw new Error(error.response?.data?.error ||
                error.message ||
                "Failed to process your request");
        }
    }

}

export default new UserService()