import type { QuestionData, StudyData } from '~/types/study';

export const useStudyData = () => {
  const studyStore = useStudyStore();

  const { setStudyData, getInitQuestionDatas } = studyStore;
  const {
    bookType,
    studyMode,
    classId,
    studentId,
    studyType,
    studyTypeServer,
    studyData,
    isSimulation,
  } = storeToRefs(studyStore);
  const { showToast } = useModal();
  const {
    fetchStudyData,
    fetchTestData,
    sendStudyData,
    sendTestData,
    parseStudyData,
    parseTestData,
  } = useApi();

  const initStudyData = () => {
    const initialStudyData = {
      version: 1,
      bookType: bookType.value,
      startTime: 0,
      endTime: 0,
      endYn: '',
      studyType: studyType.value,
      studyTypeServer: studyTypeServer.value,
      questions: getInitQuestionDatas(),
      testQuestions: [],
      studiedAt: 0,
    };

    setStudyData(initialStudyData);
  };

  const saveStudyData = async (data = studyData.value) => {
    // 시뮬레이션 학습일 경우에는 학습 저장하지 않음
    if (isSimulation.value) return;

    try {
      // 테스트 학습인 경우
      if (studyMode.value === 'test') {
        const { isSuccess, message } = await sendTestData(
          classId.value,
          studentId.value,
          studyTypeServer.value,
          bookType.value,
          data
        );
        if (!isSuccess) throw new Error(message);
      }

      // 일반 학습인 경우
      else {
        const { isSuccess, message } = await sendStudyData(
          classId.value,
          studentId.value,
          studyTypeServer.value,
          bookType.value,
          data
        );
        if (!isSuccess) throw new Error(message);
      }
    } catch (error) {
      console.log('saveStudyData() - error', error);
      showToast('학습 데이터를 저장하는데 실패했습니다.', { type: 'error' });
    }
  };

  const updateStudyData = (data: Partial<StudyData>) => {
    if (studyData.value) setStudyData({ ...studyData.value, ...data });
  };

  const mergeQuestionData = (mergingQuestions: QuestionData[]) => {
    const questions = studyData.value?.questions ?? [];
    const newQuestions =
      questions?.map(question => {
        const mergingQuestion: QuestionData | undefined = mergingQuestions.find(
          dataQuestion => dataQuestion.cardId === question.cardId
        );
        if (!mergingQuestion) return question;

        return {
          ...question,
          ...mergingQuestion,
        };
      }) ?? [];

    if (studyData.value) studyData.value.questions = newQuestions;
  };

  const mergeServerStudyData = (mergingData: Partial<StudyData>) => {
    if (!studyData.value) return;

    const keys = Object.keys(mergingData) as (keyof StudyData)[];

    keys.forEach((key: keyof StudyData) => {
      const value = mergingData[key];

      // questions 는 별도로 처리
      if (key === 'questions' && value) {
        const dataQuestions = value as QuestionData[];
        mergeQuestionData(dataQuestions);
      }

      // questions 가 아닌 그 외
      else {
        if (value) studyData.value[key] = value;
      }
    });

    console.log('mergeServerStudyData() - studyData.value', studyData.value);
  };

  const getServerStudyData = async (classId: string, studentId: string) => {
    let serverStudyData;

    try {
      // 테스트 학습인 경우
      if (studyMode.value === 'test') {
        const { data, isSuccess } = await fetchTestData(
          classId,
          studentId,
          studyTypeServer.value
        );
        if (!isSuccess) throw new Error('Failed to fetch study data');

        serverStudyData = parseTestData(data);
      }

      // 일반 학습인 경우
      else {
        const { data, isSuccess } = await fetchStudyData(
          classId,
          studentId,
          studyTypeServer.value
        );
        if (!isSuccess) throw new Error('Failed to fetch study data');

        serverStudyData = parseStudyData(data);
      }

      console.log('getServerStudyData() - serverStudyData', serverStudyData);

      return serverStudyData;
    } catch (error) {
      console.log('getServerStudyData() - error', error);
      showToast('학습 데이터를 가져오는데 실패했습니다.', { type: 'error' });
    }
  };

  const prepareStudyData = async (isSimulation = false) => {
    // 기본 학습 데이터 생성
    initStudyData();

    // 시뮬레이션 학습일 경우에는 서버 데이터 가져오지 않음
    if (isSimulation) return;

    // 서버에서 학습 데이터 가져오기
    const serverStudyData = await getServerStudyData(
      classId.value,
      studentId.value
    );

    // 서버에 학습 데이터가 있으면 해당 데이터 추가
    if (serverStudyData) mergeServerStudyData(serverStudyData);

    console.log('prepareStudyData() - studyData.value', studyData.value);
  };

  return {
    prepareStudyData,
    saveStudyData,
    updateStudyData,
    getInitQuestionDatas,
    mergeQuestionData,
  };
};
