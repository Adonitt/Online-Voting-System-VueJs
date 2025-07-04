<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import UserService from "@/services/userService.js";
import VoteService from "@/services/voteService.js";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import DataTablesBS5 from "datatables.net-bs5";
import PartyChart from "@/components/shared/PartyChart.vue";
import {useEnumStore} from "@/stores/enumStore.js";

DataTable.use(DataTablesCore);
DataTable.use(DataTablesBS5);

const users = ref([]);
const usersVote = ref([]);
const partyResults = ref([]);
const cityVoteSummary = ref([]);
const selectedCity = ref("");

const {withLoading} = useLoading();
const enumStore = useEnumStore();

const votingDay = ref(null)


const loadUsers = async () => {
  users.value = await UserService.getAllUsers();
};

const loadUserVotes = async () => {
  usersVote.value = await VoteService.getAllUsersVotes();
};

const loadPartyResults = async () => {
  partyResults.value = await VoteService.getPartyResults();
};

const loadCityVoteSummary = async () => {
  cityVoteSummary.value = await VoteService.getCityVoteSummary();
  if (!selectedCity.value && cityVoteSummary.value.length) {
    selectedCity.value = cityVoteSummary.value[0].city;
  }
};

/* Computed */
const userCount = computed(() => users.value.length);
const userVoteCount = computed(() => usersVote.value.length);
const votedPercentageFormatted = computed(() => {
  if (userCount.value === 0) return "0.00%";
  return ((userVoteCount.value / userCount.value) * 100).toFixed(2) + "%";
});

const cityOptions = computed(() =>
    [...new Set(cityVoteSummary.value.map(r => r.city))]
);

const cityPartyRows = computed(() => {
  if (!selectedCity.value) return [];

  return cityVoteSummary.value
      .filter(r => r.city === selectedCity.value)
      .map(r => ({
        ...r,
        count: Number(r.totalVotes) || 0,
        percentage: Number(r.percentage) || 0
      }));
});


const cityChartData = computed(() => {
  if (!cityPartyRows.value.length) {
    return {
      labels: [],
      datasets: []
    };
  }

  return {
    labels: cityPartyRows.value.map(r => r.partyName),
    datasets: [{
      label: `Votes in ${selectedCity.value}`,
      data: cityPartyRows.value.map(r => r.count),
      backgroundColor: cityPartyRows.value.map(() =>
          `hsl(${Math.random() * 360},70%,70%)`)
    }]
  };
});

const cityChartOptions = computed(() => ({
  responsive: true,
  plugins: {
    legend: {position: 'bottom'},
    title: {
      display: true,
      text: `Votes in – ${selectedCity.value || '—'}`
    }
  }
}));

const partyChartData = computed(() => ({
  labels: partyResults.value.map(party => party.name),
  datasets: [{
    label: 'Total Votes ',
    backgroundColor: '#4e73df',
    data: partyResults.value.map(p => p.totalVotes)
  }, {
    label: 'Percentage',
    backgroundColor: '#1cc88a',
    data: partyResults.value.map(p => p.percentage)
  }]
}));

const partyChartOptions = computed(() => ({
  responsive: true,
  plugins: {
    legend: {display: false},
    title: {display: true, text: 'Votes per Party'}
  }
}));


onMounted(async () => {
  await withLoading(async () => {
    await Promise.all([
      enumStore.loadCities(),
      loadUsers(),
      loadUserVotes(),
      loadPartyResults(),
      loadCityVoteSummary()
    ]);
    new DataTablesCore("#parties");
    const res = await VoteService.getVotingDates()
    votingDay.value = res.votingDay
  });
});

const daysLeft = computed(() => {
  const today = new Date();
  const voteDate = new Date(votingDay.value);
  const diffTime = voteDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

</script>

<template>
  <div class="page-inner container py-4">

    <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
      <h3 class="fw-bold mb-3 mb-md-0">Dashboard</h3>
    </div>

    <div class="alert alert-warning mt-3" v-if="daysLeft > 0">
      🗓️ <strong>{{ daysLeft }}</strong> day<span v-if="daysLeft > 1">s</span> left until voting day!
      Voting day is on: <b> {{ votingDay }}</b>
    </div>

    <div class="alert alert-success mt-3" v-else-if="daysLeft === 0">
      🗳️ <strong>Today is the voting day! </strong>
      <b> {{ votingDay }}</b>
    </div>

    <div class="alert alert-secondary mt-3" v-else>
      🕓 Voting day has passed.
      Voting day was on: <b> {{ votingDay }}</b>
    </div>

    <div class="row g-3 mb-4">
      <div
          v-for="(label, idx) in ['Registered Users', 'Users That Have Voted', 'Voted Percentage']"
          :key="idx"
          class="col-12 col-sm-6 col-md-4"
      >
        <div class="card shadow-sm rounded-3 h-100">
          <div class="card-body d-flex align-items-center">
            <div
                :class="[
                'icon-big d-flex justify-content-center align-items-center rounded-circle me-3',
                ['bg-primary', 'bg-info', 'bg-success'][idx],
                'text-white'
              ]"
                style="width: 55px; height: 55px; font-size: 1.75rem;"
            >
              <i :class="['fas fa-users', 'fas fa-user-check', 'fas fa-percentage'][idx]"></i>
            </div>
            <div>
              <p class="mb-1 text-muted small">{{ label }}</p>
              <h4 class="mb-0 fw-semibold">
                {{
                  idx === 0
                      ? userCount
                      : idx === 1
                          ? userVoteCount
                          : votedPercentageFormatted
                }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="daysLeft <= 0">
      <hr/>
      <div class="row mb-5">
        <div class="col-12 col-md-8 mx-auto">
          <h4 class="mb-3 text-center text-md-start">Party Results (Global)</h4>
          <div class="chart-container p-3 border rounded shadow-sm bg-white">
            <PartyChart :data="partyChartData" :options="partyChartOptions"/>
          </div>
        </div>
      </div>

      <!-- City Vote Summary -->
      <div class="row">
        <div class="col-12 d-flex align-items-center mb-3">
          <label for="citySelect" class="form-label me-3 mb-0 fw-semibold">Select City:</label>
          <select
              id="citySelect"
              class="form-select w-auto"
              v-model="selectedCity"
              aria-label="Select city"
          >
            <option v-for="c in cityOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <!-- City Chart -->
        <div class="col-12 col-lg-8 mb-4">
          <div class="chart-container p-3 border rounded shadow-sm bg-white">
            <PartyChart
                :key="selectedCity"
                :data="cityChartData"
                :options="cityChartOptions"
            />
          </div>
        </div>

        <!-- City Party Table -->
        <div class="col-12 col-lg-4">
          <div class="table-responsive shadow-sm rounded border bg-white p-3">
            <table class="table table-striped table-hover align-middle mb-0">
              <thead class="table-light">
              <tr>
                <th scope="col">Party</th>
                <th scope="col">Votes</th>
                <th scope="col">%</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in cityPartyRows" :key="row.partyName">
                <td>{{ row.partyName }}</td>
                <td>{{ row.count }}</td>
                <td>{{ row.percentage.toFixed(2) }}%</td>
              </tr>
              <tr v-if="cityPartyRows.length === 0">
                <td colspan="3" class="text-center text-muted">No data for selected city</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.card-stats {
  cursor: default;
}

</style>
