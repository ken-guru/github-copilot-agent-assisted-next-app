/**
 * Material 3 Expressive Design System Utilities
 * Helper functions for working with Material 3 design tokens in React components
 */

import { Material3CSSProperties } from '../types/material3-tokens';

/**
 * Get a CSS custom property value for Material 3 tokens
 * @param property - The CSS custom property name
 * @returns CSS var() function string
 */
export function getMaterial3Token(property: string): string {
  return `var(${property})`;
}

/**
 * Create a style object using Material 3 typography tokens
 * @param typographyScale - The typography scale to use (e.g., 'headlineLarge', 'bodyMedium')
 * @returns React CSSProperties object
 */
export function getMaterial3Typography(
  typographyScale: keyof typeof Material3CSSProperties.typography
): React.CSSProperties {
  const scale = Material3CSSProperties.typography[typographyScale];
  return {
    fontFamily: getMaterial3Token(scale.fontFamily),
    fontWeight: getMaterial3Token(scale.fontWeight),
    fontSize: getMaterial3Token(scale.fontSize),
    lineHeight: getMaterial3Token(scale.lineHeight),
    letterSpacing: getMaterial3Token(scale.letterSpacing),
  };
}

/**
 * Create a style object using Material 3 color tokens
 * @param colorRole - The color role to use (e.g., 'primary', 'surface')
 * @param property - The CSS property to apply the color to ('color' or 'backgroundColor')
 * @returns React CSSProperties object
 */
export function getMaterial3Color(
  colorRole: keyof typeof Material3CSSProperties.colors,
  property: 'color' | 'backgroundColor' = 'color'
): React.CSSProperties {
  const colorToken = Material3CSSProperties.colors[colorRole];
  return {
    [property]: getMaterial3Token(colorToken),
  };
}

/**
 * Create a style object using Material 3 shape tokens
 * @param shapeToken - The shape token to use (e.g., 'cornerMedium', 'cornerAsymmetricSmall')
 * @returns React CSSProperties object
 */
export function getMaterial3Shape(
  shapeToken: keyof typeof Material3CSSProperties.shapes
): React.CSSProperties {
  const shape = Material3CSSProperties.shapes[shapeToken];
  return {
    borderRadius: getMaterial3Token(shape),
  };
}

/**
 * Create a style object using Material 3 elevation tokens
 * @param elevationLevel - The elevation level to use (e.g., 'level1', 'level3')
 * @returns React CSSProperties object
 */
export function getMaterial3Elevation(
  elevationLevel: keyof typeof Material3CSSProperties.elevation
): React.CSSProperties {
  const elevation = Material3CSSProperties.elevation[elevationLevel];
  return {
    boxShadow: getMaterial3Token(elevation),
  };
}

/**
 * Create a transition style using Material 3 motion tokens
 * @param properties - CSS properties to transition
 * @param duration - Duration token to use (e.g., 'short2', 'medium1')
 * @param easing - Easing token to use (e.g., 'standard', 'emphasized')
 * @returns React CSSProperties object
 */
export function getMaterial3Transition(
  properties: string | string[],
  duration: keyof typeof Material3CSSProperties.motion.duration = 'short2',
  easing: keyof typeof Material3CSSProperties.motion.easing = 'standard'
): React.CSSProperties {
  const durationToken = Material3CSSProperties.motion.duration[duration];
  const easingToken = Material3CSSProperties.motion.easing[easing];
  
  const propertyList = Array.isArray(properties) ? properties.join(', ') : properties;
  
  return {
    transition: `${propertyList} ${getMaterial3Token(durationToken)} ${getMaterial3Token(easingToken)}`,
  };
}

/**
 * Create a complete Material 3 component style combining multiple tokens
 * @param config - Configuration object with token specifications
 * @returns React CSSProperties object
 */
export function getMaterial3ComponentStyle(config: {
  typography?: keyof typeof Material3CSSProperties.typography;
  color?: keyof typeof Material3CSSProperties.colors;
  backgroundColor?: keyof typeof Material3CSSProperties.colors;
  shape?: keyof typeof Material3CSSProperties.shapes;
  elevation?: keyof typeof Material3CSSProperties.elevation;
  transition?: {
    properties: string | string[];
    duration?: keyof typeof Material3CSSProperties.motion.duration;
    easing?: keyof typeof Material3CSSProperties.motion.easing;
  };
}): React.CSSProperties {
  let style: React.CSSProperties = {};
  
  if (config.typography) {
    style = { ...style, ...getMaterial3Typography(config.typography) };
  }
  
  if (config.color) {
    style = { ...style, ...getMaterial3Color(config.color, 'color') };
  }
  
  if (config.backgroundColor) {
    style = { ...style, ...getMaterial3Color(config.backgroundColor, 'backgroundColor') };
  }
  
  if (config.shape) {
    style = { ...style, ...getMaterial3Shape(config.shape) };
  }
  
  if (config.elevation) {
    style = { ...style, ...getMaterial3Elevation(config.elevation) };
  }
  
  if (config.transition) {
    style = { 
      ...style, 
      ...getMaterial3Transition(
        config.transition.properties,
        config.transition.duration,
        config.transition.easing
      ) 
    };
  }
  
  return style;
}

