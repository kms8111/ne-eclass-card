<template>
  <div class="study-ready">
    <div class="study-ready__title">
      <div v-if="isSimulation" class="text-red">
        시뮬레이션 학습은 저장되지 않습니다.
      </div>

      <template v-else>
        <div class="study-ready__title__type">
          {{ studyTypeText }}
        </div>

        <!-- <div
          class="study-ready__title-mandatory"
          :class="isMandatory ? 'text-red' : 'text-gray'"
        >
          {{ mandatoryText }}
        </div> -->
      </template>
    </div>

    <div class="study-ready__setting">
      <div
        v-if="studyMethodOptions.length > 0"
        class="study-ready__setting-item"
      >
        <div class="study-ready__setting-item__label">학습 방법</div>
        <div class="study-ready__setting-item__input">
          <Dropdown
            option-label="label"
            option-value="value"
            :options="studyMethodOptions"
            :modelValue="studyMethod"
            :disabled="!isStudyMethodSelectable"
            @change="changeStudyMethod($event)"
          />
        </div>
      </div>

      <CommonSwitch label="셔플 모드" v-model="isShuffle" />

      <!-- @TODO: 숙련모드 필요 시 작성 -->
      <!-- <CommonSwitch
        v-if="isAdvancedAvailable"
        label="숙련 모드"
        v-model="isAdvanced"
      /> -->
    </div>

    <div class="study-ready__btns">
      <Button
        class="block"
        :label="`${studyTypeText} 시작 `"
        size="small"
        severity="help"
        @click="prepareStudy()"
      />

      <div class="study-ready__btns-bottom">
        <template v-for="{ label, value } in studyTypeOptions">
          <Button
            v-if="studyType !== value"
            :key="value"
            :label="`${label}으로 이동`"
            :text="true"
            size="small"
            severity="help"
            @click="changeStudyType(value as StudyType)"
          />
        </template>

        <Button
          label="학습 종료"
          size="small"
          severity="danger"
          :text="true"
          @click="exitStudy()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  STUDY_TYPES,
  WORD_STUDY_METHODS,
  SENTENCE_STUDY_METHODS,
  STUDY_TYPE_TEXT_INFO,
  STUDY_METHOD_TEXT_INFO,
} from '@/constants/study';
import type { StudyType, StudyTypeServer, StudyMethod } from '@/types/study';
import type { SelectOptions } from '@/types/common';

const props = defineProps<{ studyType: StudyType }>();
const { studyType } = toRefs(props);

const route = useRoute();
const { showToast } = useModal();
const studyStore = useStudyStore();
const {
  isShuffle: isShuffleInit,
  isAdvanced: isAdvancedInit,
  isSimulation,
  setIsShuffle,
  setIsAdvanced,
  movePage,
  exitStudy,
} = studyStore;
const { bookType, studyMethod } = toRefs(studyStore);
const {
  isStudyMethodSelectable,
  makeQuestions,
  checkExampleExist,
  saveStudyMethod,
} = useStudy();
const { updateStudyData } = useStudyData();

const studyTypeOptions: SelectOptions = STUDY_TYPES.map(studyType => ({
  label: STUDY_TYPE_TEXT_INFO[studyType],
  value: studyType,
}));

const isShuffle = ref(isShuffleInit.valueOf());
const isAdvanced = ref(isAdvancedInit.valueOf());

// @TODO: 숙련모드 필요 시 작성
// const isAdvancedAvailable = computed(() => bookType.value === 'word');
// const isMandatory = computed(() => {
//   const mandatoryInfo = settingInfo.value?.studyMethod;
//   const isMandatory = mandatoryInfo?.[studyType.value];
//   return isMandatory;
// });
// const mandatoryText = computed(() =>
//   isMandatory.value ? '필수학습' : '필수아님'
// );

const studyMethodOptions = computed<SelectOptions>(() => {
  let availableStudyMethods: StudyMethod[] = [];
  const isSpellStudy = studyType.value === 'spell';

  if (bookType.value === 'word') {
    // 발음 제시는 스펠 학습에서만 노출
    availableStudyMethods = WORD_STUDY_METHODS.filter(method => {
      const isPronunciation = method === 'audio';

      if (isPronunciation) return isSpellStudy;
      return true;
    });
  } else if (bookType.value === 'sentence') {
    // 문장 학습일 경우는 스펠 학습에서만 노출
    if (isSpellStudy) availableStudyMethods = SENTENCE_STUDY_METHODS;
  }

  return availableStudyMethods.map(method => ({
    label: STUDY_METHOD_TEXT_INFO[method],
    value: method,
  }));
});

const studyTypeText = computed(() => STUDY_TYPE_TEXT_INFO[studyType.value]);

watch(isShuffle, newValue => {
  setIsShuffle(Boolean(newValue));
});
watch(isAdvanced, newValue => setIsAdvanced(Boolean(newValue)));

const changeStudyMethod = ($event: {
  originalEvent: Event;
  value: StudyMethod;
}) => {
  const { value } = $event;

  // 예문일 경우, 예문이 있는지 확인하여 없으면 알림 노출 후, 다시 기존 값으로 변경
  if (value === 'example') {
    const isExampleExist = checkExampleExist();
    if (!isExampleExist) {
      showToast('이 세트에는 예문이 없어 예문제시 할 수 없습니다.', {
        type: 'error',
      });
      return;
    }
  }

  studyMethod.value = value;
};

const changeStudyType = (studyType: StudyType) => {
  // navigateTo()로 이동 시, 데이터 변경 및 Reactive가 일어나지 않아 location.href 로 이동
  // navigateTo({ path: `/study/${studyType}`, query: route.query });

  // location.href 로 이동
  const url = addUrlQuery(
    `/study/${studyType}`,
    route.query as Record<string, string>
  );
  location.href = url;
};

const prepareStudy = () => {
  // 학습 방법 선택 내용 저장
  saveStudyMethod();

  // 학습 기본 데이터 저장
  updateStudyData({
    bookType: bookType.value,
    studyType: studyType.value,
    studyTypeServer: studyType.value.toUpperCase() as StudyTypeServer,
    startTime: Date.now(),
  });

  // 학습 문항 생성
  makeQuestions();

  // 학습으로 이동
  movePage('activity');
};
</script>
