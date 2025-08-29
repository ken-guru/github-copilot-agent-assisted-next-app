/**
 * Material 3 Button Component
 * Comprehensive button implementation using Material 3 design tokens with loading animations
 */

'use client';

import React from 'react';
import { Material3Colors } from '../tokens/colors';
import { Material3Typography } from '../tokens/typography';
import { Material3SpacingSystem } from '../tokens/spacing';
import { Material3ElevationSystem } from '../tokens/elevation';
import { RippleEffect } from './MicroInteractions';
import { MotionContainer } from './SharedMotion';
import { getTouchTargetSize, isTouchDevice } from '../utils/mobile-touch';
import { useLoadingAnimation } from '../hooks/useAnimations';

export interface Material3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  loadingType?: 'spinner' | 'pulse' | 'shimmer';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Material3Button = React.forwardRef<HTMLButtonElement, Material3ButtonProps>(({
  variant = 'filled',
  size = 'medium',
  loading = false,
  loadingType = 'spinner',
  startIcon,
  endIcon,
  iconOnly = false,
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  onClick,
  ...props
}, ref) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isDark, setIsDark] = React.useState(false);
  const [rippleTrigger, setRippleTrigger] = React.useState(false);
  
  // Loading animation hook
  const loadingAnimationRef = useLoadingAnimation(loadingType);
  const [stopLoading, setStopLoading] = React.useState<(() => void) | null>(null);
  
  // Interactive state management
  const [interactionState, setInteractionState] = React.useState({
    isHovered: false,
    isFocused: false,
    isPressed: false
  });

  // Handle loading state changes
  React.useEffect(() => {
    if (loading && loadingAnimationRef.ref.current) {
      const stop = loadingAnimationRef.startLoading();
      setStopLoading(() => stop);
    } else if (!loading && stopLoading) {
      stopLoading();
      setStopLoading(null);
    }
  }, [loading, loadingAnimationRef, stopLoading]);
  
  // Enhanced interaction handlers with animations
  const handleMouseEnter = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isHovered: true }));
    
    if (buttonRef.current && !loading && !disabled) {
      // Create hover animation
      const { createHoverAnimation } = require('../utils/animation-utils');
      const { onMouseEnter } = createHoverAnimation(buttonRef.current, {
        scale: 1.02,
        elevation: variant === 'text' ? 1 : 2
      });
      onMouseEnter();
    }
  }, [loading, disabled, variant]);
  
  const handleMouseLeave = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isHovered: false, isPressed: false }));
    
    if (buttonRef.current && !loading && !disabled) {
      // Create hover exit animation
      const { createHoverAnimation } = require('../utils/animation-utils');
      const { onMouseLeave } = createHoverAnimation(buttonRef.current, {
        scale: 1.02,
        elevation: variant === 'text' ? 1 : 2
      });
      onMouseLeave();
    }
  }, [loading, disabled, variant]);
  
  const handleFocus = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isFocused: true }));
    
    if (buttonRef.current && !loading && !disabled) {
      // Create focus animation
      const { createFocusAnimation } = require('../utils/animation-utils');
      const { onFocus } = createFocusAnimation(buttonRef.current);
      onFocus();
    }
  }, [loading, disabled]);
  
  const handleBlur = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isFocused: false }));
    
    if (buttonRef.current && !loading && !disabled) {
      // Create focus exit animation
      const { createFocusAnimation } = require('../utils/animation-utils');
      const { onBlur } = createFocusAnimation(buttonRef.current);
      onBlur();
    }
  }, [loading, disabled]);
  
  const handleMouseDown = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isPressed: true }));
    
    if (buttonRef.current && !loading && !disabled) {
      // Create press animation (scale down)
      buttonRef.current.style.transform = 'scale(0.98)';
      buttonRef.current.style.transition = 'transform 100ms cubic-bezier(0.3, 0.0, 0.8, 0.15)';
    }
  }, [loading, disabled]);
  
  const handleMouseUp = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isPressed: false }));
    
    if (buttonRef.current && !loading && !disabled) {
      // Create press release animation (scale back up)
      buttonRef.current.style.transform = 'scale(1)';
      buttonRef.current.style.transition = 'transform 150ms cubic-bezier(0.05, 0.7, 0.1, 1.0)';
    }
  }, [loading, disabled]);

  // Forward ref handling
  React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

  // Check for dark mode
  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Get design tokens
  const colors = isDark ? Material3Colors.dark : Material3Colors.light;
  const { base: spacing } = Material3SpacingSystem;
  const { scale: typography } = Material3Typography;

  // Check if device is touch-enabled for optimized sizing
  const isTouch = isTouchDevice();
  
  // Size configurations with Material 3 touch target compliance
  const sizeConfig = {
    small: {
      height: isTouch ? '3rem' : '2rem', // 48px on touch, 32px on desktop
      paddingX: spacing.medium2, // 16px
      paddingY: spacing.small3, // 8px
      fontSize: typography.labelMedium.fontSize,
      fontWeight: typography.labelMedium.fontWeight,
      iconSize: '1rem',
      ...getTouchTargetSize('small')
    },
    medium: {
      height: isTouch ? '3rem' : '2.5rem', // 48px on touch, 40px on desktop
      paddingX: spacing.medium4, // 24px
      paddingY: spacing.small4, // 10px
      fontSize: typography.labelLarge.fontSize,
      fontWeight: typography.labelLarge.fontWeight,
      iconSize: '1.25rem',
      ...getTouchTargetSize('medium')
    },
    large: {
      height: '3.5rem', // 56px (already exceeds 48px minimum)
      paddingX: spacing.large2, // 32px
      paddingY: spacing.medium2, // 16px
      fontSize: typography.titleMedium.fontSize,
      fontWeight: typography.titleMedium.fontWeight,
      iconSize: '1.5rem',
      ...getTouchTargetSize('large')
    }
  };

  // Variant configurations
  const variantConfig = {
    filled: {
      backgroundColor: colors.primary,
      color: colors.onPrimary,
      border: 'none',
      elevation: Material3ElevationSystem.components.button
    },
    elevated: {
      backgroundColor: colors.surfaceContainerLow,
      color: colors.primary,
      border: 'none',
      elevation: Material3ElevationSystem.components.button
    },
    tonal: {
      backgroundColor: colors.secondaryContainer,
      color: colors.onSecondaryContainer,
      border: 'none',
      elevation: Material3ElevationSystem.levels.level0
    },
    outlined: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: `1px solid ${colors.outline}`,
      elevation: Material3ElevationSystem.levels.level0
    },
    text: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: 'none',
      elevation: Material3ElevationSystem.levels.level0
    }
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  // Calculate state overlay
  const getStateOverlay = () => {
    if (disabled) return 'rgba(0, 0, 0, 0.12)';
    if (interactionState.isPressed) return Material3Colors.utils.withStateOverlay(currentVariant.backgroundColor, colors.onSurface, 'pressed');
    if (interactionState.isFocused) return Material3Colors.utils.withStateOverlay(currentVariant.backgroundColor, colors.onSurface, 'focus');
    if (interactionState.isHovered) return Material3Colors.utils.withStateOverlay(currentVariant.backgroundColor, colors.onSurface, 'hover');
    return 'transparent';
  };

  // Handle click with ripple effect
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }

    setRippleTrigger(true);
    setTimeout(() => setRippleTrigger(false), 100);
    onClick?.(event);
  }, [loading, disabled, onClick]);

  // Dynamic styles with touch target compliance
  const buttonStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.small3,
    height: currentSize.height,
    paddingLeft: iconOnly ? '0' : currentSize.paddingX,
    paddingRight: iconOnly ? '0' : currentSize.paddingX,
    paddingTop: currentSize.paddingY,
    paddingBottom: currentSize.paddingY,
    minWidth: iconOnly ? currentSize.height : isTouch ? currentSize.minWidth : undefined,
    minHeight: isTouch ? currentSize.minHeight : undefined,
    width: fullWidth ? '100%' : undefined,
    
    // Typography
    fontSize: currentSize.fontSize,
    fontWeight: currentSize.fontWeight,
    fontFamily: typography.labelLarge.fontFamily,
    lineHeight: typography.labelLarge.lineHeight,
    letterSpacing: typography.labelLarge.letterSpacing,
    textTransform: 'none',
    textDecoration: 'none',
    
    // Colors
    backgroundColor: currentVariant.backgroundColor,
    color: disabled ? Material3Colors.utils.withAlpha(currentVariant.color, 0.38) : currentVariant.color,
    border: currentVariant.border,
    
    // Shape
    borderRadius: '1.25rem', // Material 3 standard button radius
    
    // Elevation
    boxShadow: disabled ? 'none' : currentVariant.elevation.shadow,
    
    // States
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    outline: 'none',
    
    // Transitions
    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)'
  };

  // Focus ring styles
  const focusStyles = interactionState.isFocused ? {
    outline: `2px solid ${colors.primary}`,
    outlineOffset: '2px'
  } : {};

  // Combined ref for both button and loading animation
  const combinedRef = React.useCallback((node: HTMLButtonElement | null) => {
    buttonRef.current = node;
    loadingAnimationRef.ref.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref, loadingAnimationRef.ref]);

  return (
    <MotionContainer
      preset="scaleIn"
      trigger={true}
      duration="short2"
    >
      <button
        ref={combinedRef}
        type="button"
        disabled={disabled || loading}
        className={`material3-button ${loading ? 'loading' : ''} ${className}`}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          ...buttonStyles,
          ...focusStyles
        }}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {/* State overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: getStateOverlay(),
            borderRadius: 'inherit',
            pointerEvents: 'none',
            transition: 'background-color 200ms cubic-bezier(0.2, 0, 0, 1)'
          }}
        />
        
        {/* Ripple effect */}
        <RippleEffect
          trigger={rippleTrigger}
          color={Material3Colors.utils.withAlpha(colors.onSurface, 0.2)}
        />
        
        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.small3,
            zIndex: 1,
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 200ms cubic-bezier(0.2, 0, 0, 1)'
          }}
        >
          {/* Loading state content */}
          {loading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.small3
              }}
            >
              {loadingType === 'spinner' && (
                <div
                  className="loading-spinner"
                  style={{
                    width: currentSize.iconSize,
                    height: currentSize.iconSize,
                    border: '2px solid currentColor',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%'
                  }}
                />
              )}
              {!iconOnly && (
                <span style={{ whiteSpace: 'nowrap' }}>
                  {children}
                </span>
              )}
            </div>
          )}
          
          {/* Normal state content */}
          {!loading && (
            <>
              {/* Start icon */}
              {startIcon && !iconOnly && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: currentSize.iconSize
                  }}
                >
                  {startIcon}
                </span>
              )}
              
              {/* Icon only content */}
              {iconOnly ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: currentSize.iconSize
                  }}
                >
                  {startIcon || endIcon}
                </span>
              ) : (
                /* Text content */
                <span style={{ whiteSpace: 'nowrap' }}>
                  {children}
                </span>
              )}
              
              {/* End icon */}
              {endIcon && !iconOnly && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: currentSize.iconSize
                  }}
                >
                  {endIcon}
                </span>
              )}
            </>
          )}
        </div>
        
        {/* Spinner keyframes */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </button>
    </MotionContainer>
  );
});

Material3Button.displayName = 'Material3Button';

export default Material3Button;