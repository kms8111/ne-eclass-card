<template>
  <div class="layout-header">
    <div class="layout-header-left">
      <Button
        v-if="isMatchingStarted"
        class="text-white"
        label="매칭종료"
        icon="pi pi-chevron-left"
        size="small"
        :text="true"
        @click="stopMatching()"
      />

      <Button
        v-else
        class="text-white"
        label="학습종료"
        icon="pi pi-chevron-left"
        size="small"
        :text="true"
        @click="exitStudy()"
      />
    </div>

    <div class="layout-header-center">능률보카 고난도 - Day 01</div>

    <!-- 설정 보여주지 않음 -->
    <div v-if="isShowSetting" class="layout-header-right">
      <Button
        class="text-white"
        icon="pi pi-cog"
        :text="true"
        @click="showSetting()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const studyStore = useStudyStore();

const { studyMode, isSimulation } = storeToRefs(studyStore);
const { showSetting } = useSetting();
const { studyPage, exitStudy } = useStudy();
const { stopMatching } = useMatching();

const isMatchingStarted = computed(() => {
  return studyMode.value === 'matching' && studyPage.value === 'activity';
});

const isShowSetting = computed(() => {
  return studyPage.value === 'ready' && isSimulation.value;
});
</script>
