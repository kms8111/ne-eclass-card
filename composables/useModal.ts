import { useToast } from 'primevue/usetoast';
import type {
  AlertOptions,
  ConfirmOptions,
  ToastOptions,
} from '@/types/modals';
import { LOADING_DEBOUNCE_DURATION } from '~/constants/common';

export const useModal = () => {
  const modalStore = useModalStore();
  const {
    setAlertInfo,
    initAlert,
    setConfirmInfo,
    initConfirm,
    setLoadingCount,
  } = modalStore;
  const { loadingCount } = storeToRefs(modalStore);
  const toast = useToast();

  const isShowLoading = computed(() => loadingCount.value > 0);

  const showAlert = (message: string, options?: AlertOptions) => {
    setAlertInfo({
      ...options,
      message,
      isShow: true,
    });
  };

  const hideAlert = initAlert;

  const showConfirm = (message: string, options?: ConfirmOptions) => {
    setConfirmInfo({
      ...options,
      message,
      isShow: true,
    });
  };

  const hideConfirm = initConfirm;

  const showToast = (message: string, options?: ToastOptions) => {
    const { type, title, duration = 3000 } = options ?? {};

    toast.add({
      severity: type,
      summary: title,
      detail: message,
      life: duration,
    });
  };

  const showLoading = () => {
    setLoadingCount(loadingCount.value + 1);
  };

  const hideLoading = () => {
    setTimeout(() => {
      setLoadingCount(Math.max(loadingCount.value - 1, 0));
    }, LOADING_DEBOUNCE_DURATION);
  };

  return {
    isShowLoading,
    showAlert,
    hideAlert,
    showConfirm,
    hideConfirm,
    showToast,
    showLoading,
    hideLoading,
  };
};
