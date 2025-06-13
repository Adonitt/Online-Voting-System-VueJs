import client from "@/helpers/client.js";

class UserService {
    // Modified to target the correct backend API endpoint relative to the client.js baseURL
    async getAllUsers() {
        try {
            // Your backend endpoint is /api/v1/users
            // Since client.js has baseURL: 'http://localhost:8080/api/v1',
            // we just need the remainder of the path: '/users' or 'users'
            const response = await client.get('/users');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch all users:", error.response?.data || error.message);
            throw error; // Re-throw to handle in the component
        }
    }

    async getUserById(id) {
        try {
            // This correctly appends to /api/v1/users
            const response = await client.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch user by ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }

    async updateUser(id, userData) {
        try {
            // This correctly appends to /api/v1/users
            const response = await client.put(`/users/${id}`, userData);
            return response.data; // Return the updated user data
        } catch (error) {
            console.error(`Failed to update user with ID ${id}:`, error.response?.data || error.message);
            throw error; // Re-throw to handle in the component
        }
    }

    // New: Method to delete a user
    async deleteUser(id) {
        try {
            // This correctly sends an HTTP DELETE request to /api/v1/users/{id}
            const response = await client.delete(`/users/${id}`);
            return response.data; // You might return a success message or confirmation
        } catch (error) {
            console.error(`Failed to delete user with ID ${id}:`, error.response?.data || error.message);
            throw error; // Re-throw to handle in the component
        }
    }

    async registerUser(userData) {
        // This correctly appends to /api/v1/users/register
        const response = await client.post('/users/register', userData);
        return response.status === 200 || response.status === 201 ? response.data : null;
    }

    async changePassword(data) {
        // This correctly appends to /api/v1/auth/change-password
        const response = await client.put('/auth/change-password', data);
        return response.data;
    }

    async forgotPassword(email) {
        try {
            // This correctly appends to /api/v1/users/forgot-password
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
}

export default new UserService();