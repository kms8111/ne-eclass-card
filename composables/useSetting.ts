import type {
  SettingInfo,
  SettingTestQuestionSentence,
  SettingTestQuestionWord,
} from '~/types/setting';
import type {
  BookType,
  StudyMethodSentence,
  StudyMethodWord,
} from '~/types/study';
import type { TestQuestionSetting, TestQuestionTypeWord } from '~/types/test';

export const useSetting = () => {
  const studyStore = useStudyStore();
  const settingStore = useSettingStore();

  const { isSimulation } = storeToRefs(studyStore);
  const { settingInfo, testSettingInfo, isOnlyIncorrect, isShowSetting } =
    storeToRefs(settingStore);
  const { setSettingInfo, showSetting, hideSetting } = settingStore;
  const { showToast } = useModal();
  const { fetchSetting, sendSetting, parseSetting } = useApi();

  const testLimitCount = computed(() => testSettingInfo.value.limitCount);
  const isStrictAnswer = computed(
    () => settingInfo.value?.test?.isStrictAnswer
  );

  const saveSetting = async (classId: string) => {
    try {
      if (isSimulation.value)
        return showToast(
          '시뮬레이션은 설정 정보를 저장하지 않고, 학습에만 바로 적용 됩니다.',
          {
            type: 'info',
          }
        );

      const { isSuccess } = await sendSetting(classId, settingInfo.value);
      if (!isSuccess) throw new Error('No success response');

      showToast('설정 정보를 저장했습니다.', { type: 'success' });
    } catch (error) {
      console.log('saveSetting() - error', error);
      showToast('설정 정보를 저장하는데 실패했습니다.', { type: 'error' });
    }
  };

  const loadSetting = async (classId: string, studentId: string) => {
    try {
      const { data, isSuccess } = await fetchSetting(classId, studentId);
      if (!isSuccess) throw new Error('No success response');

      const parsedSetting = parseSetting(data);
      console.log('parsedSetting', parsedSetting);
      setSettingInfo(parsedSetting as SettingInfo);

      return data;
    } catch (error) {
      console.log('loadSetting() - error', error);
      throw new Error('설정 정보를 불러오기 실패');
    }
  };

  const getTestSettingCount = (bookType: BookType) => {
    const isSentenceBook = bookType === 'sentence';

    // 문장 교재 일 경우
    if (isSentenceBook) {
      const sentenceMethods: StudyMethodSentence[] = [
        'chunk',
        'writing',
        'dictation',
      ];

      const questionInfo: SettingTestQuestionSentence | undefined =
        settingInfo.value?.test?.question?.sentence;
      if (!questionInfo) return 0;

      return sentenceMethods.reduce((acc, method) => {
        return acc + (questionInfo[method] || 0);
      }, 0);
    }

    // 단어 교재 일 경우
    else {
      const wordMethods: StudyMethodWord[] = [
        'word',
        'meaning',
        'audio',
        'example',
      ];
      const wordTypes: TestQuestionTypeWord[] = ['multiple', 'typing'];

      return wordTypes.reduce((acc, type) => {
        const questionInfo: SettingTestQuestionWord | undefined =
          settingInfo.value?.test?.question?.word[type];
        if (!questionInfo) return acc;

        return (
          acc +
          wordMethods.reduce((acc, method) => {
            return acc + (questionInfo[method] || 0);
          }, 0)
        );
      }, 0);
    }
  };

  const getTestQuestionSettings = (
    bookType: BookType
  ): TestQuestionSetting[] => {
    const isSentenceBook = bookType === 'sentence';

    // 각 문항의 설정 값 구하기
    let testQuestionSettings: TestQuestionSetting[] = [];

    // 문장 교재 일 경우
    if (isSentenceBook) {
      const sentenceMethods: StudyMethodSentence[] = [
        'chunk',
        'writing',
        'dictation',
      ];

      const questionInfo: SettingTestQuestionSentence | undefined =
        settingInfo.value?.test?.question?.sentence;
      if (!questionInfo) return [];

      sentenceMethods.forEach(method => {
        const methodCount = questionInfo[method as StudyMethodSentence] || 0;

        for (let i = 0; i < methodCount; i++) {
          testQuestionSettings.push({ type: 'sentence', method });
        }
      });
    }

    // 단어 교재 일 경우
    else {
      const wordMethods: StudyMethodWord[] = [
        'word',
        'meaning',
        'audio',
        'example',
      ];
      const wordTypes: TestQuestionTypeWord[] = ['multiple', 'typing'];

      wordTypes.forEach(type => {
        const questionInfo: SettingTestQuestionWord | undefined =
          settingInfo.value?.test?.question?.word[type];
        if (!questionInfo) return;

        wordMethods.forEach(method => {
          const methodCount = questionInfo[method as StudyMethodWord] || 0;

          for (let i = 0; i < methodCount; i++) {
            testQuestionSettings.push({ type, method });
          }
        });
      });
    }

    return testQuestionSettings;
  };

  return {
    settingInfo,
    testSettingInfo,
    testLimitCount,
    isStrictAnswer,
    isShowSetting,
    isOnlyIncorrect,
    saveSetting,
    loadSetting,
    setSettingInfo,
    showSetting,
    hideSetting,
    getTestSettingCount,
    getTestQuestionSettings,
  };
};
