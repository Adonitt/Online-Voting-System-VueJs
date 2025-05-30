import client from "@/helpers/client.js";

class CandidateService {
    async getAllCandidates() {
        const response = await client.get('candidates');
        console.log(response.data)
        return response.data;
    }
}

export default new CandidateService();