/**
 * Material 3 Button Component
 * Comprehensive button implementation following Material 3 design principles
 */

'use client';

import React from 'react';
import type { Material3ElevationLevel, Material3ShapeSize } from '../types';
import { createRippleEffect, isTouchDevice } from '../utils/mobile-touch';

export interface Material3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  shape?: Material3ShapeSize;
  elevation?: Material3ElevationLevel;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Material3Button = React.forwardRef<HTMLButtonElement, Material3ButtonProps>(({
  variant = 'filled',
  size = 'medium',
  shape = 'full',
  elevation,
  loading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  onClick,
  ...props
}, ref) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  
  // Forward ref handling
  React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

  // Base classes
  const baseClasses = [
    // Layout and positioning
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'border',
    'outline-none',
    'cursor-pointer',
    'select-none',
    'transition-all',
    
    // Typography
    'm3-label-large',
    'font-medium',
    
    // Motion
    'm3-motion-button',
    'm3-duration-short4',
    'm3-motion-easing-standard',
    
    // Focus ring
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-primary',
  ];

  // Size-specific classes with mobile-optimized touch targets
  const sizeClasses = {
    small: [
      'h-8 sm:h-8',  // 32px minimum for mobile, same on desktop
      'px-3 sm:px-3',
      'text-sm',
      'min-w-16',
      'min-h-[40px] sm:min-h-[32px]', // 40px minimum touch target on mobile
    ],
    medium: [
      'h-10 sm:h-10', // 40px, good for both mobile and desktop
      'px-6 sm:px-6',
      'min-w-20',
      'min-h-[48px] sm:min-h-[40px]', // 48px minimum touch target on mobile
    ],
    large: [
      'h-12 sm:h-12', // 48px, good for both mobile and desktop
      'px-8 sm:px-8',
      'text-lg',
      'min-w-24',
      'min-h-[56px] sm:min-h-[48px]', // 56px minimum touch target on mobile
    ],
  };

  // Variant-specific classes
  const variantClasses = {
    filled: [
      'bg-primary',
      'text-on-primary',
      'border-primary',
      'hover:bg-primary/90',
      'hover:shadow-md',
      'active:bg-primary/80',
      'disabled:bg-on-surface/12',
      'disabled:text-on-surface/38',
      'disabled:border-on-surface/12',
    ],
    outlined: [
      'bg-transparent',
      'text-primary',
      'border-outline',
      'hover:bg-primary/8',
      'hover:border-primary',
      'active:bg-primary/12',
      'disabled:text-on-surface/38',
      'disabled:border-on-surface/12',
    ],
    text: [
      'bg-transparent',
      'text-primary',
      'border-transparent',
      'hover:bg-primary/8',
      'active:bg-primary/12',
      'disabled:text-on-surface/38',
    ],
    elevated: [
      'bg-surface-container-low',
      'text-primary',
      'border-transparent',
      'm3-elevation-1',
      'hover:m3-elevation-2',
      'hover:bg-surface-container-low/90',
      'active:m3-elevation-1',
      'disabled:bg-on-surface/12',
      'disabled:text-on-surface/38',
      'disabled:shadow-none',
    ],
    tonal: [
      'bg-secondary-container',
      'text-on-secondary-container',
      'border-secondary-container',
      'hover:bg-secondary-container/90',
      'hover:shadow-sm',
      'active:bg-secondary-container/80',
      'disabled:bg-on-surface/12',
      'disabled:text-on-surface/38',
      'disabled:border-on-surface/12',
    ],
  };

  // Shape classes
  const shapeClasses = {
    none: 'rounded-none',
    xs: 'm3-shape-xs',
    sm: 'm3-shape-sm', 
    md: 'm3-shape-md',
    lg: 'm3-shape-lg',
    xl: 'm3-shape-xl',
    full: 'm3-shape-full',
  };

  // Width classes
  const widthClasses = fullWidth ? ['w-full'] : [];

  // Disabled classes
  const disabledClasses = disabled ? [
    'cursor-not-allowed',
    'pointer-events-none',
  ] : [];

  // Loading classes
  const loadingClasses = loading ? [
    'cursor-wait',
    'pointer-events-none',
  ] : [];

  // Elevation classes (only for elevated variant or when explicitly set)
  const elevationClasses = elevation !== undefined ? [
    `m3-elevation-${elevation}`,
  ] : [];

  // Combine all classes
  const allClasses = [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
    ...shapeClasses[shape],
    ...widthClasses,
    ...disabledClasses,
    ...loadingClasses,
    ...elevationClasses,
    className,
  ].filter(Boolean).join(' ');

  // Handle click with loading state and mobile-optimized ripple
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }

    // Add Material 3 ripple effect with mobile optimization
    if (buttonRef.current) {
      const rippleColor = variant === 'filled' 
        ? 'rgba(var(--md-sys-color-on-primary), 0.12)'
        : variant === 'outlined' || variant === 'text'
        ? 'rgba(var(--md-sys-color-primary), 0.12)'
        : 'rgba(var(--md-sys-color-on-surface), 0.12)';

      createRippleEffect(buttonRef.current, event.nativeEvent, {
        color: rippleColor,
        duration: 600,
        bounded: true
      });
    }

    onClick?.(event);
  }, [loading, disabled, onClick, variant]);

  // Enhanced mobile touch handling
  const handleTouchStart = React.useCallback((_event: React.TouchEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;

    // Add touch feedback for mobile devices
    if (buttonRef.current && isTouchDevice()) {
      const button = buttonRef.current;
      button.style.transform = 'scale(0.98)';
      button.style.transition = 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  }, [loading, disabled]);

  const handleTouchEnd = React.useCallback((_event: React.TouchEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;

    // Reset touch feedback
    if (buttonRef.current && isTouchDevice()) {
      const button = buttonRef.current;
      setTimeout(() => {
        button.style.transform = '';
        button.style.transition = '';
      }, 100);
    }
  }, [loading, disabled]);

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled || loading}
      className={allClasses}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {/* Start icon or loading spinner */}
      {loading ? (
        <LoadingSpinner />
      ) : startIcon ? (
        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {startIcon}
        </span>
      ) : null}

      {/* Button text */}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>

      {/* End icon */}
      {endIcon && !loading && (
        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {endIcon}
        </span>
      )}
    </button>
  );
});

Material3Button.displayName = 'Material3Button';

export default Material3Button;