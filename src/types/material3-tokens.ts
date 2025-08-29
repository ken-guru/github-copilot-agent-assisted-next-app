/**
 * Material 3 Expressive Design Token Type Definitions
 * These interfaces provide type safety for Material 3 design tokens
 */

export interface TypographyToken {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
}

export interface ColorToken {
  value: string;
  description?: string;
}

export interface ShapeToken {
  value: string;
  description?: string;
}

export interface ElevationToken {
  value: string;
  description?: string;
}

export interface MotionToken {
  value: string;
  description?: string;
}

export interface StateLayerToken {
  opacity: number;
  description?: string;
}

/**
 * Complete Material 3 Expressive Design Token System
 */
export interface Material3ExpressiveTokens {
  typography: {
    displayLarge: TypographyToken;
    displayMedium: TypographyToken;
    displaySmall: TypographyToken;
    headlineLarge: TypographyToken;
    headlineMedium: TypographyToken;
    headlineSmall: TypographyToken;
    titleLarge: TypographyToken;
    titleMedium: TypographyToken;
    titleSmall: TypographyToken;
    bodyLarge: TypographyToken;
    bodyMedium: TypographyToken;
    bodySmall: TypographyToken;
    labelLarge: TypographyToken;
    labelMedium: TypographyToken;
    labelSmall: TypographyToken;
  };
  
  colors: {
    // Primary palette
    primary: ColorToken;
    onPrimary: ColorToken;
    primaryContainer: ColorToken;
    onPrimaryContainer: ColorToken;
    
    // Secondary palette
    secondary: ColorToken;
    onSecondary: ColorToken;
    secondaryContainer: ColorToken;
    onSecondaryContainer: ColorToken;
    
    // Tertiary palette
    tertiary: ColorToken;
    onTertiary: ColorToken;
    tertiaryContainer: ColorToken;
    onTertiaryContainer: ColorToken;
    
    // Error palette
    error: ColorToken;
    onError: ColorToken;
    errorContainer: ColorToken;
    onErrorContainer: ColorToken;
    
    // Surface palette
    surface: ColorToken;
    onSurface: ColorToken;
    surfaceVariant: ColorToken;
    onSurfaceVariant: ColorToken;
    surfaceContainerLowest: ColorToken;
    surfaceContainerLow: ColorToken;
    surfaceContainer: ColorToken;
    surfaceContainerHigh: ColorToken;
    surfaceContainerHighest: ColorToken;
    
    // Background
    background: ColorToken;
    onBackground: ColorToken;
    
    // Outline
    outline: ColorToken;
    outlineVariant: ColorToken;
    
    // Inverse
    inverseSurface: ColorToken;
    inverseOnSurface: ColorToken;
    inversePrimary: ColorToken;
    
    // Shadow and scrim
    shadow: ColorToken;
    scrim: ColorToken;
  };
  
  shapes: {
    cornerNone: ShapeToken;
    cornerExtraSmall: ShapeToken;
    cornerSmall: ShapeToken;
    cornerMedium: ShapeToken;
    cornerLarge: ShapeToken;
    cornerExtraLarge: ShapeToken;
    cornerFull: ShapeToken;
    
    // Expressive variations
    cornerExtraSmallTop: ShapeToken;
    cornerSmallTop: ShapeToken;
    cornerMediumTop: ShapeToken;
    cornerLargeTop: ShapeToken;
    
    // Asymmetric variations
    cornerAsymmetricSmall: ShapeToken;
    cornerAsymmetricMedium: ShapeToken;
    cornerAsymmetricLarge: ShapeToken;
  };
  
  elevation: {
    level0: ElevationToken;
    level1: ElevationToken;
    level2: ElevationToken;
    level3: ElevationToken;
    level4: ElevationToken;
    level5: ElevationToken;
  };
  
