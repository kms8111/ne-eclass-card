import type { TimerInfo } from '~/types/common';

const runtimeConfig = useRuntimeConfig();

export const useCommonStore = defineStore('common', () => {
  // API 호스트 주소
  const apiHost = runtimeConfig.public.lmsHost;
  // Content 호스트 주소
  const contentHost = runtimeConfig.public.lmsHost;
  // 개발 호스트 목록
  const devHosts = ['localhost', 'moimin.com', apiHost];

  // 오디오 플레이어
  const audioPlayer = new Audio();
  const audioPlayingMap = ref<Record<string, boolean>>({});
  const isPlaying = ref(false);

  // 타이머 정보
  const timerInfo = ref<TimerInfo>({
    timer: null,
    duration: 0,
    currentTime: 0,
    hurryTime: 0,
    isStop: true,
    isPause: false,
  });

  // 모바일 기기 여부 (태블릿 포함)
  const isMobileDevice = ref(navigator.userAgentData?.mobile);

  const setIsMobileDevice = (value: boolean) => {
    isMobileDevice.value = value;
  };

  return {
    apiHost,
    contentHost,
    devHosts,
    audioPlayer,
    audioPlayingMap,
    isPlaying,
    timerInfo,
    isMobileDevice,
    setIsMobileDevice,
  };
});
