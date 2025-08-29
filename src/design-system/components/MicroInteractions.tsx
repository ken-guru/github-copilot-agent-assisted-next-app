/**
 * Material 3 Micro-interactions and Feedback Animations
 * Loading states, success/error feedback, and subtle interaction animations
 */

'use client';

import React from 'react';
import {
  Material3Performance,
  Material3Duration,
  Material3Easing,
  Material3AnimationPresets
} from '../utils/motion';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';
export type LoadingType = 'spinner' | 'dots' | 'pulse' | 'progress';

/**
 * Hook for loading state management with animations
 */
export function useLoadingState(initialLoading: boolean = false) {
  const [isLoading, setIsLoading] = React.useState(initialLoading);
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const startLoading = React.useCallback((duration?: number) => {
    setIsLoading(true);
    setLoadingProgress(0);

    if (duration) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const next = prev + (100 / (duration / 100));
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, 100);

      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        clearInterval(interval);
      }, duration);
    }
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
    setLoadingProgress(100);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    loadingProgress,
    startLoading,
    stopLoading
  };
}

/**
 * Hook for feedback animations (success, error, etc.)
 */
export function useFeedback() {
  const [feedback, setFeedback] = React.useState<{
    type: FeedbackType;
    message: string;
    visible: boolean;
  } | null>(null);

  const showFeedback = React.useCallback((
    type: FeedbackType,
    message: string,
    duration: number = 3000
  ) => {
    setFeedback({ type, message, visible: true });

    setTimeout(() => {
      setFeedback(prev => prev ? { ...prev, visible: false } : null);
    }, duration);

    setTimeout(() => {
      setFeedback(null);
    }, duration + 300); // Account for exit animation
  }, []);

  const hideFeedback = React.useCallback(() => {
    setFeedback(prev => prev ? { ...prev, visible: false } : null);
    setTimeout(() => setFeedback(null), 300);
  }, []);

  return {
    feedback,
    showFeedback,
    hideFeedback
  };
}

/**
 * Spinner loading component
 */
