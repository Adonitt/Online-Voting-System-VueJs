<script setup>
import { defineProps, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';

const props = defineProps({
  visible: Boolean,
});

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);
</script>

<template>
  <aside
      class="sidebar"
      :class="{ 'sidebar--visible': props.visible }"
  >
    <div class="sidebar-logo">
      <div class="logo-header" data-background-color="white">
        <router-link :to="{ name: 'home' }" class="logo">
          <img
              src="@/assets/img/foto/ks.jpeg"
              alt="navbar brand"
              class="navbar-brand"
              height="50"
              width="50"
          />
        </router-link>
      </div>
    </div>

    <div class="sidebar-wrapper scrollbar scrollbar-inner">
      <div class="sidebar-content">
        <ul class="nav nav-secondary">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }">
              <i class="fas fa-home"></i>
              <p>Results</p>
            </router-link>
          </li>

          <li class="nav-section">
            <h4 class="text-section">Components</h4>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'party' }">
              <i class="bi-flag"></i>
              <p>Parties</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'candidates' }">
              <i class="bi-file-person"></i>
              <p>Candidates</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'cast-vote' }">
              <i class="bi-pen"></i>
              <p>Cast Vote</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'admin-users' }">
              <i class="bi bi-people"></i>
              <p>All Registered Users</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'admin-votes' }">
              <i class="bi bi-check-all"></i>
              <p>All Users that has Voted</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'candidate-results' }">
              <i class="bi bi-person"></i>
              <p>Candidate Results</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'my-profile' }">
              <i class="bi-person"></i>
              <p>My Profile</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: white;
  box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 9999;
  overflow-y: auto;
}

.sidebar--visible {
  transform: translateX(0);
}

/* Sidebar always visible on desktop */
@media (min-width: 992px) {
  .sidebar {
    transform: translateX(0) !important;
  }
}
</style>
