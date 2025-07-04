import axios from "axios";

class EnumService {
    async getNationalities() {
        const response = await axios.get('https://online-voting-system-rest-api-5.onrender.com/nationalities')
        return response.data
    }

    async getCities() {
        const response = await axios.get('https://online-voting-system-rest-api-5.onrender.com/api/enums/cities')
        return response.data
    }

}

export default new EnumService();