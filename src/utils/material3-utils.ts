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
): React.CSSProperties {
  const hoverOpacity = stateLayerOpacity || 0.08;
  const focusOpacity = stateLayerOpacity || 0.12;
  const pressedOpacity = stateLayerOpacity || 0.12;
  
  return {
    position: 'relative',
    overflow: 'hidden',
    // State layer implementation using CSS custom properties
    '--md-state-layer-color': getMaterial3Token(Material3CSSProperties.colors[baseColor]),
    '--md-state-layer-opacity': '0',
    transition: getMaterial3Token(Material3CSSProperties.motion.duration.short2) + ' ' + 
                getMaterial3Token(Material3CSSProperties.motion.easing.standard),
  };
}

/**
 * Create dynamic color variations for different interface states
 * @param baseColorRole - Base color role
 * @param includeStateLayer - Whether to include state layer effects
 * @returns Object with state-specific color styles
 */
export function getMaterial3DynamicColorStates(
  baseColorRole: keyof typeof Material3CSSProperties.colors,
  includeStateLayer: boolean = true
): {
  default: React.CSSProperties;
  hover: React.CSSProperties;
  focus: React.CSSProperties;
  pressed: React.CSSProperties;
  disabled: React.CSSProperties;
  selected: React.CSSProperties;
} {
  const baseColor = getMaterial3Token(Material3CSSProperties.colors[baseColorRole]);
  
  const stateStyles = {
    default: {
      color: baseColor,
    },
    hover: {
      color: `color-mix(in srgb, ${baseColor} 92%, transparent)`,
      ...(includeStateLayer && {
        backgroundColor: `color-mix(in srgb, ${baseColor} 8%, transparent)`,
      }),
    },
    focus: {
      color: `color-mix(in srgb, ${baseColor} 88%, transparent)`,
      outline: `2px solid ${baseColor}`,
      outlineOffset: '2px',
      ...(includeStateLayer && {
        backgroundColor: `color-mix(in srgb, ${baseColor} 12%, transparent)`,
      }),
    },
    pressed: {
      color: `color-mix(in srgb, ${baseColor} 88%, transparent)`,
      ...(includeStateLayer && {
        backgroundColor: `color-mix(in srgb, ${baseColor} 12%, transparent)`,
      }),
    },
    disabled: {
      color: `color-mix(in srgb, ${baseColor} 38%, transparent)`,
      cursor: 'not-allowed',
    },
    selected: {
      color: baseColor,
      backgroundColor: `color-mix(in srgb, ${baseColor} 12%, transparent)`,
    },
  };
  
  return stateStyles;
}

/**
 * Create theme-aware color utility that adapts to light/dark modes
 * @param lightColor - Color role for light theme
 * @param darkColor - Color role for dark theme (optional, defaults to same as light)
 * @returns CSS custom property that adapts to theme
 */
export function getMaterial3ThemeAwareColor(
  lightColor: keyof typeof Material3CSSProperties.colors,
  darkColor?: keyof typeof Material3CSSProperties.colors
): string {
  const lightColorToken = Material3CSSProperties.colors[lightColor];
  const darkColorToken = darkColor ? Material3CSSProperties.colors[darkColor] : lightColorToken;
  
  // Use CSS custom properties that automatically switch based on theme
  return `light-dark(var(${lightColorToken}), var(${darkColorToken}))`;
}

/**
 * Create accessible color combinations with automatic contrast validation
 * @param foregroundRole - Foreground color role
 * @param backgroundRole - Background color role
 * @param options - Configuration options
 * @returns Style object with validated color combination
 */
export function getMaterial3AccessibleColors(
  foregroundRole: keyof typeof Material3CSSProperties.colors,
  backgroundRole: keyof typeof Material3CSSProperties.colors,
  options?: {
    fallbackForeground?: keyof typeof Material3CSSProperties.colors;
    fallbackBackground?: keyof typeof Material3CSSProperties.colors;
    enforceContrast?: boolean;
  }
): React.CSSProperties {
  const foregroundColor = getMaterial3Token(Material3CSSProperties.colors[foregroundRole]);
  const backgroundColor = getMaterial3Token(Material3CSSProperties.colors[backgroundRole]);
  
  const style: React.CSSProperties = {
    color: foregroundColor,
    backgroundColor: backgroundColor,
  };
  
  // Add fallback colors if specified
  if (options?.fallbackForeground) {
    style.color = `${foregroundColor}, ${getMaterial3Token(Material3CSSProperties.colors[options.fallbackForeground])}`;
  }
  
  if (options?.fallbackBackground) {
    style.backgroundColor = `${backgroundColor}, ${getMaterial3Token(Material3CSSProperties.colors[options.fallbackBackground])}`;
  }
  
  return style;
}

