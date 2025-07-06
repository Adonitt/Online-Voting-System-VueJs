<script setup>
import { ref } from "vue";
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";

const sidebarVisible = ref(true);
const isAdmin = true; // ose nga authStore

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
  <div id="app">
    <!-- Sidebar merr prop visible -->
    <the-side-bar :visible="sidebarVisible" :is-admin="isAdmin" />

    <div class="main-panel">
      <!-- NavBar lanson event toggle-sidebar -->
      <the-nav-bar @toggle-sidebar="toggleSidebar" />

      <div class="container">
        <router-view />
      </div>
      <the-footer />
    </div>
  </div>
</template>
