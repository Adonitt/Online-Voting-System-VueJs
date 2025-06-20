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

    async getAllUsersVotes() {
        const response = await client.get("votes/results/all-users")
        // console.log(response.data)
        return response.data;
    }

    async getPartyResults() {
        const response = await client.get("/votes/results/party")
        return response.data;
    }

    async getPartyResultsById(partyId) {
        const response = await client.get(`/votes/results/${partyId}`);
        return response.data
    }

    async getCandidateResults(candidateId) {
        const response = await client.get(`/votes/results/candidate`);
        return response.data;
    }

    async getCityVoteSummary() {
        const response = await client.get(`/votes/results/city-summary`);
        return response.data
    }

    async getVotingDates() {
        const response = await client.get('/votes/voting-days');
        return response.data;
    }

}

export default new VoteService();