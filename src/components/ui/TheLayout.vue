<!-- TheLayout.vue -->
<script setup>
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";
import {ref} from "vue";

const sidebarVisible = ref(true)
const handleSidebarToggle = () => {
  sidebarVisible.value = !sidebarVisible.value
}


</script>

<template>
  <div id="app">
    <the-side-bar/>

    <div class="main-panel">
      <the-nav-bar @toggleSidebar="handleSidebarToggle"/>

      <div class="container">
        <router-view/>
      </div>
      <the-footer/>
    </div>

  </div>
</template>
