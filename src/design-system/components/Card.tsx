/**
 * Material 3 Card Component
 * Comprehensive card implementation following Material 3 design principles
 */

'use client';

import React from 'react';
import { Material3Colors } from '../tokens/colors';
import { Material3Typography } from '../tokens/typography';
import { Material3SpacingSystem } from '../tokens/spacing';
import { Material3ElevationSystem } from '../tokens/elevation';
import { MotionContainer } from './SharedMotion';
import { RippleEffect } from './MicroInteractions';
import { createRippleEffect } from '../utils/mobile-touch';

export interface Material3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined';
  shape?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  elevation?: keyof typeof Material3ElevationSystem.levels;
  interactive?: boolean;
  disabled?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  header?: React.ReactNode;
  actions?: React.ReactNode;
  media?: React.ReactNode;
  children?: React.ReactNode;
}

const Material3Card = React.forwardRef<HTMLDivElement, Material3CardProps>(({
  variant = 'elevated',
  shape = 'lg',
  elevation,
  interactive = false,
  disabled = false,
  padding = 'medium',
  header,
  actions,
  media,
  children,
  className = '',
  onClick,
  ...props
}, ref) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
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
    if (interactive && !disabled) {
      setInteractionState(prev => ({ ...prev, isHovered: true }));
    }
  }, [interactive, disabled]);
  
  const handleMouseLeave = React.useCallback(() => {
    if (interactive && !disabled) {
      setInteractionState(prev => ({ ...prev, isHovered: false, isPressed: false }));
    }
  }, [interactive, disabled]);
  
  const handleFocus = React.useCallback(() => {
    if (interactive && !disabled) {
      setInteractionState(prev => ({ ...prev, isFocused: true }));
    }
  }, [interactive, disabled]);
  
  const handleBlur = React.useCallback(() => {
    if (interactive && !disabled) {
      setInteractionState(prev => ({ ...prev, isFocused: false }));
    }
  }, [interactive, disabled]);
  
  const handleMouseDown = React.useCallback(() => {
    if (interactive && !disabled) {
      setInteractionState(prev => ({ ...prev, isPressed: true }));
    }
  }, [interactive, disabled]);
  
  const handleMouseUp = React.useCallback(() => {
    if (interactive && !disabled) {
      setInteractionState(prev => ({ ...prev, isPressed: false }));
    }
  }, [interactive, disabled]);

  // Forward ref handling
  React.useImperativeHandle(ref, () => cardRef.current as HTMLDivElement);

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

  // Shape configurations
  const shapeConfig = {
    none: '0px',
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '0.75rem', // 12px
    lg: '1rem',    // 16px - Material 3 card standard
    xl: '1.5rem',  // 24px
    full: '50rem'  // Very large radius
  };

  // Padding configurations
  const paddingConfig = {
    none: '0',
    small: spacing.small4,  // 12px
    medium: spacing.medium2, // 16px
    large: spacing.medium4   // 24px
  };

  // Variant configurations
  const variantConfig = {
    elevated: {
      backgroundColor: colors.surfaceContainerLow,
      color: colors.onSurface,
      border: 'none',
      elevation: elevation ? Material3ElevationSystem.levels[elevation] : Material3ElevationSystem.components.card
    },
    filled: {
      backgroundColor: colors.surfaceContainerHighest,
      color: colors.onSurface,
      border: 'none',
      elevation: Material3ElevationSystem.levels.level0
    },
    outlined: {
      backgroundColor: colors.surface,
      color: colors.onSurface,
      border: `1px solid ${colors.outlineVariant}`,
      elevation: Material3ElevationSystem.levels.level0
    }
  };

  const currentVariant = variantConfig[variant];

  // Calculate state overlay for interactive cards
  const getStateOverlay = () => {
    if (!interactive || disabled) return 'transparent';
    if (interactionState.isPressed) return Material3Colors.utils.withStateOverlay(currentVariant.backgroundColor, colors.onSurface, 'pressed');
    if (interactionState.isFocused) return Material3Colors.utils.withStateOverlay(currentVariant.backgroundColor, colors.onSurface, 'focus');
    if (interactionState.isHovered) return Material3Colors.utils.withStateOverlay(currentVariant.backgroundColor, colors.onSurface, 'hover');
    return 'transparent';
  };

  // Handle click with ripple effect
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || disabled) return;

    // Create ripple effect
    if (cardRef.current) {
      createRippleEffect(cardRef.current, event.nativeEvent, {
        color: Material3Colors.utils.withAlpha(colors.onSurface, 0.2),
        duration: 600,
        bounded: true
      });
    }

    onClick?.(event);
  }, [interactive, disabled, onClick, colors.onSurface]);

  // Handle keyboard interaction
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const syntheticEvent = {
        ...event,
        nativeEvent: new MouseEvent('click', { bubbles: true })
      } as unknown as React.MouseEvent<HTMLDivElement>;
      handleClick(syntheticEvent);
    }
  }, [interactive, disabled, handleClick]);

  // Dynamic styles
  const cardStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    
    // Colors
    backgroundColor: currentVariant.backgroundColor,
    color: disabled ? Material3Colors.utils.withAlpha(currentVariant.color, 0.38) : currentVariant.color,
    border: currentVariant.border,
    
    // Shape
    borderRadius: shapeConfig[shape],
    
    // Elevation
    boxShadow: disabled ? 'none' : currentVariant.elevation.shadow,
    
    // Interactive states
    cursor: interactive && !disabled ? 'pointer' : 'default',
    userSelect: 'none',
    outline: 'none',
    
    // Transitions
    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
    
    // Disabled state
    opacity: disabled ? 0.38 : 1
  };

  // Focus ring styles
  const focusStyles = interactive && interactionState.isFocused ? {
    outline: `2px solid ${colors.primary}`,
    outlineOffset: '2px'
  } : {};

  // Content sections
  const renderHeader = () => {
    if (!header) return null;
    
    return (
      <div style={{ padding: paddingConfig[padding] }}>
        {typeof header === 'string' ? (
          <h3 style={{ 
            fontSize: typography.titleMedium.fontSize,
            fontWeight: typography.titleMedium.fontWeight,
            lineHeight: typography.titleMedium.lineHeight,
            margin: 0,
            color: colors.onSurface
          }}>
            {header}
          </h3>
        ) : (
          header
        )}
      </div>
    );
  };

  const renderMedia = () => {
    if (!media) return null;
    
    return (
      <div style={{ 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {media}
      </div>
    );
  };

  const renderContent = () => {
    if (!children) return null;
    
    return (
      <div style={{ 
        padding: paddingConfig[padding],
        flex: 1,
        fontSize: typography.bodyLarge.fontSize,
        fontWeight: typography.bodyLarge.fontWeight,
        lineHeight: typography.bodyLarge.lineHeight
      }}>
        {children}
      </div>
    );
  };

  const renderActions = () => {
    if (!actions) return null;
    
    return (
      <div style={{ 
        padding: paddingConfig[padding],
        paddingTop: spacing.small3,
        display: 'flex',
        gap: spacing.small3,
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>
        {actions}
      </div>
    );
  };

  const cardElement = (
    <div
      ref={cardRef}
      role={interactive ? 'button' : 'article'}
      tabIndex={interactive && !disabled ? 0 : undefined}
      className={className}
      onClick={handleClick}
      onKeyDown={interactive ? handleKeyDown : undefined}
      onFocus={interactive ? handleFocus : undefined}
      onBlur={interactive ? handleBlur : undefined}
      onMouseEnter={interactive ? handleMouseEnter : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
      onMouseDown={interactive ? handleMouseDown : undefined}
      onMouseUp={interactive ? handleMouseUp : undefined}
      style={{
        ...cardStyles,
        ...focusStyles
      }}
      aria-disabled={disabled}
      {...props}
    >
      {/* State overlay for interactive cards */}
      {interactive && (
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
            transition: 'background-color 200ms cubic-bezier(0.2, 0, 0, 1)',
            zIndex: 1
          }}
        />
      )}
      
      {/* Card content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {renderMedia()}
        {renderHeader()}
        {renderContent()}
        {renderActions()}
      </div>
    </div>
  );

  return (
    <MotionContainer
      preset="scaleIn"
      trigger={true}
      duration="short2"
    >
      {cardElement}
    </MotionContainer>
  );
});

Material3Card.displayName = 'Material3Card';

export default Material3Card;