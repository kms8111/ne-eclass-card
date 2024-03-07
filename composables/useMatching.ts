import type {
  MatchingOptionAnswer,
  MatchingOptionWord,
} from '~/types/matching';
import {
  MATCHING_QUESTION_DURATION,
  MATCHING_OPTION_COUNT,
} from '~/constants/matching';

export const useMatching = () => {
  const studyStore = useStudyStore();
  const settingStore = useSettingStore();
  const matchingStore = useMatchingStore();

  const { wordInfos, classId, studentId } = storeToRefs(studyStore);
  const {
    recordInfos,
    currentTime,
    currentScore,
    optionWords,
    optionAnswers,
    selectedWordIndex,
    selectedAnswerIndex,
    isShowFeedback,
  } = storeToRefs(matchingStore);
  const { settingInfo } = storeToRefs(settingStore);
  const { showConfirm } = useModal();
  const { fetchGameRecord, sendGameRecord } = useApi();
  const { playAudio, playSound } = useAudio();

  const totalDuration = computed(() => {
    const settingDuration = settingInfo.value.matching?.duration;
    return settingDuration * 1000 * 60;
  });
  const questionDuration = ref(MATCHING_QUESTION_DURATION);

  const currentTimeText = computed(() =>
    parseDuration(totalDuration.value - currentTime.value)
  );

  const saveRecord = async (score: number) => {
    try {
      const endTime = parseTimestamps(new Date().getTime());

      const response = await sendGameRecord(
        classId.value,
        studentId.value,
        'MATCHING',
        score,
        endTime
      );
      console.log('response', response);
    } catch (error) {
      console.log('saveRecord() - error', error);
    }
  };

  const loadRecords = async () => {
    try {
      const { data } = await fetchGameRecord(classId.value);
      console.log('data', data);
      recordInfos.value = data.evalList ?? [];
    } catch (error) {
      console.log('loadRecords() - error', error);
    }
  };

  const checkAnswerExist = (
    words: MatchingOptionWord[],
    answers: MatchingOptionAnswer[]
  ) => {
    const isAnswerExist = answers.some(answer => words.includes(answer));

    return isAnswerExist;
  };

  const changeCurrentTime = (_, tickTime: number) => {
    currentTime.value += tickTime;
  };

  const addScore = (score: number) => {
    currentScore.value += score;
  };

  const checkAnswer = (wordIndex: number, answerIndex: number) => {
    const word = optionWords.value[wordIndex];
    const answer = optionAnswers.value[answerIndex];

    let isCorrect = word.cardId === answer.cardId;

    // 피드백 보여주기
    isShowFeedback.value = true;

    // 정답일 경우 점수 추가
    if (isCorrect) {
      addScore(100);
      playSound('correct');
    }

    // 오답일 경우 효과음 및 단어 음원 재생
    else {
      playSound('incorrect');
    }

    // 정답 단어 음원 재생
    playAudio(word.audio);

    // 피드백 2초 후 다음 문제로 넘어가기
    setTimeout(() => {
      changeOption(wordIndex, answerIndex);

      isShowFeedback.value = false;
      selectedWordIndex.value = -1;
      selectedAnswerIndex.value = -1;
    }, 2000);
  };

  const selectWord = (wordIndex: number) => {
    if (selectedWordIndex.value === wordIndex) {
      selectedWordIndex.value = -1;
    } else {
      selectedWordIndex.value = wordIndex;
    }

    if (selectedWordIndex.value > -1 && selectedAnswerIndex.value > -1) {
      checkAnswer(selectedWordIndex.value, selectedAnswerIndex.value);
    }
  };

  const selectAnswer = (answerIndex: number) => {
    if (selectedAnswerIndex.value === answerIndex) {
      selectedAnswerIndex.value = -1;
    } else {
      selectedAnswerIndex.value = answerIndex;
    }

    if (selectedWordIndex.value > -1 && selectedAnswerIndex.value > -1) {
      checkAnswer(selectedWordIndex.value, selectedAnswerIndex.value);
    }
  };

  const changeOption = (wordIndex: number, answerIndex: number): void => {
    // 현재 보여지는 단어와 정답을 제외한 단어와 정답을 가져옴
    const uniqueWords = wordInfos.value.filter(
      word => !optionWords.value.some(option => option.cardId === word.cardId)
    );
    const uniqueAnswers = wordInfos.value.filter(
      word => !optionAnswers.value.some(option => option.cardId === word.cardId)
    );

    // 새로운 단어와 정답을 가져와서 기존 단어와 정답을 변경
    const newWord = getRandomItem(uniqueWords);
    const newAnswer = getRandomItem(uniqueAnswers);

    const newWords = optionWords.value.map((word, index) => {
      if (index === wordIndex) return newWord;
      return word;
    });
    const newAnswers = optionAnswers.value.map((answer, index) => {
      if (index === answerIndex) return newAnswer;
      return answer;
    });

    // 변경된 단어와 정답에 정답이 있는지 확인
    const isAnswerExist = checkAnswerExist(newWords, newAnswers);
    if (!isAnswerExist) {
      // 정답이 없으면 다시 변경하기
      return changeOption(wordIndex, answerIndex);
    }

    // 변경된 단어와 정답으로 업데이트
    optionWords.value = newWords;
    optionAnswers.value = newAnswers;
  };

  const makeOptions = (): void => {
    const words = shuffleArray(wordInfos.value).slice(0, MATCHING_OPTION_COUNT);
    const answers = shuffleArray(wordInfos.value).slice(
      0,
      MATCHING_OPTION_COUNT
    );

    // 만든 options에 정답이 있는지 확인
    const isAnswerExist = checkAnswerExist(words, answers);
    if (!isAnswerExist) {
      // 정답이 없으면 다시 만들기
      return makeOptions();
    }

    optionWords.value = words;
    optionAnswers.value = answers;
  };

  const stopMatching = () => {
    showConfirm('매칭을 중단 하시겠습니까?', {
      onClick: async (isConfirm: boolean) => {
        if (isConfirm) {
          await saveRecord(currentScore.value);
          turnOffPreventClose();
          location.reload();
        }
      },
    });
  };

  return {
    recordInfos,
    totalDuration,
    questionDuration,
    currentTime,
    currentTimeText,
    currentScore,
    optionWords,
    optionAnswers,
    selectedWordIndex,
    selectedAnswerIndex,
    isShowFeedback,
    addScore,
    selectWord,
    selectAnswer,
    changeOption,
    makeOptions,
    changeCurrentTime,
    saveRecord,
    loadRecords,
    stopMatching,
  };
};
