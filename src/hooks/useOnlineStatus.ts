
import { useState, useEffect } from 'react';

interface WindowWithTestOnlineStatus extends Window {
  __testOnlineStatus?: boolean;
  setTestOnlineStatus?: (status: boolean) => void;
  Cypress?: unknown;
}

export function useOnlineStatus(): boolean {
  // Support test override for Cypress
  const getInitialOnline = () => {
    if (typeof window !== 'undefined' && (window as WindowWithTestOnlineStatus).__testOnlineStatus !== undefined) {
      return (window as WindowWithTestOnlineStatus).__testOnlineStatus as boolean;
    }
    return typeof window === 'undefined' ? true : navigator.onLine;
  };
  const [isOnline, setIsOnline] = useState<boolean>(getInitialOnline());

  useEffect(() => {
    setIsOnline(getInitialOnline());

    const handleStatusChange = () => {
      if ((window as WindowWithTestOnlineStatus).__testOnlineStatus !== undefined) {
        setIsOnline((window as WindowWithTestOnlineStatus).__testOnlineStatus as boolean);
      } else {
        setIsOnline(navigator.onLine);
      }
    };

    // Expose test-only setter for Cypress
    if (typeof window !== 'undefined' && (window as WindowWithTestOnlineStatus).Cypress) {
      (window as WindowWithTestOnlineStatus).setTestOnlineStatus = (status: boolean) => {
        (window as WindowWithTestOnlineStatus).__testOnlineStatus = status;
        setIsOnline(status);
      };
    }

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
      if (typeof window !== 'undefined' && (window as WindowWithTestOnlineStatus).setTestOnlineStatus) {
        delete (window as WindowWithTestOnlineStatus).setTestOnlineStatus;
        delete (window as WindowWithTestOnlineStatus).__testOnlineStatus;
      }
    };
  }, []);

  return isOnline;
}