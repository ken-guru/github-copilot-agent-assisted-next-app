import { useRef, useCallback, useState, useEffect, useMemo, memo } from 'react';

/**
 * Memoizes a value with dependency tracking
 * @param {any} value - Value to memoize
 * @param {Array} deps - Dependencies to track for changes
 * @returns {any} Memoized value
 */
export const useMemoizedValue = (value, deps) => {
  return useMemo(() => value, deps);
};

/**
 * Creates a stable callback reference that internally calls the latest function
 * @param {Function} callback - Callback function
 * @returns {Function} Stable callback reference
 */
export const useStableCallback = (callback) => {
  const callbackRef = useRef(callback);
  
  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Return stable function that uses current ref value
  return useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
};

/**
 * Returns a debounced version of a value that only updates after delay
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {boolean} immediate - Whether to update immediately on first change
 * @returns {any} Debounced value
 */
export const useDebouncedValue = (value, delay, immediate = false) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const firstUpdateRef = useRef(true);
  
  useEffect(() => {
    // If immediate is true and this is the first update, set immediately
    if (immediate && firstUpdateRef.current) {
      setDebouncedValue(value);
      firstUpdateRef.current = false;
      return;
    }
    
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, immediate]);
  
  return debouncedValue;
};

/**
 * Returns a throttled callback function that executes at most once per wait period
 * @param {Function} callback - Function to throttle
 * @param {number} wait - Throttle wait time in ms
 * @param {Object} options - Throttle options
 * @returns {Function} Throttled function
 */
export const useThrottledCallback = (callback, wait, options = { leading: true }) => {
  const { leading } = options;
  const callbackRef = useRef(callback);
  const lastCalledRef = useRef(0);
  const timeoutRef = useRef(null);
  const argsRef = useRef([]);
  const throttledRef = useRef(false);
  
  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Clean up any pending timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return useCallback((...args) => {
    const now = Date.now();
    const remaining = wait - (now - lastCalledRef.current);
    
    argsRef.current = args;
    
    // If we haven't throttled yet and leading is true, execute immediately
    if (!throttledRef.current && leading) {
      lastCalledRef.current = now;
      throttledRef.current = true;
      callbackRef.current(...argsRef.current);
      
      // Set up timer to reset throttle
      timeoutRef.current = setTimeout(() => {
        throttledRef.current = false;
      }, wait);
      
      return;
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set up new timeout
    timeoutRef.current = setTimeout(() => {
      lastCalledRef.current = Date.now();
      throttledRef.current = false;
      callbackRef.current(...argsRef.current);
    }, remaining > 0 ? remaining : 0);
  }, [wait, leading]);
};

/**
 * Higher-order component that prevents unnecessary re-renders
 * @param {React.Component} Component - Component to memoize
 * @param {Array} propsToTrack - Array of prop names to track for changes
 * @returns {React.Component} Memoized component
 */
export const usePreventUnnecessaryRenders = (Component, propsToTrack = []) => {
  return memo(Component, (prevProps, nextProps) => {
    // If no props specified, compare all props
    if (!propsToTrack.length) {
      return false; // Let React's default shallow comparison handle it
    }
    
    // Only compare specified props
    return propsToTrack.every(propName => 
      prevProps[propName] === nextProps[propName]
    );
  });
};

/**
 * Measures and logs component render time
 * @param {string} componentName - Name of the component
 * @returns {Function} Function to call when render completes
 */
export const measureRenderTime = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`);
    
    return duration;
  };
};

/**
 * Resets a component's internal state when key data changes
 * Useful for virtualized lists, data grids, etc.
 * @param {Function} resetFn - Function to call to reset state
 * @param {Array} deps - Dependencies that should trigger reset
 */
export const useResetStateOnDataChange = (resetFn, deps) => {
  const prevDepsRef = useRef(deps);
  
  useEffect(() => {
    // Check if any dependencies have changed
    const depsChanged = deps.some((dep, i) => dep !== prevDepsRef.current[i]);
    
    if (depsChanged) {
      resetFn();
      prevDepsRef.current = deps;
    }
  }, deps);
};

/**
 * Hook to detect and log when components take too long to render
 * @param {string} componentName - Name of the component
 * @param {number} threshold - Render time threshold in ms
 */
export const useRenderWarning = (componentName, threshold = 16) => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      if (duration > threshold) {
        console.warn(`[Slow Render] ${componentName} took ${duration.toFixed(2)}ms to render (threshold: ${threshold}ms)`);
      }
    };
  });
};
