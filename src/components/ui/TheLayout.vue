<script setup>
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";
import {ref} from "vue";

const sidebarVisible = ref(true);

const handleSidebarToggle = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
  <div id="app" class="app-container">
    <transition name="sidebar-fade">
      <the-side-bar v-if="sidebarVisible"/>
    </transition>

    <div class="main-panel">
      <the-nav-bar @toggle-sidebar="handleSidebarToggle"/>

      <div class="container mt-4">
        <router-view/>
      </div>

      <the-footer/>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

the-side-bar {
  width: 250px;
  min-width: 250px;
  background: #fff;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.main-panel {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Animacion per sidebar fade */
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.3s ease;
}

.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
}
</style>
