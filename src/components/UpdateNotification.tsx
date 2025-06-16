import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './UpdateNotification.module.css';

interface UpdateNotificationProps {
  message: string;
  onDismiss: () => void;
  variant?: 'default' | 'success' | 'warning' | 'info';
  autoHide?: boolean;
  autoHideDelay?: number;
}

/**
 * UpdateNotification Component
 * 
 * Displays temporary notifications for service worker updates and other system messages
 * Features: auto-dismiss, multiple variants, accessibility, mobile-responsive design
 */
export function UpdateNotification({ 
  message, 
  onDismiss, 
  variant = 'default',
  autoHide = true,
  autoHideDelay = 5000
}: UpdateNotificationProps): React.ReactElement | null {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleDismiss = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 200); // Match animation duration
  }, [onDismiss]);

  useEffect(() => {
    if (!autoHide) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, autoHideDelay);

    return () => clearTimeout(timer);
  }, [autoHide, autoHideDelay, handleDismiss]);

  // Focus management for accessibility
  useEffect(() => {
    if (notificationRef.current) {
      notificationRef.current.focus();
    }
  }, []);

  if (!isVisible) return null;

  const notificationClasses = [
    styles.updateNotification,
    variant !== 'default' && styles[variant],
    isAnimatingOut && styles.slideOut
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={notificationRef}
      className={notificationClasses}
      role="alert" 
      aria-live="assertive"
      aria-atomic="true"
      data-testid="update-notification"
      tabIndex={-1}
    >
      <div 
        className={styles.message}
        data-testid="update-notification-message"
      >
        {message}
      </div>
      <button 
        className={styles.dismissButton}
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        data-testid="update-notification-dismiss"
        type="button"
      >
        <span aria-hidden="true">✕</span>
        <span className={styles.srOnly}>Close notification</span>
      </button>
    </div>
  );
}