import { useState, useRef, useCallback, useEffect, createContext, useContext } from 'react';

/**
 * Hook for detecting long press gestures
 * @param {Function} callback - Function to call on long press
 * @param {Object} options - Configuration options
 * @returns {Object} Event handlers to attach to target element
 */
export const useLongPress = (callback, options = {}) => {
  const {
    delay = 500,
    onTap = () => {},
    onMove = () => {},
    preventDefault = true,
    stopPropagation = true,
  } = options;
  
  // Store state with refs to avoid re-renders
  const timeoutRef = useRef(null);
  const isLongPressActiveRef = useRef(false);
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const currentPositionRef = useRef({ x: 0, y: 0 });
  
  // Clean up any pending timeout
  const clearLongPressTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isLongPressActiveRef.current = false;
  };
  
  // Start the long press timer
  const startLongPress = useCallback((event) => {
    // Prevent default behavior if requested
    if (preventDefault) {
      event.preventDefault();
    }
    if (stopPropagation) {
      event.stopPropagation();
    }
    
    // Clear any existing timeout
    clearLongPressTimeout();
    
    // Store initial touch position
    if (event.touches && event.touches[0]) {
      const touch = event.touches[0];
      initialPositionRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };
      currentPositionRef.current = { ...initialPositionRef.current };
    }
    
    // Set timeout for long press
    timeoutRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      
      // Create custom event with position data
      const eventData = {
        initialPosition: initialPositionRef.current,
        currentPosition: currentPositionRef.current,
        target: event.target
      };
      
      // Call the callback with event data
      callback(eventData);
      
      // Dispatch custom event for use with TouchFeedbackProvider
      const longPressEvent = new CustomEvent('longpress', {
        bubbles: true,
        detail: { intensity: 'medium', position: currentPositionRef.current }
      });
      event.target.dispatchEvent(longPressEvent);
      
    }, delay);
  }, [callback, delay, preventDefault, stopPropagation]);
  
  // Cancel the long press timer
  const endLongPress = useCallback((event) => {
    // If long press wasn't triggered, consider it a tap
    if (!isLongPressActiveRef.current && timeoutRef.current) {
      onTap(event);
    }
    
    clearLongPressTimeout();
  }, [onTap]);
  
  // Handle movement during press
  const handleMove = useCallback((event) => {
    if (event.touches && event.touches[0]) {
      const touch = event.touches[0];
      
      // Store current position
      currentPositionRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };
      
      // Calculate delta from initial position
      const deltaX = currentPositionRef.current.x - initialPositionRef.current.x;
      const deltaY = currentPositionRef.current.y - initialPositionRef.current.y;
      
      // Calculate absolute distance moved
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      // If moved too far, cancel long press
      if (absX > 10 || absY > 10) {
        if (!isLongPressActiveRef.current) {
          clearLongPressTimeout();
        } else {
          // If long press already active, call movement handler
          onMove({
            deltaX,
            deltaY,
            absX,
            absY,
            currentPosition: currentPositionRef.current
          });
        }
      }
    }
  }, [onMove]);
  
  // Clean up on unmount
  useEffect(() => {
    return clearLongPressTimeout;
  }, []);
  
  // Return event handlers to attach to element
  return {
    onTouchStart: startLongPress,
    onTouchEnd: endLongPress,
    onTouchCancel: endLongPress,
    onTouchMove: handleMove,
    onMouseDown: startLongPress,
    onMouseUp: endLongPress,
    onMouseLeave: endLongPress
  };
};

/**
 * Hook for detecting multi-touch gestures like pinch and rotate
 * @param {Object} options - Configuration options
 * @returns {Object} Event handlers to attach to target element
 */
