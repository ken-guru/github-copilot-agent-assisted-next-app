/**
 * Material 3 Animated Text Field Component
 * Implements Material 3 Expressive text field with animations and micro-interactions
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useFocusAnimation, useMicroInteractions } from '../../hooks/useAnimations';
import styles from './Material3AnimatedTextField.module.css';

export interface Material3AnimatedTextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  animateLabel?: boolean;
  animateValidation?: boolean;
  focusAnimation?: boolean;
}

export const Material3AnimatedTextField: React.FC<Material3AnimatedTextFieldProps> = ({
  label,
  helperText,
  errorText,
  successText,
  variant = 'outlined',
  size = 'medium',
  leadingIcon,
  trailingIcon,
  loading = false,
  success = false,
  error = false,
  animateLabel = true,
  animateValidation = true,
  focusAnimation = true,
  className,
  onFocus,
  onBlur,
  onChange,
  value,
  defaultValue,
  disabled,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));
  const { handleFocus, handleBlur } = useFocusAnimation(containerRef);
  const { triggerValidationError, triggerSuccess } = useMicroInteractions();

  const handleFocusWithAnimation = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    
    if (focusAnimation && !disabled) {
      handleFocus();
    }
    
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus, focusAnimation, disabled, handleFocus]);

  const handleBlurWithAnimation = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    if (focusAnimation && !disabled) {
      handleBlur();
    }
    
    if (onBlur) {
      onBlur(event);
    }
  }, [onBlur, focusAnimation, disabled, handleBlur]);

  const handleChangeWithAnimation = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setHasValue(Boolean(newValue));
    
    if (onChange) {
      onChange(event);
    }
  }, [onChange]);

  // Trigger validation animations when state changes
  useEffect(() => {
    if (containerRef.current && animateValidation) {
      if (error) {
        triggerValidationError(containerRef.current);
      } else if (success) {
        triggerSuccess(containerRef.current);
      }
    }
  }, [error, success, animateValidation, triggerValidationError, triggerSuccess]);

  // Update hasValue when value prop changes
  useEffect(() => {
    setHasValue(Boolean(value));
  }, [value]);

  const containerClasses = [
    styles.container,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    hasValue && styles.hasValue,
    loading && styles.loading,
    success && styles.success,
    error && styles.error,
    disabled && styles.disabled,
    focusAnimation && styles.focusAnimation,
    className,
  ].filter(Boolean).join(' ');

  const labelClasses = [
    styles.label,
    animateLabel && styles.animateLabel,
    (isFocused || hasValue) && styles.labelFloating,
  ].filter(Boolean).join(' ');

  const inputClasses = [
    styles.input,
    leadingIcon && styles.hasLeadingIcon,
    trailingIcon && styles.hasTrailingIcon,
  ].filter(Boolean).join(' ');

  const displayText = error ? errorText : success ? successText : helperText;

  return (
    <div ref={containerRef} className={containerClasses}>
      <div className={styles.inputContainer}>
        {leadingIcon && (
          <span className={styles.leadingIcon} aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            className={inputClasses}
            onFocus={handleFocusWithAnimation}
            onBlur={handleBlurWithAnimation}
            onChange={handleChangeWithAnimation}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled || loading}
            {...props}
          />
          
          {label && (
            <label className={labelClasses} htmlFor={props.id}>
              {label}
            </label>
          )}
          
          {variant === 'outlined' && (
            <fieldset className={styles.fieldset} aria-hidden="true">
              <legend className={styles.legend}>
                {(isFocused || hasValue) && label && (
                  <span>{label}</span>
                )}
              </legend>
            </fieldset>
          )}
        </div>
        
        {(trailingIcon || loading) && (
          <span className={styles.trailingIcon} aria-hidden="true">
            {loading ? (
              <span className={styles.loadingSpinner} />
            ) : (
              trailingIcon
            )}
          </span>
        )}
      </div>
      
      {displayText && (
        <div className={styles.helperText}>
          {displayText}
        </div>
      )}
    </div>
  );
};