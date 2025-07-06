<script setup>
import { ref } from "vue";
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";

const sidebarVisible = ref(false);

const handleSidebarToggle = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
  <div id="app" class="d-flex">
    <!-- Sidebar for desktop, gjithmonë i dukshëm -->
    <the-side-bar class="d-none d-lg-block" />

    <!-- Sidebar for mobile, shfaqet sipas toggle -->
    <the-side-bar v-if="sidebarVisible" class="d-lg-none position-fixed" style="z-index: 1050;" />

    <div class="main-panel flex-grow-1">
      <the-nav-bar @toggleSidebar="handleSidebarToggle" />

      <div class="container">
        <router-view />
      </div>

      <the-footer />
    </div>
  </div>
</template>
