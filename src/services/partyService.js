import client from "@/helpers/client.js";

class PartyService {
    async getAllParties() {
        const response = await client.get('parties');
        // console.log(response.data)
        return response.data;
    }

    async getPartyById(id) {
        const response = await client.get(`parties/${id}`);
        return response.data;
    }

    async createParty(partyFormData) {
        const response = await client.post('parties/create', partyFormData, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
        return response.data;
    }

    async updateParty(id, partyToUpdate) {
        const response = await client.put(`parties/${id}`, partyToUpdate, {
            headers: {'Content-Type': 'multipart/form-data'}
        })

        console.log("party updated successfully")
        return response.data === 200 ? response.data : null;
    }

    async deleteParty(id) {
        const response = await client.delete(`parties/${id}`);
        return response.data === 204
    }

}

export default new PartyService();