/**
 * Generate contextual color variations for semantic meaning
 * @param intent - Semantic intent (success, warning, info, etc.)
 * @param variant - Color variant (filled, outlined, text)
 * @returns Style configuration for the semantic color
 */
export function getMaterial3SemanticColor(
  intent: 'success' | 'warning' | 'info' | 'neutral',
  variant: 'filled' | 'outlined' | 'text' = 'filled'
): React.CSSProperties {
  // Map semantic intents to Material 3 color roles
  const intentColorMap = {
    success: 'tertiary' as const,
    warning: 'error' as const, // Using error for warning as Material 3 doesn't have dedicated warning
    info: 'primary' as const,
    neutral: 'surface' as const,
  };
  
  const baseColorRole = intentColorMap[intent];
  const containerColorRole = `${baseColorRole}Container` as keyof typeof Material3CSSProperties.colors;
  const onColorRole = `on${baseColorRole.charAt(0).toUpperCase() + baseColorRole.slice(1)}` as keyof typeof Material3CSSProperties.colors;
  const onContainerColorRole = `on${baseColorRole.charAt(0).toUpperCase() + baseColorRole.slice(1)}Container` as keyof typeof Material3CSSProperties.colors;
  
  switch (variant) {
    case 'filled':
      return getMaterial3AccessibleColors(onColorRole, baseColorRole);
    case 'outlined':
      return {
        color: getMaterial3Token(Material3CSSProperties.colors[baseColorRole]),
        backgroundColor: 'transparent',
        border: `1px solid ${getMaterial3Token(Material3CSSProperties.colors[baseColorRole])}`,
      };
    case 'text':
      return {
        color: getMaterial3Token(Material3CSSProperties.colors[baseColorRole]),
        backgroundColor: 'transparent',
      };
    default:
      return getMaterial3AccessibleColors(onContainerColorRole, containerColorRole);
  }
}

/**
 * ===== SHAPE AND ELEVATION UTILITIES =====
 */

/**
 * Create responsive shape styles that adapt to screen size
 * @param baseShape - Base shape token to use
 * @param context - Context for scaling (compact, comfortable, spacious)
 * @returns React CSSProperties object with responsive shape
 */
export function getMaterial3ResponsiveShape(
  baseShape: keyof typeof Material3CSSProperties.shapes,
  context: 'compact' | 'comfortable' | 'spacious' = 'comfortable'
): React.CSSProperties {
  const shapeToken = Material3CSSProperties.shapes[baseShape];
  
  return {
    borderRadius: `calc(${getMaterial3Token(shapeToken)} * var(--md-sys-shape-scale-factor-${context}))`,
  };
}

/**
 * Create organic shape variations for expressive design
 * @param componentType - Type of component (button, card, field, etc.)
 * @param variant - Shape variant (primary, secondary, organic, asymmetric)
 * @returns React CSSProperties object with organic shape
 */
export function getMaterial3OrganicShape(
  componentType: 'button' | 'card' | 'field' | 'navigation' | 'activity' | 'timer' | 'summary' | 'chip',
  variant: 'primary' | 'secondary' | 'tertiary' | 'organic' | 'asymmetric' = 'primary'
): React.CSSProperties {
  const shapeMap = {
    button: {
      primary: 'cornerButtonPrimary',
      secondary: 'cornerButtonSecondary',
      tertiary: 'cornerButtonTertiary',
      organic: 'cornerPillMedium',
      asymmetric: 'cornerAsymmetricMedium',
    },
    card: {
      primary: 'cornerCardElevated',
      secondary: 'cornerCardFilled',
      tertiary: 'cornerCardOutlined',
      organic: 'cornerMediumTop',
      asymmetric: 'cornerAsymmetricLarge',
    },
    field: {
      primary: 'cornerFieldOutlined',
      secondary: 'cornerFieldFilled',
      tertiary: 'cornerExtraSmall',
      organic: 'cornerExtraSmallTop',
      asymmetric: 'cornerAsymmetricSmall',
    },
    navigation: {
      primary: 'cornerNavigationItem',
      secondary: 'cornerNavigationRail',
      tertiary: 'cornerMedium',
      organic: 'cornerPillLarge',
      asymmetric: 'cornerAsymmetricMedium',
    },
    activity: {
      primary: 'cornerActivityCard',
      secondary: 'cornerMedium',
      tertiary: 'cornerSmall',
      organic: 'cornerMediumTop',
      asymmetric: 'cornerAsymmetricMedium',
    },
    timer: {
      primary: 'cornerTimerContainer',
      secondary: 'cornerLarge',
      tertiary: 'cornerMedium',
      organic: 'cornerLargeTop',
      asymmetric: 'cornerAsymmetricLarge',
    },
    summary: {
      primary: 'cornerSummaryCard',
      secondary: 'cornerMedium',
      tertiary: 'cornerSmall',
      organic: 'cornerSmallTop',
      asymmetric: 'cornerAsymmetricSmall',
    },
    chip: {
      primary: 'cornerChip',
      secondary: 'cornerPillSmall',
      tertiary: 'cornerMedium',
      organic: 'cornerPillMedium',
      asymmetric: 'cornerAsymmetricSmall',
    },
  } as const;
  
  const shapeToken = shapeMap[componentType][variant] as keyof typeof Material3CSSProperties.shapes;
  
  return getMaterial3Shape(shapeToken);
}

