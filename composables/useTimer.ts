import type { TimerInfo } from '~/types/common';

export const useTimer = (options: any = {}) => {
  const { onTick } = options;
  const commonStore = useCommonStore();
  const { timerInfo } = storeToRefs(commonStore);

  const duration = computed(() => timerInfo.value.duration);
  const currentTime = computed(() => timerInfo.value.currentTime);
  const hurryTime = computed(() => timerInfo.value.hurryTime);
  const timeText = computed(() =>
    parseDuration(duration.value - currentTime.value)
  );
  const timerPercent = computed(() => {
    const percent = (currentTime.value / duration.value) * 100;
    return `${percent}%`;
  });
  const isStarted = computed(() => currentTime.value > 0);
  const isStop = computed(() => timerInfo.value.isStop);
  const isPause = computed(() => timerInfo.value.isPause);
  const isHurry = computed(() => {
    return hurryTime.value > 0 && currentTime.value >= hurryTime.value;
  });

  const setTimerInfo = (value: Partial<TimerInfo>) => {
    timerInfo.value = { ...timerInfo.value, ...value };
  };

  const startTimer = () => {
    setTimerInfo({ isStop: false });
    const timerTickTime = 25;

    timerInfo.value.timer = setInterval(() => {
      if (isStop.value || isPause.value) return;

      timerInfo.value.currentTime += timerTickTime;

      const isTimerEnd = currentTime.value >= duration.value;
      if (isTimerEnd) stopTimer();
      else {
        if (typeof onTick === 'function')
          onTick(currentTime.value, timerTickTime);
      }
    }, timerTickTime);
  };

  const pauseTimer = () => {
    timerInfo.value.isPause = true;
  };

  const resumeTimer = () => {
    timerInfo.value.isPause = false;
  };

  const stopTimer = () => {
    if (timerInfo.value.timer) clearTimeout(timerInfo.value.timer);
    setTimerInfo({ isStop: true });
  };

  const resetTimer = () => {
    timerInfo.value.currentTime = 0;
    stopTimer();
  };

  return {
    timerInfo,
    duration,
    currentTime,
    timeText,
    timerPercent,
    isStarted,
    isStop,
    isHurry,
    setTimerInfo,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer,
  };
};
