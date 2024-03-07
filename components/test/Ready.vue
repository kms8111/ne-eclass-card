<template>
  <div class="test-ready">
    <TestCard :type="readyCardType" @moveNext="moveNext()" />
  </div>
</template>

<script setup lang="ts">
const studyStore = useStudyStore();

const { movePage } = studyStore;
const { bookType, studyType, studyTypeServer } = storeToRefs(studyStore);
const { makeQuestions } = useStudy();
const { updateStudyData } = useStudyData();

const readyCardType = ref('ready');

const moveNext = () => {
  if (readyCardType.value === 'ready') {
    readyCardType.value = 'guide';
  } else if (readyCardType.value === 'guide') {
    startTest();
  }
};

const startTest = () => {
  // 학습 기본 데이터 저장
  updateStudyData({
    bookType: bookType.value,
    studyType: studyType.value,
    studyTypeServer: studyTypeServer.value,
    startTime: Date.now(),
  });

  // 학습 문항 생성
  makeQuestions();

  // 학습으로 이동
  movePage('activity');
};
</script>
