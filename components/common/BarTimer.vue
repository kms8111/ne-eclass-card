<template>
  <div class="progress-timer">
    <div
      class="progress-timer__bar"
      :class="{ 'bar-red': isBarRed || isHurry }"
      :style="{ width: timerPercent }"
    ></div>

    {{ isHurry }}
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['start', 'tick', 'end']);

const props = defineProps<{
  duration: number;
  hurryTime?: number;
  delay?: number;
  isBarRed?: boolean;
}>();

const { hurryTime, duration, delay } = toRefs(props);
const {
  timerPercent,
  isStarted,
  isStop,
  isHurry,
  setTimerInfo,
  startTimer,
  stopTimer,
} = useTimer({
  onTick: (time: number, tickTime: number) => emits('tick', time, tickTime),
});

const handleStartTimer = () => {
  emits('start');

  console.log('duration.value', duration.value);
  console.log('hurryTime.value', hurryTime.value);

  setTimerInfo({
    duration: duration.value,
    hurryTime: hurryTime.value,
  });

  if (delay.value) {
    setTimeout(() => {
      startTimer();
    }, delay.value);
  } else {
    startTimer();
  }
};

watch(
  () => isStop.value,
  () => {
    if (isStarted.value && isStop.value) {
      emits('end');
    }
  }
);

onUnmounted(stopTimer);
onMounted(handleStartTimer);
</script>
