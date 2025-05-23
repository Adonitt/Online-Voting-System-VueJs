<script setup>


import {useAppToast} from "@/composables/useAppToast.js";
import {useAuthStore} from "@/stores/authStore.js";
import {useRouter} from "vue-router";
import {onErrorCaptured} from "vue";

const {showError} = useAppToast()
const store = useAuthStore()
const router = useRouter()

onErrorCaptured((err) => {
  console.log(err)

  if (err.response && (err.response.status === 401 || err.response.status === 403)) {
    store.logout()
    showError(err.response?.data?.message || 'Session expired! Please log in again.')

    setTimeout(() => {
      router.push({name: 'login'});
    }, 100)
    return
  }

  showError(err.response?.data?.message || 'An error occured!.')
  return false;
})

</script>

<template>
  <slot/>
</template>

<style scoped>

</style>