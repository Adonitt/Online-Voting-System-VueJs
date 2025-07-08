import client from "@/helpers/client.js";
import axios from "axios";
import data from "bootstrap/js/src/dom/data.js";

class VoteService {
    async castVote(vote) {
        const response = await client.post('votes/vote', vote);
        return response.data;
    }

    async getVoteById(userId) {
        const response = await client.get(`votes/results/user/${userId}`);
        return response.data;
    }

    async getAllUsersVotes() {
        const response = await client.get("votes/results/all-users")
        // console.log(response.data)
        return response.data;
    }

    async getPartyResults() {
        const response = await client.get("votes/results/party")
        return response.data;
    }

    async getPartyResultsById(partyId) {
        const response = await client.get(`votes/results/${partyId}`);
        return response.data
    }

    async getCandidateResults(candidateId) {
        const response = await client.get(`votes/results/candidate`);
        return response.data;
    }

    async getCityVoteSummary() {
        const response = await client.get(`votes/results/city-summary`);
        return response.data
    }

    async getVotingDates() {
        const response = await client.get('/voting-dates');
        return response.data;
    }

    async createVotingDate(dates){
        const response = await client.post('voting-dates/create', dates);
        return response.data;
    }

    async updateVotingDate(id, dates){
        const response = await client.put(`voting-dates/${id}`, dates);
        return response.data;
    }

}

export default new VoteService();