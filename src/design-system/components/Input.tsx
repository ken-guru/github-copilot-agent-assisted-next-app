/**
 * Material 3 Input Component
 * Comprehensive input implementation following Material 3 design principles with enhanced animations
 */

'use client';

import React from 'react';
import { isTouchDevice, getTouchTargetSize, addTouchHandlers, getResponsiveTextSize } from '../utils/mobile-touch';
import { useHoverAnimation, useFocusAnimation } from '../hooks/useAnimations';

export interface Material3InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  helperText?: string;
  errorText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
  error?: boolean;
  success?: boolean;
  // Mobile-specific props
  mobileOptimized?: boolean;
  keyboardType?: 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal';
  autocomplete?: string;
  touchFeedback?: boolean;
  // Animation props
  enhancedAnimations?: boolean;
}

const Material3Input = React.forwardRef<HTMLInputElement, Material3InputProps>(({
  variant = 'outlined',
  size = 'medium',
  label,
  helperText,
  errorText,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  error = false,
  success = false,
  disabled = false,
  id,
  mobileOptimized = true,
  keyboardType = 'text',
  autocomplete,
  touchFeedback = true,
  enhancedAnimations = true,
  ...props
}, ref) => {
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Animation hooks
  const hoverAnimationRef = useHoverAnimation({
    scale: 1.01,
    elevation: 1
  });
  const focusAnimationRef = useFocusAnimation();
  
  // Generate unique ID if not provided
  const inputId = React.useId();
  const finalInputId = id || inputId;
  const helperTextId = `${finalInputId}-helper`;
  const errorTextId = `${finalInputId}-error`;

  // Forward ref handling
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  // Mobile detection
  const isTouch = isTouchDevice();
  const shouldOptimizeForMobile = mobileOptimized && isTouch;

  // Virtual keyboard detection for iOS/Android
  React.useEffect(() => {
    if (!shouldOptimizeForMobile) return;

    const initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    setViewportHeight(initialViewportHeight);

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(currentHeight);
      
      // Auto-scroll input into view when virtual keyboard appears
      if (focused && currentHeight < initialViewportHeight * 0.75) {
        setTimeout(() => {
          inputRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 100);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => window.visualViewport?.removeEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
      return () => window.removeEventListener('resize', handleViewportChange);
    }
  }, [shouldOptimizeForMobile, focused]);

  // Check if input has value
  React.useEffect(() => {
    if (inputRef.current) {
      setHasValue(inputRef.current.value.length > 0);
    }
  }, [props.value, props.defaultValue]);

  // Add touch handlers for mobile optimization
  React.useEffect(() => {
    if (shouldOptimizeForMobile && touchFeedback && containerRef.current) {
      const cleanup = addTouchHandlers(containerRef.current, {
        onTouchStart: () => {
          // Subtle touch feedback for input focus
          if (containerRef.current) {
            containerRef.current.style.transform = 'scale(0.998)';
            containerRef.current.style.transition = 'transform 0.1s ease-out';
          }
        },
        onTouchEnd: () => {
          if (containerRef.current) {
            containerRef.current.style.transform = '';
          }
        }
      });
      return cleanup;
    }
  }, [shouldOptimizeForMobile, touchFeedback]);

  // Get mobile-optimized touch target size
  const touchTargetSize = shouldOptimizeForMobile ? getTouchTargetSize('medium') : null;

  // Size-specific classes with mobile optimization and responsive text
  const sizeClasses = {
    small: {
      container: shouldOptimizeForMobile ? 'min-h-[48px]' : 'h-12',
      input: shouldOptimizeForMobile ? `px-4 py-3 ${getResponsiveTextSize('base')}` : 'px-3 py-2 text-sm',
      label: getResponsiveTextSize('sm'),
      icon: 'w-4 h-4',
      iconContainer: shouldOptimizeForMobile ? 'w-12 min-h-[48px]' : 'w-8',
    },
    medium: {
      container: shouldOptimizeForMobile ? 'min-h-[52px]' : 'h-14',
      input: shouldOptimizeForMobile ? `px-4 py-4 ${getResponsiveTextSize('base')}` : 'px-4 py-3',
      label: getResponsiveTextSize('base'),
      icon: 'w-5 h-5',
      iconContainer: shouldOptimizeForMobile ? 'w-14 min-h-[52px]' : 'w-10',
    },
    large: {
      container: shouldOptimizeForMobile ? 'min-h-[56px]' : 'h-16',
      input: shouldOptimizeForMobile ? `px-4 py-5 ${getResponsiveTextSize('lg')}` : 'px-4 py-4 text-lg',
      label: getResponsiveTextSize('lg'),
      icon: 'w-6 h-6',
      iconContainer: shouldOptimizeForMobile ? 'w-16 min-h-[56px]' : 'w-12',
    },
  };

  // State-based classes
  const stateClasses = {
    normal: {
      border: 'border-outline',
      label: 'text-on-surface-variant',
      background: variant === 'filled' ? 'bg-surface-container-highest' : 'bg-surface',
    },
    focused: {
      border: 'border-primary border-2',
      label: 'text-primary',
      background: variant === 'filled' ? 'bg-surface-container-highest' : 'bg-surface',
    },
    error: {
      border: 'border-error border-2',
      label: 'text-error',
      background: variant === 'filled' ? 'bg-surface-container-highest' : 'bg-surface',
    },
    success: {
      border: 'border-success border-2',
      label: 'text-success',
      background: variant === 'filled' ? 'bg-surface-container-highest' : 'bg-surface',
    },
    disabled: {
      border: 'border-on-surface/12',
      label: 'text-on-surface/38',
      background: 'bg-on-surface/4',
    },
  };

  // Determine current state
  const currentState = disabled ? 'disabled' 
    : error ? 'error'
    : success ? 'success'
    : focused ? 'focused' 
    : 'normal';

  // Container classes
  const containerClasses = [
    'relative',
    'flex',
    'items-center',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'border',
    'rounded-lg',
    'm3-shape-sm',
    sizeClasses[size].container,
    stateClasses[currentState].border,
    stateClasses[currentState].background,
    fullWidth ? 'w-full' : 'w-auto',
    disabled ? 'cursor-not-allowed' : 'cursor-text',
  ].filter(Boolean).join(' ');

  // Input classes
  const inputClasses = [
    'flex-1',
    'bg-transparent',
    'outline-none',
    'border-none',
    'text-on-surface',
    'm3-body-large',
    'placeholder:text-on-surface-variant/60',
    'disabled:text-on-surface/38',
    'disabled:placeholder:text-on-surface/38',
    sizeClasses[size].input,
    leadingIcon ? 'pl-0' : '',
    trailingIcon ? 'pr-0' : '',
  ].filter(Boolean).join(' ');

  // Label classes
  const labelFloating = focused || hasValue || props.placeholder;
  const labelClasses = [
    'absolute',
    'left-4',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'pointer-events-none',
    'bg-inherit',
    'px-1',
    'm3-body-large',
    stateClasses[currentState].label,
    sizeClasses[size].label,
    labelFloating ? [
      '-top-2',
      'text-xs',
      'scale-90',
      'origin-left',
    ] : [
      'top-1/2',
      '-translate-y-1/2',
    ],
    leadingIcon && !labelFloating ? 'left-12' : '',
  ].flat().filter(Boolean).join(' ');

  // Icon classes
  const iconClasses = [
    'flex',
    'items-center',
    'justify-center',
    'text-on-surface-variant',
    sizeClasses[size].iconContainer,
    sizeClasses[size].icon,
    disabled ? 'text-on-surface/38' : '',
  ].filter(Boolean).join(' ');

  // Handle focus events
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    props.onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    setHasValue(event.target.value.length > 0);
    props.onBlur?.(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(event.target.value.length > 0);
    props.onChange?.(event);
  };

  // Handle container click to focus input
  const handleContainerClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Map keyboard types to input attributes
  const getInputAttributes = () => {
    const baseAttributes: React.InputHTMLAttributes<HTMLInputElement> = {
      ...props
    };

    if (shouldOptimizeForMobile) {
      switch (keyboardType) {
        case 'email':
          baseAttributes.type = 'email';
          baseAttributes.inputMode = 'email';
          baseAttributes.autoCapitalize = 'none';
          baseAttributes.autoCorrect = 'off';
          baseAttributes.spellCheck = false;
          break;
        case 'tel':
          baseAttributes.type = 'tel';
          baseAttributes.inputMode = 'tel';
          baseAttributes.autoComplete = 'tel';
          break;
        case 'url':
          baseAttributes.type = 'url';
          baseAttributes.inputMode = 'url';
          baseAttributes.autoCapitalize = 'none';
          baseAttributes.autoCorrect = 'off';
          baseAttributes.spellCheck = false;
          break;
        case 'numeric':
          baseAttributes.type = 'text';
          baseAttributes.inputMode = 'numeric';
          baseAttributes.pattern = '[0-9]*';
          break;
        case 'decimal':
          baseAttributes.type = 'text';
          baseAttributes.inputMode = 'decimal';
          baseAttributes.pattern = '[0-9]*';
          break;
        default:
          baseAttributes.type = props.type || 'text';
          baseAttributes.inputMode = 'text';
          break;
      }

      // Add autocomplete if provided
      if (autocomplete) {
        baseAttributes.autoComplete = autocomplete;
      }

      // Improve mobile input experience
      baseAttributes.autoCorrect = baseAttributes.autoCorrect ?? 'on';
      baseAttributes.spellCheck = baseAttributes.spellCheck ?? true;
    }

    return baseAttributes;
  };

  return (
    <div className={fullWidth ? 'w-full' : 'w-auto'}>
      {/* Input Container */}
      <div 
        ref={containerRef}
        className={containerClasses}
        onClick={handleContainerClick}
        style={touchTargetSize ? { minHeight: touchTargetSize.minHeight } : undefined}
      >
        {/* Leading Icon */}
        {leadingIcon && (
          <div className={iconClasses}>
            {leadingIcon}
          </div>
        )}

        {/* Input Field */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            id={finalInputId}
            className={inputClasses}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-describedby={
              errorText ? errorTextId 
              : helperText ? helperTextId 
              : undefined
            }
            aria-invalid={error}
            {...getInputAttributes()}
          />
          
          {/* Floating Label */}
          {label && (
            <label
              htmlFor={finalInputId}
              className={labelClasses}
            >
              {label}
            </label>
          )}
        </div>

        {/* Trailing Icon */}
        {trailingIcon && (
          <div className={iconClasses}>
            {trailingIcon}
          </div>
        )}
      </div>

      {/* Helper/Error Text */}
      {(helperText || errorText) && (
        <div className="mt-1 px-4">
          {errorText ? (
            <p 
              id={errorTextId}
              className="text-xs text-error m3-body-small"
            >
              {errorText}
            </p>
          ) : helperText ? (
            <p 
              id={helperTextId}
              className="text-xs text-on-surface-variant m3-body-small"
            >
              {helperText}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
});

Material3Input.displayName = 'Material3Input';

export default Material3Input;