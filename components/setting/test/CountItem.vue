<template>
  <div class="setting-test-count">
    <div class="setting-test-count-left">{{ studyMethodText }}</div>

    <div class="setting-test-count-right">
      <span>{{ presentedOptionText }}</span>

      <InputNumber
        showButtons
        class="setting-test-count-input"
        :class="{ 'p-invalid': isTestCountOver }"
        :min="0"
        :disabled="isDisabled"
        v-model="count"
      />
      문항
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SettingStudyMethod } from '~/types/setting';
import {
  SETTING_STUDY_METHOD_TEXT_INFO,
  SETTING_STUDY_PRESENTED_OPTION_TEXT_INFO,
} from '~/constants/setting';

const { studyMethod, isTestCountOver, isDisabled } = defineProps<{
  studyMethod: SettingStudyMethod;
  isTestCountOver: boolean;
  isDisabled: boolean;
}>();
const count = defineModel<number>('count');

const studyMethodText = computed(() => {
  return SETTING_STUDY_METHOD_TEXT_INFO[studyMethod];
});

const presentedOptionText = computed(() => {
  return SETTING_STUDY_PRESENTED_OPTION_TEXT_INFO[studyMethod];
});
</script>
