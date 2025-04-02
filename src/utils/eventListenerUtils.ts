/**
 * Event Listener Management Utilities
 * 
 * These utilities provide standardized ways to handle event listeners
 * with proper cleanup for React components.
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect online/offline status with proper cleanup
 * 
 * @returns Current online status
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

/**
 * Hook for managing interval timers with automatic cleanup
 * 
 * @param callback - Function to call on each interval
 * @param delay - Time in milliseconds between calls, null to pause
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();
  
  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Set up the interval
  useEffect(() => {
    // Don't schedule if delay is null
    if (delay === null) return;
    
    const id = setInterval(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);
    
    // Cleanup on unmount or delay change
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook for managing timeout with automatic cleanup
 * 
 * @param callback - Function to call after timeout
 * @param delay - Time in milliseconds to wait, null to disable
 */
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();
  
  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Set up the timeout
  useEffect(() => {
    // Don't schedule if delay is null
    if (delay === null) return;
    
    const id = setTimeout(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);
    
    // Cleanup on unmount or delay change
    return () => clearTimeout(id);
  }, [delay]);
}

/**
 * Hook for window resize event with automatic cleanup
 * 
 * @param callback - Function to call on resize events
 * @param options - Optional ResizeObserver options
 */
export function useWindowResize(callback: () => void, options?: { 
  throttle?: number
}) {
  const savedCallback = useRef<() => void>();
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  useEffect(() => {
    const { throttle } = options || {};
    
    // Define handler based on whether we should throttle
    const handleResize = () => {
      if (throttle) {
        if (throttleTimeout.current === null) {
          throttleTimeout.current = setTimeout(() => {
            throttleTimeout.current = null;
            if (savedCallback.current) {
              savedCallback.current();
            }
          }, throttle);
        }
      } else if (savedCallback.current) {
        savedCallback.current();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Call once to initialize
    handleResize();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [options]);
}