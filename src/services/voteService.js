import client from "@/helpers/client.js";
import axios from "axios";

class VoteService {
    async castVote(vote) {
        const response = await client.post('votes/vote', vote);
        return response.data;
    }

    async getVoteById(userId) {
        const response = await client.get(`/votes/results/user/${userId}`);
        return response.data;
    }

}

export default new VoteService();