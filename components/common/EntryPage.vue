<template>
  <ClientOnly>
    <RouterView v-if="isLoaded" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { STUDY_TYPES } from '~/constants/study';
import type { MainPageParams, MainPageQuery } from '~/types/common';
import type { SettingInfo, SettingStudyMethod } from '~/types/setting';
import type { StudyMode } from '~/types/study';

const route = useRoute();
const studyStore = useStudyStore();
const { showToast } = useModal();
const { fetchBook, parseBook } = useApi();
const { loadSetting } = useSetting();
const { prepareStudyData } = useStudyData();
const { showAlert } = useModal();

const { params, query } = route;
const { studyMode: studyModeProp } = defineProps<{ studyMode: StudyMode }>();
const { setBook, setParamData, setStudyMode, setStudyType, resetStudy } =
  studyStore;
const { bookType, isSimulation } = storeToRefs(studyStore);
const { studyType: studyTypeParam } = params as MainPageParams;
const { deployId, studentId, classMode } = query as unknown as MainPageQuery;
const { setIsStudyMethodSelectable, loadStudyMethod } = useStudy();
const { settingInfo } = useSetting();
const isLoaded = ref(false);

const setData = async () => {
  // 학습 초기화
  resetStudy();

  // 데이터 설정
  setStudyMode(studyModeProp);
  setStudyType(studyTypeParam || STUDY_TYPES[0]);
  setParamData(deployId, studentId, classMode);

  // 데이터 로딩
  await loadData();

  // 유효한 접근인지 확인
  checkValidEntry();

  isLoaded.value = true;
};

const checkValidEntry = () => {
  if (studyModeProp === 'matching' && bookType.value === 'sentence') {
    showAlert('단어 교재만 매칭 게임을 진행할 수 있습니다.', {
      confirmLabel: '닫기',
      onClick: () => closeWindow(true),
    });
  }
};

const loadData = async () => {
  try {
    let neEvalIdParam: { neEvalId: string };
    if (!isSimulation.value) {
      // 시뮬레이션 에서는 deployId, studentId 전달하지 않음.
      const { neEvalId } = await loadSetting(deployId, studentId);
      neEvalIdParam = { neEvalId: neEvalId };
    } else {
      // GET parameter 에서 neEvalId 추출
      neEvalIdParam = route.query as { neEvalId: string };
    }
    await handleFetchBook(neEvalIdParam.neEvalId);

    // 매칭 학습이 아닌 경우에만 학습 데이터 불러오기
    if (studyModeProp === 'matching') return;

    await prepareStudyData(isSimulation.value);

    if (settingInfo?.value) {
      setIsStudyMethodSelectable(
        (settingInfo.value as SettingInfo).studyMethod?.[
          studyTypeParam as keyof SettingStudyMethod
        ] === 'free'
      );
    }

    // 이전 학습 방법 불러오기
    loadStudyMethod();
  } catch (error) {
    console.log('setData() - error', error);
    showToast('학습 정보를 불러오는데 실패했습니다.', { type: 'error' });
  }
};

const handleFetchBook = async (neEvalId: string) => {
  try {
    const { data } = await fetchBook(neEvalId);

    const book = parseBook(data);
    if (book) setBook(book);
  } catch (error) {
    console.log('handleFetchBook() - error', error);
    throw new Error('책 정보를 불러오기 실패');
  }
};

setData();
turnOnPreventClose();
</script>
