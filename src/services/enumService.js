import axios from "axios";

class EnumService {
    async getNationalities() {
        const response = await axios.get('http://localhost:8080/api/enums/nationalities') // ✅ use full URL
        return response.data
    }
}

export default new EnumService();