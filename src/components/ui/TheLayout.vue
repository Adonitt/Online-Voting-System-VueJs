<script setup>
import { ref } from "vue";
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";

const sidebarVisible = ref(true); // visible by default

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
  <div id="app" class="d-flex">
    <the-side-bar v-if="sidebarVisible" />

    <div class="main-panel w-100">
      <the-nav-bar @toggleSidebar="toggleSidebar" />

      <div class="container">
        <router-view />
      </div>

      <the-footer />
    </div>
  </div>
</template>
