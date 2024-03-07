import type { SettingInfo } from '@/types/setting';

export const useSettingStore = defineStore('setting', () => {
  const settingInfo = ref<SettingInfo>({
    version: 1,
    audioSpeed: 1,
    studyMethod: {
      memorize: 'free',
      recall: 'free',
      spell: 'free',
    },
    matching: {
      score: 1000,
      duration: 3,
    },
    test: {
      goalScore: 70,
      answerSpeed: 'normal',
      limitCount: 3,
      isShuffle: true,
      isOnlyIncorrect: false,
      isStrictAnswer: false,
      question: {
        // 테스트 문항 정보
        word: {
          // 단어 교재일 때의 문항 정보
          multiple: {
            // 단어 교재의 객관식 문항 정보
            word: 2, // 단어제시(의미선택)
            meaning: 2, // 의미제시(단어선택)
            audio: 0, // 발음제시(의미선택)
            example: 0, // 예문제시(단어선택)
          },
          typing: {
            // 단어 교재의 주관식 문항 정보
            word: 2, // 단어제시(의미입력)
            meaning: 2, // 의미제시(단어입력)
            audio: 0, // 발음제시(단어입력)
            example: 0, // 예문제시(단어입력)
          },
        },
        sentence: {
          // 문장 교재일 때의 문항정보
          chunk: 2, // 어순배열
          writing: 2, // 문장입력
          dictation: 2, // 딕테이션
        },
      },
    },
  });

  const isShowSetting = ref(false);
  const testSettingInfo = computed(() => settingInfo.value?.test);
  const isOnlyIncorrect = computed(() => testSettingInfo.value.isOnlyIncorrect);

  const setSettingInfo = (info: SettingInfo) => {
    settingInfo.value = info;
  };

  const showSetting = () => {
    isShowSetting.value = true;
  };

  const hideSetting = () => {
    isShowSetting.value = false;
  };

  return {
    settingInfo,
    testSettingInfo,
    isShowSetting,
    isOnlyIncorrect,
    setSettingInfo,
    showSetting,
    hideSetting,
  };
});
