<script setup>
import { ref } from 'vue';
import TheSideBar from './TheSideBar.vue';
import TheNavBar from './TheNavBar.vue';

const sidebarVisible = ref(false);

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value;
}
</script>

<template>
  <div id="app">
    <!-- Sidebar me prop për visibility -->
    <TheSideBar :visible="sidebarVisible" />

    <div class="main-panel">
      <!-- Navbar me event për toggle -->
      <TheNavBar @toggle-sidebar="toggleSidebar" />

      <div class="container mt-3">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-panel {
  margin-left: 250px; /* sidebar width */
  transition: margin-left 0.3s ease;
}

@media (max-width: 991px) {
  .main-panel {
    margin-left: 0;
  }
}
</style>
