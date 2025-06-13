<script setup>
import AppCard from "@/components/app/AppCard.vue";
import {ref, onMounted} from "vue";
import VoteService from "@/services/voteService.js";
import {useLoading} from "@/composables/useLoading.js";
import {useAppToast} from "@/composables/useAppToast.js";
import DataTablesCore from "datatables.net";

const {withLoading, isLoading} = useLoading();
const toast = useAppToast();

const userVotes = ref([]);

const loadUserVotes = async () => {
  await withLoading(async () => {
    try {
      userVotes.value = await VoteService.getAllUsersVotes(); // ⬅ correct call
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load votes");
    }
  });
};

onMounted(async () => {
  await loadUserVotes();
  new DataTablesCore("#users")
});
</script>

<template>
  <app-card>
    <template #header>
      <h1>All User Votes</h1>
    </template>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <!-- No data -->
    <div v-else-if="userVotes.length === 0" class="alert alert-info">
      No votes found.
    </div>

    <!-- Votes table -->
    <div v-else class="table-responsive">
      <table class="table table-striped align-middle" id="users">
        <thead class="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">User&nbsp;ID</th>
          <th scope="col">User&nbsp;Name</th>
          <th scope="col">Party&nbsp;ID</th>
          <th scope="col">Party&nbsp;Name</th>
          <th scope="col">Candidates</th>
          <th scope="col">Timestamp</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(vote, idx) in userVotes" :key="idx">
          <th scope="row">{{ idx + 1 }}</th>
          <td>{{ vote.userId }}</td>
          <td>{{ vote.user }}</td>
          <td>{{ vote.partyId }}</td>
          <td>{{ vote.party }}</td>
          <td>
            <ul class="mb-0 ps-3">
              <li v-for="name in vote.candidateNames" :key="name">{{ name }}</li>
            </ul>
          </td>
          <td>{{ new Date(vote.voteTimestamp).toLocaleString() }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </app-card>
</template>

<style scoped>
td ul {
  max-width: 220px;
  white-space: normal;
  word-break: break-word;
}
</style>
