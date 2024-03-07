<template>
  <div class="index">
    <h1>학습 진입</h1>

    <div class="index-content">
      <div class="index-study-section index-study-select">
        <div class="index-study-section-header">
          <h2 class="index-study-section-title">학습 선택</h2>

          <div class="index-study-section-select">
            <span>DEPLOY ID:</span>

            <Dropdown
              v-model="deployId"
              :options="deployIds"
              placeholder="DEPLOY ID 선택"
              @change="saveSelected"
            />
          </div>
        </div>

        <div v-if="deployId" class="index-study-info">
          <div class="index-study-info-title">평가 정보</div>

          <div class="index-study-info-list">
            <div class="index-study-info-item">
              neEvalId: <strong>{{ bookInfo?.neEvalId }}</strong>
            </div>
            <div class="index-study-info-item">
              evalType: <strong>{{ bookInfo?.evalType }}</strong>
            </div>
            <div class="index-study-info-item">
              deployId: <strong>{{ deployInfo?.deployId }}</strong>
            </div>
            <div class="index-study-info-item">
              etc: <strong>{{ deployInfo?.etc }}</strong>
            </div>
          </div>
        </div>

        <div v-if="studyList.length > 0" class="index-study-list">
          <div
            class="index-study-item"
            v-for="studyInfo in studyList"
            :key="studyInfo.studentId"
          >
            <div class="index-study-item-title">
              <div>
                {{ studyInfo.studentType }} (studentId:
                {{ studyInfo.studentId }})
              </div>
            </div>

            <div class="index-study-item-content">
              <Button
                label="암기학습"
                severity="primary"
                @click="openStudy('memorize', studyInfo)"
              />
              <Button
                label="리콜학습"
                severity="primary"
                @click="openStudy('recall', studyInfo)"
              />
              <Button
                label="스펠학습"
                severity="primary"
                @click="openStudy('spell', studyInfo)"
              />
              <Button
                label="매칭"
                severity="success"
                @click="openStudy('matching', studyInfo)"
              />
              <Button
                label="테스트"
                severity="help"
                @click="openStudy('test', studyInfo)"
              />
            </div>
          </div>
        </div>

        <div v-else class="index-study-list empty">
          <div>
            해당 Deploy ID에 대한 학생이 없습니다.<br />
            시뮬레이션 학습만 진행 가능합니다.<br />
          </div>

          <div class="index-study-item-content">
            <Button
              label="암기학습"
              severity="help"
              @click="startSimulation('memorize')"
            />
            <Button
              label="리콜학습"
              severity="help"
              @click="startSimulation('recall')"
            />
            <Button
              label="스펠학습"
              severity="help"
              @click="startSimulation('spell')"
            />
            <Button
              label="매칭"
              severity="success"
              @click="startSimulation('matching')"
            />
            <Button
              label="테스트"
              severity="help"
              @click="startSimulation('test')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { books, deploys, students } from '~/data/dev';

definePageMeta({
  layout: 'empty',

  // 개발용 테스트 주소가 아니면 접근 할 수 없도록 함
  validate: _ => {
    // Dev용 호스트 주소들
    const devHosts = ['localhost', 'moimin.com', 'eclass-lms.tssue'];
    const currentHostName = window.location.hostname;
    const isDevHost = devHosts.includes(currentHostName);

    return isDevHost;
  },
});

const { showToast } = useModal();
const deployIds = deploys.map(deploy => deploy.deployId);
const deployId = ref(deployIds[0]);
const deployInfo = computed(() =>
  deploys.find(deploy => deploy.deployId === deployId.value)
);
const bookInfo = computed(() =>
  books.find(book => book.neEvalId === deployInfo.value?.neEvalId)
);
const studyList = computed(() => {
  return students
    .filter(student => student.deployId === deployId.value)
    .map(student => {
      const studentDeploy = deploys.find(
        deploy => deploy.deployId === student.deployId
      );
      const studentBook = books.find(
        book => book.neEvalId === studentDeploy?.neEvalId
      );

      return {
        ...student,
        ...studentBook,
        ...studentDeploy,
      };
    });
});

const startSimulation = (type: string) => {
  if (!bookInfo.value) return;

  const path =
    type === 'test'
      ? `/test`
      : type === 'matching'
        ? '/matching'
        : `/study/${type}`;
  const url = addUrlQuery(path, { classMode: 'simulation' });

  // 학습 창 오픈
  openStudyWindow(url);
};

const openStudy = (type: string, studyInfo: any) => {
  const { deployId, studentId } = studyInfo;

  const path =
    type === 'test'
      ? `/test`
      : type === 'matching'
        ? '/matching'
        : `/study/${type}`;
  const url = addUrlQuery(path, {
    deployId,
    studentId,
  });

  // 학습 창 오픈
  openStudyWindow(url);
};

// 선택한 deployId 저장
const saveSelected = () => {
  localStorage.setItem('selectedDeployId', String(deployId.value));
};

// 저장된 deployId 불러오기
const loadSelected = () => {
  const selectedDeployId = localStorage.getItem('selectedDeployId');
  if (selectedDeployId) {
    deployId.value = parseInt(selectedDeployId);
  }
};

// 페이지 로드 시 저장된 deployId 불러오기
onMounted(loadSelected);
</script>
