<template>
  <Sidebar
    v-if="settingInfo"
    class="setting"
    position="right"
    v-model:visible="isShowSetting"
  >
    <template #header>
      <div class="setting-header">
        <div class="setting-header-title">학습 / 테스트 설정</div>
      </div>
    </template>

    <div class="setting-content">
      <div class="setting-list">
        <!-- <div class="setting-item">
          <div class="setting-item-left">
            <div class="setting-item-interaction">
              <i class="pi pi-volume-down"></i>
            </div>

            <div class="setting-item-title">발음 속도</div>
          </div>

          <div class="setting-item-right">
            <div class="setting-item-input">
              <Dropdown
                class="setting-item-dropdown"
                option-label="label"
                option-value="value"
                :options="audioSpeedOptions"
                :modelValue="settingInfo.audioSpeed"
                @change="changeSetting('audioSpeed', $event.value)"
              />
            </div>

            <span class="setting-item-text">
              학생이 마음대로 학습, 테스트의 녹음, 재생속도를 설정할 수
              있습니다.
            </span>
          </div>
        </div> -->

        <div
          class="setting-item"
          v-for="methodKey in studyMethodKeys"
          :key="methodKey"
        >
          <div class="setting-item-left">
            <div class="setting-item-interaction">
              <!-- <InputSwitch v-model="settingInfo.studyMethod[methodKey]" /> -->
            </div>

            <div class="setting-item-title">
              {{ SETTING_STUDY_TYPE_TEXT_INFO[methodKey] }}
            </div>
          </div>

          <div class="setting-item-right">
            <Dropdown
              class="setting-item-dropdown"
              option-label="label"
              option-value="value"
              :options="getStudyMethodOptions(methodKey)"
              :modelValue="settingInfo.studyMethod[methodKey]"
              @change="changeSettingStudyMethod(methodKey, $event.value)"
            />
          </div>
        </div>

        <!-- 매칭은 별도로 표기-->
        <div class="setting-item">
          <div class="setting-item-left">
            <div class="setting-item-interaction">
              <!-- <InputSwitch v-model="settingInfo.studyMethod[methodKey]" /> -->
            </div>

            <div class="setting-item-title">매칭</div>
          </div>

          <div class="setting-item-right">
            <InputNumber
              class="setting-item-input"
              size="small"
              v-model="settingInfo.matching.score"
            />
            <span>점</span>

            <Dropdown
              class="setting-item-dropdown"
              option-label="label"
              option-value="value"
              :options="matchingDurationOptions"
              :modelValue="settingInfo.matching.duration"
              @change="changeSettingMatching('duration', $event.value)"
            />
          </div>
        </div>
      </div>

      <div class="setting-list">
        <div class="setting-item">
          <div class="setting-item-left">
            <div class="setting-item-interaction">
              <!-- <InputSwitch v-model="settingInfo.studyMethod.test" /> -->
            </div>

            <div class="setting-item-title">
              {{ SETTING_STUDY_TYPE_TEXT_INFO['test'] }}
            </div>
          </div>

          <div class="setting-item-right">
            <Dropdown
              class="setting-item-test-score"
              option-label="label"
              option-value="value"
              :options="testScoreOptions"
              :modelValue="settingInfo.test.goalScore"
              @change="changeSettingTest('goalScore', $event.value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item-left" />

          <div class="setting-item-right">
            <div class="setting-item-right-wrap">
              <div class="setting-item-right-title">
                문항생성 (
                <strong
                  class="setting-item-text-primary"
                  :class="{ 'text-danger': isTestCountOver }"
                >
                  {{ testQuestionCount }}문항
                </strong>
                / 최대 {{ totalQuestionCount }}문항 )
              </div>
            </div>
          </div>
        </div>

        <template v-if="bookType === 'word'">
          <div
            class="setting-item"
            v-for="questionType in testQuestionTypes"
            :key="questionType"
          >
            <div class="setting-item-left" />

            <div class="setting-item-right">
              <div class="setting-item-right-wrap">
                <div class="setting-item-right-title">
                  {{ SETTING_TEST_QUESTION_WORD_TEXT_INFO[questionType] }}
                  문항 생성
                </div>

                <div class="setting-item-right-list">
                  <SettingTestCountItem
                    v-for="studyMethod in testQuestionMethods"
                    :key="studyMethod"
                    :studyMethod="studyMethod"
                    :isTestCountOver="isTestCountOver"
                    :isDisabled="checkIsStudyMethodDisabled(studyMethod)"
                    v-model:count="
                      testWordCountInfo[questionType][
                        studyMethod as keyof SettingTestQuestionWord
                      ]
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="bookType === 'sentence'">
          <div class="setting-item">
            <div class="setting-item-left" />

            <div class="setting-item-right">
              <div class="setting-item-right-wrap">
                <div class="setting-item-right-list">
                  <SettingTestCountItem
                    v-for="studyMethod in testQuestionMethods"
                    :key="studyMethod"
                    :studyMethod="studyMethod"
                    :isTestCountOver="isTestCountOver"
                    v-model:count="
                      testSentenceCountInfo[
                        studyMethod as keyof SettingTestQuestionSentence
                      ]
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Word / Sentence 교재 공통 시험 Options -->
        <div class="setting-item">
          <div class="setting-item-left" />

          <div class="setting-item-right">
            <div class="setting-item-right-wrap">
              <div class="setting-item-right-title">진행방식</div>

              <div class="setting-item-right-list">
                <!-- <div class="setting-item-right-item">
                  <div class="setting-item-right-item-title">
                    답안 입력 시간 제한
                  </div>

                  <Dropdown
                    class="setting-item-dropdown"
                    option-label="label"
                    option-value="value"
                    :options="answerSpeedOptions"
                    :modelValue="settingInfo.test.answerSpeed"
                    @change="changeSettingTest('answerSpeed', $event.value)"
                  />
                </div> -->

                <div class="setting-item-right-item">
                  <div class="setting-item-right-item-title">응시제한 횟수</div>

                  <Dropdown
                    class="setting-item-dropdown"
                    option-label="label"
                    option-value="value"
                    :options="limitCountOptions"
                    :modelValue="settingInfo.test.limitCount"
                    @change="changeSettingTest('limitCount', $event.value)"
                  />
                </div>

                <div class="setting-item-right-item">
                  <Checkbox
                    v-model="settingInfo.test.isOnlyIncorrect"
                    :binary="true"
                  />

                  <div class="setting-item-right-item-title">
                    직전 오답만 출제하기
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item-left" />

          <div class="setting-item-right">
            <div class="setting-item-right-wrap">
              <div class="setting-item-right-title">주관식 입력 채점기준</div>

              <div class="setting-item-right-list">
                <div class="setting-item-right-item">
                  <Checkbox
                    v-model="settingInfo.test.isStrictAnswer"
                    :binary="true"
                  />

                  <div class="setting-item-right-item-title">
                    대소문자, 띄어쓰기, 구두점(?!,.) 일치
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="setting-bottom">
      <div class="setting-bottom-button-wrap">
        <Button
          class="setting-bottom-button"
          label="현재 세트에 적용"
          severity="success"
          @click="handleSaveSetting()"
        />
      </div>
    </div>
  </Sidebar>
