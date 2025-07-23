export interface ToastMessage {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  autoDismiss?: boolean;
  duration?: number; // in milliseconds
  persistent?: boolean; // for toasts that shouldn't auto-dismiss
}

export interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toastData: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}
