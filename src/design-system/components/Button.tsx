/**
 * Material 3 Button Component
 * Comprehensive button implementation using Material 3 design tokens
 */

'use client';

import React from 'react';
import { Material3Colors } from '../tokens/colors';
import { Material3Typography } from '../tokens/typography';
import { Material3SpacingSystem } from '../tokens/spacing';
import { Material3ElevationSystem } from '../tokens/elevation';
import { RippleEffect } from './MicroInteractions';
import { MotionContainer } from './SharedMotion';

export interface Material3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
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
  
  // Interactive state management
  const [interactionState, setInteractionState] = React.useState({
    isHovered: false,
    isFocused: false,
    isPressed: false
  });
  
  // Event handlers for interactive states
  const handleMouseEnter = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isHovered: true }));
  }, []);
  
  const handleMouseLeave = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isHovered: false, isPressed: false }));
  }, []);
  
  const handleFocus = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isFocused: true }));
  }, []);
  
  const handleBlur = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isFocused: false }));
  }, []);
  
  const handleMouseDown = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isPressed: true }));
  }, []);
  
  const handleMouseUp = React.useCallback(() => {
    setInteractionState(prev => ({ ...prev, isPressed: false }));
  }, []);

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

  // Size configurations
  const sizeConfig = {
    small: {
      height: '2rem', // 32px
      paddingX: spacing.medium2, // 16px
      paddingY: spacing.small3, // 8px
      fontSize: typography.labelMedium.fontSize,
      fontWeight: typography.labelMedium.fontWeight,
      iconSize: '1rem'
    },
    medium: {
      height: '2.5rem', // 40px
      paddingX: spacing.medium4, // 24px
      paddingY: spacing.small4, // 10px
      fontSize: typography.labelLarge.fontSize,
      fontWeight: typography.labelLarge.fontWeight,
      iconSize: '1.25rem'
    },
    large: {
      height: '3.5rem', // 56px
      paddingX: spacing.large2, // 32px
      paddingY: spacing.medium2, // 16px
      fontSize: typography.titleMedium.fontSize,
      fontWeight: typography.titleMedium.fontWeight,
      iconSize: '1.5rem'
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

  // Dynamic styles
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
    minWidth: iconOnly ? currentSize.height : undefined,
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

  return (
    <MotionContainer
      preset="scaleIn"
      trigger={true}
      duration="short2"
    >
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled || loading}
        className={className}
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
            zIndex: 1
          }}
        >
          {/* Start icon or loading */}
          {loading ? (
            <div
              style={{
                width: currentSize.iconSize,
                height: currentSize.iconSize,
                border: '2px solid currentColor',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
          ) : startIcon && !iconOnly ? (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: currentSize.iconSize
              }}
            >
              {startIcon}
            </span>
          ) : null}
          
          {/* Icon only content */}
          {iconOnly && !loading ? (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: currentSize.iconSize
              }}
            >
              {startIcon || endIcon}
            </span>
          ) : null}
          
          {/* Text content */}
          {!iconOnly && !loading ? (
            <span style={{ whiteSpace: 'nowrap' }}>
              {children}
            </span>
          ) : null}
          
          {/* End icon */}
          {endIcon && !iconOnly && !loading ? (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: currentSize.iconSize
              }}
            >
              {endIcon}
            </span>
          ) : null}
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