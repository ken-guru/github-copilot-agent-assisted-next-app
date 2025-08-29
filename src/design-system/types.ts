/**
 * Material 3 Design System TypeScript Definitions
 * 
 * Type definitions for Material 3 Expressive design tokens and utilities.
 * Provides type safety and IntelliSense support for design system usage.
 */

export type Material3TypographyScale = 
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small';

export type Material3ColorRole = 
  | 'primary'
  | 'on-primary'
  | 'primary-container'
  | 'on-primary-container'
  | 'secondary'
  | 'on-secondary'
  | 'secondary-container'
  | 'on-secondary-container'
  | 'tertiary'
  | 'on-tertiary'
  | 'tertiary-container'
  | 'on-tertiary-container'
  | 'error'
  | 'on-error'
  | 'error-container'
  | 'on-error-container'
  | 'surface'
  | 'on-surface'
  | 'surface-variant'
  | 'on-surface-variant'
  | 'background'
  | 'on-background'
  | 'outline'
  | 'outline-variant'
  | 'inverse-surface'
  | 'inverse-on-surface'
  | 'inverse-primary'
  | 'shadow'
  | 'scrim'
  | 'success'
  | 'on-success'
  | 'success-container'
  | 'on-success-container'
  | 'warning'
  | 'on-warning'
  | 'warning-container'
  | 'on-warning-container'
  | 'info'
  | 'on-info'
  | 'info-container'
  | 'on-info-container';

export type Material3SurfaceLevel = 
  | 'surface'
  | 'surface-variant'
  | 'surface-container'
  | 'surface-container-low'
  | 'surface-container-high'
  | 'surface-container-highest'
  | 'surface-container-lowest';

export type Material3ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type Material3ShapeSize = 
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

export type Material3ShapeExpressive = 
  | 'xs-expressive'
  | 'sm-expressive'
  | 'md-expressive'
  | 'lg-expressive'
  | 'xl-expressive';

export type Material3MotionEasing = 
  | 'linear'
  | 'standard'
  | 'standard-accelerate'
  | 'standard-decelerate'
  | 'emphasized'
  | 'emphasized-accelerate'
  | 'emphasized-decelerate'
  | 'expressive-standard'
  | 'expressive-entrance'
  | 'expressive-exit'
  | 'expressive-bounce'
  | 'expressive-elastic'
  | 'expressive-back'
  | 'legacy'
  | 'legacy-accelerate'
  | 'legacy-decelerate';

export type Material3MotionDuration = 
  | 'short1'
  | 'short2'
  | 'short3'
  | 'short4'
  | 'medium1'
  | 'medium2'
  | 'medium3'
  | 'medium4'
  | 'long1'
  | 'long2'
  | 'long3'
  | 'long4'
  | 'extra-long1'
  | 'extra-long2'
  | 'extra-long3'
  | 'extra-long4';

export type Material3Spacing = 
  | 'none'
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large'
  | 'extra-extra-large'
  | 'extra-extra-extra-large';

export type Material3StateLayer = 
  | 'hover'
  | 'focus'
  | 'pressed'
  | 'dragged'
  | 'disabled';

// Animation and motion configuration interfaces
export interface Material3MotionConfig {
  duration?: Material3MotionDuration;
  easing?: Material3MotionEasing;
  properties?: string[];
  fill?: FillMode;
  iterations?: number;
}

export type Material3AnimationState = 
  | 'idle'
  | 'running'
  | 'paused'
  | 'finished';

export type Material3Breakpoint = 
  | 'compact'
  | 'medium'
  | 'expanded'
  | 'large'
  | 'extra-large';

// Utility type for generating CSS class names
export type Material3ClassName<T extends string> = `m3-${T}`;

// Typography class names
export type Material3TypographyClassName = Material3ClassName<Material3TypographyScale>;

// Color class names
export type Material3ColorClassName = 
  | Material3ClassName<`color-${Material3ColorRole}`>
  | Material3ClassName<`bg-${Material3ColorRole}`>;

// Surface class names
export type Material3SurfaceClassName = Material3ClassName<Material3SurfaceLevel>;

// Elevation class names
export type Material3ElevationClassName = Material3ClassName<`elevation-${Material3ElevationLevel}`>;

