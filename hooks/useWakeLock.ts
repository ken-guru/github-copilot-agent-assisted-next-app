import { useState, useEffect, useCallback } from 'react';

interface WakeLockResult {
  isSupported: boolean;
  isActive: boolean;
  request: () => Promise<void>;
  release: () => Promise<void>;
}

interface WakeLockSentinel {
  release: () => Promise<void>;
}

// Define our hook with safe SSR handling
export default function useWakeLock(): WakeLockResult {
  // Safely check if the Wake Lock API is supported
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  
  // Check for API support only on client side
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined' && 
        'navigator' in window && 
        'wakeLock' in navigator && 
        typeof navigator.wakeLock?.request === 'function') {
      setIsSupported(true);
    }
  }, []);
  
  // Function to request a wake lock
  const request = useCallback(async (): Promise<void> => {
    if (!isSupported) return;
    
    try {
      // Safely access navigator only on client side
      if (typeof navigator !== 'undefined' && navigator.wakeLock) {
        const sentinel = await navigator.wakeLock.request('screen');
        setWakeLock(sentinel);
        setIsActive(true);
        
        // Add event listener for when the wake lock is released
        sentinel.addEventListener('release', () => {
          setIsActive(false);
          setWakeLock(null);
        });
      }
    } catch (error) {
      console.error('Failed to request wake lock:', error);
      setIsActive(false);
      setWakeLock(null);
    }
  }, [isSupported]);
  
  // Function to release the wake lock
  const release = useCallback(async (): Promise<void> => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setIsActive(false);
        setWakeLock(null);
      } catch (error) {
        console.error('Failed to release wake lock:', error);
      }
    }
  }, [wakeLock]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wakeLock && typeof wakeLock.release === 'function') {
        try {
          // Ensure release() is properly awaited or handled in a try/catch instead of using .catch()
          // This prevents the "Cannot read properties of undefined (reading 'catch')" error
          wakeLock.release().catch(error => {
            console.error('Error releasing wake lock during cleanup:', error);
          });
        } catch (error) {
          console.error('Failed to release wake lock during cleanup:', error);
        }
      }
    };
  }, [wakeLock]);
  
  return {
    isSupported,
    isActive,
    request,
    release,
  };
}
