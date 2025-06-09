<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {onMounted, reactive, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import PartyService from "@/services/partyService.js";
import {useAppToast} from "@/composables/useAppToast.js";
import {useRoute, useRouter} from "vue-router";
import AppSpinner from "@/components/app/AppSpinner.vue";

const breadcrumbs = [
  {label: 'Dashboard', to: '/'},
  {label: 'Parties', to: {name: 'party'}},
  {label: 'Update Party'},
];

const formData = reactive({
  name: {val: '', isValid: true},
  abbreviationName: {val: '', isValid: true},
  partySymbol: {val: ''},
  numberOfParty: {val: '', isValid: true},
  description: {val: '', isValid: true},
});

const getPartyById = async (id) => {
  await withLoading(async () => {
    const response = await PartyService.getPartyById(id);
    if (response) {
      formData.name.val = response.name;
      formData.abbreviationName.val = response.abbreviationName;
      formData.partySymbol.val = response.symbol;
      formData.numberOfParty.val = response.numberOfParty;
      formData.description.val = response.description;
    }
  });
};

const route = useRoute();
const partyId = +route.params.id;

onMounted(async () => {
  await getPartyById(partyId);
});

const formIsValid = ref(true);

const validateForm = () => {
  formIsValid.value = true;

  formData.name.isValid = !!formData.name.val;
  formData.abbreviationName.isValid = !!formData.abbreviationName.val;
  formData.numberOfParty.isValid = !!formData.numberOfParty.val;
  formData.description.isValid = !!formData.description.val;

  if (
      !formData.name.isValid ||
      !formData.abbreviationName.isValid ||
      !formData.numberOfParty.isValid ||
      !formData.description.isValid
  ) {
    formIsValid.value = false;
  }
};

const clearValidity = (key) => {
  formData[key].isValid = false;
};

const {isLoading, withLoading} = useLoading();
const toast = useAppToast();
const router = useRouter();
const handleSubmit = async () => {
  validateForm();
  if (!formIsValid.value) return;

  const form = new FormData();

  const partyToUpdate = {
    name: formData.name.val,
    abbreviationName: formData.abbreviationName.val,
    symbol: formData.partySymbol.val,
    numberOfParty: formData.numberOfParty.val,
    description: formData.description.val,
  };

  form.append("data", new Blob([JSON.stringify(partyToUpdate)], {type: "application/json"}));

  const symbolInput = document.querySelector("#partySymbol");
  if (symbolInput?.files?.length) {
    form.append("symbol", symbolInput.files[0]);
  }


  await withLoading(async () => {
    try {
      await PartyService.updateParty(partyId, form);
      toast.showSuccess("Party with id " + partyId + " updated successfully");
      await router.push({name: "party"});
    } catch (error) {
      toast.showError("Failed to update party");
    }
  });
};

const getFullImageUrl = (path) => {
  // console.log("Symbol path:", path);
  if (!path || typeof path !== "string") return null;
  // console.log("VITE_IMG_URL:", import.meta.env.VITE_IMG_URL);
  // console.log("party.symbol:", path);

  return "http://localhost:8080/" + path;
};


</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="page-inner">
    <h5>Update Party</h5>

    <div class="container rounded bg-white mt-1 mb-15" id="main-body">
      <div class="text-center" v-if="isLoading">
        <app-spinner :isLoading="isLoading"/>
      </div>

      <form class="row" @submit.prevent="handleSubmit" v-else>
        <div class="col-md-3 border-right">
          <div class="d-flex flex-column align-items-center text-center p-3 py-5">
            <img
                v-if="formData.partySymbol.val"
                :src="getFullImageUrl(formData.partySymbol.val)"
                :alt="`Image of ${formData.name.val}`"

                class="rounded-circle mt-5"
                width="150px"

            />
            <p>Choose Party Symbol</p>
            <input type="hidden"/>
            <input
                type="file"
                class="form-control"
                id="partySymbol"
                name="partySymbol"
                accept="image/*"
            />
            <p class="invalid-feedback">Party symbol is required</p>
          </div>
        </div>

        <div class="col-md-8 border-right">
          <p>Party Id: {{ partyId }}</p>
          <div class="p-3 py-5">
            <div class="row mt-2">
              <div class="col-md-6">
                <label class="labels" for="partyName">Party Name</label>
                <input
                    type="text"
                    class="form-control"
                    id="partyName"
                    :class="{ 'is-invalid': !formData.name.isValid }"
                    v-model="formData.name.val"
                    placeholder="Party Name"
                />
                <p class="invalid-feedback">Party name is required</p>
              </div>

              <div class="col-md-6">
                <label class="labels" for="abbreviationName">Abbreviation Name</label>
                <input
                    type="text"
                    class="form-control"
                    id="abbreviationName"
                    :class="{ 'is-invalid': !formData.abbreviationName.isValid }"
                    v-model="formData.abbreviationName.val"
                    placeholder="Abbreviation Name"
                />
                <p class="invalid-feedback">Abbreviation name is required</p>
              </div>

              <div class="col-md-6 mt-3">
                <label class="labels" for="numberOfParty">Number Of Party</label>
                <input
                    type="number"
                    class="form-control"
                    id="numberOfParty"
                    :class="{ 'is-invalid': !formData.numberOfParty.isValid }"
                    v-model="formData.numberOfParty.val"
                    placeholder="Number Of Party"
                />
                <p class="invalid-feedback">Number of party is required</p>
              </div>

              <div class="col-md-12 mt-3">
                <label class="labels" for="description">Description</label>
                <input
                    type="text"
                    class="form-control"
                    id="description"
                    :class="{ 'is-invalid': !formData.description.isValid }"
                    v-model="formData.description.val"
                    placeholder="Description"
                />
                <p class="invalid-feedback">Description is required</p>
              </div>

              <button type="submit" class="btn btn-primary profile-button m-3">
                <i class="fas fa-save" style="margin: 5px"></i>
                Update Party
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here if needed */
</style>
