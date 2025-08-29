/**
 * Material 3 Typography Utilities
 * 
 * JavaScript utilities for working with the Material 3 typography system.
 * Provides helper functions for applying typography classes and responsive behavior.
 */

import type { 
  Material3TypographyScale, 
  Material3TypographyClassName
} from './types';

/**
 * Get the appropriate typography class name for a given scale
 */
export function getTypographyClass(scale: Material3TypographyScale): Material3TypographyClassName {
  return `m3-${scale}` as Material3TypographyClassName;
}

/**
 * Get expressive variant of typography class
 */
export function getExpressiveTypographyClass(scale: 'display-large' | 'headline-large' | 'title-large' | 'body-large'): string {
  return `m3-${scale}-expressive`;
}

/**
 * Get semantic typography class for common use cases
 */
export function getSemanticTypographyClass(semantic: 'page-title' | 'section-title' | 'subsection-title' | 'card-title' | 'card-subtitle' | 'component-title' | 'paragraph' | 'caption' | 'helper-text' | 'button-text' | 'form-label' | 'input-label'): string {
  return `m3-${semantic}`;
}

/**
 * Get status text class for feedback messages
 */
export function getStatusTextClass(status: 'error' | 'success' | 'warning' | 'info'): string {
  return `m3-${status}-text`;
}

/**
 * Apply responsive typography to an element based on screen size
 */
export function applyResponsiveTypography(element: HTMLElement, baseScale: Material3TypographyScale): void {
  // Remove any existing typography classes
  element.className = element.className.replace(/m3-[a-z-]+(?:-[a-z]+)*/g, '');
  
  // Apply base typography class
  element.classList.add(getTypographyClass(baseScale));
  
  // Add responsive behavior through CSS classes
  element.classList.add('m3-responsive-typography');
}

/**
 * Create a typography configuration object for dynamic styling
 */
export interface TypographyConfig {
  scale: Material3TypographyScale;
  expressive?: boolean;
  semantic?: string;
  responsive?: boolean;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  decoration?: 'none' | 'underline' | 'line-through';
  overflow?: 'truncate' | 'wrap' | 'nowrap';
}

/**
 * Apply typography configuration to an element
 */
export function applyTypographyConfig(element: HTMLElement, config: TypographyConfig): void {
  // Clear existing typography classes
  element.className = element.className.replace(/m3-[a-z-]+(?:-[a-z]+)*/g, '');
  
  // Apply base typography
  if (config.expressive && ['display-large', 'headline-large', 'title-large', 'body-large'].includes(config.scale)) {
    element.classList.add(getExpressiveTypographyClass(config.scale as 'display-large' | 'headline-large' | 'title-large' | 'body-large'));
  } else {
    element.classList.add(getTypographyClass(config.scale));
  }
  
  // Apply semantic class if specified
  if (config.semantic) {
    element.classList.add(`m3-${config.semantic}`);
  }
  
  // Apply utility classes
  if (config.align) {
    element.classList.add(`m3-text-${config.align}`);
  }
  
  if (config.transform && config.transform !== 'none') {
    element.classList.add(`m3-text-${config.transform}`);
  }
  
  if (config.weight && config.weight !== 'regular') {
    element.classList.add(`m3-font-${config.weight}`);
  }
  
  if (config.decoration && config.decoration !== 'none') {
    if (config.decoration === 'line-through') {
      element.classList.add('m3-line-through');
    } else {
      element.classList.add(`m3-${config.decoration}`);
    }
  }
  
  if (config.overflow) {
    if (config.overflow === 'wrap') {
      element.classList.add('m3-text-wrap');
    } else if (config.overflow === 'nowrap') {
      element.classList.add('m3-text-nowrap');
    } else {
      element.classList.add('m3-truncate');
    }
  }
  
  // Apply responsive behavior
  if (config.responsive) {
    element.classList.add('m3-responsive-typography');
  }
  
  // Apply custom color if specified
  if (config.color) {
    element.style.color = config.color;
  }
}

/**
 * Get typography token value from CSS custom properties
 */
export function getTypographyToken(scale: Material3TypographyScale, property: 'font' | 'weight' | 'size' | 'line-height' | 'tracking'): string {
  if (typeof window === 'undefined' || !document.documentElement) {
    return '';
  }
  
  const tokenName = `--m3-typescale-${scale}-${property}`;
  return window.getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();
}

/**
 * Set typography token value (useful for theming)
 */
