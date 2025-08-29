/**
 * Material 3 Input Component
 * Comprehensive input implementation following Material 3 design principles
 */

'use client';

import React from 'react';

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
  className = '',
  id,
  ...props
}, ref) => {
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Generate unique ID if not provided
  const inputId = id || React.useId();
  const helperTextId = `${inputId}-helper`;
  const errorTextId = `${inputId}-error`;

  // Forward ref handling
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  // Check if input has value
  React.useEffect(() => {
    if (inputRef.current) {
      setHasValue(inputRef.current.value.length > 0);
    }
  }, [props.value, props.defaultValue]);

  // Size-specific classes
  const sizeClasses = {
    small: {
      container: 'h-12',
      input: 'px-3 py-2 text-sm',
      label: 'text-sm',
      icon: 'w-4 h-4',
      iconContainer: 'w-8',
    },
    medium: {
      container: 'h-14',
      input: 'px-4 py-3',
      label: '',
      icon: 'w-5 h-5',
      iconContainer: 'w-10',
    },
    large: {
      container: 'h-16',
      input: 'px-4 py-4 text-lg',
      label: 'text-lg',
      icon: 'w-6 h-6',
      iconContainer: 'w-12',
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

  return (
    <div className={fullWidth ? 'w-full' : 'w-auto'}>
      {/* Input Container */}
      <div 
        className={containerClasses}
        onClick={handleContainerClick}
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
            id={inputId}
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
            {...props}
          />
          
          {/* Floating Label */}
          {label && (
            <label
              htmlFor={inputId}
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