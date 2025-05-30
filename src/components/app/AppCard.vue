<script setup>

</script>

<template>
  <div class="card">
    <div class="card-header">
      <slot name="header"/>
    </div>
    <div class="card-body">
      <!-- nese se emertoni ky slot eshte slot-i default -->
      <slot/>
    </div>
  </div>
</template>

<style scoped>

</style>