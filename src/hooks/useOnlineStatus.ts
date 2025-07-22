import { useState, useEffect } from 'react';

/**
 * Custom hook to track online/offline status
 * @returns {boolean} Current online status (true if online, false if offline)
 */
export function useOnlineStatus(): boolean {

  // Support test override for Cypress
  const getInitialOnline = () => {
    if (typeof window !== 'undefined' && (window as any).__testOnlineStatus !== undefined) {
      return (window as any).__testOnlineStatus;
    }
    return typeof window === 'undefined' ? true : navigator.onLine;
  };
  const [isOnline, setIsOnline] = useState<boolean>(getInitialOnline());


  useEffect(() => {
    // Update initial state on mount to ensure accuracy
    setIsOnline(getInitialOnline());

    // Handler for online/offline events: always read navigator.onLine or test override
    const handleStatusChange = () => {
      if ((window as any).__testOnlineStatus !== undefined) {
        setIsOnline((window as any).__testOnlineStatus);
      } else {
        setIsOnline(navigator.onLine);
      }
    };

    // Expose test-only setter for Cypress
    if (typeof window !== 'undefined' && (window as any).Cypress) {
      (window as any).setTestOnlineStatus = (status: boolean) => {
        (window as any).__testOnlineStatus = status;
        setIsOnline(status);
      };
    }

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
      if (typeof window !== 'undefined' && (window as any).setTestOnlineStatus) {
        delete (window as any).setTestOnlineStatus;
        delete (window as any).__testOnlineStatus;
      }
    };
  }, []);

  return isOnline;
}