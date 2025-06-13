<script setup>
import {computed, onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import UserService from "@/services/userService.js";
import VoteService from "@/services/voteService.js";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import DataTablesBS5 from "datatables.net-bs5";

DataTable.use(DataTablesCore);
DataTable.use(DataTablesBS5);
const users = ref([]);
const usersVote = ref([]);

const partyResults = ref([]);
const candidateResults = ref([]);
const cityVoteSummary = ref([]);

const {withLoading, isLoading} = useLoading();

const loadUsers = async () => {
  users.value = await UserService.getAllUsers();
};

const loadUserVotes = async () => {
  usersVote.value = await VoteService.getAllUsersVotes();
};

const loadPartyResults = async () => {
  partyResults.value = await VoteService.getPartyResults();
};

const loadCandidateResults = async () => {
  candidateResults.value = await VoteService.getCandidateResults();
};

const loadCityVoteSummary = async () => {
  cityVoteSummary.value = await VoteService.getCityVoteSummary();
};

const userCount = computed(() => users.value.length);
const userVoteCount = computed(() => usersVote.value.length);

const votedPercentage = computed(() => {
  if (userCount.value === 0) return 0;
  return (userVoteCount.value / userCount.value) * 100;
});
const votedPercentageFormatted = computed(() => votedPercentage.value.toFixed(2) + "%");

onMounted(async () => {
  await withLoading(async () => {
    await loadUsers();
    await loadUserVotes();
    await loadPartyResults();
    await loadCandidateResults();
    await loadCityVoteSummary();
    new DataTablesCore("#city")
  });
});
</script>



<template>
  <div class="row mt-4">
    <div class="col-12">
      <h4>City Vote Summary</h4>
      <table class="table table-striped" id="city">
        <thead>
        <tr>
          <th>City</th>
          <th>Party Name</th>
          <th>Votes</th>
          <th>Percentage</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="summary in cityVoteSummary"
            :key="summary.city + '-' + summary.partyName"
        >
          <td>{{ summary.city }}</td>
          <td>{{ summary.partyName }}</td>
          <td>{{ summary.totalVotes }}</td>
          <td>{{ summary.percentage.toFixed(2) }}%</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
