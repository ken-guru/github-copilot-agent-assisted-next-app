import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track online/offline status
 * @returns {boolean} Current online status (true if online, false if offline)
 */
export function useOnlineStatus(): boolean {
  // Get initial online status from navigator
  const [isOnline, setIsOnline] = useState<boolean>(
    // Default to true for SSR, then check navigator.onLine on client
    typeof window === 'undefined' ? true : navigator.onLine
  );
  const syncedRef = useRef(false);

  useEffect(() => {
    // Update initial state on mount to ensure accuracy
    if (!syncedRef.current) {
      syncedRef.current = true;
      queueMicrotask(() => {
        setIsOnline(navigator.onLine);
      });
    }

    // Handler for online event
    const handleOnline = () => {
      setIsOnline(true);
    };

    // Handler for offline event
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}