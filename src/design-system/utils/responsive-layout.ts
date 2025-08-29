/**
 * Responsive layout utilities for Material 3 Expressive design
 * Provides fluid layout patterns that adapt to different screen sizes
 */

/**
 * Responsive breakpoints following Material 3 guidelines
 */
export const breakpoints = {
  xs: '0px',
  sm: '600px',   // Small tablets
  md: '905px',   // Large tablets  
  lg: '1240px',  // Laptops
  xl: '1440px',  // Desktops
} as const;

/**
 * Container size utilities for responsive layouts
 */
export function getResponsiveContainer(
  size: 'compact' | 'medium' | 'expanded' = 'medium'
): string {
  const containers = {
    compact: 'max-w-sm mx-auto px-4 sm:px-6',
    medium: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    expanded: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
  };

  return containers[size];
}

/**
 * Responsive grid utilities for Material 3 layouts
 */
export function getResponsiveGrid(
  columns: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }
): string {
  const { xs = 1, sm = xs, md = sm, lg = md, xl = lg } = columns;
  
  return [
    `grid-cols-${xs}`,
    `sm:grid-cols-${sm}`,
    `md:grid-cols-${md}`,
    `lg:grid-cols-${lg}`,
    `xl:grid-cols-${xl}`
  ].join(' ');
}

/**
 * Responsive gap utilities
 */
export function getResponsiveGap(
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string {
  const gaps = {
    xs: 'gap-2 sm:gap-3',
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-12'
  };

  return gaps[gap];
}

/**
 * Responsive padding utilities for different component types
 */
export function getResponsivePadding(
  type: 'card' | 'section' | 'container' | 'compact' = 'card'
): string {
  const paddingMap = {
    card: 'p-4 sm:p-6',
    section: 'py-8 sm:py-12 px-4 sm:px-6',
    container: 'p-6 sm:p-8 lg:p-12',
    compact: 'p-2 sm:p-3'
  };

  return paddingMap[type];
}

/**
 * Device rotation handling utilities
 */
export function getOrientationClasses(): string {
  return 'portrait:flex-col landscape:flex-row';
}

/**
 * Safe area utilities for mobile devices
 */
export function getSafeAreaClasses(): string {
  return [
    'pb-safe-bottom',  // For devices with home indicators
    'pt-safe-top',     // For devices with notches
    'pl-safe-left',    // For devices in landscape
    'pr-safe-right'    // For devices in landscape
  ].join(' ');
}

/**
 * Touch-friendly spacing for interactive elements
 */
export function getTouchSpacing(density: 'comfortable' | 'compact' = 'comfortable'): string {
  return density === 'comfortable' 
    ? 'space-y-3 sm:space-y-2'  // More space on mobile
    : 'space-y-2 sm:space-y-1'; // Compact spacing
}

/**
 * Responsive typography that scales appropriately for mobile
 */
export function getResponsiveTypography(
  scale: 'display' | 'headline' | 'title' | 'body' | 'label'
): string {
  const typographyMap = {
    display: 'text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight',
    headline: 'text-2xl sm:text-3xl lg:text-4xl font-normal',
    title: 'text-xl sm:text-2xl lg:text-3xl font-medium',
    body: 'text-base sm:text-lg leading-relaxed',
    label: 'text-sm sm:text-base font-medium'
  };

  return typographyMap[scale];
}

/**
 * Responsive elevation that adapts to screen size
 */
export function getResponsiveElevation(
  level: 1 | 2 | 3 | 4 | 5 = 1
): string {
  // Mobile devices use lighter shadows to maintain battery life
  const elevationMap = {
    1: 'shadow-sm sm:shadow-md',
    2: 'shadow-md sm:shadow-lg',
    3: 'shadow-lg sm:shadow-xl',
    4: 'shadow-xl sm:shadow-2xl',
    5: 'shadow-2xl sm:shadow-2xl'
  };

  return elevationMap[level];
}

/**
 * Responsive focus indicators for better accessibility
 */
export function getResponsiveFocus(): string {
  return [
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-primary',
    // Larger focus ring on mobile for easier visibility
    'sm:focus-visible:outline-2',
    'focus-visible:outline-4 sm:focus-visible:outline-2'
  ].join(' ');
}

/**
 * Responsive modal/dialog sizing
 */
export function getResponsiveModal(
  size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string {
  const sizeMap = {
    sm: 'w-full max-w-sm mx-4 sm:mx-auto',
    md: 'w-full max-w-md mx-4 sm:max-w-lg sm:mx-auto',
    lg: 'w-full max-w-lg mx-4 sm:max-w-2xl sm:mx-auto',
    xl: 'w-full max-w-xl mx-4 sm:max-w-4xl sm:mx-auto'
  };

  return sizeMap[size];
}