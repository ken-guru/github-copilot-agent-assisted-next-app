import React, { useEffect, useState } from 'react';

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

  return (
    <div className={styles.updateNotification} role="status" data-testid="update-notification">
      <span className={styles.message} data-testid="update-notification-message">{message}</span>
      <button 
        className={styles.dismissButton}
        onClick={() => {
          setIsVisible(false);
          onDismiss();
        }}
        aria-label="Dismiss notification"
        data-testid="update-notification-dismiss"
      >
        ✕
      </button>
    </div>
  );
}