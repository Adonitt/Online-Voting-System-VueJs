<!-- TheLayout.vue -->
<script setup>
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";
</script>

<template>
  <div id="app">
    <the-side-bar/>

    <div class="main-panel">
      <the-nav-bar/>

      <div class="container">
        <router-view/>
      </div>
      <the-footer/>
    </div>

  </div>
</template>
