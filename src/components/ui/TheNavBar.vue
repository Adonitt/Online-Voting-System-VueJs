<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast.js";
import { ref } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const toast = useAppToast();

// Profile dropdown state
const showProfileDropdown = ref(false);

// Toggle profile dropdown
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

const onLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
  toast.showSuccess("You're logged out!");
};
</script>

<template>
  <div class="main-header">
    <!-- Mobile Header -->
    <div class="logo-header d-block d-lg-none px-3 py-2 d-flex align-items-center justify-content-between" data-background-color="dark">
      <!-- Logo -->
      <router-link :to="{ name: 'home' }" class="logo d-flex align-items-center">
        <img
            src="@/assets/img/foto/ks.jpeg"
            alt="navbar brand"
            class="navbar-brand"
            height="40"
        />
      </router-link>

      <!-- Sidebar Toggle Button -->
      <button class="btn btn-sm text-white" @click="$emit('toggleSidebar')">
        <i class="gg-menu-left fs-5"></i>
      </button>


      <!-- Profile Button -->
      <div class="position-relative">
        <button class="btn btn-sm text-white" @click="toggleProfileDropdown">
          <i class="gg-more-vertical-alt fs-5"></i>
        </button>

        <!-- Profile Dropdown -->
        <ul v-if="showProfileDropdown" class="dropdown-menu dropdown-user show animated fadeIn" style="right: 0; left: auto;">
          <li>
            <div class="user-box text-center p-2">
              <h6>{{ authStore.loggedInUser?.firstName + " " + authStore.loggedInUser?.lastName }}</h6>
              <p class="text-muted small">{{ authStore.loggedInUser?.sub }}</p>
              <router-link
                  :to="{ name: 'my-profile' }"
                  class="btn btn-sm btn-secondary mb-1"
              >View Profile</router-link>
            </div>
          </li>
          <li>
            <div class="dropdown-divider"></div>
            <router-link
                :to="{ name: 'change-password' }"
                class="dropdown-item"
            >Change Password</router-link>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click="onLogout">Logout</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Desktop Navbar -->
    <nav class="navbar navbar-header navbar-expand-lg border-bottom d-none d-lg-flex" data-background-color="white">
      <div class="container-fluid">
        <ul class="navbar-nav ms-auto align-items-center">
          <!-- User Dropdown -->
          <li class="nav-item dropdown hidden-caret">
            <a
                class="dropdown-toggle profile-pic"
                data-bs-toggle="dropdown"
                href="#"
                aria-expanded="false"
            >
              <span class="profile-username">
                <span class="op-7">Hi, </span>
                <span class="fw-bold">
                  {{ authStore.loggedInUser?.firstName + " " + authStore.loggedInUser?.lastName }}
                </span>
              </span>
            </a>
            <ul class="dropdown-menu dropdown-user animated fadeIn">
              <li>
                <div class="user-box text-center p-2">
                  <h6>{{ authStore.loggedInUser?.firstName + " " + authStore.loggedInUser?.lastName }}</h6>
                  <p class="text-muted small">{{ authStore.loggedInUser?.sub }}</p>
                  <router-link
                      :to="{ name: 'my-profile' }"
                      class="btn btn-sm btn-secondary mb-1"
                  >View Profile</router-link>
                </div>
              </li>
              <li>
                <div class="dropdown-divider"></div>
                <router-link
                    :to="{ name: 'change-password' }"
                    class="dropdown-item"
                >Change Password</router-link>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" @click="onLogout">Logout</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
