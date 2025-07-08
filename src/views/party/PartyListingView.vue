<script setup>
import AppCard from "@/components/app/AppCard.vue";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useLoading} from "@/composables/useLoading.js";
import {onMounted, ref} from "vue";
import PartyService from "@/services/partyService.js";
import AppSpinner from "@/components/app/AppSpinner.vue";
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import DataTablesBS5 from 'datatables.net-bs5';
import AppButton from "@/components/app/AppButton.vue";
import {useAppToast} from "@/composables/useAppToast.js";
import {useRoute} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";

DataTable.use(DataTablesCore);
DataTable.use(DataTablesBS5);

const breadcrumb = [
  {label: 'Dashboard', to: "/"},
  {label: 'Parties',}
]
const authStore = useAuthStore()
const role = authStore.loggedInUser?.role

const {isLoading, withLoading} = useLoading()
const parties = ref([])

const loadParties = async () => {
  await withLoading(async () => {
    parties.value = await PartyService.getAllParties()
  })
}

const getFullImageUrl = (path) => {
  // console.log("Symbol path:", path);
  if (!path || typeof path !== "string") return null;
  // console.log("VITE_IMG_URL:", import.meta.env.VITE_IMG_URL);
  console.log("party.symbol:", path);

  return "https://online-voting-system-rest-api-xw5q.onrender.com/" + path;
};
const {showDialog, showSuccess} = useAppToast()
const route = useRoute()

const onDeleteParty = async (id) => {
  const result = await showDialog();

  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const response = await PartyService.deleteParty(id);
        showSuccess('Party with id ' + id + " has been deleted successfully.");
        await loadParties()
      });
    } catch (error) {
      throw error;
    }
  }
}
onMounted(async () => {
  await loadParties()
  // console.log(loadParties())
  new DataTablesCore("#parties")
})


</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <bread-crumb :items="breadcrumb"/>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <app-card>
          <template #header>
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h1 class="mb-0">Parties</h1>
              <router-link
                  v-if="role === ROLES.ADMIN"
                  :to="{ name: 'createParty' }"
                  class="btn btn-secondary"
              >
                Add Party
              </router-link>
            </div>

          </template>

          <div v-if="isLoading" class="text-center my-4">
            <app-spinner :isLoading="isLoading"/>
          </div>

          <div v-else class="table-responsive mt-3">
            <table id="parties" class="table table-striped table-bordered">
              <thead>
              <tr>
                <th>#</th>
                <th>Symbol</th>
                <th>Party Number</th>
                <th>Party Name</th>
                <th>Abbreviation Name</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="party in parties" :key="party.id">
                <td>{{ party.id }}</td>
                <td>
                  <img
                      v-if="party.symbol"
                      :src="getFullImageUrl(party.symbol)"
                      :alt="`Image of ${party.name}`"
                      width="50"
                      height="50"
                      class="img-fluid"
                  />
                </td>
                <td>{{ party.numberOfParty }}</td>
                <td>{{ party.name }}</td>
                <td>{{ party.abbreviationName }}</td>
                <td class="d-flex flex-wrap gap-2">
                  <router-link
                      :to="{ name: 'partyDetails', params: { id: party.id } }"
                      class="btn btn-icon btn-round btn-info"
                  >
                    <i class="fas fa-info-circle m-1"></i>
                  </router-link>

                  <router-link
                      v-if="role === ROLES.ADMIN"
                      :to="{ name: 'updateParty', params: { id: party.id } }"
                      class="btn btn-icon btn-round btn-warning"
                  >
                    <i class="fas fa-edit m-1"></i>
                  </router-link>

                  <app-button
                      v-if="role === ROLES.ADMIN"
                      class="btn btn-icon btn-round btn-danger"
                      @click="onDeleteParty(party.id)"
                  >
                    <i class="fas fa-trash m-1"></i>
                  </app-button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </app-card>
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>
