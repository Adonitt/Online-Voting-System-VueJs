<script setup>

import {useAuthStore} from "@/stores/authStore.js";
import {onMounted, ref} from "vue";
import userService from "@/services/userService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";

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
  <div class="page-inner">
    <div class="container" id="main-body">
      <div class="main-body">
        <div class="row gutters-sm">

          <div class="col-md-12" v-if="user">
            <div class="card mb-5">
              <div class="card-body">
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
                  <div class="col-sm-4"><strong>Has Voted? </strong></div>
                  <div class="col-sm-8 text-secondary">{{ user.hasVoted ? 'Yes' : 'No' }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4"><strong>City</strong></div>
                  <div class="col-sm-8 text-secondary">
                    {{ user.city.charAt(0).toUpperCase() + user.city.slice(1).toLowerCase() }}
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4"><strong>Registered At</strong></div>
                  <div class="col-sm-8 text-secondary">
                    {{ new Date(user.registeredAt).toISOString().slice(0, 16).replace('T', ' ') }}
                  </div>

                </div>

              </div>
            </div>
            <router-link :to="{name:'change-password'}" class="btn btn-primary">Change Password</router-link>
          </div>


        </div>
      </div>
    </div>
  </div>
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