</template>

<script setup lang="ts">
import type {
  SettingInfo,
  SettingStudyMethod,
  SettingTest,
  SettingTestQuestionTypeWord,
  SettingTestQuestionWord,
  SettingTestQuestionSentence,
  SettingMatching,
} from '~/types/setting';
import {
  WORD_STUDY_METHODS,
  SENTENCE_STUDY_METHODS,
  STUDY_METHOD_TEXT_INFO,
} from '~/constants/study';
import {
  SETTING_TEST_STUDY_METHOD_WORD,
  SETTING_TEST_STUDY_METHOD_SENTENCE,
  SETTING_STUDY_TYPE_TEXT_INFO,
  SETTING_TEST_ANSWER_SPEED_TEXT_INFO,
  SETTING_TEST_QUESTION_WORD_TEXT_INFO,
  SETTING_MATCHING_DURATIONS,
} from '~/constants/setting';

const { showToast } = useModal();
const { saveSetting, settingInfo, isShowSetting } = useSetting();
const {
  book,
  bookType,
  studyType,
  studyMethod,
  classId,
  checkExampleExist,
  setIsStudyMethodSelectable,
} = useStudy();

const studyMethodKeys = [
  'memorize',
  'recall',
  'spell',
] as (keyof SettingStudyMethod)[];
const matchingDurationOptions = SETTING_MATCHING_DURATIONS.map(duration => ({
  label: `제한시간 ${duration}분`,
  value: duration,
}));
console.log('matchingDurationOptions', matchingDurationOptions);
const audioSpeedOptions = [
  { label: '0.5배속', value: 0.5 },
  { label: '0.75배속', value: 0.75 },
  { label: '1배속', value: 1 },
  { label: '1.25배속', value: 1.25 },
  { label: '1.5배속', value: 1.5 },
  { label: '1.75배속', value: 1.75 },
  { label: '2배속', value: 2 },
];
const testScoreOptions = Array.from({ length: 20 }, (_, i) => {
  const score = (i + 1) * 5;
  return { label: `${score}점 이상`, value: score };
});
const limitCountOptions = [
  { label: '무제한', value: 0 },
  ...Array.from({ length: 5 }, (_, i) => {
    const count = i + 1;
    return { label: `${count}회`, value: count };
  }),
];
const answerSpeedOptions = Object.entries(
  SETTING_TEST_ANSWER_SPEED_TEXT_INFO
).map(([key, value]) => ({ label: value, value: key }));
const testQuestionTypes: (keyof SettingTestQuestionTypeWord)[] = [
  'multiple',
  'typing',
];
const testQuestionMethods = computed(() => {
  if (bookType.value === 'word') {
    return SETTING_TEST_STUDY_METHOD_WORD;
  } else if (bookType.value === 'sentence') {
    return SETTING_TEST_STUDY_METHOD_SENTENCE;
  } else return [];
});
const testWordCountInfo = ref<SettingTestQuestionTypeWord>(
  settingInfo.value?.test.question.word || {
    multiple: {
      word: 0,
      meaning: 0,
      audio: 0,
      example: 0,
    },
    typing: {
      word: 0,
      meaning: 0,
      audio: 0,
      example: 0,
    },
  }
);
const testSentenceCountInfo = ref<SettingTestQuestionSentence>(
  settingInfo.value?.test.question.sentence || {
    chunk: 0,
    sentence: 0,
    dictation: 0,
  }
);
const testQuestionCount = computed(() => {
  const question = settingInfo.value?.test.question;
  if (!question) return 0;

  const questionTypeInfo = question[bookType.value];

  if (bookType.value === 'word') {
    let count = 0;
    Object.values(questionTypeInfo as SettingTestQuestionTypeWord).forEach(
      (questionInfo: SettingTestQuestionWord) => {
        console.log('questionInfo', questionInfo);
        count += Object.values(questionInfo).reduce((acc, cur) => acc + cur, 0);
      }
    );
    return count;
  } else if (bookType.value === 'sentence') {
    return Object.values(questionTypeInfo).reduce(
      (acc, cur) => acc + cur,
      0
    ) as number;
  } else return 0;
});
const isTestCountOver = computed(
  () => testQuestionCount.value > totalQuestionCount.value
);

