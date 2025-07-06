import axios from "axios";

class EnumService {
    async getNationalities() {
        const response = await axios.get('https://online-voting-system-rest-api-1-xvys.onrender.com/api/enums/nationalities')
        return response.data
    }

    async getCities() {
        const response = await axios.get('https://online-voting-system-rest-api-1-xvys.onrender.com/api/v1/api/enums/cities')
        return response.data
    }

}

export default new EnumService();