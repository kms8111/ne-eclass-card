<template>
  <div class="test">
    <!-- 학습 진행 단계에 따른 페이지 -->
    <TestReady :studyType="studyType" v-if="studyPage === 'ready'" />
    <TestActivity :studyType="studyType" v-else-if="studyPage === 'activity'" />
    <TestComplete v-else-if="studyPage === 'complete'" />
  </div>
</template>

<script setup lang="ts">
const studyStore = useStudyStore();
const { classMode, studyType, studyPage } = storeToRefs(studyStore);
</script>
