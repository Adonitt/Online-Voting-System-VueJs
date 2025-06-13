<script setup>


import {useAppToast} from "@/composables/useAppToast.js";
import {useAuthStore} from "@/stores/authStore.js";
import {useRouter} from "vue-router";
import {onErrorCaptured} from "vue";

const {showError} = useAppToast()
const store = useAuthStore()
const router = useRouter()
onErrorCaptured((err) => {
  const status = err?.response?.status;


  if (status === 401 || status === 403) {
    store.logout();
    showError(err.response?.data?.message || 'Unauthorized. Please log in again.');
    setTimeout(() => router.push({ name: 'login' }), 200);
    return false;
  }

  if (err?.handled) {
    return false;
  }

  showError(err.response?.data?.message || 'An unexpected error occurred.');
  console.log(err)
  return false;
});


</script>

<template>
  <slot/>
</template>

<style scoped>

</style>