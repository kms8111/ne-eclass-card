<template>
  <CommonEntryPage studyMode="test" />
</template>

<script setup lang="ts">
const studyStore = useStudyStore();
const { studyPage } = storeToRefs(studyStore);
const { prepareQuestions } = useQuestion();

// 학습 Page가 Activity로 변경되면 문항 재생성
watch(studyPage, () => {
  if (studyPage.value === 'activity') {
    prepareQuestions();
  }
});
</script>
