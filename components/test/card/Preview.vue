<template>
  <div class="test-card-preview">
    <div class="test-card__top-control">
      <StudyButtonAudio v-if="isAudioBtn" :audio="question.audio" />
    </div>

    <div class="test-card-preview__body">
      <span v-if="!isAudioQuestion">
        {{ questionWord }}
      </span>

      <StudyButtonAudio v-else="isAudioQuestion" :audio="question.audio" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { question, questionWord, isAudioBtn } = useTest();

const isAudioQuestion = computed(() => {
  const { method } = question.value;
  return method === 'audio';
});
</script>
