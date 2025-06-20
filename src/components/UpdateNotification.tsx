import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface UpdateNotificationProps {
  message: string;
  onDismiss: () => void;
}

export function UpdateNotification({ message, onDismiss }: UpdateNotificationProps): React.ReactElement | null {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 5000); // Auto dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 1055 }}>
      <Toast 
        show={isVisible}
        onClose={handleClose}
        bg="info"
        className="text-white"
        data-testid="update-notification"
      >
        <Toast.Body data-testid="update-notification-message">
          {message}
        </Toast.Body>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          onClick={handleClose}
          aria-label="Close"
          data-testid="update-notification-dismiss"
        />
      </Toast>
    </ToastContainer>
  );
}