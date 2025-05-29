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

    async changePassword(data) {
        const response = await client.put('auth/change-password', data);
        return response.data;
    }

}

export default new UserService()