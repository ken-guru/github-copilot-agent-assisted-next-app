"use client";

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { useMicroInteraction } from '@/hooks/useMotionSystem';
import { createTransition } from '@/utils/material3-motion-system';
import styles from './Material3Button.module.css';

/**
 * Material 3 Expressive Button Variants
 */
export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';

/**
 * Material 3 Expressive Button Sizes
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Material 3 Expressive Button Props
 */
export interface Material3ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /** Button variant following Material 3 Expressive patterns */
  variant?: ButtonVariant;
  
  /** Button size */
  size?: ButtonSize;
  
  /** Whether the button is in a loading state */
  loading?: boolean;
  
  /** Icon to display before the button text */
  startIcon?: React.ReactNode;
  
  /** Icon to display after the button text */
  endIcon?: React.ReactNode;
  
  /** Whether the button should take full width */
  fullWidth?: boolean;
  
  /** Custom color role override */
  colorRole?: 'primary' | 'secondary' | 'tertiary' | 'error';
  
  /** Whether to disable ripple effect */
  disableRipple?: boolean;
  
  /** Custom className for additional styling */
  className?: string;
  
  /** Children content */
  children?: React.ReactNode;
}

/**
 * Material 3 Expressive Button Component
 * 
 * Implements Material 3 Expressive button patterns with:
 * - Varied button shapes with elevated surfaces and expressive fills
 * - Hover effects with subtle scale, color, and elevation changes
 * - Ripple effects for click feedback following Material 3 patterns
 * - Different button variants (filled, outlined, text, elevated, tonal)
 * - Loading states with Material 3 Expressive progress indicators
 */
export const Material3Button = forwardRef<HTMLButtonElement, Material3ButtonProps>(({
  variant = 'filled',
  size = 'medium',
  loading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  colorRole = 'primary',
  disableRipple = false,
  className = '',
  children,
  disabled,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  // Use micro-interaction hook for button press feedback
  const { isActive: isPressActive, activate: activatePress, deactivate: deactivatePress } = useMicroInteraction('buttonPress');

  // Handle ripple effect
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disableRipple || disabled || loading) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  // Handle mouse events
  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      setIsPressed(true);
      activatePress();
      createRipple(event);
    }
    onMouseDown?.(event);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    deactivatePress();
    onMouseUp?.(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    deactivatePress();
    onMouseLeave?.(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      onClick?.(event);
    }
  };

  // Combine refs
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(buttonRef.current);
      } else {
        ref.current = buttonRef.current;
      }
    }
  }, [ref]);

  // Generate CSS classes
  const baseClasses = [
    styles['md-button'],
    styles[`md-button--${variant}`],
    styles[`md-button--${size}`],
    styles[`md-button--${colorRole}`],
    fullWidth && styles['md-button--full-width'],
    loading && styles['md-button--loading'],
    disabled && styles['md-button--disabled'],
    isPressed && styles['md-button--pressed'],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={buttonRef}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Ripple container */}
      {!disableRipple && (
        <span className={styles['md-button__ripple-container']}>
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className={styles['md-button__ripple']}
              style={{
                left: ripple.x,
                top: ripple.y,
              }}
            />
          ))}
        </span>
      )}

      {/* Button content */}
      <span className={styles['md-button__content']}>
        {/* Loading indicator */}
        {loading && (
          <span className={styles['md-button__loading-indicator']}>
            <svg
              className={styles['md-button__loading-spinner']}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
              />
            </svg>
          </span>
        )}

        {/* Start icon */}
        {startIcon && !loading && (
          <span className={styles['md-button__start-icon']}>
            {startIcon}
          </span>
        )}

        {/* Button text */}
        {children && (
          <span className={styles['md-button__text']}>
            {children}
          </span>
        )}

        {/* End icon */}
        {endIcon && !loading && (
          <span className={styles['md-button__end-icon']}>
            {endIcon}
          </span>
        )}
      </span>
    </button>
  );
});

Material3Button.displayName = 'Material3Button';

/**
 * Material 3 Expressive Icon Button Component
 * Specialized button for icon-only interactions
 */
export interface Material3IconButtonProps extends Omit<Material3ButtonProps, 'startIcon' | 'endIcon' | 'children'> {
  /** Icon to display */
  icon: React.ReactNode;
  
  /** Accessible label for screen readers */
  'aria-label': string;
}

export const Material3IconButton = forwardRef<HTMLButtonElement, Material3IconButtonProps>(({
  icon,
  variant = 'text',
  size = 'medium',
  className = '',
  ...props
}, ref) => {
  return (
    <Material3Button
      ref={ref}
      variant={variant}
      size={size}
      className={`${styles['md-icon-button']} ${className}`}
      {...props}
    >
      <span className={styles['md-icon-button__icon']}>
        {icon}
      </span>
    </Material3Button>
  );
});

Material3IconButton.displayName = 'Material3IconButton';

/**
 * Material 3 Expressive Floating Action Button Component
 * Specialized button for primary actions
 */
export interface Material3FABProps extends Omit<Material3ButtonProps, 'variant' | 'startIcon' | 'endIcon'> {
  /** FAB variant */
  variant?: 'small' | 'large' | 'extended';
  
  /** Icon to display */
  icon: React.ReactNode;
  
  /** Text label for extended FAB */
  label?: string;
}

export const Material3FAB = forwardRef<HTMLButtonElement, Material3FABProps>(({
  variant = 'large',
  icon,
  label,
  size = 'medium',
  className = '',
  ...props
}, ref) => {
  const isExtended = variant === 'extended' && label;

  return (
    <Material3Button
      ref={ref}
      variant="filled"
      size={size}
      className={`${styles['md-fab']} ${styles[`md-fab--${variant}`]} ${className}`}
      {...props}
    >
      <span className={styles['md-fab__icon']}>
        {icon}
      </span>
      {isExtended && label && (
        <span className={styles['md-fab__label']}>
          {label}
        </span>
      )}
    </Material3Button>
  );
});

Material3FAB.displayName = 'Material3FAB';