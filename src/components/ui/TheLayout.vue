<script setup>
import {ref} from "vue";
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";

const sidebarVisible = ref(true);

const handleSidebarToggle = () => {
  console.log("Sidebar toggle event received, sidebarVisible:", sidebarVisible.value);
  sidebarVisible.value = !sidebarVisible.value;
  console.log("Sidebar visible after toggle:", sidebarVisible.value);
};

</script>

<template>
  <div id="app" class="app-container" style="display:flex; height: 100vh;">
    <the-side-bar v-if="sidebarVisible"/>

    <div class="main-panel" style="flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column;">
      <the-nav-bar @toggle-sidebar="handleSidebarToggle"/>

      <div class="container mt-4" style="flex-grow: 1;">
        <router-view/>
      </div>

      <the-footer/>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  overflow: hidden;
}
</style>
