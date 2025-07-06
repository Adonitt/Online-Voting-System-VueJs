<script setup>
import { ref } from "vue";
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <div id="app" class="d-flex">
    <the-side-bar v-show="sidebarOpen || window.innerWidth >= 992" />

    <div class="main-panel flex-grow-1">
      <the-nav-bar @toggle-sidebar="toggleSidebar" />

      <div class="container">
        <router-view />
      </div>
      <the-footer />
    </div>
  </div>
</template>