// Shape class names
export type Material3ShapeClassName = 
  | Material3ClassName<`shape-${Material3ShapeSize}`>
  | Material3ClassName<`shape-${Material3ShapeExpressive}`>;

// Motion class names
export type Material3MotionClassName = 
  | Material3ClassName<`motion-${Material3MotionEasing}`>
  | Material3ClassName<`duration-${Material3MotionDuration}`>;

// Tonal palette interface
export interface Material3TonalPalette {
  0?: string;
  10?: string;
  20?: string;
  30?: string;
  40?: string;
  50?: string;
  60?: string;
  70?: string;
  80?: string;
  90?: string;
  95?: string;
  99?: string;
  100?: string;
}

// Color scheme interface
export interface Material3ColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  background: string;
  onBackground: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

// Typography configuration interface
export interface Material3TypographyConfig {
  scale: Material3TypographyScale;
  weight?: 'normal' | 'medium' | 'bold';
  responsive?: boolean;
  className?: string;
}

// Component state interface
export interface Material3ComponentState {
  elevation?: Material3ElevationLevel;
  surface?: Material3SurfaceLevel;
  shape?: Material3ShapeSize | Material3ShapeExpressive;
  colorRole?: Material3ColorRole;
  disabled?: boolean;
  focused?: boolean;
  hovered?: boolean;
  pressed?: boolean;
}

// Design token interface
export interface Material3DesignTokens {
  typography: {
    [K in Material3TypographyScale]: {
      font: string;
      weight: number;
      size: string;
      lineHeight: string;
      tracking: string;
    }
  };
  colors: {
    [K in Material3ColorRole]: string;
  };
  shapes: {
    [K in Material3ShapeSize | Material3ShapeExpressive]: string;
  };
  elevation: {
    [K in Material3ElevationLevel]: string;
  };
  motion: {
    easing: {
      [K in Material3MotionEasing]: string;
    };
    duration: {
      [K in Material3MotionDuration]: string;
    };
  };
  spacing: {
    [K in Material3Spacing]: string;
  };
}

// Theme interface
export interface Material3Theme {
  mode: 'light' | 'dark';
  colors: Material3DesignTokens['colors'];
  typography: Material3DesignTokens['typography'];
  shapes: Material3DesignTokens['shapes'];
  elevation: Material3DesignTokens['elevation'];
  motion: Material3DesignTokens['motion'];
  spacing: Material3DesignTokens['spacing'];
}

// CSS Custom Property names
export type Material3CSSProperty = 
  | `--m3-typescale-${Material3TypographyScale}-${'font' | 'weight' | 'size' | 'line-height' | 'tracking'}`
  | `--m3-color-${Material3ColorRole}`
  | `--m3-shape-corner-${Material3ShapeSize | Material3ShapeExpressive}`
  | `--m3-elevation-${Material3ElevationLevel}`
  | `--m3-motion-easing-${Material3MotionEasing}`
  | `--m3-motion-duration-${Material3MotionDuration}`
  | `--m3-space-${Material3Spacing}`;

// Helper functions type definitions
export interface Material3Utilities {
  getTypographyClass(scale: Material3TypographyScale): Material3TypographyClassName;
  getColorClass(role: Material3ColorRole, type?: 'color' | 'bg'): Material3ColorClassName;
  getSurfaceClass(level: Material3SurfaceLevel): Material3SurfaceClassName;
  getElevationClass(level: Material3ElevationLevel): Material3ElevationClassName;
  getShapeClass(size: Material3ShapeSize | Material3ShapeExpressive): Material3ShapeClassName;
  getMotionClass(type: 'easing' | 'duration', value: Material3MotionEasing | Material3MotionDuration): Material3MotionClassName;
  getCSSProperty(property: Material3CSSProperty): string;
  applyState(element: HTMLElement, state: Material3ComponentState): void;
}

declare global {
  interface CSSStyleDeclaration {
    // Material 3 CSS custom properties are accessible via getPropertyValue()
    getPropertyValue(property: Material3CSSProperty): string;
    setProperty(property: Material3CSSProperty, value: string, priority?: string): void;
  }
}