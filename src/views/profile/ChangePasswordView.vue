<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {ref} from "vue";
import {useAppToast} from "@/composables/useAppToast.js";
import UserService from "@/services/userService.js";

const breadCrumbItems = [
  {label: "Dashboard", to: "/home"},
  {label: "My Profile", to: "/my-profile"},
  {label: "Change Password", to: "/change-password"},
]

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const toast = useAppToast()

const handleChangePassword = async () => {
  try {
    await UserService.changePassword({
      oldPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value
    });

    toast.showSuccess("Password changed successfully");

    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';

  } catch (error) {
    toast.showError(error.response?.data?.message || "Something went wrong");
    console.log(error);
  }
};


</script>
<template>
  <bread-crumb :items="breadCrumbItems"/>

  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-body p-4">
            <h4 class="mb-4 text-center fw-bold text-primary">Change Password</h4>

            <form @submit.prevent="handleChangePassword">
              <input type="hidden" name="adminId"/>

              <div class="form-group mb-3">
                <label for="current-password" class="form-label">Current Password</label>
                <input
                    type="password"
                    class="form-control form-control-lg"
                    id="current-password"
                    name="currentPassword"
                    v-model="currentPassword"
                    placeholder="Enter current password"
                    required
                />
              </div>

              <div class="form-group mb-3">
                <label for="new-password" class="form-label">New Password</label>
                <input
                    type="password"
                    v-model="newPassword"
                    class="form-control form-control-lg"
                    id="new-password"
                    name="newPassword"
                    placeholder="Enter new password"
                    required
                />
              </div>

              <div class="form-group mb-4">
                <label for="confirm-password" class="form-label">Confirm New Password</label>
                <input
                    type="password"
                    class="form-control form-control-lg"
                    id="confirm-password"
                    v-model="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    required
                />
              </div>

              <button type="submit" class="btn btn-primary w-100 btn-lg">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>