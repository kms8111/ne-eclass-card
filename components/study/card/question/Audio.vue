<template>
  <div class="study-card-audio">
    <StudyButtonAudio :audio="audio" />
  </div>
</template>

<script setup lang="ts">
const { audio } = defineProps<{ audio: string }>();
</script>