export const LoadingSpinner: React.FC<{
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}> = ({ size = 'medium', color = 'currentColor', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div
      className={`animate-spin border-2 border-current border-t-transparent rounded-full ${sizeClasses[size]} ${className}`}
      style={{ 
        color,
        animationDuration: Material3Performance.respectsReducedMotion() ? '0s' : '1s'
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

/**
 * Dots loading component
 */
export const LoadingDots: React.FC<{
  count?: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}> = ({ count = 3, size = 'medium', color = 'currentColor', className = '' }) => {
  const sizeClasses = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  };

  const dots = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`bg-current rounded-full ${sizeClasses[size]}`}
      style={{
        color,
        animation: Material3Performance.respectsReducedMotion() 
          ? 'none' 
          : `pulse 1.4s ease-in-out ${i * 0.16}s infinite both`
      }}
    />
  ));

  return (
    <div className={`flex space-x-1 ${className}`} role="status" aria-label="Loading">
      {dots}
      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Progress bar component
 */
export const ProgressBar: React.FC<{
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  animated?: boolean;
}> = ({ 
  progress, 
  height = 4, 
  color = 'rgb(103, 80, 164)', 
  backgroundColor = 'rgba(0, 0, 0, 0.1)',
  className = '',
  animated = true
}) => {
  const progressRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (progressRef.current && animated) {
      const element = progressRef.current;
      element.style.transition = Material3Performance.respectsReducedMotion()
        ? 'none'
        : `width ${Material3Duration.medium2}ms ${Material3Easing.standard}`;
    }
  }, [animated]);

  return (
    <div
      className={`w-full rounded-full ${className}`}
      style={{ height, backgroundColor }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        ref={progressRef}
        className="h-full rounded-full transition-all duration-300 ease-out"
        style={{
          width: `${Math.min(Math.max(progress, 0), 100)}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
};

/**
 * Feedback toast component
 */
export const FeedbackToast: React.FC<{
  type: FeedbackType;
  message: string;
  visible: boolean;
  onClose?: () => void;
  duration?: number;
}> = ({ type, message, visible, onClose, duration = 3000 }) => {
  const toastRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = {
      success: {
        backgroundColor: 'rgb(46, 125, 50)',
        color: 'white',
        icon: '✓'
      },
      error: {
        backgroundColor: 'rgb(211, 47, 47)',
        color: 'white',
        icon: '✕'
      },
      warning: {
        backgroundColor: 'rgb(237, 108, 2)',
        color: 'white',
        icon: '⚠'
      },
      info: {
        backgroundColor: 'rgb(2, 136, 209)',
        color: 'white',
        icon: 'ℹ'
      }
    };

    return baseStyles[type];
  };

  const styles = getToastStyles();

  if (!visible) return null;

  return (
    <div
      ref={toastRef}
      className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm"
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        animation: Material3Performance.respectsReducedMotion()
          ? 'none'
          : `slideInRight ${Material3Duration.medium2}ms ${Material3Easing.decelerated} forwards`
      }}
      role="alert"
    >
      <span className="text-lg" aria-hidden="true">
        {styles.icon}
      </span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Ripple effect component for touch feedback
 */
export const RippleEffect: React.FC<{
  trigger: boolean;
  color?: string;
  duration?: number;
  onComplete?: () => void;
}> = ({ trigger, color = 'rgba(255, 255, 255, 0.3)', duration = Material3Duration.long1, onComplete }) => {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (trigger && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newRipple = {
        id: Date.now(),
        x: rect.width / 2,
        y: rect.height / 2
      };

      setRipples(prev => [...prev, newRipple]);

      const timer = setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, onComplete]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none"
    >
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            backgroundColor: color,
            animation: Material3Performance.respectsReducedMotion()
              ? 'none'
              : `ripple ${duration}ms ${Material3Easing.decelerated} forwards`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes ripple {
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Pulse animation component
 */
export const PulseAnimation: React.FC<{
  children: React.ReactNode;
  active: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}> = ({ children, active, intensity = 'medium', className = '' }) => {
  const intensityScale = {
    subtle: 1.02,
    medium: 1.05,
    strong: 1.1
  };

  const scale = intensityScale[intensity];

  return (
    <div
      className={className}
      style={{
        transform: active ? `scale(${scale})` : 'scale(1)',
        transition: Material3Performance.respectsReducedMotion()
          ? 'none'
          : `transform ${Material3Duration.short2}ms ${Material3Easing.standard}`
      }}
    >
      {children}
    </div>
  );
};

/**
 * Shake animation for error feedback
 */
export const ShakeAnimation: React.FC<{
  children: React.ReactNode;
  trigger: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}> = ({ children, trigger, intensity = 'medium', className = '' }) => {
  const [isShaking, setIsShaking] = React.useState(false);

  const intensityDistance = {
    subtle: 2,
    medium: 4,
    strong: 8
  };

  const distance = intensityDistance[intensity];

  React.useEffect(() => {
    if (trigger) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className={className}
      style={{
        animation: isShaking && !Material3Performance.respectsReducedMotion()
          ? `shake 0.6s ease-in-out`
          : 'none'
      }}
    >
      {children}
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-${distance}px); }
          20%, 40%, 60%, 80% { transform: translateX(${distance}px); }
        }
      `}</style>
    </div>
  );
};

/**
 * Combined feedback provider component
 */
export const FeedbackProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { feedback, showFeedback, hideFeedback } = useFeedback();

  // Provide feedback context to children
  const contextValue = React.useMemo(() => ({
    showSuccess: (message: string, duration?: number) => showFeedback('success', message, duration),
    showError: (message: string, duration?: number) => showFeedback('error', message, duration),
    showWarning: (message: string, duration?: number) => showFeedback('warning', message, duration),
    showInfo: (message: string, duration?: number) => showFeedback('info', message, duration),
    hideFeedback
  }), [showFeedback, hideFeedback]);

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
      {feedback && (
        <FeedbackToast
          type={feedback.type}
          message={feedback.message}
          visible={feedback.visible}
          onClose={hideFeedback}
        />
      )}
    </FeedbackContext.Provider>
  );
};

/**
 * Feedback context for easy access throughout the app
 */
const FeedbackContext = React.createContext<{
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  hideFeedback: () => void;
} | null>(null);

/**
 * Hook to access feedback context
 */
export function useFeedbackContext() {
  const context = React.useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedbackContext must be used within a FeedbackProvider');
  }
  return context;
}