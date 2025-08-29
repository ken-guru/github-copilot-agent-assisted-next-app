/**
 * Material 3 TextArea Component
 * Mobile-optimized textarea implementation following Material 3 design principles
 */

'use client';

import React from 'react';
import { isTouchDevice, getTouchTargetSize, addTouchHandlers } from '../utils/mobile-touch';

export interface Material3TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  helperText?: string;
  errorText?: string;
  fullWidth?: boolean;
  error?: boolean;
  success?: boolean;
  resizable?: boolean;
  minRows?: number;
  maxRows?: number;
  // Mobile-specific props
  mobileOptimized?: boolean;
  touchFeedback?: boolean;
  autoResize?: boolean;
}

const Material3TextArea = React.forwardRef<HTMLTextAreaElement, Material3TextAreaProps>(({
  variant = 'outlined',
  size = 'medium',
  label,
  helperText,
  errorText,
  fullWidth = false,
  error = false,
  success = false,
  disabled = false,
  resizable = true,
  minRows = 3,
  maxRows = 8,
  id,
  mobileOptimized = true,
  touchFeedback = true,
  autoResize = true,
  ...props
}, ref) => {
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Generate unique ID if not provided
  const textareaId = React.useId();
  const finalTextareaId = id || textareaId;
  const helperTextId = `${finalTextareaId}-helper`;
  const errorTextId = `${finalTextareaId}-error`;

  // Forward ref handling
  React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  // Mobile detection
  const isTouch = isTouchDevice();
  const shouldOptimizeForMobile = mobileOptimized && isTouch;

  // Check if textarea has value
  React.useEffect(() => {
    if (textareaRef.current) {
      setHasValue(textareaRef.current.value.length > 0);
    }
  }, [props.value, props.defaultValue]);

  // Add touch handlers for mobile optimization
  React.useEffect(() => {
    if (shouldOptimizeForMobile && touchFeedback && containerRef.current) {
      const cleanup = addTouchHandlers(containerRef.current, {
        onTouchStart: () => {
          // Subtle touch feedback for textarea focus
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

  // Auto-resize functionality
  const handleAutoResize = React.useCallback(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset height to get accurate scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height based on content
      const computed = window.getComputedStyle(textarea);
      const lineHeight = parseInt(computed.lineHeight) || 20;
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;
      
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [autoResize, minRows, maxRows]);

  // Auto-resize on content change
  React.useEffect(() => {
    handleAutoResize();
  }, [props.value, handleAutoResize]);

  // Get mobile-optimized touch target size
  const touchTargetSize = shouldOptimizeForMobile ? getTouchTargetSize(size) : null;

  // Size-specific classes with mobile optimization
  const sizeClasses = {
    small: {
      container: shouldOptimizeForMobile ? 'min-h-[80px]' : 'min-h-[72px]',
      textarea: shouldOptimizeForMobile ? 'px-4 py-3 text-base leading-6' : 'px-3 py-2 text-sm leading-5',
      label: 'text-sm',
    },
    medium: {
      container: shouldOptimizeForMobile ? 'min-h-[96px]' : 'min-h-[88px]',
      textarea: shouldOptimizeForMobile ? 'px-4 py-4 text-base leading-6' : 'px-4 py-3 leading-6',
      label: '',
    },
    large: {
      container: shouldOptimizeForMobile ? 'min-h-[112px]' : 'min-h-[104px]',
      textarea: shouldOptimizeForMobile ? 'px-4 py-5 text-lg leading-7' : 'px-4 py-4 text-lg leading-7',
      label: 'text-lg',
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

  // TextArea classes
  const textareaClasses = [
    'w-full',
    'bg-transparent',
    'outline-none',
    'border-none',
    'text-on-surface',
    'm3-body-large',
    'placeholder:text-on-surface-variant/60',
    'disabled:text-on-surface/38',
    'disabled:placeholder:text-on-surface/38',
    sizeClasses[size].textarea,
    resizable ? 'resize-y' : 'resize-none',
    autoResize ? 'overflow-hidden' : 'overflow-auto',
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
      'top-4',
    ],
  ].flat().filter(Boolean).join(' ');

  // Handle focus events
  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    props.onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    setHasValue(event.target.value.length > 0);
    props.onBlur?.(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(event.target.value.length > 0);
    handleAutoResize();
    props.onChange?.(event);
  };

  // Handle container click to focus textarea
  const handleContainerClick = () => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Get mobile-optimized attributes
  const getTextAreaAttributes = () => {
    const baseAttributes: React.TextareaHTMLAttributes<HTMLTextAreaElement> = {
      ...props
    };

    if (shouldOptimizeForMobile) {
      // Improve mobile textarea experience
      baseAttributes.autoCorrect = baseAttributes.autoCorrect ?? 'on';
      baseAttributes.spellCheck = baseAttributes.spellCheck ?? true;
      baseAttributes.autoCapitalize = baseAttributes.autoCapitalize ?? 'sentences';
      
      // Set initial rows based on size and minRows
      if (!baseAttributes.rows) {
        baseAttributes.rows = minRows;
      }
    }

    return baseAttributes;
  };

  return (
    <div className={fullWidth ? 'w-full' : 'w-auto'}>
      {/* TextArea Container */}
      <div 
        ref={containerRef}
        className={containerClasses}
        onClick={handleContainerClick}
        style={touchTargetSize ? { minHeight: touchTargetSize.minHeight } : undefined}
      >
        {/* TextArea Field */}
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            id={finalTextareaId}
            className={textareaClasses}
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
            {...getTextAreaAttributes()}
          />
          
          {/* Floating Label */}
          {label && (
            <label
              htmlFor={finalTextareaId}
              className={labelClasses}
            >
              {label}
            </label>
          )}
        </div>
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

Material3TextArea.displayName = 'Material3TextArea';

export default Material3TextArea;