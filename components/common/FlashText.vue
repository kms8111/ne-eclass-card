<template>
  <div class="flash-text">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
const { text, duration = 2000 } = defineProps({
  text: String,
  duration: Number,
});

const emits = defineEmits(['done']);

const done = () => {
  emits('done');
};

onMounted(() => {
  setTimeout(() => {
    done();
  }, duration);
});
</script>