  motion: {
    easing: {
      standard: MotionToken;
      emphasized: MotionToken;
      emphasizedDecelerate: MotionToken;
      emphasizedAccelerate: MotionToken;
      legacy: MotionToken;
      linear: MotionToken;
    };
    duration: {
      short1: MotionToken;
      short2: MotionToken;
      short3: MotionToken;
      short4: MotionToken;
      medium1: MotionToken;
      medium2: MotionToken;
      medium3: MotionToken;
      medium4: MotionToken;
      long1: MotionToken;
      long2: MotionToken;
      long3: MotionToken;
      long4: MotionToken;
      extraLong1: MotionToken;
      extraLong2: MotionToken;
      extraLong3: MotionToken;
      extraLong4: MotionToken;
    };
  };
  
  stateLayers: {
    hover: StateLayerToken;
    focus: StateLayerToken;
    pressed: StateLayerToken;
    dragged: StateLayerToken;
  };
}

/**
 * Component-specific token interfaces
 */
export interface ButtonTokens {
  containerHeight: string;
  containerShape: string;
  labelTextFont: string;
  labelTextSize: string;
  labelTextWeight: string;
}

export interface TextFieldTokens {
  containerShape: string;
  inputTextFont: string;
  inputTextSize: string;
  labelTextFont: string;
  labelTextSize: string;
}

export interface CardTokens {
  containerElevation: string;
  containerShape: string;
  containerColor: string;
}

/**
 * Component token collection
 */
export interface Material3ComponentTokens {
  filledButton: ButtonTokens;
  outlinedTextField: TextFieldTokens;
  elevatedCard: CardTokens;
}

/**
 * Theme mode type
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Material 3 Expressive theme configuration
 */
export interface Material3Theme {
  mode: ThemeMode;
  tokens: Material3ExpressiveTokens;
  components: Material3ComponentTokens;
}

/**
 * Font weight variations for expressive typography
 */
export type FontWeightVariation = 
  | 'thin' 
  | 'extra-light' 
  | 'light' 
  | 'regular' 
  | 'medium' 
  | 'semi-bold' 
  | 'bold' 
  | 'extra-bold' 
  | 'black';

/**
 * Typography emphasis levels
 */
export type TypographyEmphasis = 'high' | 'medium' | 'low';

/**
 * Typography context for density scaling
 */
export type TypographyContext = 'compact' | 'comfortable' | 'spacious';

/**
 * Responsive typography configuration
 */
export interface ResponsiveTypographyConfig {
  mobileScale?: keyof Material3ExpressiveTokens['typography'];
  tabletScale?: keyof Material3ExpressiveTokens['typography'];
  context?: TypographyContext;
  enableDynamicScaling?: boolean;
}

/**
 * Adaptive typography breakpoint configuration
 */
export interface AdaptiveTypographyBreakpoints {
  mobile?: { scale: number; maxWidth: string };
  tablet?: { scale: number; minWidth: string; maxWidth: string };
  desktop?: { scale: number; minWidth: string };
}

/**
 * CSS Custom Property names for Material 3 tokens
 * These correspond to the actual CSS custom properties defined in material3-tokens.css
 */
