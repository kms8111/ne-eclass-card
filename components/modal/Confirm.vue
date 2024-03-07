<template>
  <Dialog
    modal
    class="error-modal"
    :header="title"
    :closable="false"
    :style="{ width: '25rem' }"
    v-model:visible="isShow"
  >
    <div v-if="message" class="error-modal-message">
      {{ message }}
    </div>

    <template #footer>
      <div class="error-modal-footer" :style="{}">
        <Button
          :label="cancelLabel"
          :severity="cancelColor"
          :style="{ flex: 1 }"
          @click="handleClick(false)"
        />

        <Button
          :label="confirmLabel"
          :severity="confirmColor"
          :style="{ flex: 1 }"
          @click="handleClick(true)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
const modalStore = useModalStore();
const { confirmInfo } = storeToRefs(modalStore);
const { hideConfirm } = useModal();

const title = computed(() => confirmInfo.value.title);
const message = computed(() => confirmInfo.value.message);
const confirmLabel = computed(() => confirmInfo.value.confirmLabel);
const confirmColor = computed(() => confirmInfo.value.confirmColor);
const cancelLabel = computed(() => confirmInfo.value.cancelLabel);
const cancelColor = computed(() => confirmInfo.value.cancelColor);
const isShow = computed(() => confirmInfo.value.isShow);

const handleClick = (isConfirm: boolean) => {
  const { onClick } = confirmInfo.value;

  if (typeof onClick === 'function') onClick(isConfirm);
  hideConfirm();
};

useKeyStroke(true, (keyName: string) => {
  if (keyName === 'enter') {
    handleClick(true);
  } else if (keyName === 'escape') {
    handleClick(false);
  }
});
</script>
