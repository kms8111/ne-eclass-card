import type {
  FetchBookResponse,
  FetchSettingResponse,
  FetchStudyDataResponse,
} from '~/types/api';
import type { BasicObject } from '~/types/global';
import type { SettingInfo } from '~/types/setting';
import type {
  Book,
  QuestionData,
  ServerQuestion,
  StudyData,
} from '~/types/study';
import type { TestQuestionData } from '~/types/test';

export const useApi = () => {
  const { apiHost } = useCommonStore();
  const { getInitQuestionDatas } = useStudyStore();
  const { showLoading, hideLoading } = useModal();

  const handleApi =
    (fn: any, options?: BasicObject) =>
    async (...args: any[]) => {
      const { isLoading = true } = options ?? {};
      let fetchResponse = null;

      console.log('isLoading', isLoading);

      try {
        if (isLoading) showLoading();
        fetchResponse = await fn(...args);
      } catch (error) {
        console.log('handleApi() - error', error);
      } finally {
        if (isLoading) hideLoading();
      }
      const { data, error, status } = fetchResponse;
      const responseData = data.value;
      const statusCode = responseData?.status_code;
      const isSuccess = String(statusCode) === '200';
      const response = {
        status: status.value,
        error: error.value,
        message: responseData.message,
        data: responseData.data,
        isSuccess,
      };

      return response;
    };

  const fetchBook = handleApi(async (neEvalId: string) => {
    const url = addUrlQuery(`${apiHost}/api/necard/getEvalCardList`, {
      neEvalId,
    });

    const response = await useFetch<FetchBookResponse>(url, {
      method: 'POST',
    });
    console.log('fetchBook() - response', response);

    return response;
  });

  const fetchSetting = handleApi(
    async (deployId: string, studentId: string) => {
      const url = addUrlQuery(`${apiHost}/api/necard/getEvalInfo`, {
        deployId,
        studentId,
      });

      const response = await useFetch<FetchSettingResponse>(url, {
        method: 'POST',
      });
      console.log('fetchSetting() - response', response);

      return response;
    }
  );

  // @deprecated - 사용하지 않음
  const sendSetting = handleApi(
    async (deployId: string, settingInfo: SettingInfo) => {
      const response = await useFetch(`/api/settings/classes/${deployId}`, {
        method: 'POST',
        body: JSON.stringify(settingInfo),
      });
      console.log('sendSetting() - response', response);

      return response;
    }
  );

  const fetchStudyData = handleApi(
    async (deployId: string, studentId: string, studyType: string) => {
      const url = addUrlQuery(`${apiHost}/api/necard/getStudyStatus`, {
        deployId,
        studentId,
        studyType,
      });

      const response = await useFetch<FetchStudyDataResponse>(url, {
        method: 'POST',
      });
      console.log('fetchStudyData() - response', response);

      return response;
    }
  );

  const fetchTestData = handleApi(
    async (deployId: string, studentId: string) => {
      const url = addUrlQuery(`${apiHost}/api/necard/getTestResult`, {
        deployId,
        studentId,
      });

      const response = await useFetch<FetchStudyDataResponse>(url, {
        method: 'POST',
      });
      console.log('fetchTestData() - response', response);

      return response;
    }
  );

  const sendTestData = handleApi(
    async (
      deployId: string,
      studentId: string,
      studyTypeServer: string,
      bookType: string,
      studyData: any
    ) => {
      const evalType = bookType === 'word' ? 'VOCABULARY' : 'READING';
      const url = addUrlQuery(`${apiHost}/api/necard/saveEvalResult/test`, {
        deployId,
        studentId,
        evalType,
        studyType: studyTypeServer,
      });
      const convertedStudyData = convertTestData(studyData);
      const payload = {
        ...convertedStudyData,
        deployId,
        studentId,
        evalType,
        studyType: studyTypeServer,
      };

      const response = await useFetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('sendTestData() - response', response);

      return response;
    },
    { isLoading: false }
  );

  const sendStudyData = handleApi(
    async (
      deployId: string,
      studentId: string,
      studyTypeServer: string,
      bookType: string,
      studyData: any
    ) => {
      const evalType = bookType === 'word' ? 'VOCABULARY' : 'READING';
      const url = addUrlQuery(`${apiHost}/api/necard/saveEvalResult/study`, {
        deployId,
        studentId,
        evalType,
        studyType: studyTypeServer,
      });
      const convertedStudyData = convertStudyData(studyData);
      const payload = {
        ...convertedStudyData,
        deployId,
        studentId,
        evalType,
        studyType: studyTypeServer,
      };

      const response = await useFetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('sendStudyData() - response', response);

      return response;
    },
    { isLoading: false }
  );

  // @deprecated - 사용하지 않음
  const deleteStudyData = handleApi(
    async (classId: string, studentId: string) => {
      const response = await useFetch(
        `/api/study-data/classes/${classId}/students/${studentId}`,
        {
          method: 'DELETE',
        }
      );
      console.log('deleteStudyData() - response', response);

      return response;
    }
  );

  // 게임 기록 조회
  const fetchGameRecord = handleApi(async (deployId: number) => {
    const url = addUrlQuery(`${apiHost}/api/necard/getGameResultList`, {
      deployId: String(deployId),
    });

    const response = await useFetch<FetchBookResponse>(url, {
      method: 'POST',
    });
    console.log('fetchGameRecord() - response', response);

    return response;
  });

  // 게임 기록 전송
  const sendGameRecord = handleApi(
    async (
      deployId: string,
      studentId: string,
      studyTypeServer: string,
      score: number,
      endTime: string
    ) => {
      const url = addUrlQuery(`${apiHost}/api/necard/saveEvalResult/game`, {
        deployId,
        studentId,
        studyType: studyTypeServer,
        score: String(score),
        endTime,
      });
      const payload = {
        deployId,
        studentId,
        studyType: studyTypeServer,
        score,
        endTime,
      };

      const response = await useFetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('saveGameRecord() - response', response);

      return response;
    }
  );

  const parseStudyData = (data: any): Partial<StudyData> => {
    const initialQuestions = getInitQuestionDatas();
    const serverQuestions: ServerQuestion[] = data ?? [];

    const questions =
      initialQuestions?.map(question => {
        const serverQuestion = serverQuestions.find(
          serverQuestion => serverQuestion.cardId === question.cardId
        );
        if (!serverQuestion) return question;

        const {
          correctAnswer = '',
          studentAnswer = '',
          completeYn,
        } = serverQuestion;

        const isCompleted = completeYn === 'Y';
        const newQuestion = {
          ...question,
          isCompleted,
        };

        if (isCompleted) {
          const serverCorrectAnswers =
            typeof correctAnswer === 'string' ? correctAnswer.split('_') : [];
          const serverStudentAnswers =
            typeof studentAnswer === 'string' ? studentAnswer.split('_') : [];

          newQuestion.correctAnswers =
            typeof correctAnswer === 'string'
              ? serverCorrectAnswers
              : question.correctAnswers;
          newQuestion.selectedAnswers =
            typeof studentAnswer === 'string'
              ? serverStudentAnswers
              : question.selectedAnswers;
          newQuestion.chunkAnswers =
            typeof studentAnswer === 'string'
              ? serverStudentAnswers
              : question.chunkAnswers;
          newQuestion.selectedIndex = !isNaN(parseInt(String(studentAnswer)))
            ? parseInt(String(studentAnswer))
            : question.selectedIndex;
          newQuestion.correctIndex = !isNaN(parseInt(String(correctAnswer)))
            ? parseInt(String(correctAnswer))
            : question.correctIndex;
        }

        return newQuestion;
      }) ?? [];

    return { questions };
  };

  const parseTestData = (data: any) => {
    if (!data) {
      console.log('parseTestData() - data is not exist');
      return null;
    }

    // @TODO: 오답만 다시 풀기 기능 추가 필요
    const { testResult, testQuestion } = data;
    const testHistories = testResult.map((result: any) => {
      const { endDate } = result;

      return {
        ...result,
        score: result.score,
        studiedAt: new Date(endDate).getTime(),
      };
    });

    return {
      testHistories,
      testPreviousQuestions: testQuestion,
    };
  };

  const convertStudyData = (studyData: StudyData) => {
    const { bookType, studyType, startTime } = studyData;
    const questions = studyData.questions as QuestionData[];

    const isStudyCompleted = questions.every(
      (question: QuestionData) => question.isCompleted
    );
    const totalQuestionCount = questions.length;
    const completedQuestionCount = questions.filter(
      (question: QuestionData) => question.isCompleted
    ).length;
    const status = Math.round(
      (completedQuestionCount / totalQuestionCount) * 100
    );

    const question = questions.map((data: QuestionData) => {
      const {
        cardId,
        type,
        word,
        meaning,
        studyMethod,
        selectedIndex,
        correctIndex,
        selectedAnswers,
        correctAnswers,
        spellAnswer,
        chunkAnswers,
        isCompleted,
      } = data;
      let correctAnswer, studentAnswer;

      // 단어 교재일 경우
      if (bookType === 'word') {
        if (studyType === 'memorize') {
          // 암기 학습 일 때는 정답과 학생답 동일하게 처리
          correctAnswer = studyMethod === 'word' ? meaning : word;
          studentAnswer = studyMethod === 'word' ? meaning : word;
        } else if (studyType === 'recall') {
          correctAnswer = correctIndex;
          studentAnswer = selectedIndex;
        } else {
          correctAnswer = studyMethod === 'word' ? meaning : word;
          studentAnswer = spellAnswer;
        }
      }

      // 문장 교재일 경우
      else {
        if (type === 'chunk') {
          correctAnswer = correctAnswers?.join('_');
          studentAnswer = chunkAnswers?.join('_');
        } else if (type === 'blank') {
          correctAnswer = correctAnswers?.join('_');
          studentAnswer = selectedAnswers?.join('_');
        } else {
          correctAnswer = studyMethod === 'word' ? meaning : word;
          studentAnswer = spellAnswer;
        }
      }

      return {
        cardId,
        correctAnswer,
        studentAnswer,
        isCompleted: isCompleted ?? false,
        submitDate: data.studiedAt ? parseTimestamps(data.studiedAt) : null,
      };
    });

    const convertedData = {
      evalType: bookType === 'word' ? 'VOCABULARY' : 'READING',
      studyType: studyType?.toUpperCase(),
      status,
      startTime: parseTimestamps(startTime),
      endTime: parseTimestamps(Date.now()),
      endYn: isStudyCompleted ? 'Y' : 'N',
      question,
    };
    console.log('convertedData', convertedData);

    return convertedData;
  };

  const convertTestData = (studyData: StudyData) => {
    const { bookType, studyType, testHistories = [], startTime } = studyData;
    const tryCount = testHistories.length + 1;
    const questions = studyData.testQuestions as TestQuestionData[];

    const isTestCompleted = questions.every(
      (question: TestQuestionData) => question.isAnswered
    );
    const totalQuestionCount = questions.length;
    const answeredQuestionCount = questions.filter(
      (question: TestQuestionData) => question.isAnswered
    ).length;
    const status = Math.round(
      (answeredQuestionCount / totalQuestionCount) * 100
    );

    const question = questions.map((data: TestQuestionData, index: number) => {
      const {
        cardId,
        type,
        method,
        answerKey,
        word,
        meaning,
        audio,
        answers,
        selectedIndex,
        correctIndex,
        selectedAnswers,
        correctAnswers,
        spellAnswer,
        chunkAnswers,
        isAnswered,
        isCorrect,
      } = data;
      let correctAnswer, studentAnswer, question;

      // 단어 학습의 객관식 문항
      if (type === 'multiple') {
        correctAnswer = correctIndex;
        studentAnswer = selectedIndex;
        question = data[method as keyof TestQuestionData];
      }

      // 단어 학습의 주관식 문항
      else if (type === 'typing') {
        correctAnswer = data[answerKey as keyof TestQuestionData];
        studentAnswer = spellAnswer;
        question = data[method as keyof TestQuestionData];
      }

      // 문장 학습 문항
      else if (type === 'sentence') {
        question = meaning;

        // 문장 학습의 Writing 문항
        if (method === 'writing' || method === 'dictation') {
          correctAnswer = word; // 교재에 써진 단어(문장)이 정답
          studentAnswer = spellAnswer;
        }

        // 문장 학습의 어순 배열 문항
        else {
          correctAnswer = correctAnswers?.join('_') ?? '';
          studentAnswer = chunkAnswers?.join('_') ?? '';
        }
      }

      return {
        cardId,
        questionNo: index + 1,
        question,
        correctAnswer,
        studentAnswer,
        answers,
        audio,
        isCompleted: isAnswered ?? false,
        isCorrect: isCorrect ?? false,
        submitDate: data.studiedAt ? parseTimestamps(data.studiedAt) : null,
      };
    });

    const convertedData = {
      evalType: bookType === 'word' ? 'VOCABULARY' : 'READING',
      studyType: studyType?.toUpperCase(),
      status,
      startTime: parseTimestamps(startTime),
      endTime: parseTimestamps(Date.now()),
      tryCount,
      submitYn: isTestCompleted ? 'Y' : 'N',
      question,
    };

    console.log('convertedData', convertedData);

    return convertedData;
  };

  const parseBook = (data: any): Book => {
    const { evalType = '', cardCnt = 0, question = [] } = data;

    const wordInfos = question.map((question: any) => {
      return {
        ...question,

        // audioPath => audio 로 변경
        audio: question?.audioPath,
      };
    });

    return {
      evalType,
      cardCnt,
      wordInfos,
    };
  };

  const parseSetting = (data: any) => {
    const {
      spellType,
      testGoalScore,
      testIsAfterMandatory,
      testIsOnlyIncorrect,
      testIsStrictAnswer,
      testRuleLimitCount,
      memorizeType,
      recallType,
      matchingScore,
      matchingLimitTime,
      testWordChoice,
      testWordSubject,
      testMeanChoice,
      testMeanSubject,
      testPronunChoice,
      testPronunSubject,
      testSentenceChoice,
      testSentenceSubject,
      testQuestionChunks,
      testQuestionSentence,
      testQuestionDictation,
    } = data;

    const convertStudyMethod = (serverMethod: string) => {
      if (serverMethod === 'WORD') return 'word';
      else if (serverMethod === 'CHUNK') return 'meaning';
      else if (serverMethod === 'PRONUN') return 'audio';
      else if (serverMethod === 'BLANK') return 'example';
      else if (serverMethod === 'WRITING') return 'writing';
      else if (serverMethod === 'WRITING_IMMEDIATE') return 'writingImmediate';
      else if (serverMethod === 'WRITING_FIRST_LETTER')
        return 'writingFirstLetter';
      else if (serverMethod === 'CHUNK') return 'chunk';
      else if (serverMethod === 'DICTATION') return 'dictation';
      else if (serverMethod === 'DICTATION_FIRST_LETTER')
        return 'dictationFirstLetter';
      else return 'free';
    };

    return {
      version: 1,
      audioSpeed: 1,
      studyMethod: {
        memorize: convertStudyMethod(memorizeType),
        recall: convertStudyMethod(recallType),
        spell: convertStudyMethod(spellType),
      },
      matching: {
        score: matchingScore,
        duration: matchingLimitTime,
      },
      test: {
        goalScore: testGoalScore,
        answerSpeed: 'normal',
        limitCount: testRuleLimitCount,
        question: {
          word: {
            multiple: {
              word: testWordChoice,
              meaning: testMeanChoice,
              audio: testPronunChoice,
              example: testSentenceChoice,
            },
            typing: {
              word: testWordSubject,
              meaning: testMeanSubject,
              audio: testPronunSubject,
              example: testSentenceSubject,
            },
          },
          sentence: {
            chunk: testQuestionChunks,
            writing: testQuestionSentence,
            dictation: testQuestionDictation,
          },
        },
        isShuffle: true,
        isOnlyIncorrect: testIsOnlyIncorrect,
        isStrictAnswer: testIsStrictAnswer,
      },
    };
  };

  return {
    fetchBook,
    fetchSetting,
    fetchStudyData,
    fetchTestData,
    sendStudyData,
    sendTestData,
    sendSetting,
    fetchGameRecord,
    sendGameRecord,
    deleteStudyData,
    parseBook,
    parseSetting,
    parseStudyData,
    parseTestData,
  };
};
