/**
 * Material 3 Expressive accessibility enhancements
 * Provides accessibility features specific to Material 3 design system
 */

import { 
  validateColorCombination, 
  prefersReducedMotion,
  focusManager,
  screenReader,
  type ContrastRatio 
} from './accessibility-utils';

export interface Material3AccessibilityConfig {
  respectReducedMotion: boolean;
  enforceContrastRatios: boolean;
  enhancedFocusIndicators: boolean;
  screenReaderOptimizations: boolean;
  keyboardNavigationEnhancements: boolean;
}

export const defaultAccessibilityConfig: Material3AccessibilityConfig = {
  respectReducedMotion: true,
  enforceContrastRatios: true,
  enhancedFocusIndicators: true,
  screenReaderOptimizations: true,
  keyboardNavigationEnhancements: true,
};

/**
 * Material 3 color accessibility validator
 */
export class Material3ColorAccessibility {
  private config: Material3AccessibilityConfig;
  
  constructor(config: Material3AccessibilityConfig = defaultAccessibilityConfig) {
    this.config = config;
  }
  
  /**
   * Validate Material 3 color tokens for accessibility
   */
  validateColorTokens(tokens: Record<string, string>): Record<string, ContrastRatio[]> {
    const results: Record<string, ContrastRatio[]> = {};
    
    // Common color combinations to test
    const combinations = [
      ['primary', 'onPrimary'],
      ['secondary', 'onSecondary'],
      ['tertiary', 'onTertiary'],
      ['surface', 'onSurface'],
      ['surfaceVariant', 'onSurfaceVariant'],
      ['primaryContainer', 'onPrimaryContainer'],
      ['secondaryContainer', 'onSecondaryContainer'],
      ['tertiaryContainer', 'onTertiaryContainer'],
      ['error', 'onError'],
      ['errorContainer', 'onErrorContainer'],
    ];
    
    combinations.forEach(([bg, fg]) => {
      if (tokens[bg] && tokens[fg]) {
        const contrast = validateColorCombination(tokens[fg], tokens[bg]);
        if (!results[bg]) results[bg] = [];
        results[bg].push(contrast);
      }
    });
    
    return results;
  }
  
  /**
   * Get accessible focus ring color based on background
   */
  getFocusRingColor(backgroundColor: string): string {
    const contrast = validateColorCombination('#0066cc', backgroundColor);
    
    if (contrast.level === 'FAIL') {
      // Use high contrast alternative
      const bgLuminance = this.getColorLuminance(backgroundColor);
      return bgLuminance > 0.5 ? '#000000' : '#ffffff';
    }
    
    return '#0066cc'; // Default Material 3 focus color
  }
  
  private getColorLuminance(color: string): number {
    // Simplified luminance calculation
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
}

/**
 * Material 3 focus management
 */
export class Material3FocusManager {
  private static instance: Material3FocusManager;
  private focusRingObserver: MutationObserver | null = null;
  
  static getInstance(): Material3FocusManager {
    if (!Material3FocusManager.instance) {
      Material3FocusManager.instance = new Material3FocusManager();
    }
    return Material3FocusManager.instance;
  }
  
  /**
   * Initialize Material 3 focus enhancements
   */
  initialize(): void {
    this.addGlobalFocusStyles();
    this.enhanceFocusIndicators();
    this.setupKeyboardNavigation();
  }
  
  private addGlobalFocusStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* Material 3 Expressive focus indicators */
      .m3-focus-ring {
        position: relative;
        outline: none;
      }
      
      .m3-focus-ring::after {
        content: '';
        position: absolute;
        inset: -2px;
        border: 2px solid var(--md-sys-color-primary);
        border-radius: inherit;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 150ms cubic-bezier(0.2, 0, 0, 1),
                    transform 150ms cubic-bezier(0.2, 0, 0, 1);
        pointer-events: none;
      }
      
