import { STUDY_BLANK_TEXT } from '~/constants/study';
import type { TestQuestion, TestQuestionData } from '~/types/test';

export const useTest = () => {
  const studyStore = useStudyStore();

  const { movePage } = studyStore;
  const {
    bookType,
    studyMethod,
    testQuestions,
    testQuestionIndex: questionIndex,
    testData,
    testHistories,
    testTryCount,
    testPreviousQuestions,
    testQuestionTypeInfos,
    incorrectQuestionTypeInfos,
    isIncorrectOnlyTest,
  } = storeToRefs(studyStore);
  const {
    studyAnswerKey,
    studyQuestionKey,
    testMaxQuestionCount,
    getTestQuestionData,
    updateTestQuestionData,
    getIsAnswered,
    moveTestQuestion,
  } = useQuestion();
  const { playSound } = useAudio();
  const { saveStudyData } = useStudyData();
  const { testSettingInfo, isStrictAnswer } = useSetting();

  const question = computed<TestQuestion>(
    () => testQuestions.value[questionIndex.value]
  );
  const questionCount = computed(() => testQuestions.value.length);
  const correctCount = computed(
    () =>
      questionDatas.value.filter(questionData => questionData?.isCorrect).length
  );
  const questionDatas = computed<TestQuestionData[]>(() =>
    testQuestions.value.map(
      question => getTestQuestionData(question.cardId) as TestQuestionData
    )
  );
  const questionData = computed<TestQuestionData | undefined>(() =>
    getTestQuestionData(question.value.cardId)
  );
  const questionWord = computed(() => {
    const { method } = question.value;

    // 문장 교재인 경우
    if (isSentenceBook.value) {
      return question.value['meaning'];
    }

    // 단어 교재인 경우
    else {
      const questionWord = question.value[
        method as keyof typeof question.value
      ] as string;

      // method가 예문(example)일 경우, 중간 {단어} 부분을 정해진 밑줄로 표시
      if (method === 'example')
        return questionWord.replace(/{.+}/, STUDY_BLANK_TEXT);
      else return questionWord;
    }
  });
  const testMethod = computed(() => questionData.value?.method);
  const answers = computed(() => question.value?.answers ?? []);
  const chunkAnswers = computed(() => questionData.value?.chunkAnswers || []);
  const selectedIndexes = ref<number[]>([]);
  const correctAnswers = computed(() => question.value.correctAnswers);
  const correctIndex = computed(() => questionData.value?.correctIndex);
  const selectedIndex = computed(() => questionData.value?.selectedIndex);
  const isSentenceBook = computed(() => bookType.value === 'sentence');
  const isCorrect = computed(
    () => isAnswered.value && questionData.value?.isCorrect
  );
  const isIncorrect = computed(
    () => isAnswered.value && !questionData.value?.isCorrect
  );
  const isAnswered = computed(() => getIsAnswered(question.value.cardId));
  const isAudioBtn = computed(() => {
    const { method } = question.value;
    return method === 'word';
  });

  const checkAnswer = () => {
    // questionData가 없는 경우 return
    if (!questionData.value)
      return console.warn('checkAnswer() - questionData is not exist');
    // 이미 정답이 확인 된 경우 return
    if (isAnswered.value)
      return console.warn('checkAnswer() - already answered');

    const {
      type,
      method,
      meaning,
      word,
      spellAnswer,
      selectedIndex,
      correctAnswers,
      chunkAnswers = [],
      correctIndex,
    } = questionData.value;
    let isCorrect = false;

    // 객관식일 경우
    if (type === 'multiple') {
      isCorrect = selectedIndex === correctIndex;

      updateTestQuestionData({
        isCorrect,
        isAnswered: true,
        studiedAt: Date.now(),
      });
    }

    // 주관식일 경우
    else if (type === 'typing') {
      const correctAnswer = method === 'word' ? meaning : word;
      isCorrect = checkSpellAnswer(
        spellAnswer,
        correctAnswer,
        isStrictAnswer.value
      );

      updateTestQuestionData({
        isCorrect,
        isAnswered: true,
        studiedAt: Date.now(),
      });
    }

    // 문장 학습일 경우
    else if (type === 'sentence') {
      // 문장입력 학습일 경우
      if (method === 'writing') {
        isCorrect = checkSpellAnswer(spellAnswer, word, isStrictAnswer.value);

        updateTestQuestionData({
          isCorrect,
          isAnswered: true,
          studiedAt: Date.now(),
        });
      }

      // 어순배열 학습일 경우
      else if (method === 'chunk') {
        isCorrect = correctAnswers.every(
          (answer, index) => answer === chunkAnswers[index]
        );

        updateTestQuestionData({
          isCorrect,
          isAnswered: true,
          studiedAt: Date.now(),
        });
      }

      // 딕테이션 학습일 경우
      // method === 'writing'과 동일하게 처리
      else if (method === 'dictation') {
        isCorrect = checkSpellAnswer(spellAnswer, word, isStrictAnswer.value);

        updateTestQuestionData({
          isCorrect,
          isAnswered: true,
          studiedAt: Date.now(),
        });
      }
    }

    // 학습 데이터 저장
    saveStudyData();

    // 정/오답 효과음 재생
    if (isCorrect) playSound('correct');
    else playSound('test_incorrect');
  };

  const updateAnswer = (spellAnswer: string) => {
    updateTestQuestionData({ spellAnswer });
  };

  const selectAnswer = (selectedIndex: number) => {
    updateTestQuestionData({ selectedIndex });
    checkAnswer();
  };

  const selectChunk = (chunk: string, chunkIndex: number): boolean => {
    if (!questionData.value) return false;

    const targetIndex = chunkAnswers.value.length;
    const isCorrect = correctAnswers.value[targetIndex] === chunk;

    if (isCorrect) {
      selectedIndexes.value.push(chunkIndex);
      updateTestQuestionData({
        chunkAnswers: [...chunkAnswers.value, chunk],
      });
    }

    return isCorrect;
  };

  const handleNext = () => {
    const isLastQuestion = questionIndex.value === questionCount.value - 1;

    if (isLastQuestion) movePage('complete');
    else {
      const nextIndex = questionIndex.value + 1;
      moveTestQuestion(nextIndex);
    }
  };

  return {
    studyMethod,
    studyAnswerKey,
    studyQuestionKey,
    testPreviousQuestions,
    testMaxQuestionCount,
    testQuestionTypeInfos,
    incorrectQuestionTypeInfos,
    questionIndex,
    question,
    questionDatas,
    questionData,
    questionWord,
    correctCount,
    questionCount,
    testMethod,
    answers,
    chunkAnswers,
    selectedIndexes,
    correctAnswers,
    correctIndex,
    selectedIndex,
    testData,
    testHistories,
    testTryCount,
    isIncorrectOnlyTest,
    isSentenceBook,
    isAnswered,
    isCorrect,
    isIncorrect,
    isAudioBtn,
    movePage,
    moveTestQuestion,
    checkAnswer,
    selectAnswer,
    selectChunk,
    updateAnswer,
    handleNext,
  };
};
