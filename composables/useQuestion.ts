import {
  STUDY_BLANK_ANSWER_COUNT,
  STUDY_BLANK_TEXT,
  STUDY_MULTIPLE_ANSWER_COUNT,
} from '~/constants/study';
import { TEST_ANSWER_COUNT } from '~/constants/test';
import type {
  GeneratedQuestion,
  Question,
  QuestionAnswerKey,
  QuestionData,
  StudyMethodWord,
  WordInfo,
} from '~/types/study';
import type {
  TestPreviousQuestion,
  TestQuestion,
  TestQuestionData,
  TestQuestionMethod,
  TestQuestionSetting,
  TestQuestionType,
} from '~/types/test';

export const useQuestion = () => {
  const studyStore = useStudyStore();

  const {
    book,
    bookType,
    wordInfos,
    bookWordCount,
    studyMode,
    studyMethod,
    studyData,
    questions,
    questionIndex,
    cardPages,
    showHints,
    showMeanings,
    testQuestions,
    testQuestionIndex,
    testPreviousQuestions,
    testQuestionTypeInfos,
    incorrectQuestionTypeInfos,
    isMemorize,
    isRecall,
    isShuffle,
    isIncorrectOnlyTest,
  } = storeToRefs(studyStore);

  const { setStudyData } = studyStore;
  const { getTestSettingCount } = useSetting();
  const { mergeQuestionData } = useStudyData();

  // Question Object에서 문항의 Key
  const studyQuestionKey = computed<StudyMethodWord>(() => {
    if (bookType.value === 'word') {
      if (studyMethod.value === 'word') return 'word';
      else if (studyMethod.value === 'meaning') return 'meaning';
      else if (studyMethod.value === 'example') return 'example';
      else if (studyMethod.value === 'audio') return 'audio';
    } else if (bookType.value === 'sentence') return 'word';
    return 'word';
  });

  // Question Object에서 답안의 Key
  const studyAnswerKey = computed<QuestionAnswerKey>(() => {
    if (studyMode.value === 'test') return 'meaning';
    else if (studyQuestionKey.value === 'word') return 'meaning';
    else if (studyQuestionKey.value === 'meaning') return 'word';
    else return 'word';
  });

  const questionData = computed<QuestionData | undefined>(() => {
    const question = questions.value[questionIndex.value];
    const questionData = getQuestionData(question?.cardId);
    return questionData;
  });

  const testMaxQuestionCount = computed(() => {
    // 테스트 설정에서 정해진 테스트 문항 수 구하기
    const testSettingCount = getTestSettingCount(bookType.value);

    // 이전 문항의 오답 문항 개수 구하기
    const testPreviousQuestions = studyData.value?.testPreviousQuestions || [];
    const incorrectQuestionCount =
      testPreviousQuestions.length > 0
        ? testPreviousQuestions.filter(question => question.correctYn === 'N')
            .length
        : testSettingCount;

    const testQuestionCount = Math.min(
      bookWordCount.value,
      testSettingCount,
      incorrectQuestionCount
    );

    return testQuestionCount;
  });

  const setQuestionIndex = (index: number) => {
    questionIndex.value = index;
  };

  const getStartQuestionIndex = () => {
    // 모르는 단어 중 가장 처음 단어
    const unknownIndex = questions.value.findIndex(question => {
      const questionData = getQuestionData(question.cardId);
      return !questionData?.isCompleted;
    });

    return unknownIndex;
  };

  const getMultipleAnswers = (
    contents: WordInfo[],
    contentInfo: WordInfo,
    answerCount: number,
    answerKey = studyAnswerKey.value
  ) => {
    const answers = [contentInfo[answerKey]];
    const multipleAnswerCount = Math.min(answerCount, contents.length);

    while (answers.length < multipleAnswerCount) {
      const randomItem = getRandomItem(contents);
      const answer = randomItem[answerKey];
      const isAlreadyExistAnswer = answers.includes(answer);

      if (!isAlreadyExistAnswer) answers.push(answer);
    }

    // 답안 섞기
    const shuffledAnswers = shuffleArray([...answers]);

    return shuffledAnswers;
  };

  const getBlankQuestion = (sentence: string) => {
    const chunks = sentence.split(' ');
    const chunkCount = Math.min(STUDY_BLANK_ANSWER_COUNT, chunks.length);

    // 문장의 chunks에서 연속된 chunkCount 개의 빈칸을 랜덤으로 생성할 시작 index 계산
    const randomStartIndex = Math.floor(
      Math.random() * (chunks.length - chunkCount)
    );

    const blankCorrectAnswers: string[] = [];
    const blankChunks = chunks.map((chunk, index) => {
      const isBlank =
        index >= randomStartIndex &&
        index < randomStartIndex + STUDY_BLANK_ANSWER_COUNT;

      if (isBlank) {
        blankCorrectAnswers.push(chunk);
        return STUDY_BLANK_TEXT;
      } else return chunk;
    });
    const blankOptions = shuffleArray([...blankCorrectAnswers]);

    return { blankChunks, blankOptions, blankCorrectAnswers };
  };

  const getQuestionType = () => {
    const isSentenceBook = bookType.value === 'sentence';
    const isChunkQuestion =
      studyMethod.value === 'chunk' || (isSentenceBook && isMemorize.value);
    const isBlankQuestion = isSentenceBook && isRecall.value;

    if (isChunkQuestion) return 'chunk';
    else if (isBlankQuestion) return 'blank';
    else return 'word';
  };

  // 학습 진행 문제 생성
  const generateStudyQuestions = () => {
    // 1. 교재 내 단어 정보 추출
    const wordInfos = book.value?.wordInfos || [];
    const questionWordInfos = isShuffle.value
      ? shuffleArray([...wordInfos])
      : wordInfos;
    const isSentenceBook = bookType.value === 'sentence';
    const isChunkQuestion =
      studyMethod.value === 'chunk' || (isSentenceBook && isMemorize.value);

    // 2. 학습 진행 문제 생성
    const generatedQuestions: GeneratedQuestion[] = questionWordInfos.map(
      (wordInfo, questionIndex) => {
        const wordIndex = wordInfos.findIndex(
          w => w.cardId === wordInfo.cardId
        );

        // 문장 학습 교재일 경우
        if (isSentenceBook) {
          const sentence = wordInfo.word;
          const chunks = sentence.split(' ');
          const answers = shuffleArray([...chunks]);
          const { blankChunks, blankOptions, blankCorrectAnswers } =
            getBlankQuestion(sentence);

          return {
            ...wordInfo,
            type: getQuestionType(),
            studyMethod: studyMethod.value,
            wordIndex,
            questionIndex,
            answers,
            blankChunks,
            blankOptions,
            correctIndex: -1,
            correctAnswers: isChunkQuestion ? chunks : blankCorrectAnswers,
          };
        }

        // 단어 학습 교재일 경우
        else {
          const answerKey = studyAnswerKey.value;
          const answers = getMultipleAnswers(
            wordInfos,
            wordInfo,
            STUDY_MULTIPLE_ANSWER_COUNT,
            answerKey
          );
          const correctIndex = answers.findIndex(
            answer => answer === wordInfo[answerKey]
          );
          const correctAnswers = answers[correctIndex]
            .split(/,|;/)
            .map((answer: string) => answer.trim());

          return {
            ...wordInfo,
            type: getQuestionType(),
            studyMethod: studyMethod.value,
            questionIndex,
            blankChunks: [],
            blankOptions: [],
            answers,
            correctIndex,
            correctAnswers,
          };
        }
      }
    );

    console.log(
      'generateStudyQuestions() - generatedQuestions',
      generatedQuestions
    );

    return generatedQuestions;
  };

  const makeQuestions = () => {
    // studyMode가 일반 학습일 경우
    if (studyMode.value === 'study') {
      // 학습 문항 생성
      const generatedQuestions = generateStudyQuestions();

      // 문항 데이터 업데이트
      questions.value = generatedQuestions as Question[];
      cardPages.value = questions.value.map(() => 'preview');
      showHints.value = questions.value.map(() => false);
      showMeanings.value = questions.value.map(() => false);

      // 문항 학습 데이터 업데이트
      mergeQuestionData(questions.value);
    }

    // studyMode가 테스트 학습일 경우
    else if (studyMode.value === 'test') {
      // 테스트 문항 생성
      const generatedTestQuestions = generateTestQuestions();

      // 문항 데이터 업데이트
      testQuestions.value = generatedTestQuestions as TestQuestion[];

      // 문항 학습 데이터 업데이트
      studyData.value!.testQuestions =
        testQuestions.value as TestQuestionData[];
    }
  };

  const getAnswerKey = (
    type: TestQuestionType,
    method: TestQuestionMethod
  ): QuestionAnswerKey => {
    let answerKey: QuestionAnswerKey = 'word';
    if (type === 'multiple' || type === 'typing')
      answerKey = method === 'word' ? 'meaning' : 'word';
    else if (type === 'sentence') answerKey = 'word'; // TODO: 확인 필요

    return answerKey;
  };

  const getTestWordInfos = () => {
    // 오답만 풀이하는 경우 - 오답 문항 단어들만 리턴
    if (isIncorrectOnlyTest.value) {
      const incorrectQuestions: TestPreviousQuestion[] =
        testPreviousQuestions.value.filter(
          question => question.correctYn === 'N'
        );
      const incorrectWordInfos = incorrectQuestions.map(({ cardId }) => {
        const wordInfo = wordInfos.value.find(
          wordInfo => wordInfo.cardId === cardId
        );
        return wordInfo;
      });

      return incorrectWordInfos;
    }

    // 그 외 경우 - 교재 전체 단어 섞어서 최대 문항 개수만큼만 리턴
    else {
      const shuffledWordInfos = shuffleArray(wordInfos.value);
      const questionWordInfos = shuffledWordInfos.slice(
        0,
        testMaxQuestionCount.value
      );

      return questionWordInfos;
    }
  };

  // 테스트 진행 문항 생성
  const generateTestQuestions = () => {
    // 1. 전체문항/직전오답 여부에 따른 테스트 문항별 타입 구하기
    const testQuestionTypes = isIncorrectOnlyTest.value
      ? incorrectQuestionTypeInfos.value
      : testQuestionTypeInfos.value;

    // 2. 교재의 모든 단어 정보를 추출하여 단어 순서 섞기
    const testWordInfos = getTestWordInfos();

    // 3. 테스트 진행 문항 생성
    const generatedQuestions: TestQuestion[] = testWordInfos.map(
      (wordInfo, questionIndex) => {
        const { type, method } = testQuestionTypes[questionIndex] as {
          type: TestQuestionType;
          method: TestQuestionMethod;
        };

        const isSentenceBook = bookType.value === 'sentence';
        const isChunkQuestion = isSentenceBook && method === 'chunk';

        // 문장 교재의 어순 배열 학습만 문항 다르게 생성
        if (isChunkQuestion) {
          const sentence = wordInfo.word;
          const chunks = sentence.split(' ');
          const answers = shuffleArray([...chunks]);

          return {
            ...wordInfo,
            type,
            method,
            answers,
            answerKey: '',
            //  correctIndex,
            correctAnswers: chunks,
          };
        }

        // 그 외(단어 교재/문장 교재) 문항 생성
        else {
          const answerKey = getAnswerKey(type, method);
          const answers = getMultipleAnswers(
            wordInfos.value,
            wordInfo,
            TEST_ANSWER_COUNT,
            answerKey
          );
          const correctIndex = answers.findIndex(
            answer => answer === wordInfo[answerKey]
          );
          const correctAnswers = answers[correctIndex]
            .split(/,|;/)
            .map((answer: string) => answer.trim());

          return {
            ...wordInfo,
            type,
            method,
            answers,
            answerKey,
            correctIndex,
            correctAnswers,
          };
        }
      }
    );

    console.log(
      'generateTestQuestions() - generatedQuestions',
      generatedQuestions
    );

    return generatedQuestions;
  };

  const moveTestQuestion = (index: number) => {
    const minIndex = 0;
    const maxIndex = testQuestions.value.length - 1;
    if (index < minIndex || index > maxIndex) {
      return;
    }

    testQuestionIndex.value = index;
  };

  const getQuestionData = (questionId: number): QuestionData | undefined => {
    const questionDatas = studyData.value?.questions || ([] as QuestionData[]);
    const questionData = questionDatas.find(data => data.cardId === questionId);

    return questionData;
  };

  const updateQuestionData = (
    data: Partial<QuestionData>,
    index: number = questionIndex.value
  ) => {
    const questionDatas = studyData.value?.questions as QuestionData[];
    const question = questions.value[index];
    const questionData = getQuestionData(question.cardId);
    if (!questionData) return;

    const dataIndex = questionDatas.findIndex(
      data => data.cardId === questionData?.cardId
    );
    questionDatas[dataIndex] = {
      ...questionData,
      ...data,
      studiedAt: Date.now(),
    };

    if (studyData.value) {
      studyData.value.questions = questionDatas;
      setStudyData(studyData.value);
    }
  };

  const getIsAnswered = (questionId: number) => {
    let isAnswered = false;

    // 일반 학습 일 때
    if (studyMode.value === 'study') {
      const questionData = getQuestionData(questionId);
      if (!questionData) return false;

      const targetQuestion = questions.value.find(
        question => question.cardId === questionId
      );
      const { type } = targetQuestion as Question;
      const { selectedIndex, spellAnswer, selectedAnswers, correctAnswers } =
        questionData;
      const isBlankQuestion = type === 'blank';

      if (isBlankQuestion) {
        const isCorrectAnswerExists = correctAnswers?.length > 0;
        isAnswered =
          isCorrectAnswerExists &&
          selectedAnswers?.length === correctAnswers?.length;
      } else {
        isAnswered = selectedIndex > -1 || spellAnswer?.length > 0;
      }
    }

    // 테스트 학습 일 때
    else if (studyMode.value === 'test') {
      const questionData = getTestQuestionData(questionId);
      isAnswered = questionData?.isAnswered ?? false;
    }

    return isAnswered;
  };

  const getQuestion = (questionId: number): Question | undefined => {
    const question = questions.value.find(
      question => question.cardId === questionId
    );
    return question;
  };

  const getStudentAnswer = (questionId: number) => {
    const questionData = getQuestionData(questionId);
    if (!questionData) return false;

    const { type, selectedIndex, spellAnswer, selectedAnswers } = questionData;
    const isBlankQuestion = type === 'blank';

    if (isBlankQuestion) {
      return selectedAnswers;
    } else {
      return isRecall.value ? selectedIndex : spellAnswer;
    }
  };

  const getIsCorrect = (questionId: number) => {
    const questionData = getQuestionData(questionId);
    if (!questionData) return false;

    const {
      type,
      selectedIndex,
      spellAnswer,
      selectedAnswers,
      correctIndex,
      correctAnswers,
    } = questionData;
    const isSentenceBook = bookType.value === 'sentence';
    const isBlankQuestion = type === 'blank';

    if (isBlankQuestion) {
      const isCorrect =
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every(
          (answer, index) => answer === correctAnswers[index]
        );

      return isCorrect;
    } else {
      const question = getQuestion(questionId);
      if (!question) return false;

      const correctAnswer = question[studyQuestionKey.value];
      const isSpellCorrect = isSentenceBook
        ? spellAnswer.toLowerCase().replace(/[.!?]/g, '') ===
          correctAnswer.replace(/[.!?]/g, '')
        : correctAnswers.includes(spellAnswer.toLowerCase());
      const isMultipleCorrect = selectedIndex === correctIndex;
      const isCorrect = isMultipleCorrect || isSpellCorrect;

      return isCorrect;
    }
  };

  const getTestQuestionData = (
    questionId: number
  ): TestQuestionData | undefined => {
    const testQuestionDatas = studyData.value?.testQuestions || [];
    const questionData = (testQuestionDatas as TestQuestionData[]).find(
      data => data.cardId === questionId
    );

    return questionData;
  };

  const updateTestQuestionData = (
    data: Partial<TestQuestionData>,
    index: number = testQuestionIndex.value
  ) => {
    const testQuestion = testQuestions.value[index];
    const testQuestionDatas = studyData.value?.testQuestions || [];
    const testQuestionData = getTestQuestionData(testQuestion.cardId);
    if (!testQuestionData) return;

    const dataIndex = (testQuestionDatas as TestQuestionData[]).findIndex(
      data => data.cardId === testQuestionData?.cardId
    );
    testQuestionDatas[dataIndex] = { ...testQuestionData, ...data };
    studyData.value!.testQuestions = testQuestionDatas;
  };

  const prepareQuestions = () => {
    // 학습 최초 시작 시, 모르는 단어부터 시작하도록 questionIndex 설정
    const startQuestionIndex = getStartQuestionIndex();
    if (startQuestionIndex > -1) setQuestionIndex(startQuestionIndex);
  };

  return {
    questionIndex,
    testQuestionIndex,
    studyQuestionKey,
    studyAnswerKey,
    questionData,
    testMaxQuestionCount,
    setQuestionIndex,
    getQuestionData,
    prepareQuestions,
    makeQuestions,
    moveTestQuestion,
    getTestQuestionData,
    updateTestQuestionData,
    getStartQuestionIndex,
    getIsAnswered,
    getQuestion,
    getStudentAnswer,
    getIsCorrect,
    updateQuestionData,
    getAnswerKey,
    getTestWordInfos,
  };
};
