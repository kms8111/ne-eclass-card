<template>
  <div class="switch">
    <div class="switch-label">{{ label }}</div>
    <div class="switch-input">
      <InputSwitch v-model="isOn" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { label } = defineProps<{ label: string }>();

const isOn = defineModel<boolean>();
</script>
