<script setup>
import {ref} from "vue";
import TheSideBar from "@/components/ui/TheSideBar.vue";
import TheNavBar from "@/components/ui/TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <div id="app" class="d-flex">
    <!-- Hamburger button për mobile -->
    <button
        class="btn btn-primary d-lg-none m-2"
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
    >
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar me klasë dinamike -->
    <the-side-bar v-show="sidebarOpen || window.innerWidth >= 992"/>

    <div class="main-panel flex-grow-1">
      <the-nav-bar :close-sidebar="() => (sidebarOpen.value = false)"/>
      <div class="container">
        <router-view/>
      </div>
      <the-footer/>
    </div>
  </div>
</template>
