<script setup>
import { ref, onMounted } from 'vue'
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value

}

onMounted(() => {
  sidebarOpen.value = window.innerWidth >= 992
})
</script>

<template>
  <div id="app" :class="{ 'nav_open': sidebarOpen }">
    <the-side-bar :visible="sidebarOpen" @link-clicked="sidebarOpen = false" />

    <div class="main-panel">
      <the-nav-bar @toggle-sidebar="toggleSidebar" />

      <div class="container">
        <router-view />
      </div>

      <the-footer />
    </div>
  </div>
</template>
