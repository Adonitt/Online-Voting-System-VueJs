<script setup>

import {useAuthStore} from "@/stores/authStore.js";
import {onMounted, ref} from "vue";
import userService from "@/services/userService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import AppCard from "@/components/app/AppCard.vue";

const breadCrumbItems = [
  {label: "Dashboard", to: "/home"},
  {label: "My Profile", to: "/my-profile"}
]

const authStore = useAuthStore();
const user = ref()

onMounted(async () => {
  const loggedInUser = authStore.loggedInUser;

  if (loggedInUser?.id) {
    const response = await userService.getUserById(loggedInUser.id);
    user.value = response
    console.log(response.data)
  }
})

</script>
<template>
  <bread-crumb :items="breadCrumbItems"/>

  <app-card>
    <template #header>
      My Profile
    </template>
    <div v-if="user">

      <div class="row mb-2">
        <div class="col-sm-4"><strong>Personal Number</strong></div>
        <div class="col-sm-8 text-secondary">{{ user.personalNo }}</div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-4"><strong>First Name</strong></div>
        <div class="col-sm-8 text-secondary">{{ user.firstName }}</div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-4"><strong>Last Name</strong></div>
        <div class="col-sm-8 text-secondary">{{ user.lastName }}</div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-4"><strong>Email</strong></div>
        <div class="col-sm-8 text-secondary">{{ user.email }}</div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-4"><strong>Birth Date</strong></div>
        <div class="col-sm-8 text-secondary">{{ user.birthDate }}</div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-4"><strong>Nationality</strong></div>
        <div class="col-sm-8 text-secondary">{{ user.nationality }}</div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-4"><strong>Role</strong></div>
        <div class="col-sm-8 text-secondary">{{ user.role }}</div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-4"><strong>Has Voted? </strong></div>
        <div class="col-sm-8 text-secondary">{{ user.hasVoted ? 'Yes' : 'No' }}</div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-4"><strong>City</strong></div>
        <div class="col-sm-8 text-secondary">
          {{ user.city }}
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-sm-4"><strong>Registered At</strong></div>
        <div class="col-sm-8 text-secondary">
          {{ new Date(user.registeredAt).toISOString().slice(0, 16).replace('T', ' ') }}
        </div>

      </div>

    </div>
    <router-link :to="{name:'change-password'}" class="btn btn-primary">Change Password</router-link>
    <router-link
        :to="{name:'my-vote-details', params:{id:authStore.loggedInUser?.id}}"
        class="inline-block bg-green-600 m-4 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition btn btn-secondary"
    >
      View Vote Details
    </router-link>


  </app-card>

</template>


<style scoped>
input::placeholder {
  color: #bbb;
}

.card {
  background-color: #fff;
  transition: all 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
</style>
