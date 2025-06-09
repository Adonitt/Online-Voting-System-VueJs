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
  // console.log("party.symbol:", path);

  return "http://localhost:8080/" + path;
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

  <bread-crumb :items="breadcrumb"/>
  <app-card>
    <template #header>
      <h1>Parties</h1>
    </template>

    <div class="d-flex justify-content-end m-3 ">
      <router-link :to="{name:'createParty'}" class="btn btn-secondary"
                   v-if="role === ROLES.ADMIN"
      >Add Party
      </router-link>
    </div>

    <div class="text-center" v-if="isLoading">
      <app-spinner :isLoading="isLoading"/>
    </div>
    <table v-else id="parties" class="table table-striped table-bordered">
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
          <img v-if="party.symbol"
               :src="getFullImageUrl(party.symbol)"
               :alt="`Image of ${party.name}`" width="50" height="50"/>
        </td>
        <td>{{ party.numberOfParty }}</td>
        <td>{{ party.name }}</td>
        <td>{{ party.abbreviationName }}</td>
        <td>
          <router-link :to="{name:'partyDetails', params:{id:party.id}}" class="btn btn-icon btn-round btn-info me-2">
            <i class="fas fa-info-circle m-2"></i>
          </router-link>

          <router-link :to="{name:'updateParty',params:{id:party.id}}" class="btn btn-icon btn-round btn-warning me-2"
                       v-if="role === ROLES.ADMIN">
            <i class="fas fa-edit m-2"></i>
          </router-link>

          <app-button class="btn btn-icon btn-round btn-danger" @click="onDeleteParty(party.id)"
                      v-if="role === ROLES.ADMIN">
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
