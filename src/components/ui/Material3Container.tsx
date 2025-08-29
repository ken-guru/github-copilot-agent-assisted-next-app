import React, { forwardRef, HTMLAttributes } from 'react';
import { getMaterial3ComponentStyle } from '@/utils/material3-utils';
import { useMotionSystem } from '@/hooks/useMotionSystem';
import styles from './Material3Container.module.css';

export interface Material3ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Container variant affecting elevation and styling */
  variant?: 'elevated' | 'filled' | 'outlined' | 'surface';
  /** Elevation level for the container */
  elevation?: 'level0' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
  /** Shape variation for organic corner radius */
  shape?: 'none' | 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | 'asymmetricSmall' | 'asymmetricMedium' | 'asymmetricLarge' | 'cardElevated' | 'cardFilled' | 'summaryCard' | 'activityCard' | 'timerContainer';
  /** Color role for contextual theming */
  colorRole?: 'surface' | 'surfaceContainer' | 'surfaceContainerLow' | 'surfaceContainerHigh' | 'surfaceContainerHighest' | 'primary' | 'secondary' | 'tertiary';
  /** Enable hover elevation transitions */
  interactive?: boolean;
  /** Enable focus management for accessibility */
  focusable?: boolean;
  /** Responsive behavior */
  responsive?: boolean;
  /** Custom content state for dynamic elevation */
  contentState?: 'default' | 'active' | 'loading' | 'error' | 'success';
  /** Enable organic motion transitions */
  enableMotion?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

export const Material3Container = forwardRef<HTMLDivElement, Material3ContainerProps>(
  ({
    variant = 'elevated',
    elevation = 'level1',
    shape = 'medium',
    colorRole = 'surfaceContainer',
    interactive = false,
    focusable = false,
    responsive = true,
    contentState = 'default',
    enableMotion = true,
    className = '',
    children,
    ...props
  }, ref) => {
    const motionSystem = useMotionSystem();

    // Determine elevation based on variant and content state
    const getElevation = () => {
      if (contentState === 'active') {
        return elevation === 'level0' ? 'level1' : elevation === 'level1' ? 'level2' : 'level3';
      }
      if (contentState === 'loading') {
        return 'level0';
      }
      return elevation;
    };

    // Get shape token based on variant and shape prop
    const getShapeToken = () => {
      if (shape === 'cardElevated') return 'cornerCardElevated';
      if (shape === 'cardFilled') return 'cornerCardFilled';
      if (shape === 'summaryCard') return 'cornerSummaryCard';
      if (shape === 'activityCard') return 'cornerActivityCard';
      if (shape === 'timerContainer') return 'cornerTimerContainer';
      if (shape === 'asymmetricSmall') return 'cornerAsymmetricSmall';
      if (shape === 'asymmetricMedium') return 'cornerAsymmetricMedium';
      if (shape === 'asymmetricLarge') return 'cornerAsymmetricLarge';
      
      // Map standard shapes to corner tokens
      const shapeMap = {
        none: 'cornerNone',
        extraSmall: 'cornerExtraSmall',
        small: 'cornerSmall',
        medium: 'cornerMedium',
        large: 'cornerLarge',
        extraLarge: 'cornerExtraLarge'
      } as const;
      
      return shapeMap[shape] || 'cornerMedium';
    };

    // Get background color based on variant and color role
    const getBackgroundColor = () => {
      if (variant === 'filled') {
        return colorRole === 'primary' ? 'primaryContainer' : 
               colorRole === 'secondary' ? 'secondaryContainer' :
               colorRole === 'tertiary' ? 'tertiaryContainer' : 'surfaceContainer';
      }
      if (variant === 'outlined') {
        return 'surface';
      }
      // elevated and surface variants
      return colorRole === 'surfaceContainer' ? 'surfaceContainer' :
             colorRole === 'surfaceContainerLow' ? 'surfaceContainerLow' :
             colorRole === 'surfaceContainerHigh' ? 'surfaceContainerHigh' :
             colorRole === 'surfaceContainerHighest' ? 'surfaceContainerHighest' :
             'surface';
    };

    // Get text color based on background
    const getTextColor = () => {
      const bgColor = getBackgroundColor();
      if (bgColor.includes('primary')) return 'onPrimaryContainer';
      if (bgColor.includes('secondary')) return 'onSecondaryContainer';
      if (bgColor.includes('tertiary')) return 'onTertiaryContainer';
      return 'onSurface';
    };

    // Build style configuration
    const styleConfig = {
      backgroundColor: getBackgroundColor(),
      color: getTextColor(),
      shape: getShapeToken(),
      elevation: variant === 'outlined' ? 'level0' : getElevation(),
      ...(enableMotion && {
        transition: {
          properties: ['box-shadow', 'transform', 'background-color'],
          duration: 'medium1',
          easing: 'standard'
        }
      })
    };

    // Generate Material 3 styles
    const containerStyle = getMaterial3ComponentStyle(styleConfig);

    // Build CSS classes
    const containerClasses = [
      styles.container,
      styles[`variant-${variant}`],
      styles[`elevation-${getElevation()}`],
      styles[`shape-${shape}`],
      styles[`color-${colorRole}`],
      contentState !== 'default' && styles[`state-${contentState}`],
      interactive && styles.interactive,
      focusable && styles.focusable,
      responsive && styles.responsive,
      enableMotion && styles.motion,
      className
    ].filter(Boolean).join(' ');

    // Handle interactive states
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive && enableMotion) {
        const element = e.currentTarget;
        Object.assign(element.style, motionSystem.transitions.cardHover);
      }
      props.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive && enableMotion) {
        const element = e.currentTarget;
        // Reset to base elevation
        Object.assign(element.style, {
          transform: 'translateY(0)',
          boxShadow: containerStyle.boxShadow
        });
      }
      props.onMouseLeave?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      if (focusable && enableMotion) {
        const element = e.currentTarget;
        Object.assign(element.style, motionSystem.transitions.focus.enter);
      }
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (focusable && enableMotion) {
        const element = e.currentTarget;
        Object.assign(element.style, motionSystem.transitions.focus.exit);
      }
      props.onBlur?.(e);
    };

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={focusable ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Material3Container.displayName = 'Material3Container';