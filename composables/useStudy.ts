import { SENTENCE_STUDY_METHODS, WORD_STUDY_METHODS } from '~/constants/study';
import type { Question, CardPage, QuestionData } from '~/types/study';

export const useStudy = () => {
  const studyStore = useStudyStore();

  const { setStudyMethod, setShowMeanings, movePage, moveQuestion, exitStudy } =
    studyStore;
  const {
    book,
    bookType,
    wordInfos,
    bookWordCount,
    studyMode,
    classId,
    studentId,
    studyType,
    studyMethod,
    studyPage,
    studyData,
    selectedIndexes,
    cardPages,
    questions,
    questionIndex,
    showMeanings,
    showHints,
    isMemorize,
    isRecall,
    isSpell,
    isChecked,
    isShowFlashText,
    isAnimating,
    isQuestionMoving,
    isStudyMethodSelectable,
  } = storeToRefs(studyStore);

  const {
    studyAnswerKey,
    studyQuestionKey,
    setQuestionIndex,
    getQuestionData,
    getIsAnswered,
    updateQuestionData,
    makeQuestions,
    getStartQuestionIndex,
  } = useQuestion();
  const { showConfirm } = useModal();
  const { playAudio } = useAudio();
  const { saveStudyData } = useStudyData();

  const question = computed<Question>(
    () => questions.value[questionIndex.value]
  );
  const questionCount = computed(() => questions.value.length);
  const knownCount = computed(
    () => questionDatas.value?.filter(data => data.isCompleted).length
  );
  const questionDatas = computed<QuestionData[]>(
    () => studyData.value?.questions as QuestionData[]
  );
  const questionData = computed(() => getQuestionData(question.value.cardId));
  const correctAnswers = computed(() => question.value.correctAnswers);
  const chunkAnswers = computed(() => questionData.value?.chunkAnswers || []);
  const selectedAnswers = computed(() => questionData.value?.selectedAnswers);
  const cardPage = computed(() => cardPages.value[questionIndex.value]);
  const isSentenceBook = computed(() => bookType.value === 'sentence');
  const isCompleted = computed(() => questionData.value?.isCompleted || false);
  const isBookmarked = computed(
    () => questionData.value?.isBookmarked || false
  );
  const isAnswered = computed(() => getIsAnswered(question.value.cardId));
  const isIncorrect = computed(
    () => isAnswered.value && isChecked.value && !isCompleted.value
  );
  const isShowHint = computed(() => showHints.value[questionIndex.value]);
  const isNavigation = computed(
    () => bookType.value === 'word' && isMemorize.value
  );
  const isCardPreview = computed(
    () =>
      bookType.value === 'sentence' &&
      isMemorize.value &&
      cardPage.value === 'preview'
  );
  const isFirstLetterCheck = computed(
    () =>
      studyMethod.value === 'writingFirstLetter' ||
      studyMethod.value === 'dictationFirstLetter'
  );
  const isAudioStudy = computed(
    () =>
      studyMethod.value === 'audio' ||
      studyMethod.value === 'dictation' ||
      studyMethod.value === 'dictationFirstLetter'
  );
  const isChunkStudy = computed(
    () =>
      studyMethod.value === 'chunk' ||
      (!isCardPreview.value && isMemorize.value)
  );
  const isImmediateFeedback = computed(
    () =>
      studyMode.value === 'test' ||
      studyMethod.value === 'writingImmediate' ||
      (isSpell.value && isChunkStudy.value)
  );
  const isAudioDisabled = computed(
    () => !isChecked.value && isChunkStudy.value
  );
  const setIsStudyMethodSelectable = (isSelectable: boolean) => {
    isStudyMethodSelectable.value = isSelectable;
  };

  const initStudy = () => {
    isShowFlashText.value = true;
    isChecked.value = false;
    hideMeaningExceptKnown();
  };

  const initQuestion = () => {
    isChecked.value = isCompleted.value;

    if (!isCompleted.value) {
      cardPages.value[questionIndex.value] = 'preview';

      // 선택 답안 초기화
      updateQuestionData({
        selectedIndex: -1,
        spellAnswer: '',
        chunkAnswers: [],
        selectedAnswers: [],
      });
    }

    // chunk, blank 학습일 경우를 위해 선택 단어 초기화
    selectedIndexes.value = [];

    if (isMemorize.value) {
      if (!isSentenceBook.value) {
        // 아직 끝나지 않은 문항들은 의미 가리기
        setTimeout(hideMeaningExceptKnown, 300);
        // 문항 하나의 의미 가리기
        // showMeanings.value[questionIndex.value] = false;
      }
    }
  };

  // const initAnswers = () => {
  //   // 선택 답안 초기화
  //   updateQuestionData({
  //     selectedIndex: -1,
  //     spellAnswer: '',
  //     chunkAnswers: [],
  //   });

  //   markAsKnown(false);
  // };

  const startStudy = () => {
    isShowFlashText.value = false;
    startQuestion();
  };

  const startQuestion = async () => {
    try {
      const isInitAudioPlay = checkIsInitAudio();
      if (isInitAudioPlay) await playAudio(question.value.audio);
    } catch (error) {
      console.error('startQuestion() - error', error);
    }

    // memorize 학습이 아닐 때는 학습 카드의 Cover 바로 내림
    const isRemoveCover = !isMemorize.value;
    if (isRemoveCover)
      setTimeout(() => (showMeanings.value[questionIndex.value] = true), 100);
  };

  const retryQuestion = () => {
    markAsKnown(false);
    initQuestion();
    startQuestion();
  };

  const markAsKnown = (isCompleted: boolean) => {
    updateQuestionData({ isCompleted });
    saveStudyData();
  };

  const toggleBookmark = () => {
    updateQuestionData({ isBookmarked: !isBookmarked.value });
    saveStudyData();
  };

  const hideMeaningExceptKnown = () => {
    const showMeanings = questions.value.map(question => {
      const questionData = getQuestionData(question.cardId);
      return questionData?.isCompleted || false;
    });

    setShowMeanings(showMeanings);
  };

  const moveCardPage = (page: CardPage) => {
    cardPages.value[questionIndex.value] = page;
  };

  const updateAnswer = (spellAnswer: string) => {
    updateQuestionData({ spellAnswer });
  };

  const selectChunk = (chunk: string, chunkIndex: number): boolean => {
    if (!questionData.value) return false;

    const targetIndex = chunkAnswers.value.length;
    const isCorrect = correctAnswers.value?.[targetIndex] === chunk;

    if (isCorrect) {
      selectedIndexes.value.push(chunkIndex);
      updateQuestionData({
        chunkAnswers: [...chunkAnswers.value, chunk],
      });
    }

    return isCorrect;
  };

  const completeWord = async (isCompleted: boolean = false) => {
    if (isAnimating.value) return;

    const isChangedToKnown = !questionData.value?.isCompleted && isCompleted;
    if (isChangedToKnown) {
      markAsKnown(true);
      isAnimating.value = true;
      await sleep(1000);
      isAnimating.value = false;
    }

    handleNext();
  };

  const handleNext = () => {
    const isAllKnown = knownCount.value === questionCount.value;
    if (isAllKnown) movePage('complete');
    else if (isMemorize.value) {
      const nextIndex = questionIndex.value + 1;
      handleMoveQuestion(nextIndex);
    } else {
      const firstUnknownIndex = questions.value.findIndex(
        question => !getQuestionData(question.cardId)?.isCompleted
      );
      const nextUnknownIndex = questions.value.findIndex(
        (question, index) =>
          index > questionIndex.value &&
          !getQuestionData(question.cardId)?.isCompleted
      );

      if (nextUnknownIndex > -1) handleMoveQuestion(nextUnknownIndex);
      else handleMoveQuestion(firstUnknownIndex);
    }
  };

  const handleMoveQuestion = (index: number) => {
    if (isAnimating.value || isQuestionMoving.value) return;
    isQuestionMoving.value = true;

    const isIndexLessThanZero = index < 0;
    const isIndexOutOfRange = index >= questionCount.value;
    if (isIndexOutOfRange) index = 0;
    else if (isIndexLessThanZero) index = questionCount.value - 1;

    moveQuestion(index);
    initQuestion();
    setTimeout(() => {
      isQuestionMoving.value = false;
      startQuestion();
    }, 300);
  };

  const checkIsInitAudio = () => {
    // 시작 시 음성 재생 studyMethod
    const initAudioStudyMethods = [
      'word',
      'audio',
      'dictation',
      'dictationFirstLetter',
    ];

    const isInitAudioMethod = initAudioStudyMethods.includes(studyMethod.value);
    const isSentenceInitAudio = isSentenceBook.value && isMemorize.value;
    const isInitAudio = isInitAudioMethod || isSentenceInitAudio;

    return isInitAudio;
  };

  // 해당 교재에 예문이 있는지 확인
  const checkExampleExist = () => {
    return book.value?.wordInfos.some(wordInfo => !!wordInfo.example);
  };

  const getStudentOptionInfo = () => {
    const studentOptionInfo = localStorage.getItem('studentOptionInfo');
    if (studentOptionInfo) return JSON.parse(studentOptionInfo);
    else return {};
  };

  const saveStudentOption = (data: object) => {
    const studentOptionInfo = getStudentOptionInfo();
    studentOptionInfo[studentId.value] = {
      ...studentOptionInfo[studentId.value],
      ...data,
    };
    localStorage.setItem(
      'studentOptionInfo',
      JSON.stringify(studentOptionInfo)
    );
  };

  const saveStudyMethod = () => {
    const studyMethodKey = `${bookType.value}-${studyType.value}`;
    saveStudentOption({ [studyMethodKey]: studyMethod.value });
  };

  const loadStudyMethod = () => {
    const studentOptionInfo = getStudentOptionInfo();
    const studyMethodKey = `${bookType.value}-${studyType.value}`;
    const studyMethod = studentOptionInfo[studentId.value]?.[studyMethodKey];
    if (studyMethod) setStudyMethod(studyMethod);
    else {
      const defaultStudyMethod = isSentenceBook.value
        ? SENTENCE_STUDY_METHODS[0]
        : WORD_STUDY_METHODS[0];
      setStudyMethod(defaultStudyMethod);
    }
  };

  const endStudy = async (isStudyCompleted: boolean) => {
    showConfirm('학습을 종료하시겠습니까?', {
      onClick: (isConfirm: boolean) => {
        if (isConfirm) {
          exitStudy(isStudyCompleted);
        }
      },
    });
  };

  return {
    book,
    bookType,
    wordInfos,
    bookWordCount,
    classId,
    isShowFlashText,
    isChecked,
    studyType,
    studyMethod,
    studyPage,
    showMeanings,
    showHints,
    studyAnswerKey,
    studyQuestionKey,
    questions,
    questionIndex,
    question,
    questionData,
    questionCount,
    knownCount,
    correctAnswers,
    chunkAnswers,
    selectedAnswers,
    selectedIndexes,
    isSentenceBook,
    isMemorize,
    isRecall,
    isSpell,
    isCompleted,
    isBookmarked,
    isAnswered,
    isIncorrect,
    isShowHint,
    isNavigation,
    isCardPreview,
    isAnimating,
    isQuestionMoving,
    isFirstLetterCheck,
    isAudioStudy,
    isChunkStudy,
    isImmediateFeedback,
    isAudioDisabled,
    isStudyMethodSelectable,
    initStudy,
    initQuestion,
    startStudy,
    startQuestion,
    retryQuestion,
    markAsKnown,
    toggleBookmark,
    hideMeaningExceptKnown,
    setQuestionIndex,
    makeQuestions,
    getStartQuestionIndex,
    movePage,
    moveQuestion,
    moveCardPage,
    updateAnswer,
    selectChunk,
    completeWord,
    handleNext,
    handleMoveQuestion,
    checkExampleExist,
    setIsStudyMethodSelectable,
    getStudentOptionInfo,
    saveStudentOption,
    saveStudyMethod,
    loadStudyMethod,
    exitStudy,
    endStudy,
  };
};
