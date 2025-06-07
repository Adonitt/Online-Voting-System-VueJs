<script setup>
const model = defineModel({ type: [String, Number, Array, Object] });

defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: "text" },
  isInvalid: { type: Boolean, default: true },
  invalidFeedback: { type: String, default: "This field is required" },
});
</script>

<template>
  <div class="col-md-4 " style="margin-bottom: 25px">
    <label class="form-label" :for="id">{{ label }}</label>
    <input
        :type="type"
        :id="id"
        class="form-control"
        :class="{ 'is-invalid': !isInvalid }"
        v-model="model"
        v-bind="$attrs"
    />
    <div class="invalid-feedback">{{ invalidFeedback }}</div>
  </div>
</template>
