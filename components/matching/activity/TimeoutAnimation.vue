<template>
  <div class="matching-timer-over">
    <div
      class="matching-timer-over__text animate__animated"
      :class="{
        animate__bounceInRight: isStartedAnimation,
        animate__backOutLeft: isEndedAnimation,
      }"
    >
      Time's Up!
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['complete']);

const isStartedAnimation = ref(false);
const isEndedAnimation = ref(false);

const { playSound } = useAudio();

const startReadyAnimation = () => {
  isStartedAnimation.value = true;

  setTimeout(() => {
    playSound('incorrect');
  }, 500);

  setTimeout(() => {
    isStartedAnimation.value = false;
    isEndedAnimation.value = true;

    setTimeout(() => emits('complete'), 500);
  }, 2000);
};

startReadyAnimation();
</script>
