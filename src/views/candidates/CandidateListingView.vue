<script setup>

import AppCard from "@/components/app/AppCard.vue";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useLoading} from "@/composables/useLoading";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import DataTablesBS5 from "datatables.net-bs5";
import {computed, onMounted, ref} from "vue";
import CandidateService from "@/services/candidateService";
import AppSpinner from "@/components/app/AppSpinner.vue";
import AppButton from "@/components/app/AppButton.vue";
import {useAppToast} from "@/composables/useAppToast.js";
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";
import {usePartyStore} from "@/stores/partyStore.js";
import VoteService from "@/services/voteService.js";

DataTable.use(DataTablesCore);
DataTable.use(DataTablesBS5);
const breadcrumb = [
  {label: 'Dashboard', to: '/'},
  {label: 'Candidates'},
]

const authStore = useAuthStore()
const role = authStore.loggedInUser?.role
const {isLoading, withLoading} = useLoading()

const candidates = ref([])

const getFullImageUrl = (path) => {
  // console.log("Symbol path:", path);
  if (!path || typeof path !== "string") return null;
  return "https://online-voting-system-rest-api-xw5q.onrender.com/" + path;
};

const loadCandidates = async () => {
  await withLoading(async () =>
      candidates.value = await CandidateService.getAllCandidates());
  console.log(candidates.value)
}

const {showDialog, showSuccess} = useAppToast()
const onDeleteCandidate = async (id) => {
  const result = await showDialog();

  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const res = await CandidateService.deleteCandidate(id);
        showSuccess("Candidate with id: " + id + " deleted Succesfully!");
        await loadCandidates();
      })
    } catch (error) {
      throw error
    }
  }

}

const deadline = ref(null)
const isBeforeDeadline = ref(true)

onMounted(async () => {
  await loadCandidates()
  const res = await VoteService.getVotingDates()
  deadline.value = new Date(res.partyCreationDeadline)

  const now = new Date()
  isBeforeDeadline.value = now <= deadline.value

  new DataTablesCore("#candidates")
})

</script>
<template>
  <bread-crumb :items="breadcrumb" />

  <app-card>
    <!-- Header -->
    <template #header>
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 class="mb-0">Candidates</h1>
        <router-link
            v-if="role === ROLES.ADMIN && isBeforeDeadline"
            :to="{ name: 'create-candidate' }"
            class="btn btn-secondary"
        >
          Add Candidate
        </router-link>
      </div>
    </template>

    <!-- Deadline Alert -->
    <div
        class="alert alert-warning text-center mx-3"
        v-if="role === ROLES.ADMIN"
    >
      The deadline for creating or updating parties is on
      ({{ deadline?.toLocaleDateString() }}).
    </div>

    <!-- Spinner -->
    <div class="text-center my-4" v-if="isLoading">
      <app-spinner :isLoading="isLoading" />
    </div>

    <!-- Table -->
    <div class="table-responsive" v-else>
      <table id="candidates" class="table table-striped table-bordered">
        <thead>
        <tr>
          <th>#</th>
          <th>Candidate Number</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Party</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="candidate in candidates" :key="candidate.id">
          <td>{{ candidate.id }}</td>
          <td>{{ candidate.candidateNumber }}</td>
          <td>{{ candidate.firstName }}</td>
          <td>{{ candidate.lastName }}</td>
          <td>{{ candidate.party }}</td>
          <td class="d-flex flex-wrap gap-2">
            <router-link
                :to="{ name: 'candidate-details', params: { id: candidate.id } }"
                class="btn btn-icon btn-round btn-info"
            >
              <i class="fas fa-info-circle m-1"></i>
            </router-link>

            <router-link
                v-if="role === ROLES.ADMIN && isBeforeDeadline"
                :to="{ name: 'edit-candidate', params: { id: candidate.id } }"
                class="btn btn-icon btn-round btn-warning"
            >
              <i class="fas fa-edit m-1"></i>
            </router-link>

            <app-button
                v-if="role === ROLES.ADMIN && isBeforeDeadline"
                class="btn btn-icon btn-round btn-danger"
                @click="onDeleteCandidate(candidate.id)"
            >
              <i class="fas fa-trash m-1"></i>
            </app-button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </app-card>
</template>


<style scoped>

</style>