<template>
  <ModalAlert />
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import type { BasicObject } from '~/types/global';

const { error } = defineProps({
  error: Object as () => NuxtError,
});
const data = error?.data as BasicObject;
const { showAlert } = useModal();

const errorTitle = computed(() => {
  if (error?.statusCode === 404) {
    return '잘못된 경로';
  } else if (error?.statusCode === 999 && data?.title) {
    return data?.title;
  }

  return '에러';
});

const errorMessage = computed(() => {
  if (error?.statusCode === 404) {
    return '페이지를 찾을 수 없습니다.';
  }

  // 커스텀 에러 메시지
  if (error?.statusCode === 999) {
    return error.message;
  }

  return '';
});

const goBack = () => {
  window.history.back();
};

onMounted(() => {
  showAlert(errorMessage.value, {
    title: errorTitle.value,
    confirmLabel: '돌아가기',
    onClick: goBack,
  });
});
</script>
