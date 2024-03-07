<template>
  <div class="matching-ready">
    <div class="matching-ready__title">매칭 게임</div>
    <CommonSwitch
      class="matching-ready__only-today"
      label="오늘만 보기"
      v-model="isOnlyToday"
    />

    <div class="matching-ready__record">
      <CommonTabs :tabs="tabs" v-model="tabIndex" />
      <div v-if="displayRecords.length > 0" class="matching-ready__record-list">
        <div
          class="matching-ready__record-item"
          :class="{ 'high-rank': index < 3 }"
          v-for="(recordInfo, index) in displayRecords"
          :key="recordInfo.recodeId"
        >
          <div class="matching-ready__record-item__rank">
            {{ index + 1 }}
          </div>
          <div class="matching-ready__record-item__content">
            <div class="matching-ready__record-item__label">
              {{ recordInfo.attendanceNo }} 학생

              <span
                v-if="String(recordInfo.studentId) === String(studentId)"
                class="record-myself"
              />
            </div>
            <div class="matching-ready__record-item__score">
              {{ recordInfo.score }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="matching-ready__record-list">
        <div class="empty-message">기록이 없습니다.</div>
      </div>
    </div>

    <div class="matching-ready__btns">
      <Button
        class="block"
        label="매칭 게임 시작"
        size="small"
        severity="help"
        @click="prepareMatching()"
      />

      <div class="matching-ready__btns-bottom">
        <!-- 스코어보드 초기화 기획에 없음 -->
        <!-- <Button
          text
          class="matching-ready__btn"
          label="스코어보드 초기화"
          size="small"
          severity="help"
          @click="resetRecord()"
        /> -->

        <Button
          text
          class="matching-ready__btn"
          label="학습 종료"
          size="small"
          severity="danger"
          @click="exitStudy()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const studyStore = useStudyStore();

const { movePage, exitStudy } = studyStore;
const { studentId } = storeToRefs(studyStore);
const { recordInfos, loadRecords } = useMatching();

const displayRecords = computed(() => {
  return isOnlyToday.value
    ? recordInfos.value.filter(record => isToday(new Date(record.submitDate)))
    : recordInfos.value;
});

const tabs: string[] = [
  '클래스 순위',
  // 전체 순위 노출하지 않음
  // '전체 순위',
];
const tabIndex = ref(0);
const isOnlyToday = ref(false);

const prepareMatching = () => {
  movePage('activity');
};

// // @TODO: 스코어보드 초기화 필요 시 작성
// const resetRecord = () => {
//   console.log('reset record');
// };

loadRecords();
</script>
