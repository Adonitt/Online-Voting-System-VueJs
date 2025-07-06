import client from "@/helpers/client.js";
import axios from "axios";

class UserService {
    async getAllUsers() {
        try {
            const response = await client.get('/users');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch all users:", error.response?.data || error.message);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const response = await client.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch user by ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }

    async updateUser(id, userData) {
        try {
            const response = await client.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update user with ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const response = await client.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to delete user with ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }

    async registerUser(userData) {
        const response = await client.post('/users/register', userData);
        return response.status === 200 || response.status === 201 ? response.data : null;
    }

    async changePassword(data) {
        const response = await client.put('/auth/change-password', data);
        return response.data;
    }

    async forgotPassword(email) {
        try {
            const response = await client.post('/users/forgot-password', {
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

    async getAllCitizens() {
        const response = await axios.get("https://online-voting-system-rest-api-1-xvys.onrender.com/rks/suffrages")
        return response.data;
    }

}

export default new UserService();