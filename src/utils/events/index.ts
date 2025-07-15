/**
 * Event Listener Management Utilities
 * 
 * These utilities provide standardized ways to handle event listeners
 * with proper cleanup for React components.
 */

import { useEffect, useState } from 'react';

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
 * Utility to add event listener with automatic cleanup
 * 
 * @param element DOM element to attach the listener to
 * @param eventType Event type (e.g., 'click', 'keydown')
 * @param handler Event handler function
 * @param options Event listener options
 * @returns Function to manually remove the event listener
 */
export function addEventListenerWithCleanup<K extends keyof WindowEventMap>(
  element: Window | Document | HTMLElement,
  eventType: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void {
  element.addEventListener(eventType, handler as EventListener, options);
  return () => {
    element.removeEventListener(eventType, handler as EventListener, options);
  };
}

/**
 * Higher-order function that returns a debounced version of the provided function
 * 
 * @param func Function to debounce
 * @param delay Debounce delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: Array<unknown>) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: unknown, ...args: Parameters<T>) {
    // Use the function directly without aliasing 'this'
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Higher-order function that returns a throttled version of the provided function
 * 
 * @param func Function to throttle
 * @param limit Minimum time between function calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: Array<unknown>) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastRun = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: unknown, ...args: Parameters<T>) {
    // Use the function directly without aliasing 'this'
    const now = Date.now();
    
    if (now - lastRun >= limit) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      lastRun = now;
      func.apply(this, args);
    } else if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        lastRun = Date.now();
        timeoutId = null;
        func.apply(this, args);
      }, limit - (now - lastRun));
    }
  };
}
