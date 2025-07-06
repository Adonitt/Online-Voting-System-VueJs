<!-- TheLayout.vue -->
<script setup>
import { ref } from "vue";
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";

const sidebarVisible = ref(false);

const handleSidebarToggle = () => {
  sidebarVisible.value = !sidebarVisible.value;
  console.log("Sidebar visible:", sidebarVisible.value);
};
</script>

<template>
  <div id="app" class="d-flex">
    <!-- Desktop sidebar: gjithmonë e dukshme -->
    <the-side-bar class="d-none d-lg-block" />

    <!-- Mobile sidebar toggle -->
    <the-side-bar
        v-if="sidebarVisible"
        class="d-lg-none position-fixed"
        style="z-index: 1050; background:white; width:250px; height:100vh;"
    />

    <div class="main-panel flex-grow-1">
      <the-nav-bar @toggleSidebar="handleSidebarToggle" />

      <router-view />
    </div>
  </div>
</template>
