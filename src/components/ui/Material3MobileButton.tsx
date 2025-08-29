/**
 * Material 3 Expressive Mobile-Optimized Button Component
 * 
 * A button component specifically optimized for mobile interactions
 * with touch feedback, appropriate sizing, and responsive behavior.
 */

import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { useMobileOptimizations, useTouchOptimizedHandlers } from '../../hooks/useMobileOptimizations';
import styles from './Material3MobileButton.module.css';

export interface Material3MobileButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Button variant */
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  
  /** Whether to show ripple effect on interaction */
  enableRipple?: boolean;
  
  /** Icon to display before text */
  startIcon?: React.ReactNode;
  
  /** Icon to display after text */
  endIcon?: React.ReactNode;
  
  /** Whether the button is in a loading state */
  loading?: boolean;
  
  /** Click handler */
  onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Children content */
  children?: React.ReactNode;
}

export const Material3MobileButton = forwardRef<HTMLButtonElement, Material3MobileButtonProps>(
  ({
    variant = 'filled',
    size = 'medium',
    enableRipple = true,
    startIcon,
    endIcon,
    loading = false,
    onClick,
    className = '',
    children,
    disabled,
    ...props
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { isMobile, isTouch, getTouchSize } = useMobileOptimizations();
    const { createTouchHandler } = useTouchOptimizedHandlers();
    
    useImperativeHandle(ref, () => buttonRef.current!);
    
    // Get touch-optimized size
    const touchSize = getTouchSize('button');
    
    // Create touch-optimized event handlers
    const touchHandlers = onClick ? createTouchHandler(onClick, { enableRipple }) : {};
    
    // Determine button classes
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      isMobile && styles.mobile,
      isTouch && styles.touch,
      loading && styles.loading,
      disabled && styles.disabled,
      className,
    ].filter(Boolean).join(' ');
    
    // Custom style for touch-optimized sizing
    const customStyle = isMobile ? {
      minHeight: `${touchSize}px`,
      minWidth: `${touchSize}px`,
    } : {};
    
    return (
      <button
        ref={buttonRef}
        className={buttonClasses}
        style={customStyle}
        disabled={disabled || loading}
        {...touchHandlers}
        {...props}
      >
        {enableRipple && <div className={styles.rippleContainer} />}
        
        {loading && (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner} />
          </div>
        )}
        
        <div className={styles.content}>
          {startIcon && (
            <span className={styles.startIcon}>
              {startIcon}
            </span>
          )}
          
          {children && (
            <span className={styles.text}>
              {children}
            </span>
          )}
          
          {endIcon && (
            <span className={styles.endIcon}>
              {endIcon}
            </span>
          )}
        </div>
      </button>
    );
  }
);

Material3MobileButton.displayName = 'Material3MobileButton';