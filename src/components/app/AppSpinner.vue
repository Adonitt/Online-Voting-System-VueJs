<script setup>

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<style scoped>

</style>