export const Material3CSSProperties = {
  // Typography
  typography: {
    displayLarge: {
      fontFamily: '--md-sys-typescale-display-large-font-family',
      fontWeight: '--md-sys-typescale-display-large-font-weight',
      fontSize: '--md-sys-typescale-display-large-font-size',
      lineHeight: '--md-sys-typescale-display-large-line-height',
      letterSpacing: '--md-sys-typescale-display-large-letter-spacing',
    },
    displayMedium: {
      fontFamily: '--md-sys-typescale-display-medium-font-family',
      fontWeight: '--md-sys-typescale-display-medium-font-weight',
      fontSize: '--md-sys-typescale-display-medium-font-size',
      lineHeight: '--md-sys-typescale-display-medium-line-height',
      letterSpacing: '--md-sys-typescale-display-medium-letter-spacing',
    },
    displaySmall: {
      fontFamily: '--md-sys-typescale-display-small-font-family',
      fontWeight: '--md-sys-typescale-display-small-font-weight',
      fontSize: '--md-sys-typescale-display-small-font-size',
      lineHeight: '--md-sys-typescale-display-small-line-height',
      letterSpacing: '--md-sys-typescale-display-small-letter-spacing',
    },
    headlineLarge: {
      fontFamily: '--md-sys-typescale-headline-large-font-family',
      fontWeight: '--md-sys-typescale-headline-large-font-weight',
      fontSize: '--md-sys-typescale-headline-large-font-size',
      lineHeight: '--md-sys-typescale-headline-large-line-height',
      letterSpacing: '--md-sys-typescale-headline-large-letter-spacing',
    },
    headlineMedium: {
      fontFamily: '--md-sys-typescale-headline-medium-font-family',
      fontWeight: '--md-sys-typescale-headline-medium-font-weight',
      fontSize: '--md-sys-typescale-headline-medium-font-size',
      lineHeight: '--md-sys-typescale-headline-medium-line-height',
      letterSpacing: '--md-sys-typescale-headline-medium-letter-spacing',
    },
    headlineSmall: {
      fontFamily: '--md-sys-typescale-headline-small-font-family',
      fontWeight: '--md-sys-typescale-headline-small-font-weight',
      fontSize: '--md-sys-typescale-headline-small-font-size',
      lineHeight: '--md-sys-typescale-headline-small-line-height',
      letterSpacing: '--md-sys-typescale-headline-small-letter-spacing',
    },
    titleLarge: {
      fontFamily: '--md-sys-typescale-title-large-font-family',
      fontWeight: '--md-sys-typescale-title-large-font-weight',
      fontSize: '--md-sys-typescale-title-large-font-size',
      lineHeight: '--md-sys-typescale-title-large-line-height',
      letterSpacing: '--md-sys-typescale-title-large-letter-spacing',
    },
    titleMedium: {
      fontFamily: '--md-sys-typescale-title-medium-font-family',
      fontWeight: '--md-sys-typescale-title-medium-font-weight',
      fontSize: '--md-sys-typescale-title-medium-font-size',
      lineHeight: '--md-sys-typescale-title-medium-line-height',
      letterSpacing: '--md-sys-typescale-title-medium-letter-spacing',
    },
    titleSmall: {
      fontFamily: '--md-sys-typescale-title-small-font-family',
      fontWeight: '--md-sys-typescale-title-small-font-weight',
      fontSize: '--md-sys-typescale-title-small-font-size',
      lineHeight: '--md-sys-typescale-title-small-line-height',
      letterSpacing: '--md-sys-typescale-title-small-letter-spacing',
    },
    bodyLarge: {
      fontFamily: '--md-sys-typescale-body-large-font-family',
      fontWeight: '--md-sys-typescale-body-large-font-weight',
      fontSize: '--md-sys-typescale-body-large-font-size',
      lineHeight: '--md-sys-typescale-body-large-line-height',
      letterSpacing: '--md-sys-typescale-body-large-letter-spacing',
    },
    bodyMedium: {
      fontFamily: '--md-sys-typescale-body-medium-font-family',
      fontWeight: '--md-sys-typescale-body-medium-font-weight',
      fontSize: '--md-sys-typescale-body-medium-font-size',
      lineHeight: '--md-sys-typescale-body-medium-line-height',
      letterSpacing: '--md-sys-typescale-body-medium-letter-spacing',
    },
    bodySmall: {
      fontFamily: '--md-sys-typescale-body-small-font-family',
      fontWeight: '--md-sys-typescale-body-small-font-weight',
      fontSize: '--md-sys-typescale-body-small-font-size',
      lineHeight: '--md-sys-typescale-body-small-line-height',
      letterSpacing: '--md-sys-typescale-body-small-letter-spacing',
    },
    labelLarge: {
      fontFamily: '--md-sys-typescale-label-large-font-family',
      fontWeight: '--md-sys-typescale-label-large-font-weight',
      fontSize: '--md-sys-typescale-label-large-font-size',
      lineHeight: '--md-sys-typescale-label-large-line-height',
      letterSpacing: '--md-sys-typescale-label-large-letter-spacing',
    },
    labelMedium: {
      fontFamily: '--md-sys-typescale-label-medium-font-family',
      fontWeight: '--md-sys-typescale-label-medium-font-weight',
      fontSize: '--md-sys-typescale-label-medium-font-size',
      lineHeight: '--md-sys-typescale-label-medium-line-height',
      letterSpacing: '--md-sys-typescale-label-medium-letter-spacing',
    },
    labelSmall: {
      fontFamily: '--md-sys-typescale-label-small-font-family',
      fontWeight: '--md-sys-typescale-label-small-font-weight',
      fontSize: '--md-sys-typescale-label-small-font-size',
      lineHeight: '--md-sys-typescale-label-small-line-height',
      letterSpacing: '--md-sys-typescale-label-small-letter-spacing',
    },
  },
  
  // Colors
  colors: {
    primary: '--md-sys-color-primary',
    onPrimary: '--md-sys-color-on-primary',
    primaryContainer: '--md-sys-color-primary-container',
    onPrimaryContainer: '--md-sys-color-on-primary-container',
    secondary: '--md-sys-color-secondary',
    onSecondary: '--md-sys-color-on-secondary',
    secondaryContainer: '--md-sys-color-secondary-container',
    onSecondaryContainer: '--md-sys-color-on-secondary-container',
    tertiary: '--md-sys-color-tertiary',
    onTertiary: '--md-sys-color-on-tertiary',
    tertiaryContainer: '--md-sys-color-tertiary-container',
    onTertiaryContainer: '--md-sys-color-on-tertiary-container',
    error: '--md-sys-color-error',
    onError: '--md-sys-color-on-error',
    errorContainer: '--md-sys-color-error-container',
    onErrorContainer: '--md-sys-color-on-error-container',
    surface: '--md-sys-color-surface',
    onSurface: '--md-sys-color-on-surface',
    surfaceVariant: '--md-sys-color-surface-variant',
    onSurfaceVariant: '--md-sys-color-on-surface-variant',
    surfaceContainerLowest: '--md-sys-color-surface-container-lowest',
    surfaceContainerLow: '--md-sys-color-surface-container-low',
    surfaceContainer: '--md-sys-color-surface-container',
    surfaceContainerHigh: '--md-sys-color-surface-container-high',
    surfaceContainerHighest: '--md-sys-color-surface-container-highest',
    background: '--md-sys-color-background',
    onBackground: '--md-sys-color-on-background',
    outline: '--md-sys-color-outline',
    outlineVariant: '--md-sys-color-outline-variant',
    inverseSurface: '--md-sys-color-inverse-surface',
    inverseOnSurface: '--md-sys-color-inverse-on-surface',
    inversePrimary: '--md-sys-color-inverse-primary',
    shadow: '--md-sys-color-shadow',
    scrim: '--md-sys-color-scrim',
  },
  
  // Shapes
  shapes: {
    cornerNone: '--md-sys-shape-corner-none',
    cornerExtraSmall: '--md-sys-shape-corner-extra-small',
    cornerSmall: '--md-sys-shape-corner-small',
    cornerMedium: '--md-sys-shape-corner-medium',
    cornerLarge: '--md-sys-shape-corner-large',
    cornerExtraLarge: '--md-sys-shape-corner-extra-large',
    cornerFull: '--md-sys-shape-corner-full',
    cornerExtraSmallTop: '--md-sys-shape-corner-extra-small-top',
    cornerSmallTop: '--md-sys-shape-corner-small-top',
    cornerMediumTop: '--md-sys-shape-corner-medium-top',
    cornerLargeTop: '--md-sys-shape-corner-large-top',
    cornerAsymmetricSmall: '--md-sys-shape-corner-asymmetric-small',
    cornerAsymmetricMedium: '--md-sys-shape-corner-asymmetric-medium',
    cornerAsymmetricLarge: '--md-sys-shape-corner-asymmetric-large',
  },
  
  // Elevation
  elevation: {
    level0: '--md-sys-elevation-level0',
    level1: '--md-sys-elevation-level1',
    level2: '--md-sys-elevation-level2',
    level3: '--md-sys-elevation-level3',
    level4: '--md-sys-elevation-level4',
    level5: '--md-sys-elevation-level5',
  },
  
  // Motion
  motion: {
    easing: {
      standard: '--md-sys-motion-easing-standard',
      emphasized: '--md-sys-motion-easing-emphasized',
      emphasizedDecelerate: '--md-sys-motion-easing-emphasized-decelerate',
      emphasizedAccelerate: '--md-sys-motion-easing-emphasized-accelerate',
      legacy: '--md-sys-motion-easing-legacy',
      linear: '--md-sys-motion-easing-linear',
    },
    duration: {
      short1: '--md-sys-motion-duration-short1',
      short2: '--md-sys-motion-duration-short2',
      short3: '--md-sys-motion-duration-short3',
      short4: '--md-sys-motion-duration-short4',
      medium1: '--md-sys-motion-duration-medium1',
      medium2: '--md-sys-motion-duration-medium2',
      medium3: '--md-sys-motion-duration-medium3',
      medium4: '--md-sys-motion-duration-medium4',
      long1: '--md-sys-motion-duration-long1',
      long2: '--md-sys-motion-duration-long2',
      long3: '--md-sys-motion-duration-long3',
      long4: '--md-sys-motion-duration-long4',
      extraLong1: '--md-sys-motion-duration-extra-long1',
      extraLong2: '--md-sys-motion-duration-extra-long2',
      extraLong3: '--md-sys-motion-duration-extra-long3',
      extraLong4: '--md-sys-motion-duration-extra-long4',
    },
  },
  
  // State layers
  stateLayers: {
    hover: '--md-sys-state-hover-state-layer-opacity',
    focus: '--md-sys-state-focus-state-layer-opacity',
    pressed: '--md-sys-state-pressed-state-layer-opacity',
    dragged: '--md-sys-state-dragged-state-layer-opacity',
  },
  
  // Font weight variations
  fontWeights: {
    thin: '--md-sys-typescale-font-weight-thin',
    extraLight: '--md-sys-typescale-font-weight-extra-light',
    light: '--md-sys-typescale-font-weight-light',
    regular: '--md-sys-typescale-font-weight-regular',
    medium: '--md-sys-typescale-font-weight-medium',
    semiBold: '--md-sys-typescale-font-weight-semi-bold',
    bold: '--md-sys-typescale-font-weight-bold',
    extraBold: '--md-sys-typescale-font-weight-extra-bold',
    black: '--md-sys-typescale-font-weight-black',
  },
  
  // Typography scaling factors
  typographyScaling: {
    scaleFactor: '--md-sys-typescale-scale-factor',
    scaleFactorCompact: '--md-sys-typescale-scale-factor-compact',
    scaleFactorComfortable: '--md-sys-typescale-scale-factor-comfortable',
    scaleFactorSpacious: '--md-sys-typescale-scale-factor-spacious',
  },
  
  // Component tokens
  components: {
    filledButton: {
      containerHeight: '--md-comp-filled-button-container-height',
      containerShape: '--md-comp-filled-button-container-shape',
      labelTextFont: '--md-comp-filled-button-label-text-font',
      labelTextSize: '--md-comp-filled-button-label-text-size',
      labelTextWeight: '--md-comp-filled-button-label-text-weight',
    },
    outlinedTextField: {
      containerShape: '--md-comp-outlined-text-field-container-shape',
      inputTextFont: '--md-comp-outlined-text-field-input-text-font',
      inputTextSize: '--md-comp-outlined-text-field-input-text-size',
      labelTextFont: '--md-comp-outlined-text-field-label-text-font',
      labelTextSize: '--md-comp-outlined-text-field-label-text-size',
    },
    elevatedCard: {
      containerElevation: '--md-comp-elevated-card-container-elevation',
      containerShape: '--md-comp-elevated-card-container-shape',
      containerColor: '--md-comp-elevated-card-container-color',
    },
  },
} as const;

/**
 * Utility type to extract CSS property names
 */
export type Material3CSSPropertyName = typeof Material3CSSProperties[keyof typeof Material3CSSProperties];