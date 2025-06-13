<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {onMounted, reactive, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import UserService from "@/services/userService.js";
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import {useEnumStore} from "@/stores/enumStore.js";
import AppCard from "@/components/app/AppCard.vue";
import AppSelect from "@/components/app/AppSelect.vue";
import {ROLES} from "@/composables/useAdministration.js";
import {useAppToast} from "@/composables/useAppToast.js";

const toast = useAppToast();

const breadcrumb = [
  {label: 'Dashboard', to: '/'},
  {label: 'Users', to: {name: 'admin-users'}},
  {label: "Update User"}
];

const formData = reactive({
  email: {val: '', isValid: true},
  nationality: {val: '', isValid: true},
  city: {val: '', isValid: true},
  role: {val: '', isValid: true},
});

const route = useRoute();
const user = ref(null);
const userId = +route.params.id;

const {isLoading, withLoading} = useLoading();
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

const loadUserById = async (id) => {
  await withLoading(async () => {
    user.value = await UserService.getUserById(id);

    formData.nationality.val = user.value.nationality;
    formData.city.val = user.value.city;
    formData.role.val = user.value.role;
    formData.email.val = user.value.email;
  });
};

const handleSubmit = async () => {
  validateForm();
  if (!formIsValid.value) return;

  const obj = {
    nationality: formData.nationality.val,
    email: formData.email.val,
    city: formData.city.val,
    role: formData.role.val,
  };

  await withLoading(async () => {
    try {
      await UserService.updateUser(userId, obj);
      toast.showSuccess(`User with ID ${userId} updated successfully.`);
      await router.push({ name: 'admin-users' });
    } catch (err) {
      toast.showError(err.response?.data?.message || 'Update Failed');
      console.error("Update error:", err);
    }

  });
};

const enumStore = useEnumStore();
onMounted(async () => {
  await enumStore.loadCities();
  await enumStore.loadNationalities();
  await loadUserById(userId);
});
</script>

<template>
  <bread-crumb :items="breadcrumb"/>

  <app-card>
    <section class="d-flex justify-content-center">
      <div class="card shadow p-4" style="max-width: 500px; width: 100%;">
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-sm-4"><strong>Full Name:</strong></div>
              <div class="col-sm-8">{{ user?.firstName }} {{ user?.lastName }}</div>
              <hr/>
              <div class="col-sm-4"><strong>Birthdate:</strong></div>
              <div class="col-sm-8">{{ user?.birthDate }}</div>
              <hr/>
              <div class="col-sm-4"><strong>Registered At:</strong></div>
              <div class="col-sm-8">{{ user?.registeredAt }}</div>
            </div>
          </div>
        </div>

        <h2 class="text-center fw-bold mb-4">Update User</h2>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
                type="email"
                class="form-control"
                id="email"
                :class="{ 'is-invalid': !formData.email.isValid }"
                v-model="formData.email.val"
                placeholder="example@mail.com"
            />
            <div class="invalid-feedback">Please enter a valid email.</div>
          </div>

          <app-select
              id="nationality"
              label="Nationality"
              v-model="formData.nationality.val"
              :is-valid="formData.nationality.isValid"
              :options="enumStore.nationalitiesForDropdown"
          />

          <app-select
              :options="enumStore.citiesForDropdown"
              label="City"
              id="city"
              v-model="formData.city.val"
              :is-valid="formData.city.isValid"
          />


          <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
            {{ isLoading ? "Saving..." : "Update" }}
          </button>
        </form>
      </div>
    </section>
  </app-card>
</template>

<style scoped>
</style>
