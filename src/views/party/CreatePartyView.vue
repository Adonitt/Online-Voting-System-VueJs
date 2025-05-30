<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import { reactive, ref, nextTick } from "vue";
import { useLoading } from "@/composables/useLoading.js";
import { useAppToast } from "@/composables/useAppToast.js";
import { useRouter } from "vue-router";
import PartyService from "@/services/partyService.js";

const breadcrumbs = [
  { label: 'Dashboard', to: '/' },
  { label: 'Parties', to: { name: 'party' } },
  { label: 'Create Party' },
];

const formData = reactive({
  name: { val: '', isValid: true },
  partySymbol: { val: '', isValid: true },
  numberOfParty: { val: '', isValid: true },
  abbreviationName: { val: '', isValid: true },
  description: { val: '', isValid: true },
});

const formIsValid = ref(true);

const validateForm = () => {
  formIsValid.value = true;

  for (const key in formData) {
    formData[key].isValid = !!formData[key].val;
    if (!formData[key].isValid) {
      formIsValid.value = false;
    }
  }
};

const onFileChange = (e) => {
  const file = e.target.files?.[0] || null;
  formData.partySymbol.val = file;
  formData.partySymbol.isValid = !!file;
};

const { isLoading, withLoading } = useLoading();
const toast = useAppToast();
const router = useRouter();

const handleSubmit = async () => {
  validateForm();
  if (!formIsValid.value) return;

  const partyToCreate = {
    name: formData.name.val,
    symbol: formData.partySymbol.val,
    numberOfParty: formData.numberOfParty.val,
    description: formData.description.val,
    abbreviationName: formData.abbreviationName.val,
  };

  await withLoading(async () => {
    try {
      const res = await PartyService.createParty(partyToCreate);
      toast.showSuccess("Party created successfully");
      await nextTick(); // Wait for DOM/toast
      await router.push({ name: 'party' });
    } catch (error) {
      if (error.response?.status === 409) {
        toast.showError(error.response.data.message || "Party already exists!");
      } else {
        toast.showError("Failed to create party");
      }
    }
  });
};
</script>

<template>
  <bread-crumb :items="breadcrumbs" />

  <div class="page-inner">
    <h5>Create new Party</h5>

    <div class="container rounded bg-white mt-1 mb-15" id="main-body">
      <form class="row" @submit.prevent="handleSubmit">
        <!-- Symbol Input -->
        <div class="col-md-3 border-right">
          <div class="d-flex flex-column align-items-center text-center p-3 py-5">
            <img class="rounded-circle mt-5" width="150px" src="/src/assets/img/foto/ks.jpeg" />
            <p>Choose Party Symbol</p>
            <input type="file"
                   class="form-control"
                   id="partySymbol"
                   name="partySymbol"
                   accept="image/*"
                   @change="onFileChange"
                   :class="{ 'is-invalid': !formData.partySymbol.isValid }" />
            <p class="invalid-feedback">Party symbol is required</p>
          </div>
        </div>

        <!-- Other Inputs -->
        <div class="col-md-8 border-right">
          <div class="p-3 py-5">
            <div class="row mt-2">
              <div class="col-md-4">
                <label class="labels" for="partyName">Party Name</label>
                <input type="text"
                       id="partyName"
                       class="form-control"
                       v-model="formData.name.val"
                       :class="{ 'is-invalid': !formData.name.isValid }"
                       placeholder="Party Name" />
                <p class="invalid-feedback">Party name is required</p>
              </div>

              <div class="col-md-4">
                <label class="labels" for="abbreviationName">Abbreviation Name</label>
                <input type="text"
                       id="abbreviationName"
                       class="form-control"
                       v-model="formData.abbreviationName.val"
                       :class="{ 'is-invalid': !formData.abbreviationName.isValid }"
                       placeholder="Abbreviation Name" />
                <p class="invalid-feedback">Abbreviation name is required</p>
              </div>

              <div class="col-md-4">
                <label class="labels" for="numberOfParty">Number Of Party</label>
                <input type="number"
                       id="numberOfParty"
                       class="form-control"
                       v-model="formData.numberOfParty.val"
                       :class="{ 'is-invalid': !formData.numberOfParty.isValid }"
                       placeholder="Number Of Party" />
                <p class="invalid-feedback">Number of party is required</p>
              </div>

              <div class="col-md-12">
                <label class="labels" for="description">Description</label>
                <input type="text"
                       id="description"
                       class="form-control"
                       v-model="formData.description.val"
                       :class="{ 'is-invalid': !formData.description.isValid }"
                       placeholder="Description" />
                <p class="invalid-feedback">Description is required</p>
              </div>

              <button type="submit" class="btn btn-primary profile-button m-3">
                <i class="fas fa-save me-2"></i>
                Create Party
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* You can style here if needed */
</style>
