export interface AlertOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  confirmColor?: string;
  isShow?: boolean;
  onClick?: () => void;
}

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  cancelColor?: string;
  isShow?: boolean;
  onClick?: (isConfirm: boolean) => void;
}

export interface ToastOptions {
  type?: 'info' | 'success' | 'warn' | 'error';
  title?: string;
  duration?: number;
}
