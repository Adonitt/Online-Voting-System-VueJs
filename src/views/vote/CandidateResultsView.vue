<script setup>
import {onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import VoteService from "@/services/voteService.js";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import DataTablesBS5 from "datatables.net-bs5";
import AppCard from "@/components/app/AppCard.vue";

DataTable.use(DataTablesCore);
DataTable.use(DataTablesBS5);

const users = ref([]);
const usersVote = ref([]);

const candidateResults = ref([]);


const {withLoading, isLoading} = useLoading();

const loadCandidateResults = async () => {
  candidateResults.value = await VoteService.getCandidateResults();
};


onMounted(async () => {
  await withLoading(async () => {
    await loadCandidateResults();
    new DataTablesCore("#candidates")
  });
});
</script>
<template>
  <app-card>
    <template #header>
      <h1>Candidate Vote Results</h1>

    </template>
    <div class="row mt-4">
      <div class="col-12">
        <table class="table table-striped" id="candidates">
          <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Name</th>
            <th>Party ID</th>
            <th>Party Name</th>
            <th>Votes</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="candidate in candidateResults" :key="candidate.id">
            <td>{{ candidate.candidateId }}</td>
            <td>{{ candidate.firstName }}</td>
            <td>{{ candidate.partyId }}</td>
            <td>{{ candidate.partyName }}</td>
            <td>{{ candidate.totalVotes }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </app-card>

</template>

<style scoped>

</style>