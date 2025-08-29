/**
 * Material 3 Animated Button Component
 * Implements Material 3 Expressive button with animations and micro-interactions
 */

import React, { useRef, useCallback } from 'react';
import { useHoverAnimation, useFocusAnimation, useMicroInteractions } from '../../hooks/useAnimations';
import styles from './Material3AnimatedButton.module.css';

export interface Material3AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  rippleEffect?: boolean;
  hoverAnimation?: boolean;
  focusAnimation?: boolean;
  children: React.ReactNode;
}

export const Material3AnimatedButton: React.FC<Material3AnimatedButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  loading = false,
  success = false,
  error = false,
  icon,
  iconPosition = 'start',
  rippleEffect = true,
  hoverAnimation = true,
  focusAnimation = true,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  children,
  disabled,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { handleMouseEnter, handleMouseLeave } = useHoverAnimation(buttonRef);
  const { handleFocus, handleBlur } = useFocusAnimation(buttonRef);
  const { triggerClick, triggerSuccess, triggerValidationError } = useMicroInteractions();

  const handleClickWithAnimation = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current && rippleEffect && !disabled) {
      triggerClick(buttonRef.current);
    }
    
    if (onClick) {
      onClick(event);
    }
  }, [onClick, rippleEffect, disabled, triggerClick]);

  const handleMouseEnterWithAnimation = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (hoverAnimation && !disabled) {
      handleMouseEnter();
    }
    
    if (onMouseEnter) {
      onMouseEnter(event);
    }
  }, [onMouseEnter, hoverAnimation, disabled, handleMouseEnter]);

  const handleMouseLeaveWithAnimation = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (hoverAnimation && !disabled) {
      handleMouseLeave();
    }
    
    if (onMouseLeave) {
      onMouseLeave(event);
    }
  }, [onMouseLeave, hoverAnimation, disabled, handleMouseLeave]);

  const handleFocusWithAnimation = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    if (focusAnimation && !disabled) {
      handleFocus();
    }
    
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus, focusAnimation, disabled, handleFocus]);

  const handleBlurWithAnimation = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    if (focusAnimation && !disabled) {
      handleBlur();
    }
    
    if (onBlur) {
      onBlur(event);
    }
  }, [onBlur, focusAnimation, disabled, handleBlur]);

  // Trigger success or error animations when state changes
  React.useEffect(() => {
    if (buttonRef.current) {
      if (success) {
        triggerSuccess(buttonRef.current);
      } else if (error) {
        triggerValidationError(buttonRef.current);
      }
    }
  }, [success, error, triggerSuccess, triggerValidationError]);

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    success && styles.success,
    error && styles.error,
    disabled && styles.disabled,
    hoverAnimation && styles.hoverAnimation,
    focusAnimation && styles.focusAnimation,
    rippleEffect && styles.rippleEffect,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      onClick={handleClickWithAnimation}
      onMouseEnter={handleMouseEnterWithAnimation}
      onMouseLeave={handleMouseLeaveWithAnimation}
      onFocus={handleFocusWithAnimation}
      onBlur={handleBlurWithAnimation}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className={styles.loadingSpinner} aria-hidden="true" />
      )}
      
      {icon && iconPosition === 'start' && (
        <span className={styles.iconStart} aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span className={styles.content}>
        {children}
      </span>
      
      {icon && iconPosition === 'end' && (
        <span className={styles.iconEnd} aria-hidden="true">
          {icon}
        </span>
      )}
      
      {success && (
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
      )}
      
      {error && (
        <span className={styles.errorIcon} aria-hidden="true">
          ⚠
        </span>
      )}
    </button>
  );
};