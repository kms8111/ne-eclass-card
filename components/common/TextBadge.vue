<template>
  <div class="text-badge" :class="type">{{ label }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'correct' | 'incorrect';
  label: String;
}>();
const { label, type } = toRefs(props);
</script>
