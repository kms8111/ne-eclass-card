<template>
  <div class="matching-result">
    <div class="matching-result-score">
      <div class="label">Your Score</div>
      <div class="value">{{ currentScore }}</div>
    </div>

    <div class="matching-result-buttons">
      <CommonActivityButton
        label="재도전"
        severity="success"
        @click="handleRetry"
      />
      <CommonActivityButton
        outlined
        label="종료"
        severity="help"
        @click="endStudy(true)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { endStudy } = useStudy();
const { currentScore } = useMatching();

const handleRetry = () => {
  turnOffPreventClose();
  location.reload();
};
</script>
