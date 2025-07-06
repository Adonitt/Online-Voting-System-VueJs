<script setup>
import { ref } from "vue";

const emit = defineEmits(["toggle-sidebar"]);

const showProfileDropdown = ref(false);
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

const showSidebarDropdown = ref(false);
const toggleSidebarDropdown = () => {
  showSidebarDropdown.value = !showSidebarDropdown.value;
};
</script>

<template>
  <div class="main-header">
    <!-- Mobile Header -->
    <div
        class="logo-header d-block d-lg-none px-3 py-2 d-flex align-items-center justify-content-between"
        data-background-color="dark"
    >
      <!-- Logo -->
      <router-link :to="{ name: 'home' }" class="logo d-flex align-items-center">
        <img
            src="@/assets/img/foto/ks.jpeg"
            alt="navbar brand"
            class="navbar-brand"
            height="40"
        />
      </router-link>

      <!-- Sidebar Toggle Button me event dhe opsional dropdown -->
      <button class="btn btn-sm text-white" @click="emit('toggle-sidebar')">
        <i class="gg-menu-left fs-5"></i>
      </button>

      <!-- Shembull: Sidebar Toggle Dropdown (opsionale, nëse e do) -->
      <!--
      <button class="btn btn-sm text-white" @click="toggleSidebarDropdown">
        <i class="gg-menu-left fs-5"></i>
      </button>
      <ul v-if="showSidebarDropdown" class="dropdown-menu">
        <li>Option 1</li>
        <li>Option 2</li>
      </ul>
      -->

      <!-- Profile Button -->
      <div class="position-relative">
        <button class="btn btn-sm text-white" @click="toggleProfileDropdown">
          <i class="gg-more-vertical-alt fs-5"></i>
        </button>

        <ul
            v-if="showProfileDropdown"
            class="dropdown-menu dropdown-user show animated fadeIn"
            style="right: 0; left: auto"
        >
          <li>
            <div class="user-box text-center p-2">
              <h6>{{ /* Emri i user-it */ }}</h6>
              <p class="text-muted small">{{ /* Email apo user sub */ }}</p>
              <router-link
                  :to="{ name: 'my-profile' }"
                  class="btn btn-sm btn-secondary mb-1"
              >View Profile</router-link
              >
            </div>
          </li>
          <li>
            <div class="dropdown-divider"></div>
            <router-link
                :to="{ name: 'change-password' }"
                class="dropdown-item"
            >Change Password</router-link
            >
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click="/* Logout funksioni */">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
