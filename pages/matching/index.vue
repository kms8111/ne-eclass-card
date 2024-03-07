<template>
  <div class="matching">
    <MatchingReady v-if="studyPage === 'ready'" />
    <MatchingActivity v-else-if="studyPage === 'activity'" />
    <MatchingResult v-else-if="studyPage === 'complete'" />
  </div>
</template>

<script setup lang="ts">
const studyStore = useStudyStore();
const { studyPage } = storeToRefs(studyStore);
</script>
