<script setup>
import TheLayout from "@/components/ui/TheLayout.vue";
import AuthView from "@/views/auth/AuthView.vue";
import {useAuthStore} from "@/stores/authStore.js";
import ErrorBoundary from "@/components/shared/ErrorBoundary.vue";

const authStore = useAuthStore()
</script>

<template>

  <error-boundary>
<!--    <main>-->
<!--      <auth-view v-if="!authStore.isLoggedIn)" />-->
<!--      <the-layout v-else/>-->
<!--    </main>-->
    <router-view/>

  </error-boundary>

</template>

<style scoped>
</style>
