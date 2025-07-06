<script setup>
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";
import {ref, onMounted, onUnmounted} from 'vue';

const isSidebarOpen = ref(false);
const isUserMenuOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  if (isSidebarOpen.value) {
    document.body.classList.add('sidenav-toggled');
  } else {
    document.body.classList.remove('sidenav-toggled');
  }
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

onMounted(() => {
  // Add a class to body when the component mounts to handle initial sidebar state if needed
  // This is a common pattern for dashboard templates that control sidebar visibility via body classes
});

onUnmounted(() => {
  // Clean up body classes when the component is unmounted
  document.body.classList.remove('sidenav-toggled');
});
</script>

<template>
  <div id="app" :class="{'sidenav-toggled': isSidebarOpen}">
    <the-side-bar/>

    <div class="main-panel">
      <div class="main-header">
        <div class="logo-header" data-background-color="dark">
          <a href="index.html" class="logo">
            <img src="assets/img/kaiadmin/logo_light.svg" alt="navbar brand" class="navbar-brand" height="20">
          </a>
          <div class="nav-toggle">
            <button class="btn btn-toggle toggle-sidebar" @click="toggleSidebar">
              <i class="gg-menu-right"></i>
            </button>
            <button class="btn btn-toggle sidenav-toggler" @click="toggleSidebar">
              <i class="gg-menu-left"></i>
            </button>
          </div>
          <button class="topbar-toggler more" @click="toggleUserMenu">
            <i class="gg-more-vertical-alt"></i>
          </button>
        </div>
        <the-nav-bar :is-user-menu-open="isUserMenuOpen"/>
      </div>

      <div class="container">
        <router-view/>
      </div>
      <the-footer/>
    </div>
  </div>
</template>
