<!-- TheLayout.vue -->
<script setup>
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";
</script>

<template>
  <div id="app" class="d-flex">
    <the-side-bar/>

    <div class="main-panel w-100">
      <the-nav-bar/>

      <div class="container">
        <router-view/>
      </div>
      <the-footer/>
    </div>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  flex-direction: row;
}
</style>