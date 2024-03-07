<template>
  <div class="study">
    <!-- 학습 진행 단계에 따른 페이지 -->
    <StudyReady :studyType="studyType" v-if="studyPage === 'ready'" />
    <StudyActivity
      :studyType="studyType"
      v-else-if="studyPage === 'activity'"
    />
    <StudyComplete v-else-if="studyPage === 'complete'" />
  </div>
</template>

<script setup lang="ts">
import type { StudyType } from '~/types/study';
import { STUDY_TYPES } from '~/constants/study';
import type { MainPageParams } from '~/types/common';

definePageMeta({
  // 진입한 페이지가 StudyType이 아니면 404 에러 페이지로 이동
  validate: route => {
    const params = route.params as MainPageParams;
    const studyType = params.studyType as StudyType;

    if (!STUDY_TYPES.includes(studyType)) {
      throw createError({
        statusCode: 999,
        message: '학습 타입이 유효하지 않습니다.',
        data: {
          title: '잘못된 학습 타입',
        },
      });
    } else return true;
  },
});

const studyStore = useStudyStore();
const { studyType, studyPage } = storeToRefs(studyStore);
</script>
