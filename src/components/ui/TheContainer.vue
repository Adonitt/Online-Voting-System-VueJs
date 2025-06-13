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
    new DataTablesCore("#parties")
  });
});
</script>

<template>
  <div class="page-inner">
    <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
      <div>
        <h3 class="fw-bold mb-3">Dashboard</h3>
      </div>
    </div>

    <div class="row">
      <!-- Registered Users -->
      <div class="col-sm-6 col-md-3">
        <div class="card card-stats card-round">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-icon">
                <div class="icon-big text-center icon-primary bubble-shadow-small">
                  <i class="fas fa-users"></i>
                </div>
              </div>
              <div class="col col-stats ms-3 ms-sm-0">
                <div class="numbers">
                  <p class="card-category">Registered Users</p>
                  <h4 class="card-title">{{ userCount }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users That Voted -->
      <div class="col-sm-6 col-md-3">
        <div class="card card-stats card-round">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-icon">
                <div class="icon-big text-center icon-info bubble-shadow-small">
                  <i class="fas fa-user-check"></i>
                </div>
              </div>
              <div class="col col-stats ms-3 ms-sm-0">
                <div class="numbers">
                  <p class="card-category">Users That Have Voted</p>
                  <h4 class="card-title">{{ userVoteCount }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Voted Percentage -->
      <div class="col-sm-6 col-md-3">
        <div class="card card-stats card-round">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-icon">
                <div class="icon-big text-center icon-success bubble-shadow-small">
                  <i class="fas fa-percentage"></i>
                </div>
              </div>
              <div class="col col-stats ms-3 ms-sm-0">
                <div class="numbers">
                  <p class="card-category">Voted Percentage</p>
                  <h4 class="card-title">{{ votedPercentageFormatted }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr>
    <div class="row mt-4">
      <div class="col-12">
        <h4>Party Vote Results</h4>
        <table class="table table-striped" id="parties">
          <thead>
          <tr>
            <th>Party ID</th>
            <th>Party Name</th>
            <th>Votes</th>
            <th>Percentage</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="party in partyResults" :key="party.id">
            <td>{{ party.partyId }}</td>
            <td>{{ party.name }}</td>
            <td>{{ party.totalVotes }}</td>
            <td>{{ party.percentage.toFixed(2) }}%</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<style scoped>
.card-stats {
  cursor: default;
}
</style>
