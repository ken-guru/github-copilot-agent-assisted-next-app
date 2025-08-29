import React, { useState, useRef, useEffect, forwardRef } from 'react';
import styles from './Material3TextField.module.css';

export interface Material3TextFieldProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'time' | 'tel' | 'url';
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  maxLength?: number;
  pattern?: string;
  'data-testid'?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const Material3TextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  Material3TextFieldProps
>(({
  id,
  label,
  placeholder,
  value,
  defaultValue,
  type = 'text',
  variant = 'outlined',
  size = 'medium',
  disabled = false,
  required = false,
  error = false,
  helperText,
  startIcon,
  endIcon,
  multiline = false,
  rows,
  maxRows,
  autoComplete,
  autoFocus = false,
  readOnly = false,
  min,
  max,
  step,
  maxLength,
  pattern,
  'data-testid': dataTestId,
  className,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // Generate unique ID if not provided
  const fieldId = id || `material3-textfield-${Math.random().toString(36).substr(2, 9)}`;
  const labelId = label ? `${fieldId}-label` : undefined;
  const helperTextId = helperText ? `${fieldId}-helper-text` : undefined;

  // Combine refs
  const combinedRef = (element: HTMLInputElement | HTMLTextAreaElement | null) => {
    if (inputRef) {
      inputRef.current = element;
    }
    if (ref) {
      if (typeof ref === 'function') {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  };

  // Check if field has value
  useEffect(() => {
    const currentValue = value !== undefined ? value : defaultValue || '';
    setHasValue(currentValue.toString().length > 0);
  }, [value, defaultValue]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHasValue(event.target.value.length > 0);
    onChange?.(event);
  };

  const containerClasses = [
    styles.textField,
    styles[variant],
    styles[size],
    focused && styles.focused,
    hasValue && styles.hasValue,
    disabled && styles.disabled,
    error && styles.error,
    readOnly && styles.readOnly,
    startIcon && styles.hasStartIcon,
    endIcon && styles.hasEndIcon,
    className
  ].filter(Boolean).join(' ');

  const inputProps = {
    id: fieldId,
    type: multiline ? undefined : type,
    value,
    defaultValue,
    placeholder: focused || hasValue ? placeholder : undefined,
    disabled,
    required,
    readOnly,
    autoComplete,
    autoFocus,
    min,
    max,
    step,
    maxLength,
    pattern,
    'data-testid': dataTestId,
    'aria-labelledby': label ? labelId : undefined,
    'aria-describedby': helperText ? helperTextId : undefined,
    'aria-invalid': error,
    'aria-label': !label ? placeholder : undefined,
    className: styles.input,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown,
    onKeyUp,
    ref: combinedRef,
  };

  const textareaProps = multiline ? {
    rows,
    ...(maxRows && { style: { maxHeight: `${maxRows * 1.5}em` } })
  } : {};

  const InputElement = multiline ? 'textarea' : 'input';

  return (
    <div className={containerClasses}>
      <div className={styles.inputContainer}>
        {startIcon && (
          <div className={styles.startIcon} aria-hidden="true">
            {startIcon}
          </div>
        )}
        
        <div className={styles.inputWrapper}>
          <InputElement
            {...inputProps}
            {...textareaProps}
          />
          
          {label && (
            <label
              id={labelId}
              htmlFor={fieldId}
              className={styles.label}
            >
              {label}
              {required && <span className={styles.required} aria-label="required">*</span>}
            </label>
          )}
          
          <div className={styles.outline} aria-hidden="true">
            <div className={styles.outlineStart}></div>
            {label && <div className={styles.outlineNotch}></div>}
            <div className={styles.outlineEnd}></div>
          </div>
        </div>
        
        {endIcon && (
          <div className={styles.endIcon} aria-hidden="true">
            {endIcon}
          </div>
        )}
      </div>
      
      {helperText && (
        <div
          id={helperTextId}
          className={styles.helperText}
          role={error ? 'alert' : undefined}
        >
          {helperText}
        </div>
      )}
    </div>
  );
});

Material3TextField.displayName = 'Material3TextField';

export default Material3TextField;