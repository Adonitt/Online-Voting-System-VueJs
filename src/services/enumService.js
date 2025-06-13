import axios from "axios";

class EnumService {
    async getNationalities() {
        const response = await axios.get('http://localhost:8080/api/enums/nationalities')
        return response.data
    }

    async getCities() {
        const response = await axios.get('http://localhost:8080/api/enums/cities')
        return response.data
    }

}

export default new EnumService();