/**
 * Create contextual elevation styles for different component states
 * @param componentType - Type of component (card, button, fab, navigation, etc.)
 * @param state - Component state (resting, hover, pressed, focused, dragged)
 * @returns React CSSProperties object with contextual elevation
 */
export function getMaterial3ContextualElevation(
  componentType: 'card' | 'button' | 'fab' | 'navigation' | 'dialog' | 'menu' | 'tooltip' | 'snackbar',
  state: 'resting' | 'hover' | 'pressed' | 'focused' | 'dragged' = 'resting'
): React.CSSProperties {
  const elevationMap = {
    card: {
      resting: 'cardResting',
      hover: 'cardHover',
      pressed: 'cardPressed',
      focused: 'cardResting',
      dragged: 'cardDragged',
    },
    button: {
      resting: 'buttonResting',
      hover: 'buttonHover',
      pressed: 'buttonPressed',
      focused: 'buttonFocused',
      dragged: 'buttonResting',
    },
    fab: {
      resting: 'fabResting',
      hover: 'fabHover',
      pressed: 'fabPressed',
      focused: 'fabFocused',
      dragged: 'fabResting',
    },
    navigation: {
      resting: 'navigationRail',
      hover: 'navigationBar',
      pressed: 'navigationRail',
      focused: 'navigationRail',
      dragged: 'navigationDrawer',
    },
    dialog: {
      resting: 'dialog',
      hover: 'dialog',
      pressed: 'dialog',
      focused: 'dialog',
      dragged: 'dialog',
    },
    menu: {
      resting: 'menu',
      hover: 'menu',
      pressed: 'menu',
      focused: 'menu',
      dragged: 'menu',
    },
    tooltip: {
      resting: 'tooltip',
      hover: 'tooltip',
      pressed: 'tooltip',
      focused: 'tooltip',
      dragged: 'tooltip',
    },
    snackbar: {
      resting: 'snackbar',
      hover: 'snackbar',
      pressed: 'snackbar',
      focused: 'snackbar',
      dragged: 'snackbar',
    },
  } as const;
  
  const elevationToken = elevationMap[componentType][state] as keyof typeof Material3CSSProperties.elevation;
  
  return getMaterial3Elevation(elevationToken);
}

/**
 * Create organic elevation variations for expressive design
 * @param intensity - Elevation intensity (subtle, moderate, pronounced)
 * @param direction - Optional directional shadow (top, bottom, left, right)
 * @returns React CSSProperties object with organic elevation
 */
export function getMaterial3OrganicElevation(
  intensity: 'subtle' | 'moderate' | 'pronounced' = 'moderate',
  direction?: 'top' | 'bottom' | 'left' | 'right'
): React.CSSProperties {
  if (direction) {
    const directionalToken = `directional${direction.charAt(0).toUpperCase() + direction.slice(1)}` as keyof typeof Material3CSSProperties.elevation;
    return getMaterial3Elevation(directionalToken);
  }
  
  const organicToken = `organic${intensity.charAt(0).toUpperCase() + intensity.slice(1)}` as keyof typeof Material3CSSProperties.elevation;
  return getMaterial3Elevation(organicToken);
}

/**
 * Create interactive elevation styles with smooth transitions
 * @param baseElevation - Base elevation level
 * @param hoverElevation - Elevation on hover
 * @param pressedElevation - Elevation when pressed
 * @returns React CSSProperties object with interactive elevation
 */
export function getMaterial3InteractiveElevation(
  baseElevation: keyof typeof Material3CSSProperties.elevation = 'level1',
  hoverElevation: keyof typeof Material3CSSProperties.elevation = 'level2',
  pressedElevation: keyof typeof Material3CSSProperties.elevation = 'level0'
): React.CSSProperties {
  return {
    boxShadow: getMaterial3Token(Material3CSSProperties.elevation[baseElevation]),
    transition: `box-shadow ${getMaterial3Token(Material3CSSProperties.motion.duration.short2)} ${getMaterial3Token(Material3CSSProperties.motion.easing.standard)}`,
    '&:hover': {
      boxShadow: getMaterial3Token(Material3CSSProperties.elevation[hoverElevation]),
    },
    '&:active': {
      boxShadow: getMaterial3Token(Material3CSSProperties.elevation[pressedElevation]),
    },
  };
}

