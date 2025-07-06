<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import { computed, ref } from "vue";

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);
const sidebarOpen = ref(false);
</script>

<template>
  <!-- HAMBURGER BUTTON: Only visible on mobile -->
  <button
      class="hamburger-btn"
      @click="sidebarOpen = !sidebarOpen"
  >
    <i class="fas fa-bars"></i>
  </button>

  <div class="sidebar" :class="{ open: sidebarOpen }">
    <div class="sidebar-logo">
      <div class="logo-header" data-background-color="white">
        <router-link :to="{ name: 'home' }" class="logo">
          <img
              src="@/assets/img/foto/ks.jpeg"
              alt="navbar brand"
              class="navbar-brand"
              height="50px"
              width="50px"
          />
        </router-link>
      </div>
    </div>
    <div class="sidebar-wrapper scrollbar scrollbar-inner">
      <div class="sidebar-content">
        <ul class="nav nav-secondary">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" @click="sidebarOpen = false">
              <i class="fas fa-home"></i>
              <p>Results</p>
            </router-link>
          </li>

          <li class="nav-section">
            <h4 class="text-section">Components</h4>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'party' }" @click="sidebarOpen = false">
              <i class="bi-flag"></i>
              <p>Parties</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'candidates' }" @click="sidebarOpen = false">
              <i class="bi-file-person"></i>
              <p>Candidates</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'cast-vote' }" @click="sidebarOpen = false">
              <i class="bi-pen"></i>
              <p>Cast Vote</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'admin-users' }" @click="sidebarOpen = false">
              <i class="bi bi-people"></i>
              <p>All Registered Users</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'admin-votes' }" @click="sidebarOpen = false">
              <i class="bi bi-check-all"></i>
              <p>All Users that has Voted</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'candidate-results' }" @click="sidebarOpen = false">
              <i class="bi bi-person"></i>
              <p>Candidate Results</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'my-profile' }" @click="sidebarOpen = false">
              <i class="bi-person"></i>
              <p>My Profile</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background: #f4f4f4;
  height: 100vh;
  transition: transform 0.3s ease-in-out;
}

.hamburger-btn {
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  background: white;
  border: none;
  font-size: 24px;
  z-index: 1001;
  padding: 6px 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    z-index: 1000;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .hamburger-btn {
    display: block;
  }
}
</style>
