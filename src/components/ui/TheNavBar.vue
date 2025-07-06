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
    <!-- Logo Header with Toggle Button -->
    <div class="logo-header" data-background-color="dark">
      <router-link :to="{ name: 'home' }" class="logo">
        <img
            src="@/assets/img/foto/ks.jpeg"
            alt="navbar brand"
            class="navbar-brand"
            height="40"
        />
      </router-link>
      <!-- Sidebar Toggle -->
      <button class="navbar-toggler sidenav-toggler ms-auto" type="button" data-toggle="collapse" data-target="collapse">
        <span class="navbar-toggler-icon">
          <i class="gg-menu-left text-white"></i>
        </span>
      </button>
      <button class="topbar-toggler more">
        <i class="gg-more-vertical-alt text-white"></i>
      </button>
    </div>

    <!-- Main Navbar -->
    <nav
        class="navbar navbar-header navbar-expand-lg border-bottom"
        data-background-color="white"
    >
      <div class="container-fluid">
        <ul class="navbar-nav topbar-nav ms-auto align-items-center">
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
                  {{
                    authStore.loggedInUser?.firstName +
                    " " +
                    authStore.loggedInUser?.lastName
                  }}
                </span>
              </span>
            </a>
            <ul class="dropdown-menu dropdown-user animated fadeIn">
              <li>
                <div class="user-box">
                  <div class="u-text text-center">
                    <h4>
                      {{
                        authStore.loggedInUser?.firstName +
                        " " +
                        authStore.loggedInUser?.lastName
                      }}
                    </h4>
                    <p class="text-muted">{{ authStore.loggedInUser?.sub }}</p>
                    <router-link
                        :to="{ name: 'my-profile' }"
                        class="btn btn-secondary btn-sm"
                    >
                      View Profile
                    </router-link>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown-divider"></div>
                <router-link
                    :to="{ name: 'change-password' }"
                    class="dropdown-item"
                >
                  Change Password
                </router-link>
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