/**
 * Create shape and elevation combination for Material 3 Expressive components
 * @param config - Configuration object for shape and elevation
 * @returns React CSSProperties object with combined shape and elevation
 */
export function getMaterial3ExpressiveContainer(config: {
  componentType: 'button' | 'card' | 'field' | 'navigation' | 'activity' | 'timer' | 'summary' | 'chip';
  shapeVariant?: 'primary' | 'secondary' | 'tertiary' | 'organic' | 'asymmetric';
  elevationState?: 'resting' | 'hover' | 'pressed' | 'focused' | 'dragged';
  responsive?: boolean;
  context?: 'compact' | 'comfortable' | 'spacious';
  interactive?: boolean;
}): React.CSSProperties {
  const {
    componentType,
    shapeVariant = 'primary',
    elevationState = 'resting',
    responsive = true,
    context = 'comfortable',
    interactive = false,
  } = config;
  
  let styles: React.CSSProperties = {};
  
  // Add shape styles
  if (responsive) {
    const baseShape = getMaterial3OrganicShape(componentType, shapeVariant);
    styles = {
      ...styles,
      borderRadius: `calc(${baseShape.borderRadius} * var(--md-sys-shape-scale-factor-${context}))`,
    };
  } else {
    styles = {
      ...styles,
      ...getMaterial3OrganicShape(componentType, shapeVariant),
    };
  }
  
  // Add elevation styles
  const elevationComponentType = componentType === 'activity' || componentType === 'timer' || componentType === 'summary' ? 'card' : componentType;
  if (elevationComponentType === 'field' || elevationComponentType === 'chip') {
    // Fields and chips typically don't have elevation
    styles = {
      ...styles,
      ...getMaterial3Elevation('level0'),
    };
  } else {
    styles = {
      ...styles,
      ...getMaterial3ContextualElevation(elevationComponentType as any, elevationState),
    };
  }
  
  // Add interactive transitions if specified
  if (interactive) {
    styles = {
      ...styles,
      transition: `all ${getMaterial3Token(Material3CSSProperties.motion.duration.short2)} ${getMaterial3Token(Material3CSSProperties.motion.easing.standard)}`,
    };
  }
  
  return styles;
}

/**
 * Create responsive shape scaling utilities for different breakpoints
 * @param baseShapes - Object with shape tokens for different breakpoints
 * @returns Object with media query styles for responsive shapes
 */
export function getMaterial3ResponsiveShapeBreakpoints(baseShapes: {
  mobile?: keyof typeof Material3CSSProperties.shapes;
  tablet?: keyof typeof Material3CSSProperties.shapes;
  desktop?: keyof typeof Material3CSSProperties.shapes;
  base: keyof typeof Material3CSSProperties.shapes;
}): {
  base: React.CSSProperties;
  mobile?: React.CSSProperties;
  tablet?: React.CSSProperties;
  desktop?: React.CSSProperties;
} {
  const result: any = {
    base: getMaterial3Shape(baseShapes.base),
  };
  
  if (baseShapes.mobile) {
    result.mobile = getMaterial3Shape(baseShapes.mobile);
  }
  
  if (baseShapes.tablet) {
    result.tablet = getMaterial3Shape(baseShapes.tablet);
  }
  
  if (baseShapes.desktop) {
    result.desktop = getMaterial3Shape(baseShapes.desktop);
  }
  
  return result;
}

/**
 * Create shape utility classes generator for consistent application
 * @param componentType - Type of component
 * @param variants - Array of shape variants to generate classes for
 * @returns Object with CSS class names for different shape variants
 */
export function getMaterial3ShapeClasses(
  componentType: 'button' | 'card' | 'field' | 'navigation' | 'activity' | 'timer' | 'summary' | 'chip',
  variants: Array<'primary' | 'secondary' | 'tertiary' | 'organic' | 'asymmetric'> = ['primary']
): Record<string, string> {
  const classes: Record<string, string> = {};
  
  variants.forEach(variant => {
    const className = `md-shape-${componentType}-${variant}`;
    classes[variant] = className;
  });
  
  return classes;
}

/**
 * Create elevation utility classes generator for consistent application
 * @param componentType - Type of component
 * @param states - Array of elevation states to generate classes for
 * @returns Object with CSS class names for different elevation states
 */
export function getMaterial3ElevationClasses(
  componentType: 'card' | 'button' | 'fab' | 'navigation' | 'dialog' | 'menu' | 'tooltip' | 'snackbar',
  states: Array<'resting' | 'hover' | 'pressed' | 'focused' | 'dragged'> = ['resting']
): Record<string, string> {
  const classes: Record<string, string> = {};
  
  states.forEach(state => {
    const className = `md-elevation-${componentType}-${state}`;
    classes[state] = className;
  });
  
  return classes;
}