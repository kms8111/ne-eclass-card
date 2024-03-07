<template>
  <span class="study-card__bottom-answer__text">{{ text }}</span>
</template>

<script setup lang="ts">
const { text } = defineProps<{ text: string }>();
</script>
