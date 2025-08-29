/**
 * Accessibility utilities for Material 3 Expressive design
 * Ensures WCAG AA compliance and enhanced accessibility features
 */

export interface ContrastRatio {
  ratio: number;
  level: 'AA' | 'AAA' | 'FAIL';
  isLargeText?: boolean;
}

export interface ColorAccessibility {
  hex: string;
  rgb: { r: number; g: number; b: number };
  luminance: number;
  contrastWith: (color: string) => ContrastRatio;
}

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 specification
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): ContrastRatio {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    return { ratio: 0, level: 'FAIL' };
  }
  
  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  let level: 'AA' | 'AAA' | 'FAIL' = 'FAIL';
  if (ratio >= 7) {
    level = 'AAA';
  } else if (ratio >= 4.5) {
    level = 'AA';
  }
  
  return { ratio, level };
}

/**
 * Validate color combinations for WCAG AA compliance
 */
export function validateColorCombination(
  foreground: string,
  background: string,
  isLargeText = false
): ContrastRatio {
  const contrast = getContrastRatio(foreground, background);
  
  // Large text has lower contrast requirements
  if (isLargeText) {
    if (contrast.ratio >= 4.5) {
      contrast.level = 'AAA';
    } else if (contrast.ratio >= 3) {
      contrast.level = 'AA';
    } else {
      contrast.level = 'FAIL';
    }
  }
  
  contrast.isLargeText = isLargeText;
  return contrast;
}

/**
 * Get accessible color suggestions for Material 3 tokens
 */
export function getAccessibleColorSuggestions(baseColor: string): {
  onColor: string;
  containerColor: string;
  onContainerColor: string;
} {
  // This is a simplified implementation
  // In a real app, you'd use the Material 3 color algorithm
  const rgb = hexToRgb(baseColor);
  if (!rgb) {
    return {
      onColor: '#ffffff',
      containerColor: '#f5f5f5',
      onContainerColor: '#000000'
    };
  }
  
  const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  
  return {
    onColor: luminance > 0.5 ? '#000000' : '#ffffff',
    containerColor: luminance > 0.5 ? '#f0f0f0' : '#2a2a2a',
    onContainerColor: luminance > 0.5 ? '#000000' : '#ffffff'
  };
}

/**
 * Focus management utilities
 */
export interface FocusOptions {
  preventScroll?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
}

export class FocusManager {
  private previouslyFocused: HTMLElement | null = null;
  private focusTrap: HTMLElement | null = null;
  
  /**
   * Set focus to an element with options
   */
  setFocus(element: HTMLElement | null, options: FocusOptions = {}): void {
    if (!element) return;
    
    if (options.restoreFocus && document.activeElement instanceof HTMLElement) {
      this.previouslyFocused = document.activeElement;
    }
    
    element.focus({ preventScroll: options.preventScroll });
  }
  
  /**
   * Restore focus to previously focused element
   */
  restoreFocus(): void {
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }
  }
  
  /**
   * Create focus trap for modal dialogs
   */
  trapFocus(container: HTMLElement): void {
    this.focusTrap = container;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
  }
  
  /**
   * Release focus trap
   */
  releaseFocusTrap(): void {
    this.focusTrap = null;
  }
}

/**
 * Screen reader utilities
 */
export class ScreenReaderUtils {
  private announcer: HTMLElement | null = null;
  
  constructor() {
    this.createAnnouncer();
  }
  
  private createAnnouncer(): void {
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    
    document.body.appendChild(this.announcer);
  }
  
  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcer) return;
    
    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = '';
      }
    }, 1000);
  }
}

/**
 * Reduced motion utilities
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getMotionPreference(): 'reduce' | 'no-preference' {
  return prefersReducedMotion() ? 'reduce' : 'no-preference';
}

/**
 * Keyboard navigation utilities
 */
export interface KeyboardNavigationOptions {
  wrap?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  activateOnFocus?: boolean;
}

export class KeyboardNavigation {
  private elements: HTMLElement[] = [];
  private currentIndex = 0;
  private options: KeyboardNavigationOptions;
  
  constructor(
    container: HTMLElement,
    selector: string,
    options: KeyboardNavigationOptions = {}
  ) {
    this.options = {
      wrap: true,
      orientation: 'both',
      activateOnFocus: false,
      ...options
    };
    
    this.updateElements(container, selector);
    this.bindEvents(container);
  }
  
  private updateElements(container: HTMLElement, selector: string): void {
    this.elements = Array.from(container.querySelectorAll(selector));
  }
  
  private bindEvents(container: HTMLElement): void {
    container.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  private handleKeyDown(event: KeyboardEvent): void {
    const { key } = event;
    const { orientation, wrap } = this.options;
    
    let handled = false;
    
    switch (key) {
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          this.moveNext(wrap);
          handled = true;
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          this.movePrevious(wrap);
          handled = true;
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          this.moveNext(wrap);
          handled = true;
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          this.movePrevious(wrap);
          handled = true;
        }
        break;
      case 'Home':
        this.moveToFirst();
        handled = true;
        break;
      case 'End':
        this.moveToLast();
        handled = true;
        break;
    }
    
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  
  private moveNext(wrap: boolean): void {
    if (this.currentIndex < this.elements.length - 1) {
      this.currentIndex++;
    } else if (wrap) {
      this.currentIndex = 0;
    }
    this.focusCurrent();
  }
  
  private movePrevious(wrap: boolean): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (wrap) {
      this.currentIndex = this.elements.length - 1;
    }
    this.focusCurrent();
  }
  
  private moveToFirst(): void {
    this.currentIndex = 0;
    this.focusCurrent();
  }
  
  private moveToLast(): void {
    this.currentIndex = this.elements.length - 1;
    this.focusCurrent();
  }
  
  private focusCurrent(): void {
    const element = this.elements[this.currentIndex];
    if (element) {
      element.focus();
      if (this.options.activateOnFocus) {
        element.click();
      }
    }
  }
}

// Global instances
export const focusManager = new FocusManager();
export const screenReader = new ScreenReaderUtils();