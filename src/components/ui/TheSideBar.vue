<!-- TheSideBar.vue -->
<script setup>
import { useAuthStore } from "@/stores/authStore.js"; // Import your auth store
import { computed } from "vue"; // Import computed

const authStore = useAuthStore();

// Computed property to check if the user is an admin
const isAdmin = computed(() => authStore.isAdmin);

</script>

<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <!-- Logo Header -->
      <div class="logo-header" data-background-color="white">
        <router-link :to="{name:'home'}" class="logo">
          <img
              src="@/assets/img/foto/ks.jpeg"
              alt="navbar brand"
              class="navbar-brand"
              height="50px"
              width="50px"/>
        </router-link>
      </div>
      <!-- End Logo Header -->
    </div>
    <div class="sidebar-wrapper scrollbar scrollbar-inner">
      <div class="sidebar-content">
        <ul class="nav nav-secondary">
          <li class="nav-item ">
            <router-link :to="{name:'home'}">
              <i class="fas fa-home"></i>
              <p>Dashboard</p>
            </router-link>
          </li>

          <li class="nav-section">
            <h4 class="text-section">Components</h4>
          </li>
          <li class="nav-item">
            <router-link
                :to="{name:'party'}">
              <i class="bi-flag"></i>
              <p>Parties</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
                :to="{name:'candidates'}">
              <i class="bi-file-person"></i>
              <p>Candidates</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
                :to="{name:'cast-vote'}">
              <i class="bi-pen"></i>
              <p>Cast Vote</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
                :to="{name:'my-profile'}">
              <i class="bi-person"></i>
              <p>My Profile</p>
            </router-link>
          </li>

          <!-- Admin-specific links, conditionally rendered -->
          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'admin-users' }">
              <i class="bi bi-people"></i> <!-- Using Bootstrap Icons for a people icon -->
              <p>All Users</p>
            </router-link>
          </li>

          <!-- *** NEW: Admin All Votes Link (Conditional) *** -->
          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'admin-votes' }">
              <i class="bi bi-check-all"></i> <!-- Icon for votes -->
              <p>All Votes</p>
            </router-link>
          </li>
          <!-- End New Admin All Votes Link -->

        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles here if needed. Ensure your existing styles for .sidebar,
   .sidebar-logo, .sidebar-wrapper, .nav-item, .nav-link, etc., are properly defined
   elsewhere (e.g., in global CSS or a parent component).
*/
</style>