<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  }
});
</script>

<template>
  <ol class="breadcrumb">
    <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item mt-3 m-lg-2"
        :class="{ active: index === items.length - 1 }"
    >
      <span v-if="index === items.length - 1">{{ item.label }}</span>
      <router-link v-else :to="item.to">{{ item.label }}</router-link>
    </li>
  </ol>
</template>


