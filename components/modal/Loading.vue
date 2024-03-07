<template>
  <div v-if="isShowLoading" class="loading">
    <div class="loading-wrap">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />

      <div>잠시만 기다려주세요...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isShowLoading } = useModal();
</script>
