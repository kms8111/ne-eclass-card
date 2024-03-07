import type {
  MatchingOptionAnswer,
  MatchingOptionWord,
  MatchingRecordInfo,
} from '~/types/matching';

export const useMatchingStore = defineStore('matching', () => {
  const recordInfos = ref<MatchingRecordInfo[]>([]);
  const currentTime = ref(0);
  const currentScore = ref(0);

  const optionWords = ref<MatchingOptionWord[]>([]);
  const optionAnswers = ref<MatchingOptionAnswer[]>([]);
  const selectedWordIndex = ref(-1);
  const selectedAnswerIndex = ref(-1);

  const isShowFeedback = ref(false);

  return {
    recordInfos,
    currentTime,
    currentScore,
    optionWords,
    optionAnswers,
    selectedWordIndex,
    selectedAnswerIndex,
    isShowFeedback,
  };
});
