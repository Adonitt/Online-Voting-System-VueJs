<script setup>
import { ref } from 'vue';
import TheSideBar from './TheSideBar.vue';
import TheNavBar from './TheNavBar.vue';
import TheFooter from '@/components/ui/TheFooter.vue';

const sidebarVisible = ref(false);

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value;
}
</script>

<template>
  <div id="app">
    <TheSideBar :visible="sidebarVisible" :is-admin="true" />  <!-- ose boolean sipas rolit -->

    <div class="main-panel">
      <TheNavBar @toggle-sidebar="toggleSidebar" />

      <div class="container">
        <router-view />
      </div>

      <TheFooter />
    </div>
  </div>
</template>