export const useMultiTouch = (options = {}) => {
  const {
    onPinch = () => {},
    onPinchEnd = () => {},
    onRotate = () => {},
    onRotateEnd = () => {},
    threshold = 10,
  } = options;
  
  // Store state with refs to avoid re-renders
  const touchesRef = useRef([]);
  const initialDistanceRef = useRef(null);
  const initialAngleRef = useRef(null);
  const isActiveRef = useRef(false);
  
  // Calculate distance between two points
  const getDistance = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Calculate angle between two points
  const getAngle = (p1, p2) => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  };
  
  // Calculate center between two points
  const getCenter = (p1, p2) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  };
  
  // Update touch points from event
  const updateTouches = (touches) => {
    touchesRef.current = Array.from(touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY
    }));
  };
  
  // Handle touch start
  const handleTouchStart = useCallback((event) => {
    if (event.touches.length >= 2) {
      updateTouches(event.touches);
      
      // Get the first two touches
      const [p1, p2] = touchesRef.current;
      
      // Store initial values
      initialDistanceRef.current = getDistance(p1, p2);
      initialAngleRef.current = getAngle(p1, p2);
      isActiveRef.current = true;
    }
  }, []);
  
  // Handle touch move
  const handleTouchMove = useCallback((event) => {
    if (!isActiveRef.current || event.touches.length < 2) return;
    
    updateTouches(event.touches);
    
    // Get the first two touches
    const [p1, p2] = touchesRef.current;
    
    // Calculate current values
    const currentDistance = getDistance(p1, p2);
    const currentAngle = getAngle(p1, p2);
    const center = getCenter(p1, p2);
    
    // Calculate scale change for pinch
    if (initialDistanceRef.current) {
      const scale = currentDistance / initialDistanceRef.current;
      
      // Only trigger if change exceeds threshold
      if (Math.abs(scale - 1) > threshold / 100) {
        onPinch({
          scale,
          center,
          touches: [p1, p2]
        });
      }
    }
    
    // Calculate angle change for rotation
    if (initialAngleRef.current !== null) {
      let angle = currentAngle - initialAngleRef.current;
      
      // Normalize angle to range [-π, π]
      if (angle > Math.PI) angle -= 2 * Math.PI;
      if (angle < -Math.PI) angle += 2 * Math.PI;
      
      // Only trigger if change exceeds threshold
      if (Math.abs(angle) > threshold / 100) {
        onRotate({
          angle,
          center,
          touches: [p1, p2]
        });
      }
    }
  }, [onPinch, onRotate, threshold]);
  
  // Handle touch end
  const handleTouchEnd = useCallback((event) => {
    if (isActiveRef.current && event.touches.length < 2) {
      onPinchEnd();
      onRotateEnd();
      isActiveRef.current = false;
      initialDistanceRef.current = null;
      initialAngleRef.current = null;
    }
  }, [onPinchEnd, onRotateEnd]);
  
  // Return event handlers to attach to element
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd
  };
};

/**
 * Hook for creating spring-based animations
 * @param {Object} props - Animation configuration
 * @returns {[Object, Object]} [Animated values, Animation API]
 */
export const useSpringAnimation = (props) => {
  const {
    from = {},
    to = {},
    config = { tension: 170, friction: 26 },
    immediate = false,
    onStart = () => {},
    onRest = () => {},
  } = props;
  
  // State to track current animated values
  const [values, setValues] = useState(from);
  
  // Store animation state in refs
  const isAnimatingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const velocitiesRef = useRef(Object.keys(from).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {}));
  const startTimeRef = useRef(null);
  
  // Run spring physics calculation
  const animateSpring = useCallback(() => {
    if (!isAnimatingRef.current) return;
    
    // Calculate elapsed time
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    
    // Create new values object
    const newValues = { ...values };
    let stillAnimating = false;
    
    // Update each animated value
    Object.keys(to).forEach(key => {
      // Get current value and target
      const currentValue = values[key];
      const targetValue = to[key];
      
      // Spring physics parameters
      const { tension, friction } = config;
      
      // Calculate spring force
      const distance = targetValue - currentValue;
      const springForce = tension * distance;
      const dampingForce = friction * velocitiesRef.current[key];
      const acceleration = springForce - dampingForce;
      
      // Update velocity
      velocitiesRef.current[key] += acceleration * 0.001; // Scale by time
      
      // Update value
      newValues[key] = currentValue + velocitiesRef.current[key];
      
      // Check if still animating
      if (Math.abs(distance) > 0.1 || Math.abs(velocitiesRef.current[key]) > 0.1) {
        stillAnimating = true;
      }
    });
    
    // Update state with new values
    setValues(newValues);
    
    // Continue animation or end
    if (stillAnimating) {
      animationFrameRef.current = requestAnimationFrame(animateSpring);
    } else {
      isAnimatingRef.current = false;
      setValues(to);
      onRest();
    }
  }, [values, to, config, onRest]);
  
  // Start animation
  const startAnimation = useCallback((animProps = {}) => {
    const mergedProps = {
      to: animProps.to || to,
      immediate: animProps.immediate || immediate,
    };
    
    // If immediate, just set the values
    if (mergedProps.immediate) {
      isAnimatingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setValues(mergedProps.to);
      onRest();
      return;
    }
    
    // Start animation
    isAnimatingRef.current = true;
    startTimeRef.current = performance.now();
    
    // Reset velocities
    Object.keys(velocitiesRef.current).forEach(key => {
      velocitiesRef.current[key] = 0;
    });
    
    // Call onStart callback
    onStart();
    
    // Start animation loop
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateSpring);
    }
  }, [to, immediate, onStart, animateSpring]);
  
  // Initialize animation
  useEffect(() => {
    startAnimation();
    
    // Clean up on unmount
    return () => {
      isAnimatingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startAnimation]);
  
  // API for controlling animation
  const api = {
    start: startAnimation,
    stop: () => {
      isAnimatingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    },
    reset: () => {
      api.stop();
      setValues(from);
    },
    immediately: (target) => {
      api.stop();
      setValues(target || to);
    },
    isAnimating: () => isAnimatingRef.current
  };
  
  return [values, api];
};

