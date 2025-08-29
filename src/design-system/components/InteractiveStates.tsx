/**
 * Material 3 Interactive State Transitions
 * Hooks and utilities for smooth state changes in interactive components
 */

'use client';

import React from 'react';
import {
  Material3StateTransition,
  Material3Performance,
  Material3Duration,
  Material3Easing
} from '../utils/motion';

export interface InteractiveStateConfig {
  default: React.CSSProperties;
  hover?: React.CSSProperties;
  focus?: React.CSSProperties;
  active?: React.CSSProperties;
  disabled?: React.CSSProperties;
  loading?: React.CSSProperties;
}

export interface StateTransitionOptions {
  duration?: number;
  easing?: string;
  respectsReducedMotion?: boolean;
}

/**
 * Hook for managing interactive state transitions
 */
export function useInteractiveStates(
  states: InteractiveStateConfig,
  options: StateTransitionOptions = {}
) {
  const [currentState, setCurrentState] = React.useState<keyof InteractiveStateConfig>('default');
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const elementRef = React.useRef<HTMLElement>(null);
  const transitionRef = React.useRef<Material3StateTransition | null>(null);

  const transitionOptions = {
    duration: options.duration || Material3Duration.short2,
    easing: options.easing || Material3Easing.standard,
    respectsReducedMotion: options.respectsReducedMotion !== false
  };

  // Initialize state transition manager
  React.useEffect(() => {
    if (!elementRef.current) return;

    const transition = new Material3StateTransition(elementRef.current);
    
    // Define all states
    Object.entries(states).forEach(([stateName, styles]) => {
      // Convert React.CSSProperties to Record<string, string | number>
      const convertedStyles: Record<string, string | number> = {};
      Object.entries(styles).forEach(([prop, value]) => {
        if (value !== undefined && value !== null) {
          convertedStyles[prop] = value as string | number;
        }
      });
      
      transition.defineState(stateName, convertedStyles, {
        duration: transitionOptions.respectsReducedMotion 
          ? Material3Performance.getDuration(transitionOptions.duration)
          : transitionOptions.duration,
        easing: transitionOptions.respectsReducedMotion
          ? Material3Performance.getEasing(transitionOptions.easing)
          : transitionOptions.easing
      });
    });

    transitionRef.current = transition;

    return () => {
      transitionRef.current = null;
    };
  }, [states, transitionOptions]);

  const transitionTo = React.useCallback(async (stateName: keyof InteractiveStateConfig) => {
    if (!transitionRef.current || currentState === stateName || isTransitioning) {
      return;
    }

    setIsTransitioning(true);
    setCurrentState(stateName);
    
    try {
      await transitionRef.current.transitionTo(stateName as string);
    } catch (error) {
      console.warn('State transition failed:', error);
    } finally {
      setIsTransitioning(false);
    }
  }, [currentState, isTransitioning]);

  const resetToDefault = React.useCallback(() => {
    transitionTo('default');
  }, [transitionTo]);

  return {
    elementRef,
    currentState,
    isTransitioning,
    transitionTo,
    resetToDefault,
    // Convenience methods for common interactions
    onMouseEnter: () => transitionTo('hover'),
    onMouseLeave: () => transitionTo('default'),
    onFocus: () => transitionTo('focus'),
    onBlur: () => transitionTo('default'),
    onMouseDown: () => transitionTo('active'),
    onMouseUp: () => transitionTo('hover')
  };
}

/**
 * Hook for button-specific state transitions
 */