/**
 * Generate CSS class names for Material 3 utility classes
 * @param config - Configuration object specifying which utility classes to use
 * @returns String of CSS class names
 */
export function getMaterial3Classes(config: {
  typography?: keyof typeof Material3CSSProperties.typography;
  color?: keyof typeof Material3CSSProperties.colors;
  backgroundColor?: keyof typeof Material3CSSProperties.colors;
  shape?: keyof typeof Material3CSSProperties.shapes;
  elevation?: keyof typeof Material3CSSProperties.elevation;
  motion?: {
    easing?: keyof typeof Material3CSSProperties.motion.easing;
    duration?: keyof typeof Material3CSSProperties.motion.duration;
  };
  stateLayer?: boolean;
}): string {
  const classes: string[] = [];
  
  if (config.typography) {
    classes.push(`md-typescale-${config.typography.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  }
  
  if (config.color) {
    classes.push(`md-color-${config.color.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  }
  
  if (config.backgroundColor) {
    classes.push(`md-bg-${config.backgroundColor.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  }
  
  if (config.shape) {
    classes.push(`md-shape-${config.shape.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  }
  
  if (config.elevation) {
    classes.push(`md-elevation-${config.elevation}`);
  }
  
  if (config.motion?.easing) {
    classes.push(`md-motion-easing-${config.motion.easing.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  }
  
  if (config.motion?.duration) {
    classes.push(`md-motion-duration-${config.motion.duration.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  }
  
  if (config.stateLayer) {
    classes.push('md-state-layer');
  }
  
  return classes.join(' ');
}

/**
 * Create a Material 3 button style configuration
 * @param variant - Button variant ('filled', 'outlined', 'text')
 * @param size - Button size ('small', 'medium', 'large')
 * @returns Style configuration object
 */
export function getMaterial3ButtonStyle(
  variant: 'filled' | 'outlined' | 'text' = 'filled',
  size: 'small' | 'medium' | 'large' = 'medium'
): React.CSSProperties {
  const baseStyle = getMaterial3ComponentStyle({
    typography: 'labelLarge',
    shape: 'cornerFull',
    transition: {
      properties: ['background-color', 'color', 'box-shadow', 'transform'],
      duration: 'short2',
      easing: 'standard',
    },
  });
  
  const sizeStyles = {
    small: { height: '32px', padding: '0 16px', fontSize: '0.75rem' },
    medium: { height: '40px', padding: '0 24px' },
    large: { height: '48px', padding: '0 32px', fontSize: '1rem' },
  };
  
  const variantStyles = {
    filled: getMaterial3ComponentStyle({
      backgroundColor: 'primary',
      color: 'onPrimary',
      elevation: 'level0',
    }),
    outlined: {
      backgroundColor: 'transparent',
      border: `1px solid ${getMaterial3Token(Material3CSSProperties.colors.outline)}`,
      ...getMaterial3Color('primary', 'color'),
    },
    text: {
      backgroundColor: 'transparent',
      ...getMaterial3Color('primary', 'color'),
    },
  };
  
  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    border: variant === 'outlined' ? variantStyles.outlined.border : 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    userSelect: 'none',
    position: 'relative',
    overflow: 'hidden',
  };
}

/**
 * Create a Material 3 card style configuration
 * @param variant - Card variant ('elevated', 'filled', 'outlined')
 * @returns Style configuration object
 */
export function getMaterial3CardStyle(
  variant: 'elevated' | 'filled' | 'outlined' = 'elevated'
): React.CSSProperties {
  const baseStyle = getMaterial3ComponentStyle({
    shape: 'cornerMedium',
    transition: {
      properties: ['box-shadow', 'transform'],
      duration: 'short2',
      easing: 'standard',
    },
  });
  
  const variantStyles = {
    elevated: getMaterial3ComponentStyle({
      backgroundColor: 'surfaceContainerLow',
      color: 'onSurface',
      elevation: 'level1',
    }),
    filled: getMaterial3ComponentStyle({
      backgroundColor: 'surfaceContainerHighest',
      color: 'onSurface',
    }),
    outlined: {
      backgroundColor: getMaterial3Token(Material3CSSProperties.colors.surface),
      color: getMaterial3Token(Material3CSSProperties.colors.onSurface),
      border: `1px solid ${getMaterial3Token(Material3CSSProperties.colors.outlineVariant)}`,
    },
  };
  
  return {
    ...baseStyle,
    ...variantStyles[variant],
    padding: '16px',
    display: 'block',
  };
}

/**
 * Create a Material 3 text field style configuration
 * @param variant - Text field variant ('filled', 'outlined')
 * @returns Style configuration object
 */
export function getMaterial3TextFieldStyle(
  variant: 'filled' | 'outlined' = 'outlined'
): React.CSSProperties {
  const baseStyle = getMaterial3ComponentStyle({
    typography: 'bodyLarge',
    transition: {
      properties: ['border-color', 'background-color'],
      duration: 'short2',
      easing: 'standard',
    },
  });
  
  const variantStyles = {
    filled: {
      backgroundColor: getMaterial3Token(Material3CSSProperties.colors.surfaceContainerHighest),
      color: getMaterial3Token(Material3CSSProperties.colors.onSurface),
      borderRadius: `${getMaterial3Token(Material3CSSProperties.shapes.cornerExtraSmall)} ${getMaterial3Token(Material3CSSProperties.shapes.cornerExtraSmall)} 0 0`,
      borderBottom: `1px solid ${getMaterial3Token(Material3CSSProperties.colors.onSurfaceVariant)}`,
    },
    outlined: {
      backgroundColor: 'transparent',
      color: getMaterial3Token(Material3CSSProperties.colors.onSurface),
      border: `1px solid ${getMaterial3Token(Material3CSSProperties.colors.outline)}`,
      borderRadius: getMaterial3Token(Material3CSSProperties.shapes.cornerExtraSmall),
    },
  };
  
  return {
    ...baseStyle,
    ...variantStyles[variant],
    padding: '16px',
    fontSize: getMaterial3Token(Material3CSSProperties.typography.bodyLarge.fontSize),
    lineHeight: getMaterial3Token(Material3CSSProperties.typography.bodyLarge.lineHeight),
    outline: 'none',
    width: '100%',
  };
}

/**
 * Responsive typography utility that adapts font sizes based on screen size
 * @param baseScale - Base typography scale
 * @param options - Configuration options for responsive behavior
 * @returns CSS-in-JS media query object
 */
export function getResponsiveMaterial3Typography(
  baseScale: keyof typeof Material3CSSProperties.typography,
  options?: {
    mobileScale?: keyof typeof Material3CSSProperties.typography;
    tabletScale?: keyof typeof Material3CSSProperties.typography;
    context?: 'compact' | 'comfortable' | 'spacious';
    enableDynamicScaling?: boolean;
  }
): React.CSSProperties {
  const baseTypography = getMaterial3Typography(baseScale);
  
  let styles: React.CSSProperties = {
    ...baseTypography,
  };
  
  // Add dynamic scaling if enabled
  if (options?.enableDynamicScaling) {
    styles = {
      ...styles,
      fontSize: `calc(${baseTypography.fontSize} * var(--md-sys-typescale-scale-factor))`,
      lineHeight: `calc(${baseTypography.lineHeight} * var(--md-sys-typescale-scale-factor))`,
    };
  }
  
  // Add context-aware scaling
  if (options?.context) {
    const contextClass = `md-typography-context-${options.context}`;
    styles = {
      ...styles,
      // Note: In a real implementation, this would be handled by CSS classes
      // This is a simplified representation for the utility function
    };
  }
  
  return styles;
}

/**
 * Create typography styles with expressive font weight variations
 * @param baseScale - Base typography scale
 * @param weight - Font weight variation
 * @param emphasis - Emphasis level for color and hierarchy
 * @returns React CSSProperties object
 */
export function getMaterial3ExpressiveTypography(
  baseScale: keyof typeof Material3CSSProperties.typography,
  weight?: 'thin' | 'extra-light' | 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold' | 'extra-bold' | 'black',
  emphasis?: 'high' | 'medium' | 'low'
): React.CSSProperties {
  const baseTypography = getMaterial3Typography(baseScale);
  
  let styles: React.CSSProperties = { ...baseTypography };
  
  // Apply expressive font weight if specified
  if (weight) {
    const weightToken = `--md-sys-typescale-font-weight-${weight.replace(/-/g, '-')}`;
    styles.fontWeight = getMaterial3Token(weightToken);
  }
  
  // Apply emphasis styling if specified
  if (emphasis) {
    switch (emphasis) {
      case 'high':
        styles.color = getMaterial3Token(Material3CSSProperties.colors.primary);
        styles.fontWeight = getMaterial3Token('--md-sys-typescale-font-weight-bold');
        break;
      case 'medium':
        styles.color = getMaterial3Token(Material3CSSProperties.colors.onSurface);
        styles.fontWeight = getMaterial3Token('--md-sys-typescale-font-weight-medium');
        break;
      case 'low':
        styles.color = getMaterial3Token(Material3CSSProperties.colors.onSurfaceVariant);
        styles.fontWeight = getMaterial3Token('--md-sys-typescale-font-weight-regular');
        break;
    }
  }
  
  return styles;
}

/**
 * Create contextual typography scaling based on content density
 * @param baseScale - Base typography scale
 * @param context - Context for scaling (compact, comfortable, spacious)
 * @returns React CSSProperties object
 */
export function getMaterial3ContextualTypography(
  baseScale: keyof typeof Material3CSSProperties.typography,
  context: 'compact' | 'comfortable' | 'spacious' = 'comfortable'
): React.CSSProperties {
  const baseTypography = getMaterial3Typography(baseScale);
  
  const scalingFactors = {
    compact: 0.875,
    comfortable: 1,
    spacious: 1.125,
  };
  
  const scaleFactor = scalingFactors[context];
  
  return {
    ...baseTypography,
    fontSize: `calc(${baseTypography.fontSize} * ${scaleFactor})`,
    lineHeight: `calc(${baseTypography.lineHeight} * ${scaleFactor})`,
  };
}

/**
 * Create adaptive typography that responds to screen size and maintains proportions
 * @param baseScale - Base typography scale
 * @param breakpoints - Custom breakpoint configurations
 * @returns Object with media query styles
 */
export function getMaterial3AdaptiveTypography(
  baseScale: keyof typeof Material3CSSProperties.typography,
  breakpoints?: {
    mobile?: { scale: number; maxWidth: string };
    tablet?: { scale: number; minWidth: string; maxWidth: string };
    desktop?: { scale: number; minWidth: string };
  }
): {
  base: React.CSSProperties;
  mobile: React.CSSProperties;
  tablet: React.CSSProperties;
  desktop: React.CSSProperties;
} {
  const baseTypography = getMaterial3Typography(baseScale);
  
  const defaultBreakpoints = {
    mobile: { scale: 0.875, maxWidth: '599px' },
    tablet: { scale: 0.95, minWidth: '600px', maxWidth: '1023px' },
    desktop: { scale: 1.05, minWidth: '1024px' },
  };
  
  const bp = { ...defaultBreakpoints, ...breakpoints };
  
  return {
    base: baseTypography,
    mobile: {
      fontSize: `calc(${baseTypography.fontSize} * ${bp.mobile.scale})`,
      lineHeight: `calc(${baseTypography.lineHeight} * ${bp.mobile.scale})`,
    },
    tablet: {
      fontSize: `calc(${baseTypography.fontSize} * ${bp.tablet.scale})`,
      lineHeight: `calc(${baseTypography.lineHeight} * ${bp.tablet.scale})`,
    },
    desktop: {
      fontSize: `calc(${baseTypography.fontSize} * ${bp.desktop.scale})`,
      lineHeight: `calc(${baseTypography.lineHeight} * ${bp.desktop.scale})`,
    },
  };
}

/**
 * Create hover and focus state styles for interactive elements
 * @param baseColor - Base color token
 * @param stateLayerOpacity - Optional custom state layer opacity
 * @returns Object with hover and focus state styles
 */
export function getMaterial3InteractionStates(
  baseColor: keyof typeof Material3CSSProperties.colors,
  stateLayerOpacity?: number
): {
  '&:hover': React.CSSProperties;
  '&:focus-visible': React.CSSProperties;
  '&:active': React.CSSProperties;
} {
  const hoverOpacity = stateLayerOpacity || 0.08;
  const focusOpacity = stateLayerOpacity || 0.12;
  const pressedOpacity = stateLayerOpacity || 0.12;
  
  return {
    '&:hover': {
      '&::before': {
        opacity: hoverOpacity,
      },
    },
    '&:focus-visible': {
      '&::before': {
        opacity: focusOpacity,
      },
      outline: `2px solid ${getMaterial3Token(Material3CSSProperties.colors[baseColor])}`,
      outlineOffset: '2px',
    },
    '&:active': {
      '&::before': {
        opacity: pressedOpacity,
      },
    },
  };
}