/**
 * Hook for creating ripple effect on touch
 * @param {Object} options - Ripple configuration
 * @returns {Object} Event handlers to attach to element
 */
export const useRippleEffect = (options = {}) => {
  const {
    color = 'rgba(0, 0, 0, 0.3)',
    duration = 700,
    size = 'auto'
  } = options;
  
  // Create ripple and track active ripples
  const ripplesRef = useRef([]);
  
  // Add ripple on touch
  const addRipple = useCallback((event) => {
    const element = event.currentTarget;
    
    // Get element dimensions
    const rect = element.getBoundingClientRect();
    
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    // Set max dimension based on element size
    const maxDimension = Math.max(rect.width, rect.height);
    const diameter = size === 'auto' ? maxDimension * 2 : size;
    
    // Position ripple where touched
    let x, y;
    if (event.touches && event.touches[0]) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }
    
    // Style the ripple
    ripple.style.width = `${diameter}px`;
    ripple.style.height = `${diameter}px`;
    ripple.style.left = `${x - diameter / 2}px`;
    ripple.style.top = `${y - diameter / 2}px`;
    ripple.style.backgroundColor = color;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'scale(0)';
    ripple.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    ripple.style.opacity = '1';
    
    // Add ripple to element
    element.appendChild(ripple);
    
    // Track ripple
    ripplesRef.current.push({
      element: ripple,
      timeoutId: null
    });
    
    // Trigger animation
    setTimeout(() => {
      ripple.style.transform = 'scale(1)';
    }, 0);
    
    return ripple;
  }, [color, duration, size]);
  
  // Remove ripple on touch end
  const removeRipple = useCallback((event) => {
    if (ripplesRef.current.length === 0) return;
    
    // Get the most recently added ripple
    const rippleObj = ripplesRef.current[ripplesRef.current.length - 1];
    const ripple = rippleObj.element;
    
    // Start fade out
    ripple.style.opacity = '0';
    
    // Remove after animation completes
    rippleObj.timeoutId = setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
      ripplesRef.current = ripplesRef.current.filter(r => r.element !== ripple);
    }, duration);
  }, [duration]);
  
  // Clean up any ripples on unmount
  useEffect(() => {
    return () => {
      ripplesRef.current.forEach(rippleObj => {
        if (rippleObj.timeoutId) {
          clearTimeout(rippleObj.timeoutId);
        }
        if (rippleObj.element.parentNode) {
          rippleObj.element.parentNode.removeChild(rippleObj.element);
        }
      });
    };
  }, []);
  
  // Return event handlers
  return {
    onTouchStart: addRipple,
    onTouchEnd: removeRipple,
    onTouchCancel: removeRipple,
    onMouseDown: addRipple,
    onMouseUp: removeRipple,
    onMouseLeave: removeRipple
  };
};

// Create context for haptic feedback
const TouchFeedbackContext = createContext({
  provideFeedback: () => {}
});

/**
 * Provider component for haptic feedback
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const TouchFeedbackProvider = ({ children }) => {
  // Check if vibration is enabled
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  
  // Check vibration settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const setting = localStorage.getItem('vibrationEnabled');
      setVibrationEnabled(setting !== 'false');
    }
  }, []);
  
  // Function to provide feedback
  const provideFeedback = useCallback((intensity = 'medium') => {
    if (typeof navigator === 'undefined' || !navigator.vibrate || !vibrationEnabled) {
      return;
    }
    
    // Map intensity to duration
    const durationMap = {
      light: 10,
      medium: 15,
      strong: 25
    };
    
    const duration = durationMap[intensity] || durationMap.medium;
    
    // Vibrate
    navigator.vibrate(duration);
  }, [vibrationEnabled]);
  
  // Listen for custom events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleCustomEvent = (event) => {
      const intensity = event.detail?.intensity || 'medium';
      provideFeedback(intensity);
    };
    
    // Listen for events that should trigger haptic feedback
    document.addEventListener('longpress', handleCustomEvent);
    document.addEventListener('gesturedetected', handleCustomEvent);
    
    return () => {
      document.removeEventListener('longpress', handleCustomEvent);
      document.removeEventListener('gesturedetected', handleCustomEvent);
    };
  }, [provideFeedback]);
  
  // Toggle vibration setting
  const toggleVibration = useCallback(() => {
    const newSetting = !vibrationEnabled;
    setVibrationEnabled(newSetting);
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('vibrationEnabled', newSetting.toString());
    }
  }, [vibrationEnabled]);
  
  return (
    <TouchFeedbackContext.Provider value={{ provideFeedback, vibrationEnabled, toggleVibration }}>
      {children}
    </TouchFeedbackContext.Provider>
  );
};

/**
 * Hook to use touch feedback
 * @returns {Object} Touch feedback functions
 */
export const useTouchFeedback = () => {
  return useContext(TouchFeedbackContext);
};
