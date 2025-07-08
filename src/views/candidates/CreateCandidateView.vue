<script setup>
import AppCard from "@/components/app/AppCard.vue";
import AppInput from "@/components/app/AppInput.vue";
import AppSelect from "@/components/app/AppSelect.vue";
import {usePartyStore} from "@/stores/partyStore";
import {useEnumStore} from "@/stores/enumStore";
import {useAppToast} from "@/composables/useAppToast";
import {useLoading} from "@/composables/useLoading";
import {useRouter} from "vue-router";
import CandidateService from "@/services/candidateService";
import {onMounted, reactive, ref, nextTick} from "vue";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";

const breadcrumb = [
  {label: 'Dashboard', to: '/'},
  {label: 'Candidates', to: '/candidates'},
  {label: 'Create Candidate'}
]

const partyStore = usePartyStore();
const enumStore = useEnumStore();
const toast = useAppToast();
const router = useRouter();
const {isLoading, withLoading} = useLoading();

const formData = reactive({
  personalNo: {val: '', isValid: true},
  firstName: {val: '', isValid: true},
  lastName: {val: '', isValid: true},
  birthDate: {val: '', isValid: true},
  party: {val: '', isValid: true},
  nationality: {val: '', isValid: true},
  photo: {val: null, isValid: true}
});

const formIsValid = ref(true);

const validateForm = () => {
  formIsValid.value = true;
  for (const key in formData) {
    if (formData[key] && typeof formData[key] === 'object' && 'val' in formData[key]) {
      formData[key].isValid = !!formData[key].val;
      if (!formData[key].isValid) formIsValid.value = false;
    }
  }
};

const previewImage = ref(null);

const onFileChange = (e) => {
  const file = (e.target.files?.[0] || null)
  formData.photo.val = file;
  formData.photo.isValid = !!file;
  previewImage.value = file ? URL.createObjectURL(file) : null;
};

const onHandleSubmit = async () => {
  validateForm();
  if (!formIsValid.value) return;

  const candidateDto = {
    personalNo: formData.personalNo.val,
    firstName: formData.firstName.val,
    lastName: formData.lastName.val,
    birthDate: formData.birthDate.val,
    party: formData.party.val,
    nationality: formData.nationality.val
  };

  const obj = new FormData();
  obj.append("dto", new Blob([JSON.stringify(candidateDto)], {type: "application/json"}));
  if (formData.photo.val) {
    obj.append("photo", formData.photo.val);
  }

  await withLoading(async () => {
    try {
      const response = await CandidateService.createCandidate(obj);
      toast.showSuccess("Candidate created successfully");
      await router.push({name: 'candidates'});
    } catch (err) {
      toast.showError(
          err.response?.data?.message ||
          err.response?.data?.birthDate ||
          'An error occurred registering candidate!'
      );
    }
  });
};

onMounted(async () => {
  await partyStore.getParties();
  await enumStore.loadNationalities();
});
</script>

<template>
  <bread-crumb :items="breadcrumb"/>
  <app-card>
    <template #header>
      <h1>Create Candidate</h1>
    </template>

    <form @submit.prevent="onHandleSubmit" class="row g-4 p-3">
      <!-- Left: Image Upload -->
      <div class="col-md-4 d-flex flex-column align-items-center text-center">
        <img
            class="rounded-circle mb-3"
            width="150"
            height="150"
            :src="previewImage"
            alt="Candidate Preview"
            v-if="previewImage"
        />
        <p class="fw-semibold">Candidate Photo</p>
        <input
            type="file"
            class="form-control"
            accept="image/*"
            @change="onFileChange"
            :class="{ 'is-invalid': !formData.photo.isValid }"
        />
        <div class="invalid-feedback w-100 text-start">Photo is required.</div>
      </div>

      <div class="col-md-8">
        <div class="row g-3">

          <app-input
              id="personalNo"
              label="Personal Number"
              v-model="formData.personalNo.val"
              :is-invalid="formData.personalNo.isValid"
              placeholder="Enter personal number"
              minlength="10"
              maxlength="10"
          />

          <app-input
              id="firstName"
              label="First Name"
              v-model="formData.firstName.val"
              :is-invalid="formData.firstName.isValid"
              placeholder="Enter first name"
          />
          <app-input
              id="lastName"
              label="Last Name"
              v-model="formData.lastName.val"
              :is-invalid="formData.lastName.isValid"
              placeholder="Enter last name"
          />
          <app-input
              id="birthdate"
              label="Birthdate"
              type="date"
              v-model="formData.birthDate.val"
              :is-invalid="formData.birthDate.isValid"
          />
          <app-select
              id="party"
              label="Party"
              v-model="formData.party.val"
              :is-invalid="formData.party.isValid"
              :options="partyStore.partiesForDropdown"
          />
          <app-select
              id="nationality"
              label="Nationality"
              v-model="formData.nationality.val"
              :is-invalid="formData.nationality.isValid"
              :options="enumStore.nationalitiesForDropdown"
          />

          <button type="submit" class="btn btn-primary profile-button mt-3">
            <i class="fas fa-save me-2"></i>
            Create Candidate
          </button>
          <router-link :to="{name:'citizens'}">How to add candidate?</router-link>
        </div>

      </div>
    </form>
  </app-card>
</template>

<style scoped>
img {
  object-fit: cover;
}
</style>