export function useButtonStates(
  variant: 'filled' | 'outlined' | 'text' = 'filled',
  options: StateTransitionOptions = {}
) {
  // Define Material 3 button states based on variant
  const getButtonStates = (): InteractiveStateConfig => {
    const baseStates = {
      default: {
        transform: 'scale(1)',
        boxShadow: 'none'
      },
      hover: {
        transform: 'scale(1.02)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      },
      focus: {
        transform: 'scale(1)',
        boxShadow: '0 0 0 2px rgba(103, 80, 164, 0.24)'
      },
      active: {
        transform: 'scale(0.98)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      },
      disabled: {
        transform: 'scale(1)',
        opacity: 0.38,
        boxShadow: 'none'
      }
    };

    // Customize based on variant
    switch (variant) {
      case 'filled':
        return {
          ...baseStates,
          hover: {
            ...baseStates.hover,
            filter: 'brightness(1.1)'
          }
        };
      case 'outlined':
        return {
          ...baseStates,
          hover: {
            ...baseStates.hover,
            backgroundColor: 'rgba(103, 80, 164, 0.08)'
          }
        };
      case 'text':
        return {
          ...baseStates,
          default: {
            transform: 'scale(1)',
            backgroundColor: 'transparent'
          },
          hover: {
            ...baseStates.hover,
            backgroundColor: 'rgba(103, 80, 164, 0.08)'
          }
        };
      default:
        return baseStates;
    }
  };

  return useInteractiveStates(getButtonStates(), options);
}

/**
 * Hook for input field state transitions
 */
export function useInputStates(options: StateTransitionOptions = {}) {
  const inputStates: InteractiveStateConfig = {
    default: {
      borderColor: 'rgb(121, 116, 126)',
      borderWidth: '1px',
      backgroundColor: 'transparent'
    },
    hover: {
      borderColor: 'rgb(103, 80, 164)',
      borderWidth: '1px',
      backgroundColor: 'rgba(103, 80, 164, 0.04)'
    },
    focus: {
      borderColor: 'rgb(103, 80, 164)',
      borderWidth: '2px',
      backgroundColor: 'transparent',
      boxShadow: '0 0 0 1px rgba(103, 80, 164, 0.24)'
    },
    active: {
      borderColor: 'rgb(103, 80, 164)',
      borderWidth: '2px',
      backgroundColor: 'transparent'
    },
    disabled: {
      borderColor: 'rgba(28, 27, 31, 0.12)',
      borderWidth: '1px',
      backgroundColor: 'rgba(28, 27, 31, 0.04)',
      opacity: 0.38
    }
  };

  return useInteractiveStates(inputStates, options);
}

/**
 * Hook for card hover effects
 */
export function useCardStates(
  elevated: boolean = false,
  options: StateTransitionOptions = {}
) {
  const cardStates: InteractiveStateConfig = {
    default: {
      transform: 'scale(1) translateY(0)',
      boxShadow: elevated 
        ? '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
        : '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    hover: {
      transform: 'scale(1.01) translateY(-2px)',
      boxShadow: elevated
        ? '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)'
        : '0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)'
    },
    active: {
      transform: 'scale(0.99) translateY(0)',
      boxShadow: elevated
        ? '0 2px 4px rgba(0, 0, 0, 0.12)'
        : '0 1px 2px rgba(0, 0, 0, 0.08)'
    }
  };

  return useInteractiveStates(cardStates, {
    duration: Material3Duration.medium1,
    ...options
  });
}

/**
 * Interactive wrapper component with built-in state transitions
 */
export const InteractiveElement: React.FC<{
  children: React.ReactNode;
  states: InteractiveStateConfig;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  as?: React.ElementType;
  stateOptions?: StateTransitionOptions;
}> = ({
  children,
  states,
  disabled = false,
  loading = false,
  className = '',
  style = {},
  onClick,
  as: Component = 'div',
  stateOptions = {}
}) => {
  const {
    elementRef,
    transitionTo,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onMouseDown,
    onMouseUp
  } = useInteractiveStates(states, stateOptions);

  // Handle disabled and loading states
  React.useEffect(() => {
    if (disabled) {
      transitionTo('disabled');
    } else if (loading) {
      transitionTo('loading');
    } else {
      transitionTo('default');
    }
  }, [disabled, loading, transitionTo]);

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return React.createElement(
    Component,
    {
      ref: elementRef,
      className,
      style: {
        cursor: disabled ? 'not-allowed' : loading ? 'wait' : 'pointer',
        userSelect: 'none',
        ...style
      },
      onMouseEnter: disabled || loading ? undefined : onMouseEnter,
      onMouseLeave: disabled || loading ? undefined : onMouseLeave,
      onFocus: disabled || loading ? undefined : onFocus,
      onBlur: disabled || loading ? undefined : onBlur,
      onMouseDown: disabled || loading ? undefined : onMouseDown,
      onMouseUp: disabled || loading ? undefined : onMouseUp,
      onClick: handleClick,
      tabIndex: disabled ? -1 : 0
    },
    children
  );
};

/**
 * Enhanced button component with Material 3 state transitions
 */
export const AnimatedButton: React.FC<{
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'text';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  variant = 'filled',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  style = {}
}) => {
  // Create button states based on variant
  const buttonStates: InteractiveStateConfig = React.useMemo(() => {
    const baseStates = {
      default: {
        transform: 'scale(1)',
        boxShadow: 'none'
      },
      hover: {
        transform: 'scale(1.02)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      },
      focus: {
        transform: 'scale(1)',
        boxShadow: '0 0 0 2px rgba(103, 80, 164, 0.24)'
      },
      active: {
        transform: 'scale(0.98)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      },
      disabled: {
        transform: 'scale(1)',
        opacity: 0.38,
        boxShadow: 'none'
      }
    };

    // Customize based on variant
    switch (variant) {
      case 'filled':
        return {
          ...baseStates,
          hover: {
            ...baseStates.hover,
            filter: 'brightness(1.1)'
          }
        };
      case 'outlined':
        return {
          ...baseStates,
          hover: {
            ...baseStates.hover,
            backgroundColor: 'rgba(103, 80, 164, 0.08)'
          }
        };
      case 'text':
        return {
          ...baseStates,
          default: {
            transform: 'scale(1)',
            backgroundColor: 'transparent'
          },
          hover: {
            ...baseStates.hover,
            backgroundColor: 'rgba(103, 80, 164, 0.08)'
          }
        };
      default:
        return baseStates;
    }
  }, [variant]);

  return (
    <InteractiveElement
      states={buttonStates}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${className}`}
      style={style}
      as="button"
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </InteractiveElement>
  );
};