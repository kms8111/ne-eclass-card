<template>
  <div class="test-card">
    <TestCardReady v-if="type === 'ready'" @moveNext="emits('moveNext')" />
    <TestCardGuide v-else-if="type === 'guide'" @moveNext="emits('moveNext')" />
    <TestCardPreview v-else-if="type === 'preview'" />
    <TestCardActivity v-else-if="type === 'activity'" />
    <TestCardComplete v-else-if="type === 'complete'" />
  </div>
</template>

<script setup lang="ts">
const { type } = defineProps<{
  type: String;
}>();

const emits = defineEmits(['moveNext']);
</script>
