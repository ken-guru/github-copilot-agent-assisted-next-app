import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer as BootstrapToastContainer } from 'react-bootstrap';
import { useToast } from '@/contexts/ToastContext';
import { ToastMessage } from '@/types/toast';

// Animation timing constant for toast fade out
const TOAST_FADE_OUT_DURATION = 200; // milliseconds

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps): React.ReactElement {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!toast.autoDismiss || toast.persistent) {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), TOAST_FADE_OUT_DURATION); // Allow fade out animation
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.autoDismiss, toast.persistent, toast.duration, toast.id, onRemove]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), TOAST_FADE_OUT_DURATION); // Allow fade out animation
  };

  const getBootstrapVariant = (variant: ToastMessage['variant']): string => {
    switch (variant) {
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getIcon = (variant: ToastMessage['variant']): string => {
    switch (variant) {
      case 'success':
        return 'bi-check-circle';
      case 'error':
        return 'bi-exclamation-circle';
      case 'warning':
        return 'bi-exclamation-triangle';
      case 'info':
        return 'bi-info-circle';
      default:
        return 'bi-info-circle';
    }
  };

  return (
    <Toast
      show={isVisible}
      onClose={handleClose}
      bg={getBootstrapVariant(toast.variant)}
      className="text-white mb-2"
      data-testid="toast-notification"
      data-variant={toast.variant}
      autohide={false} // We handle this manually for better control
    >
      <Toast.Body className="d-flex align-items-center">
        <i className={`bi ${getIcon(toast.variant)} me-2`} aria-hidden="true"></i>
        <span className="flex-grow-1" data-testid="toast-message">
          {toast.message}
        </span>
        <button
          type="button"
          className="btn-close btn-close-white ms-2"
          onClick={handleClose}
          aria-label="Close notification"
          data-testid="toast-close-button"
        />
      </Toast.Body>
    </Toast>
  );
}

export function ToastContainer(): React.ReactElement {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return <></>;
  }

  return (
    <BootstrapToastContainer 
      position="top-end" 
      className="p-3 position-fixed" 
      style={{ zIndex: 1055 }}
      data-testid="toast-container"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </BootstrapToastContainer>
  );
}
