<template>
  <StudyActivityBottomWord
    v-if="bookType === 'word'"
    @checkAnswer="checkAnswer"
    @checkWord="checkWord"
  />

  <StudyActivityBottomSentence
    v-else-if="bookType === 'sentence'"
    @checkAnswer="checkAnswer"
    @checkWord="checkWord"
  />
</template>

<script setup lang="ts">
const emits = defineEmits(['checkAnswer', 'checkWord']);

const studyStore = useStudyStore();
const { bookType } = storeToRefs(studyStore);

const checkAnswer = () => emits('checkAnswer');
const checkWord = () => emits('checkWord');
</script>
