import {
  GET_INITIAL_QUESTION_DATA,
  STUDY_METHODS,
  STUDY_TYPES,
} from '~/constants/study';
import type {
  SettingTestQuestionSentence,
  SettingTestQuestionTypeWord,
  SettingTestQuestionWord,
} from '~/types/setting';
import type {
  Book,
  BookType,
  CardPage,
  Question,
  QuestionData,
  StudyData,
  StudyMethod,
  StudyMethodSentence,
  StudyMethodWord,
  StudyMode,
  StudyType,
  StudyTypeServer,
  WordInfo,
} from '~/types/study';
import type {
  TestQuestion,
  TestQuestionTypeInfo,
  TestQuestionTypeWord,
} from '~/types/test';

export const useStudyStore = defineStore('study', () => {
  const runtimeConfig = useRuntimeConfig();
  const settingStore = useSettingStore();
  const { testSettingInfo, isOnlyIncorrect } = storeToRefs(settingStore);

  /**
   * 학습 진입 정보
   */
  const classId = ref<string>(''); // 학습 진입 시 필요한 classId
  const studentId = ref<string>(''); // 학습 진입 시 필요한 studentId
  const classMode = ref<string>(''); // 학습 진입 시 필요한 classMode
  const isSimulation = computed(() => classMode.value === 'simulation'); // 학습이 Simulation 모드 인지 여부

  const setParamData = (
    classIdParam: string,
    studentIdParam: string,
    classModeParam: string
  ) => {
    classId.value = classIdParam;
    studentId.value = studentIdParam;
    classMode.value = classModeParam;
  };

  /**
   * 학습 진행 정보
   */
  const studyMode = ref<StudyMode>('study'); // 학습 모드 - study, test
  const studyType = ref<StudyType>(STUDY_TYPES[0]); // 학습 타입 - memorize, recall, spell
  const studyTypeServer = computed<StudyTypeServer>(() =>
    studyMode.value === 'test'
      ? 'TEST'
      : (studyType.value.toUpperCase() as StudyTypeServer)
  );
  const studyMethod = ref<StudyMethod>(STUDY_METHODS[0]); // 학습 방법 - word, meaning, example
  const isShuffle = ref<Boolean>(false);
  const isAdvanced = ref<Boolean>(false);

  const setStudyMode = (mode: StudyMode) => {
    studyMode.value = mode;
  };

  const setStudyType = (type: StudyType) => {
    studyType.value = type;
  };

  const setStudyMethod = (method: StudyMethod) => {
    studyMethod.value = method;
  };

  const setIsShuffle = (shuffle: boolean) => {
    isShuffle.value = shuffle;
  };

  const setIsAdvanced = (advanced: boolean) => {
    isAdvanced.value = advanced;
  };

  const isMemorize = computed(() => {
    return studyType.value === 'memorize';
  });

  const isRecall = computed(() => {
    return studyType.value === 'recall';
  });

  const isSpell = computed(() => {
    return studyType.value === 'spell';
  });

  const isStudyMethodSelectable = ref(false);

  /**
   * 학습 내역 데이터
   */
  const studyData = ref<StudyData | null>(null); // 학습 데이터 - 학생의 학습 내용 저장
  const selectedIndexes = ref<number[]>([]); // Chunk, Blank 학습 시 선택된 인덱스들

  const setStudyData = (data: StudyData) => {
    studyData.value = data;
  };

  const getInitQuestionDatas = (): QuestionData[] => {
    return wordInfos.value.map(
      (wordInfo: WordInfo): QuestionData => GET_INITIAL_QUESTION_DATA(wordInfo)
    );
  };

  /**
   * 학습 진행 단계
   *   - Page -> Question
   *     - Page: 학습의 화면 [ready, activity, complete]
   *     - Question: 학습의 현재 문제(단어, 의미, 문장 등) [문제1, 문제2, 문제3 ...]
   *        - Question은 교재 내 WordInfo를 바탕으로 학습 설정에 따라 셔플 등을 거쳐 생성
   */
  const studyPage = ref('ready'); // 현재 학습의 Page - ready, activity, complete
  const cardPages = ref<CardPage[]>([]);
  const questionIndex = ref(0);
  const isShowFlashText = ref(false);
  const isChecked = ref(false);
  const isAnimating = ref(false);
  const isQuestionMoving = ref(false);

  /**
   * 학습 구성요소
   *  - Book: 학습 교재
   *  - WordInfo: 섹션 내 단어 정보
   */
  // 학습 교재
  const book = ref<Book | null>(null);
  // 교재 타입
  const bookType = computed<BookType>(() => {
    return book.value?.evalType === 'VOCABULARY' ? 'word' : 'sentence';
  });
  // 교재의 단어 정보
  const wordInfos = computed<WordInfo[]>(() => book.value?.wordInfos || []);
  // 교재의 단어 수
  const bookWordCount = computed(() => wordInfos.value.length);
  // 학습 진행 문항들
  const questions = ref<Question[]>([]);
  // 학습 문항 중 의미를 본 문항들
  const showMeanings = ref<Boolean[]>([]);
  // 학습 문항 중 힌트를 본 문항들
  const showHints = ref<Boolean[]>([]);

  const setBook = (data: Book) => {
    book.value = data;
  };

  const movePage = (page: string) => {
    studyPage.value = page;
  };

  const moveQuestion = (index: number) => {
    const minIndex = 0;
    const maxIndex = questions.value.length - 1;
    if (index < minIndex || index > maxIndex) {
      return;
    }

    questionIndex.value = index;
  };

  const nextQuestion = () => {
    const nextQuestionIndex = Math.min(
      questions.value.length - 1,
      questionIndex.value + 1
    );
    moveQuestion(nextQuestionIndex);
  };

  const prevQuestion = () => {
    const prevQuestionIndex = Math.max(0, questionIndex.value - 1);
    moveQuestion(prevQuestionIndex);
  };

  const resetStudy = () => {
    studyPage.value = 'ready';
    book.value = null;
    studyData.value = null;
    questionIndex.value = 0;
  };

  const exitStudy = (isStudyCompleted = false) => {
    // 부모창으로 닫기 메시지 전송
    opener.postMessage(
      { isStudyCompleted: isStudyCompleted },
      runtimeConfig.public.lmsHost
    );

    closeWindow(true);
  };

  const setShowMeanings = (data: Boolean[]) => {
    showMeanings.value = data;
  };

  /**
   * 테스트 학습 데이터 설정
   */
  // 테스트 진행 문항들
  const testQuestions = ref<TestQuestion[]>([]);
  const testQuestionIndex = ref(0);

  const testData = computed(() => {
    return studyData.value;
  });
  const testHistories = computed(() => {
    return testData.value?.testHistories || [];
  });
  const testTryCount = computed(() => {
    return (testHistories.value.length || 0) + 1;
  });
  const testPreviousQuestions = computed(
    () => studyData.value?.testPreviousQuestions || []
  );
  // 설정에 입력된 테스트 문항 개수 전체의 각 테스트 문항별 타입 정보
  const testQuestionTypeInfos = computed<TestQuestionTypeInfo[]>(() => {
    let testQuestionTypeInfos: TestQuestionTypeInfo[] = [];
    const questionSettingInfo = testSettingInfo.value.question[bookType.value];

    // 단어 교재 일 때
    if (bookType.value === 'word') {
      const questionOptionTypes = Object.keys(
        questionSettingInfo as SettingTestQuestionTypeWord
      ) as TestQuestionTypeWord[];

      questionOptionTypes.forEach(key => {
        const questionTypeInfo: SettingTestQuestionWord = (
          questionSettingInfo as SettingTestQuestionTypeWord
        )[key];
        const questionTypeKeys: StudyMethodWord[] = Object.keys(
          questionTypeInfo
        ) as StudyMethodWord[];

        questionTypeKeys.forEach(questionMethod => {
          const questionTypeCount =
            questionTypeInfo[questionMethod as keyof SettingTestQuestionWord];
          for (let i = 0; i < questionTypeCount; i++) {
            if (testQuestionTypeInfos.length < bookWordCount.value) {
              testQuestionTypeInfos.push({
                type: key,
                method: questionMethod,
              });
            }
          }
        });
      });
    }

    // 문장 교재 일 때
    else {
      const questionTypeKeys: StudyMethodSentence[] = Object.keys(
        questionSettingInfo as SettingTestQuestionSentence
      ) as StudyMethodSentence[];

      questionTypeKeys.forEach(questionMethod => {
        const questionTypeCount = (
          questionSettingInfo as SettingTestQuestionSentence
        )[questionMethod as keyof SettingTestQuestionSentence];

        for (let i = 0; i < questionTypeCount; i++) {
          if (testQuestionTypeInfos.length < bookWordCount.value) {
            testQuestionTypeInfos.push({
              type: 'sentence',
              method: questionMethod,
            });
          }
        }
      });
    }

    return testQuestionTypeInfos;
  });
  // 이전 오답만 풀기 할 때, 직전 오답 문항 각 문항별 타입 정보
  const incorrectQuestionTypeInfos = computed(() => {
    // 각 문항 별 타입을 설정에 있는 것에서 랜덤하게 설정
    const incorrectQuestionTypeInfos = testPreviousQuestions.value.reduce(
      (acc, cur, index) => {
        const isCorrect = cur.correctYn === 'Y';

        if (!isCorrect) {
          // 문항 개수가 변경되어 줄어들었을 경우 등 해당 문항 번째의 Type 정보가 없으면 랜덤한 타입 추출
          const questionTypeInfo =
            testQuestionTypeInfos.value[index] ??
            getRandomItem(testQuestionTypeInfos.value);

          acc.push(questionTypeInfo);
          return acc;
        }
        return acc as object[];
      },
      []
    );

    return incorrectQuestionTypeInfos;
  });
  const isIncorrectOnlyTest = computed(
    () => isOnlyIncorrect.value && testTryCount.value > 1
  );

  return {
    // 학습 진입 데이터
    classId,
    studentId,
    classMode,
    setParamData,

    // 학습 진행 데이터
    studyMode,
    studyType,
    studyTypeServer,
    studyMethod,
    isSimulation,
    isShuffle,
    isAdvanced,
    isMemorize,
    isRecall,
    isSpell,
    isStudyMethodSelectable,
    isShowFlashText,
    isChecked,
    isAnimating,
    isQuestionMoving,
    studyData,
    selectedIndexes,
    book,
    bookType,
    wordInfos,
    bookWordCount,
    studyPage,
    cardPages,

    // 학습 데이터
    questions,
    questionIndex,
    showMeanings,
    showHints,
    setStudyData,
    getInitQuestionDatas,
    setIsShuffle,
    setIsAdvanced,
    setStudyMode,
    setStudyType,
    setStudyMethod,
    setBook,
    movePage,
    moveQuestion,
    nextQuestion,
    prevQuestion,
    setShowMeanings,
    resetStudy,
    exitStudy,

    // 테스트용 데이터
    testQuestions,
    testQuestionIndex,
    testData,
    testHistories,
    testTryCount,
    testPreviousQuestions,
    testQuestionTypeInfos,
    incorrectQuestionTypeInfos,
    isIncorrectOnlyTest,
  };
});
