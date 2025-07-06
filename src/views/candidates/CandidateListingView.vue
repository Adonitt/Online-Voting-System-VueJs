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
  return "https://online-voting-system-rest-api-1-xvys.onrender.com/api/v1/" + path;
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

  <bread-crumb :items="breadcrumb"/>
  <app-card>
    <template #header>
      <h1>Candidates</h1>
    </template>

    <div class="alert alert-warning text-center mx-3" v-if="role === ROLES.ADMIN">
      The deadline for creating or updating parties is on ({{ deadline?.toLocaleDateString() }}).
    </div>

    <div class="d-flex justify-content-end m-3 " v-if="role === ROLES.ADMIN && isBeforeDeadline">
      <router-link :to="{name:'create-candidate'}" class="btn btn-secondary">Add Candidate</router-link>
    </div>

    <div class="text-center" v-if="isLoading">
      <app-spinner :isLoading="isLoading"/>
    </div>
    <table v-else id="candidates" class="table table-striped table-bordered">
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
        <td>
          <router-link :to="{name:'candidate-details', params:{id:candidate.id}}"
                       class="btn btn-icon btn-round btn-info me-2">
            <i class="fas fa-info-circle m-2"></i>
          </router-link>

          <router-link :to="{name:'edit-candidate',params:{id:candidate.id}}"
                       v-if="role === ROLES.ADMIN && isBeforeDeadline"
                       class="btn btn-icon btn-round btn-warning me-2">
            <i class="fas fa-edit m-2"></i>
          </router-link>

          <app-button class="btn btn-icon btn-round btn-danger" @click="onDeleteCandidate(candidate.id)"
                      v-if="role === ROLES.ADMIN && isBeforeDeadline">
            <i class="fas fa-trash m-2"></i>
          </app-button>

        </td>
      </tr>
      </tbody>
    </table>

  </app-card>
</template>

<style scoped>

</style>