import type { AlertOptions, ConfirmOptions } from '~/types/modals';

export const initialAlert: AlertOptions = {
  title: '알림',
  message: '',
  confirmLabel: '확인',
  confirmColor: 'warning',
  isShow: false,
  onClick: () => {},
};

export const initialConfirm: ConfirmOptions = {
  title: '알림',
  message: '',
  confirmLabel: '확인',
  cancelLabel: '취소',
  confirmColor: 'success',
  cancelColor: 'warning',
  isShow: false,
  onClick: () => {},
};

export const useModalStore = defineStore('modal', () => {
  const confirmInfo = ref<ConfirmOptions>(initialConfirm);
  const alertInfo = ref<AlertOptions>(initialAlert);
  const loadingCount = ref(0);

  const initAlert = () => {
    alertInfo.value = initialAlert;
  };

  const setAlertInfo = (options: AlertOptions) => {
    alertInfo.value = { ...alertInfo.value, ...options };
  };

  const initConfirm = () => {
    confirmInfo.value = initialConfirm;
  };

  const setConfirmInfo = (options: ConfirmOptions) => {
    confirmInfo.value = { ...confirmInfo.value, ...options };
  };

  const setLoadingCount = (count: number) => {
    loadingCount.value = count;
  };

  return {
    confirmInfo,
    alertInfo,
    loadingCount,
    initAlert,
    setAlertInfo,
    initConfirm,
    setConfirmInfo,
    setLoadingCount,
  };
});
