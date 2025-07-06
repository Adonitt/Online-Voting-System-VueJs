
<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast.js";

const authStore = useAuthStore();
const router = useRouter();
const toast = useAppToast();

const onLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
  toast.showSuccess("You're logged out!");
};
</script>

<template>
  <div class="main-header">
    <nav
        class="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom"
        data-background-color="white"
    >
      <div class="container-fluid d-flex align-items-center">
        <!-- Hamburger for mobile -->
        <button
            class="btn btn-sm btn-outline-secondary d-lg-none me-3"
            @click="$emit('toggle-sidebar')"
        >
          <i class="fas fa-bars"></i>
        </button>

        <ul class="navbar-nav topbar-nav ms-auto align-items-center">
          <li class="nav-item topbar-user dropdown hidden-caret">
            <a class="dropdown-toggle profile-pic" data-bs-toggle="dropdown" href="#">
              <span class="profile-username">
                <span class="op-7">Hi, </span>
                <span class="fw-bold">
                  {{ authStore.loggedInUser?.firstName }} {{ authStore.loggedInUser?.lastName }}
                </span>
              </span>
            </a>
            <ul class="dropdown-menu dropdown-user animated fadeIn">
              <li>
                <router-link :to="{ name: 'my-profile' }" class="dropdown-item">View Profile</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'change-password' }" class="dropdown-item">Change Password</router-link>
              </li>
              <li>
                <a class="dropdown-item" @click="onLogout">Logout</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