const totalQuestionCount = computed(() => {
  return book.value.wordInfos.length;
});

const initSetting = () => {
  if (!settingInfo.value) return;

  // 각 학습의 기본 학습 방법 설정
  if (settingInfo.value?.studyMethod) {
    Object.keys(settingInfo.value?.studyMethod).forEach(key => {
      if (
        !(settingInfo.value as SettingInfo).studyMethod?.[
          key as keyof SettingStudyMethod
        ]
      )
        (settingInfo.value as SettingInfo).studyMethod[
          key as keyof SettingStudyMethod
        ] = 'free';
    });
  } else {
    (settingInfo.value as SettingInfo).studyMethod = {
      memorize: 'free',
      recall: 'free',
      spell: 'free',
    };
  }

  // 테스트의 문항 개수 세팅
  testWordCountInfo.value = settingInfo.value?.test.question.word;
  testSentenceCountInfo.value = settingInfo.value?.test.question.sentence;
};

const changeSetting = <T extends keyof SettingInfo>(
  key: T,
  value: SettingInfo[T]
) => {
  if (settingInfo.value) settingInfo.value[key] = value;
};

const changeSettingStudyMethod = <T extends keyof SettingStudyMethod>(
  key: T,
  value: SettingStudyMethod[T]
) => {
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

  if (settingInfo.value) {
    settingInfo.value.studyMethod[key] = value;
    if (value !== 'free') studyMethod.value = value;
    if (key === studyType.value) setIsStudyMethodSelectable(value === 'free');
  }
};

const changeSettingMatching = <T extends keyof SettingMatching>(
  key: T,
  value: number
) => {
  if (settingInfo.value) settingInfo.value.matching[key] = value;
};

const changeSettingTest = <T extends keyof SettingTest>(
  key: T,
  value: SettingTest[T]
) => {
  if (settingInfo.value) settingInfo.value.test[key] = value;
};

const checkIsStudyMethodDisabled = (studyMethod: string) => {
  if (studyMethod === 'example') {
    const isExampleExist = checkExampleExist();
    console.log('isExampleExist', isExampleExist);
    return !isExampleExist;
  } else return false;
};

const getStudyMethodOptions = (studyType: string) => {
  const studyMethodOptions =
    bookType.value === 'word'
      ? WORD_STUDY_METHODS.filter(
          studyMethod => !(studyType !== 'spell' && studyMethod === 'audio')
        ).map(studyMethod => ({
          label: STUDY_METHOD_TEXT_INFO[studyMethod],
          value: studyMethod,
        }))
      : SENTENCE_STUDY_METHODS.map(studyMethod => ({
          label: STUDY_METHOD_TEXT_INFO[studyMethod],
          value: studyMethod,
        }));

  return [...studyMethodOptions, { label: '학생 설정 허용', value: 'free' }];
};

const handleSaveSetting = () => {
  if (isTestCountOver.value) {
    showToast('문항 생성 개수가 최대 문항 개수를 초과하였습니다.', {
      type: 'error',
    });
    return;
  }

  saveSetting(classId.value);
};

watch(isShowSetting, () => {
  initSetting();
});
watch(testWordCountInfo, () => {
  if (settingInfo.value) {
    settingInfo.value.test.question.word = testWordCountInfo.value;
  }
});
</script>
