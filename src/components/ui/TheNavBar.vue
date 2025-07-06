
<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast.js";

const authStore = useAuthStore();
const router = useRouter();
const toast = useAppToast();

const onLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
  toast.showSuccess("You're logged out!");
};
</script>

<template>
  <div class="main-header">
    <nav class="navbar navbar-expand-lg navbar-light border-bottom">
      <div class="container-fluid d-flex justify-content-between align-items-center">

        <!-- Mobile hamburger button -->
        <button
            class="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarCollapse"
            aria-controls="sidebarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Optional title or logo -->
        <span class="navbar-brand">Voting System</span>

        <!-- Profile dropdown -->
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item dropdown">
            <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
              {{ authStore.loggedInUser?.firstName }} {{ authStore.loggedInUser?.lastName }}
            </a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" :to="{ name: 'my-profile' }">View Profile</router-link></li>
              <li><router-link class="dropdown-item" :to="{ name: 'change-password' }">Change Password</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" @click="onLogout">Logout</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
