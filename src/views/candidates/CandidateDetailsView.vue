<script setup>
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import DataTablesBS5 from 'datatables.net-bs5'
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import AppInput from "@/components/app/AppInput.vue";
import AppCard from "@/components/app/AppCard.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import CandidateService from "@/services/candidateService.js";
import {useAppToast} from "@/composables/useAppToast.js";
import AppButton from "@/components/app/AppButton.vue";
import {usePartyStore} from "@/stores/partyStore.js";
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";
import VoteService from "@/services/voteService.js";

DataTable.use(DataTablesCore)
DataTable.use(DataTablesBS5)

const breadcrumb = [
  {label: 'Dashboard', to: '/',},
  {label: 'Candidates', to: {name: 'candidates'},},
  {label: 'Candidate Details'},
]

const partyStore = usePartyStore()
const authStore = useAuthStore()
const role = authStore.loggedInUser?.role
const route = useRoute()
const router = useRouter()
const candidateId = ref(route.params.id)

const candidate = ref(null)
const {isLoading, withLoading} = useLoading()


const loadCandidateById = async (id) => {
  await withLoading(async () => {
    candidate.value = await CandidateService.getCandidateById(id)
  })
}

const {showSuccess, showDialog} = useAppToast()

// Helper function to build full image URL
const getFullImageUrl = (path) => {
  if (!path || typeof path !== "string") return null;
  const baseUrl = "http://localhost:8080/";
  return baseUrl + path;
};

// Computed photo URL
const photoUrl = computed(() => {
  return candidate.value?.photo ? getFullImageUrl(candidate.value.photo) : null;
});

const candidatePartyName = computed(() => {
  return partyStore.partiesForDropdown.find(p => p.value === candidate.value?.party)?.label || candidate.value?.party;
});

const onDeleteCandidate = async (id) => {
  const result = await showDialog();

  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const res = await CandidateService.deleteCandidate(id);
        showSuccess("Candidate with id: " + id + " deleted Succesfully!");
        await router.push({name: 'candidates'})
      })
    } catch (error) {
      throw error
    }
  }
}
const deadline = ref(null)
const isBeforeDeadline = ref(true)

onMounted(async () => {
  await withLoading(async () => {
    candidate.value = await CandidateService.getCandidateById(candidateId.value);
  });
  await partyStore.getParties()
  const res = await VoteService.getVotingDates()
  deadline.value = new Date(res.partyCreationDeadline)

  const now = new Date()
  isBeforeDeadline.value = now <= deadline.value
});

</script>

<template>
  <bread-crumb :items="breadcrumb"/>
  <app-card>
    <template #header>
      <h1>Candidate Details</h1>
    </template>
    <div v-if="candidate && candidate.id">
      <div class="d-flex justify-content-center gap-2 mt-3">
        <router-link class="btn btn-secondary  " :to="{name:'edit-candidate', params:{id:route.params.id}}"
                     v-if="role === ROLES.ADMIN && isBeforeDeadline"
        >Update Candidate
        </router-link>

        <app-button class="btn btn-danger flex" @click="onDeleteCandidate(candidate.id) "
                    v-if="role === ROLES.ADMIN && isBeforeDeadline"
        >Delete Candidate
        </app-button>
      </div>
      <div class="page-inner">
        <div class="container" id="main-body">
          <div class="main-body">
            <div class="row gutters-sm">
              <div class="col-md-4 mb-3">
                <div class="card">
                  <div class="card-body">
                    <p class="text-center text-secondary">Candidate ID: {{ candidateId }}</p>
                    <div class="d-flex flex-column align-items-center text-center">

                      <img v-if="candidate.photo"
                           :src="photoUrl"
                           :alt="`Image of ${candidate.name}`"
                           style="max-width: 300px"
                           class="rounded-circle"
                           width="200"
                           height="200"
                      />


                      <div class="mt-3 text-secondary">
                        <h4>
                          {{ candidate.firstName + ' ' + candidate.lastName + ' - ' + candidate.candidateNumber }} </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card" v-if="role === ROLES.ADMIN">
                  <div class="card-body">
                    <p class="text-muted font-size-sm">
                      Created By: <span class="text-secondary">{{ candidate.createdBy }}</span>
                    </p>
                    <p class="text-muted font-size-sm">
                      Created At: <span class="text-secondary">                      {{
                        new Date(candidate.createdAt).toISOString().slice(0, 16).replace('T', ' ')
                      }}
</span>
                    </p>
                    <p v-if="candidate.updatedAt" class="text-muted font-size-sm">
                      Updated At: <span class="text-secondary">
    {{ new Date(candidate.updatedAt).toISOString().slice(0, 16).replace('T', ' ') }}
  </span>
                    </p>

                    <p v-if="candidate.updatedBy" class="text-muted font-size-sm">
                      Updated By: <span class="text-secondary">{{ candidate.updatedBy }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-8">
                <div class="card mb-5">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-sm-3"><h6 class="mb-0">Full Name</h6></div>
                      <div class="col-sm-9 text-secondary">{{
                          candidate.firstName + ' ' + candidate.lastName
                        }}
                      </div>
                    </div>
                    <hr>
                    <div class="row">
                      <div class="col-sm-3"><h6 class="mb-0">Birthdate</h6></div>
                      <div class="col-sm-9 text-secondary">{{ candidate.birthDate }}</div>
                    </div>
                    <hr>
                    <div class="row">
                      <div class="col-sm-3"><h6 class="mb-0">Party</h6></div>
                      <div class="col-sm-9 text-secondary">{{ candidatePartyName }}
                        <router-link :to="{name:'partyDetails',params:{id:candidate.party}}"
                                     class="btn btn-sm btn-outline-primary py-0 px-1 m-2" style="font-size: 11px;">
                          Details
                        </router-link>
                      </div>
                    </div>
                    <hr>
                    <div class="row">
                      <div class="col-sm-3"><h6 class="mb-0">Candidate Number</h6></div>
                      <div class="col-sm-9 text-secondary">{{ candidate.candidateNumber }}</div>
                    </div>
                    <hr>
                    <div class="row">
                      <div class="col-sm-3"><h6 class="mb-0">Nationality</h6></div>
                      <div class="col-sm-9 text-secondary">{{ candidate.nationality }}</div>
                    </div>
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