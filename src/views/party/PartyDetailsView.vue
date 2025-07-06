<script setup>
import AppCard from "@/components/app/AppCard.vue";
import {onMounted, ref} from "vue";
import PartyService from "@/services/partyService.js";
import {useRoute, useRouter} from "vue-router";
import {useLoading} from "@/composables/useLoading.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import CandidateService from "@/services/candidateService.js";
import AppButton from "@/components/app/AppButton.vue";
import {useAppToast} from "@/composables/useAppToast.js";
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import DataTablesBS5 from 'datatables.net-bs5'
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";
import VoteService from "@/services/voteService.js";

DataTable.use(DataTablesCore)
DataTable.use(DataTablesBS5)

const breadcrumb = [
  {label: 'Dashboard', to: '/',},
  {label: 'Parties', to: {name: 'party'},},
  {label: 'Party Details'},
]

const route = useRoute()
const router = useRouter()
const partyId = ref(route.params.id)
const authStore = useAuthStore()
const role = authStore.loggedInUser?.role


const party = ref(null)

const {isLoading, withLoading} = useLoading()

const loadPartyById = async (id) => {
  await withLoading(async () => {
    party.value = await PartyService.getPartyById(id)
    console.log("Fetched Party:", party.value);
  })
}
const {showSuccess, showDialog} = useAppToast()

const onDeleteParty = async (id) => {
  const result = await showDialog();

  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const response = await PartyService.deleteParty(id);
        await router.push({name: 'party'});
        showSuccess('Party with id ' + id + " has been deleted successfully.");
      });
    } catch (error) {
      throw error;
    }
  }
}


const getFullImageUrl = (path) => {
  // console.log("Symbol path:", path);
  if (!path || typeof path !== "string") return null;
  return "https://online-voting-system-rest-api-1-xvys.onrender.com/api/v1//" + path ;
};

console.log("Full image URL:", getFullImageUrl(party.symbol));
const deadline = ref(null)
const isBeforeDeadline = ref(true)
onMounted(async () => {
  await loadPartyById(partyId.value)

  await CandidateService.getAllCandidates()
  new DataTablesCore("#candidates", {
    pageLength: 10
  })
  const res = await VoteService.getVotingDates()
  deadline.value = new Date(res.partyCreationDeadline)

  const now = new Date()
  isBeforeDeadline.value = now <= deadline.value
})


</script>
<template>
  <bread-crumb :items="breadcrumb"/>
  <app-card>
    <div v-if="party && party.id">
      <div class="d-flex justify-content-center gap-2 mt-3">
        <router-link class="btn btn-secondary  " :to="{name:'updateParty', params:{id:route.params.id}}"
                     v-if="isBeforeDeadline && role === ROLES.ADMIN"
        >Update Party
        </router-link>

        <app-button class="btn btn-danger flex" @click="onDeleteParty(partyId)"
                    v-if="isBeforeDeadline && role === ROLES.ADMIN "
        >Delete
        </app-button>
      </div>
      <div class="page-inner">
        <div class="container" id="main-body">
          <div class="main-body">
            <div class="row gutters-sm">
              <div class="col-md-4 mb-3">
                <div class="card">
                  <div class="card-body">
                    <p class="text-center text-secondary">Party ID: {{ partyId }}</p>
                    <div class="d-flex flex-column align-items-center text-center">

                      <img
                          v-if="party.symbol"
                          :src="getFullImageUrl(party.symbol)"
                          :alt="`Image of ${party.name}`"
                          style="max-width: 300px"
                          class="rounded-circle"
                          width="200"
                          height="200"
                      />

                      <div class="mt-3 text-secondary">
                        <h4>{{ party.name + ' - ' + party.abbreviationName }} </h4>
                        <h4>Number: <b>{{ party.numberOfParty }} </b></h4>
                        <p class="text-muted font-size-sm">
                          {{ party.description }}
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
                <div class="card" v-if="role === ROLES.ADMIN">
                  <div class="card-body">
                    <p class="text-muted font-size-sm">
                      Created By: <span class="text-secondary">{{ party.createdBy }}</span>
                    </p>
                    <p class="text-muted font-size-sm">
                      Created At: <span class="text-secondary">                      {{
                        new Date(party.createdAt).toISOString().slice(0, 16).replace('T', ' ')
                      }}
</span>
                    </p>
                    <p v-if="party.updatedAt" class="text-muted font-size-sm">
                      Updated At: <span class="text-secondary">
    {{ new Date(party.updatedAt).toISOString().slice(0, 16).replace('T', ' ') }}
  </span>
                    </p>

                    <p v-if="party.updatedBy" class="text-muted font-size-sm">
                      Updated By: <span class="text-secondary">{{ party.updatedBy }}</span>

                    </p>
                  </div>
                </div>
              </div>

              <div class="col-md-8">
                <div class="card mb-5">
                  <div class="card-body">

                    <table id="candidates" class="table" v-if="party.candidates && party.candidates.length">
                      <thead>
                      <tr>
                        <th scope="col" style="width: 33%;">ID</th>
                        <th scope="col" style="width: 33%;">Candidate Number</th>
                        <th scope="col" style="width: 33%;">Candidate Name</th>
                        <th scope="col" style="width: 33%;">Nationality</th>
                        <th scope="col" style="width: 33%;">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="candidate in party.candidates" :key="candidate.id" style="font-size: 13px;">
                        <td style="padding: 2px 4px; width: 50px;">{{ candidate.id }}</td>
                        <td style="padding: 2px 4px; width: 50px;">{{ candidate.candidateNumber }}</td>
                        <td style="padding: 2px 4px; max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          {{ candidate.firstName + ' ' + candidate.lastName }}
                        </td>
                        <td style="padding: 2px 4px; max-width: 80px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          {{ candidate.nationality }}
                        </td>
                        <td style="padding: 2px 4px; width: 60px;">
                          <router-link :to="{name:'candidate-details',params:{id:candidate.id}}"
                                       class="btn btn-sm btn-outline-primary py-0 px-1" style="font-size: 11px;">Details
                          </router-link>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <p v-else>No candidates found.</p>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </app-card>
</template>

<style scoped>

</style>