      .m3-focus-ring:focus-visible::after {
        opacity: 1;
        transform: scale(1);
      }
      
      /* Reduced motion alternative */
      @media (prefers-reduced-motion: reduce) {
        .m3-focus-ring::after {
          transition: opacity 0ms, transform 0ms;
        }
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .m3-focus-ring::after {
          border-width: 3px;
          border-color: Highlight;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  private enhanceFocusIndicators(): void {
    // Add focus ring class to interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    interactiveElements.forEach(element => {
      if (!element.classList.contains('m3-focus-ring')) {
        element.classList.add('m3-focus-ring');
      }
    });
    
    // Observe for new interactive elements
    this.focusRingObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const interactives = element.querySelectorAll(
              'button, [role="button"], input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
            );
            
            interactives.forEach(interactive => {
              if (!interactive.classList.contains('m3-focus-ring')) {
                interactive.classList.add('m3-focus-ring');
              }
            });
          }
        });
      });
    });
    
    this.focusRingObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  private setupKeyboardNavigation(): void {
    // Enhanced keyboard navigation for Material 3 components
    document.addEventListener('keydown', (event) => {
      const target = event.target as HTMLElement;
      
      // Handle escape key for dismissible components
      if (event.key === 'Escape') {
        const dismissible = target.closest('[data-dismissible]');
        if (dismissible) {
          const closeButton = dismissible.querySelector('[data-dismiss]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      }
      
      // Handle enter/space for custom interactive elements
      if ((event.key === 'Enter' || event.key === ' ') && target.hasAttribute('role')) {
        const role = target.getAttribute('role');
        if (role === 'button' || role === 'tab' || role === 'option') {
          event.preventDefault();
          target.click();
        }
      }
    });
  }
  
  /**
   * Clean up focus manager
   */
  destroy(): void {
    if (this.focusRingObserver) {
      this.focusRingObserver.disconnect();
      this.focusRingObserver = null;
    }
  }
}

/**
 * Material 3 motion accessibility
 */
export class Material3MotionAccessibility {
  private reducedMotionMediaQuery: MediaQueryList;
  private motionElements: Set<HTMLElement> = new Set();
  
  constructor() {
    this.reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotionMediaQuery.addEventListener('change', this.handleMotionPreferenceChange.bind(this));
    this.initialize();
  }
  
  private initialize(): void {
    this.addMotionStyles();
    this.handleMotionPreferenceChange();
  }
  
  private addMotionStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* Material 3 motion with reduced motion support */
      .m3-motion-standard {
        transition: all 300ms cubic-bezier(0.2, 0, 0, 1);
      }
      
      .m3-motion-emphasized {
        transition: all 500ms cubic-bezier(0.05, 0.7, 0.1, 1);
      }
      
      .m3-motion-decelerated {
        transition: all 400ms cubic-bezier(0, 0, 0, 1);
      }
      
      .m3-motion-accelerated {
        transition: all 200ms cubic-bezier(0.3, 0, 1, 1);
      }
      
      /* Reduced motion alternatives */
      @media (prefers-reduced-motion: reduce) {
        .m3-motion-standard,
        .m3-motion-emphasized,
        .m3-motion-decelerated,
        .m3-motion-accelerated {
          transition: none;
        }
        
        .m3-motion-essential {
          transition: opacity 150ms ease;
        }
      }
      
      /* High contrast mode adjustments */
      @media (prefers-contrast: high) {
        .m3-motion-standard,
        .m3-motion-emphasized,
        .m3-motion-decelerated,
        .m3-motion-accelerated {
          transition-duration: 150ms;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  private handleMotionPreferenceChange(): void {
    const prefersReduced = this.reducedMotionMediaQuery.matches;
    
    document.body.classList.toggle('prefers-reduced-motion', prefersReduced);
    
    // Announce motion preference change
    screenReader.announce(
      prefersReduced 
        ? 'Animations have been reduced for better accessibility'
        : 'Full animations are now enabled',
      'polite'
    );
  }
  
  /**
   * Register element for motion accessibility
   */
  registerMotionElement(element: HTMLElement, motionType: string): void {
    this.motionElements.add(element);
    element.classList.add(`m3-motion-${motionType}`);
    
    // Add reduced motion alternative if needed
    if (this.reducedMotionMediaQuery.matches) {
      element.classList.add('m3-motion-reduced');
    }
  }
  
  /**
   * Unregister element from motion accessibility
   */
  unregisterMotionElement(element: HTMLElement): void {
    this.motionElements.delete(element);
  }
}

/**
 * Material 3 ARIA enhancements
 */
export class Material3AriaEnhancements {
  /**
   * Enhance button with proper ARIA attributes
   */
  static enhanceButton(button: HTMLElement, options: {
    label?: string;
    describedBy?: string;
    pressed?: boolean;
    expanded?: boolean;
    controls?: string;
  } = {}): void {
    if (options.label) {
      button.setAttribute('aria-label', options.label);
    }
    
    if (options.describedBy) {
      button.setAttribute('aria-describedby', options.describedBy);
    }
    
    if (typeof options.pressed === 'boolean') {
      button.setAttribute('aria-pressed', options.pressed.toString());
    }
    
    if (typeof options.expanded === 'boolean') {
      button.setAttribute('aria-expanded', options.expanded.toString());
    }
    
    if (options.controls) {
      button.setAttribute('aria-controls', options.controls);
    }
  }
  
  /**
   * Enhance form field with proper ARIA attributes
   */
  static enhanceFormField(field: HTMLElement, options: {
    label?: string;
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
    errorMessage?: string;
  } = {}): void {
    if (options.label) {
      field.setAttribute('aria-label', options.label);
    }
    
    if (options.required) {
      field.setAttribute('aria-required', 'true');
    }
    
    if (typeof options.invalid === 'boolean') {
      field.setAttribute('aria-invalid', options.invalid.toString());
    }
    
    if (options.describedBy) {
      field.setAttribute('aria-describedby', options.describedBy);
    }
    
    if (options.errorMessage && options.invalid) {
      const errorId = `${field.id || 'field'}-error`;
      let errorElement = document.getElementById(errorId);
      
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'sr-only';
        errorElement.setAttribute('role', 'alert');
        field.parentNode?.appendChild(errorElement);
      }
      
      errorElement.textContent = options.errorMessage;
      field.setAttribute('aria-describedby', 
        [options.describedBy, errorId].filter(Boolean).join(' ')
      );
    }
  }
  
  /**
   * Create live region for dynamic content announcements
   */
  static createLiveRegion(id: string, priority: 'polite' | 'assertive' = 'polite'): HTMLElement {
    let liveRegion = document.getElementById(id);
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = id;
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = `
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
      
      document.body.appendChild(liveRegion);
    }
    
    return liveRegion;
  }
}

// Initialize Material 3 accessibility enhancements
export function initializeMaterial3Accessibility(
  config: Partial<Material3AccessibilityConfig> = {}
): void {
  const fullConfig = { ...defaultAccessibilityConfig, ...config };
  
  if (fullConfig.enhancedFocusIndicators) {
    Material3FocusManager.getInstance().initialize();
  }
  
  if (fullConfig.respectReducedMotion) {
    new Material3MotionAccessibility();
  }
  
  // Create global live regions
  Material3AriaEnhancements.createLiveRegion('m3-announcements', 'polite');
  Material3AriaEnhancements.createLiveRegion('m3-alerts', 'assertive');
  
  // Announce initialization
  screenReader.announce('Material 3 accessibility enhancements loaded', 'polite');
}

// Export instances
export const material3ColorAccessibility = new Material3ColorAccessibility();
export const material3FocusManager = Material3FocusManager.getInstance();