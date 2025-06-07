import client from "@/helpers/client.js";

class CandidateService {
    async getAllCandidates() {
        const response = await client.get('candidates');
        console.log(response.data)
        return response.data;
    }

    async getCandidateById(id) {
        const response = await client.get(`candidates/${id}`);
        return response.data;
    }

    async createCandidate(candidateFormData) {
        const response = await client.post('candidates/create', candidateFormData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        return response.data
    }

    async updateCandidate(id, candidateToUpdate) {
        const response = await client.put(`candidates/${id}`, candidateToUpdate,{
            headers: {'Content-Type': 'multipart/form-data'}
        });
        return response.status === 200 ? response.data : null;
    }



    async deleteCandidate(id) {
        const response = await client.delete(`candidates/${id}`);
        return response.data === 204
    }

}

export default new CandidateService();