export function setTypographyToken(scale: Material3TypographyScale, property: 'font' | 'weight' | 'size' | 'line-height' | 'tracking', value: string): void {
  if (typeof window === 'undefined' || !document.documentElement) {
    return;
  }
  
  const tokenName = `--m3-typescale-${scale}-${property}`;
  document.documentElement.style.setProperty(tokenName, value);
}

/**
 * Check if an element has a specific typography class
 */
export function hasTypographyClass(element: HTMLElement, scale: Material3TypographyScale): boolean {
  return element.classList.contains(getTypographyClass(scale));
}

/**
 * Get the current typography scale applied to an element
 */
export function getCurrentTypographyScale(element: HTMLElement): Material3TypographyScale | null {
  const scales: Material3TypographyScale[] = [
    'display-large', 'display-medium', 'display-small',
    'headline-large', 'headline-medium', 'headline-small',
    'title-large', 'title-medium', 'title-small',
    'body-large', 'body-medium', 'body-small',
    'label-large', 'label-medium', 'label-small'
  ];
  
  for (const scale of scales) {
    if (hasTypographyClass(element, scale)) {
      return scale;
    }
  }
  
  return null;
}

/**
 * Create a typography style object for CSS-in-JS solutions
 */
export function createTypographyStyle(config: TypographyConfig): Record<string, string> {
  const style: Record<string, string> = {};
  
  // Get base typography properties
  const font = getTypographyToken(config.scale, 'font');
  const weight = getTypographyToken(config.scale, 'weight');
  const size = getTypographyToken(config.scale, 'size');
  const lineHeight = getTypographyToken(config.scale, 'line-height');
  const tracking = getTypographyToken(config.scale, 'tracking');
  
  if (font) style.font = font;
  if (weight) style.fontWeight = weight;
  if (size) style.fontSize = size;
  if (lineHeight) style.lineHeight = lineHeight;
  if (tracking) style.letterSpacing = tracking;
  
  // Apply configuration overrides
  if (config.color) {
    style.color = config.color;
  }
  
  if (config.align) {
    style.textAlign = config.align;
  }
  
  if (config.transform && config.transform !== 'none') {
    style.textTransform = config.transform;
  }
  
  if (config.weight && config.weight !== 'regular') {
    const weightMap = {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    };
    style.fontWeight = weightMap[config.weight];
  }
  
  if (config.decoration && config.decoration !== 'none') {
    style.textDecoration = config.decoration;
  }
  
  if (config.overflow) {
    if (config.overflow === 'truncate') {
      style.overflow = 'hidden';
      style.textOverflow = 'ellipsis';
      style.whiteSpace = 'nowrap';
    } else if (config.overflow === 'wrap') {
      style.wordWrap = 'break-word';
      style.overflowWrap = 'break-word';
    } else if (config.overflow === 'nowrap') {
      style.whiteSpace = 'nowrap';
    }
  }
  
  return style;
}

/**
 * Validate typography scale
 */
export function isValidTypographyScale(scale: string): scale is Material3TypographyScale {
  const validScales: Material3TypographyScale[] = [
    'display-large', 'display-medium', 'display-small',
    'headline-large', 'headline-medium', 'headline-small',
    'title-large', 'title-medium', 'title-small',
    'body-large', 'body-medium', 'body-small',
    'label-large', 'label-medium', 'label-small'
  ];
  
  return validScales.includes(scale as Material3TypographyScale);
}

/**
 * Typography system constants
 */
export const TYPOGRAPHY_SCALES = {
  DISPLAY: ['display-large', 'display-medium', 'display-small'] as const,
  HEADLINE: ['headline-large', 'headline-medium', 'headline-small'] as const,
  TITLE: ['title-large', 'title-medium', 'title-small'] as const,
  BODY: ['body-large', 'body-medium', 'body-small'] as const,
  LABEL: ['label-large', 'label-medium', 'label-small'] as const,
} as const;

export const SEMANTIC_CLASSES = {
  HEADERS: ['page-title', 'section-title', 'subsection-title'] as const,
  COMPONENTS: ['card-title', 'card-subtitle', 'component-title'] as const,
  CONTENT: ['paragraph', 'caption', 'helper-text'] as const,
  INTERACTIVE: ['button-text', 'form-label', 'input-label'] as const,
  STATUS: ['error-text', 'success-text', 'warning-text', 'info-text'] as const,
} as const;