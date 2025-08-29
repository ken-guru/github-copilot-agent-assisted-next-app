/**
 * Material 3 Expressive Mobile-Optimized Text Field Component
 * 
 * A text field component specifically optimized for mobile interactions
 * with appropriate sizing, touch feedback, and contextual keyboards.
 */

import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import { useMobileOptimizations } from '../../hooks/useMobileOptimizations';
import styles from './Material3MobileTextField.module.css';

export interface Material3MobileTextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field variant */
  variant?: 'filled' | 'outlined';
  
  /** Field size */
  size?: 'small' | 'medium' | 'large';
  
  /** Label text */
  label?: string;
  
  /** Helper text */
  helperText?: string;
  
  /** Error message */
  error?: string;
  
  /** Whether the field is in an error state */
  hasError?: boolean;
  
  /** Leading icon */
  startIcon?: React.ReactNode;
  
  /** Trailing icon */
  endIcon?: React.ReactNode;
  
  /** Input mode for mobile keyboards */
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search';
  
  /** Whether to enable touch-optimized interactions */
  touchOptimized?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

export const Material3MobileTextField = forwardRef<HTMLInputElement, Material3MobileTextFieldProps>(
  ({
    variant = 'outlined',
    size = 'medium',
    label,
    helperText,
    error,
    hasError = false,
    startIcon,
    endIcon,
    inputMode = 'text',
    touchOptimized = true,
    className = '',
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));
    const { isMobile, getTouchSize } = useMobileOptimizations();
    
    useImperativeHandle(ref, () => inputRef.current!);
    
    // Get touch-optimized size
    const touchSize = getTouchSize('input');
    
    // Handle focus events
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };
    
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(event.target.value));
      onBlur?.(event);
    };
    
    // Handle input changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(event.target.value));
      props.onChange?.(event);
    };
    
    // Determine container classes
    const containerClasses = [
      styles.container,
      styles[variant],
      styles[size],
      isMobile && touchOptimized && styles.mobile,
      isFocused && styles.focused,
      hasValue && styles.hasValue,
      (hasError || error) && styles.error,
      props.disabled && styles.disabled,
      className,
    ].filter(Boolean).join(' ');
    
    // Custom style for touch-optimized sizing
    const customStyle = isMobile && touchOptimized ? {
      minHeight: `${touchSize}px`,
    } : {};
    
    // Determine input type and attributes for mobile optimization
    const inputAttributes = {
      ...props,
      inputMode,
      // Prevent zoom on iOS for certain input types
      style: {
        fontSize: isMobile && touchOptimized ? '16px' : undefined,
        ...props.style,
      },
    };
    
    return (
      <div className={containerClasses} style={customStyle}>
        <div className={styles.inputContainer}>
          {startIcon && (
            <div className={styles.startIcon}>
              {startIcon}
            </div>
          )}
          
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              className={styles.input}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...inputAttributes}
            />
            
            {label && (
              <label className={styles.label}>
                {label}
              </label>
            )}
          </div>
          
          {endIcon && (
            <div className={styles.endIcon}>
              {endIcon}
            </div>
          )}
        </div>
        
        {(helperText || error) && (
          <div className={styles.supportingText}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Material3MobileTextField.displayName = 'Material3MobileTextField';