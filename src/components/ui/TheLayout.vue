
<script setup>
import { ref } from "vue";
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";

const sidebarOpen = ref(false);
</script>

<template>
  <div id="app" class="d-flex">
    <the-side-bar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="main-panel flex-grow-1">
      <the-nav-bar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <div class="container">
        <router-view />
      </div>

      <the-footer />
    </div>
  </div>
</template>

<style scoped>
#app {
  height: 100vh;
  overflow: hidden;
}
.main-panel {
  flex-grow: 1;
  overflow-y: auto;
}
</style>