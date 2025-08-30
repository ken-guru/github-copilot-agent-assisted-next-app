import React from 'react';

/**
 * Focus Management System for Material 3 Components
 * 
 * Comprehensive focus management with visible focus indicators,
 * focus trapping for modals, and keyboard navigation support.
 */

/**
 * Focus trap utility for modal dialogs and overlays
 */
export class FocusTrap {
  private element: HTMLElement;
  private previouslyFocusedElement: HTMLElement | null = null;
  private focusableSelector = 
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), details, summary';

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Get all focusable elements within the trap
   */
  private getFocusableElements(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll(this.focusableSelector)
    ).filter(el => {
      return el instanceof HTMLElement && 
             !el.hasAttribute('disabled') && 
             !el.getAttribute('aria-hidden') &&
             el.offsetParent !== null; // Visible elements only
    }) as HTMLElement[];
  }

  /**
   * Handle Tab key navigation within trap
   */
  private handleTabKey = (event: KeyboardEvent): void => {
    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey) {
      // Shift + Tab - moving backwards
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab - moving forwards
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  /**
   * Handle Escape key to close modal
   */
  private handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.deactivate();
    }
  };

  /**
   * Handle all keyboard events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'Tab':
        this.handleTabKey(event);
        break;
      case 'Escape':
        this.handleEscapeKey(event);
        break;
    }
  };

  /**
   * Activate the focus trap
   */
  activate(): void {
    // Store the currently focused element
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Add event listeners
    document.addEventListener('keydown', this.handleKeyDown);

    // Focus the first focusable element
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    }
  }

  /**
   * Deactivate the focus trap
   */
  deactivate(): void {
    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyDown);

    // Restore focus to previously focused element
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }
}

/**
 * Focus indicator styles with Material 3 design
 */
export const Material3FocusIndicators = {
  /**
   * Primary focus ring style
   */
  primary: {
    outline: '2px solid rgb(103, 80, 164)',
    outlineOffset: '2px',
    borderRadius: '4px',
    transition: 'outline 150ms cubic-bezier(0.2, 0, 0, 1)'
  },

  /**
   * High contrast focus ring
   */
  highContrast: {
    outline: '3px solid currentColor',
    outlineOffset: '2px',
    borderRadius: '4px',
    transition: 'outline 150ms cubic-bezier(0.2, 0, 0, 1)'
  },

  /**
   * Focus ring for dark backgrounds
   */
  onDark: {
    outline: '2px solid rgb(255, 255, 255)',
    outlineOffset: '2px',
    borderRadius: '4px',
    boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.3)',
    transition: 'outline 150ms cubic-bezier(0.2, 0, 0, 1)'
  },

  /**
   * Focus ring for light backgrounds
   */
  onLight: {
    outline: '2px solid rgb(0, 0, 0)',
    outlineOffset: '2px',
    borderRadius: '4px',
    boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.8)',
    transition: 'outline 150ms cubic-bezier(0.2, 0, 0, 1)'
  },

  /**
   * Focus background for buttons and interactive elements
   */
  interactive: {
    backgroundColor: 'rgba(103, 80, 164, 0.12)',
    outline: '2px solid rgb(103, 80, 164)',
    outlineOffset: '-2px',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)'
  },

  /**
   * Focus ring for form elements
   */
  form: {
    outline: '2px solid rgb(103, 80, 164)',
    outlineOffset: '0px',
    borderColor: 'rgb(103, 80, 164)',
    transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)'
  }
} as const;

/**
 * CSS classes for focus management
 */
export const focusCSS = `
  /* Hide default focus outline for custom styling */
  .m3-focus-custom {
    outline: none;
  }

  /* Primary focus indicator */
  .m3-focus-primary:focus-visible {
    outline: 2px solid rgb(103, 80, 164);
    outline-offset: 2px;
    border-radius: 4px;
    transition: outline 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* High contrast focus for accessibility */
  .m3-focus-high-contrast:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
    border-radius: 4px;
    transition: outline 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* Focus for interactive elements */
  .m3-focus-interactive:focus-visible {
    background-color: rgba(103, 80, 164, 0.12);
    outline: 2px solid rgb(103, 80, 164);
    outline-offset: -2px;
    transition: all 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* Focus for form elements */
  .m3-focus-form:focus-visible {
    outline: 2px solid rgb(103, 80, 164);
    outline-offset: 0px;
    border-color: rgb(103, 80, 164);
    transition: all 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* Focus ring for buttons */
  .m3-button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    transition: outline 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* Focus ring for cards */
  .m3-card:focus-visible {
    outline: 2px solid rgb(103, 80, 164);
    outline-offset: 2px;
    transition: outline 150ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* Skip link styling */
  .m3-skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: rgb(103, 80, 164);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 9999;
    transition: top 150ms ease-in-out;
  }

  .m3-skip-link:focus {
    top: 6px;
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .m3-focus-primary:focus-visible,
    .m3-focus-high-contrast:focus-visible,
    .m3-focus-interactive:focus-visible,
    .m3-focus-form:focus-visible,
    .m3-button:focus-visible,
    .m3-card:focus-visible {
      transition: none;
    }
  }
`;

/**
 * Focus management utilities
 */
export const FocusUtils = {
  /**
   * Apply Material 3 focus styling to an element
   */
  applyFocusStyle: (
    element: HTMLElement, 
    variant: keyof typeof Material3FocusIndicators = 'primary'
  ): void => {
    const styles = Material3FocusIndicators[variant];
    Object.assign(element.style, styles);
  },

  /**
   * Create skip link for accessibility
   */
  createSkipLink: (targetId: string, text: string = 'Skip to main content'): HTMLElement => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'm3-skip-link';
    skipLink.setAttribute('tabindex', '0');
    return skipLink;
  },

  /**
   * Move focus to element with announcement
   */
  moveFocusWithAnnouncement: (
    element: HTMLElement, 
    announcement?: string
  ): void => {
    element.focus();
    
    if (announcement) {
      // Create temporary live region for announcement
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      
      document.body.appendChild(liveRegion);
      
      // Add announcement
      setTimeout(() => {
        liveRegion.textContent = announcement;
      }, 100);
      
      // Clean up after announcement
      setTimeout(() => {
        if (liveRegion.parentNode) {
          liveRegion.parentNode.removeChild(liveRegion);
        }
      }, 1000);
    }
  },

  /**
   * Check if element is focusable
   */
  isFocusable: (element: HTMLElement): boolean => {
    if (element.hasAttribute('disabled') || element.getAttribute('aria-hidden') === 'true') {
      return false;
    }

    const focusableSelectors = [
      'button', 'a[href]', 'input', 'select', 'textarea', 
      '[tabindex]', 'details', 'summary'
    ];

    const tagName = element.tagName.toLowerCase();
    if (focusableSelectors.includes(tagName)) {
      return true;
    }

    if (element.hasAttribute('tabindex')) {
      const tabIndex = element.getAttribute('tabindex');
      return tabIndex !== '-1';
    }

    return false;
  },

  /**
   * Get next focusable element
   */
  getNextFocusableElement: (
    currentElement: HTMLElement, 
    container?: HTMLElement
  ): HTMLElement | null => {
    const root = container || document.body;
    const focusableElements = Array.from(root.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    
    return focusableElements[nextIndex] || null;
  },

  /**
   * Get previous focusable element
   */
  getPreviousFocusableElement: (
    currentElement: HTMLElement, 
    container?: HTMLElement
  ): HTMLElement | null => {
    const root = container || document.body;
    const focusableElements = Array.from(root.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(currentElement);
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    
    return focusableElements[previousIndex] || null;
  }
} as const;

/**
 * React hook for focus management
 */
export function useFocusManagement(containerRef: React.RefObject<HTMLElement>) {
  const [focusTrap, setFocusTrap] = React.useState<FocusTrap | null>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      const trap = new FocusTrap(containerRef.current);
      setFocusTrap(trap);
      
      return () => {
        trap.deactivate();
      };
    }
  }, [containerRef]);

  const activateFocusTrap = React.useCallback(() => {
    focusTrap?.activate();
  }, [focusTrap]);

  const deactivateFocusTrap = React.useCallback(() => {
    focusTrap?.deactivate();
  }, [focusTrap]);

  return {
    activateFocusTrap,
    deactivateFocusTrap,
    focusTrap
  };
}

/**
 * Keyboard navigation handler
 */
export class KeyboardNavigationHandler {
  private container: HTMLElement;
  private onEscape?: () => void;
  private onEnter?: (element: HTMLElement) => void;

  constructor(
    container: HTMLElement,
    options: {
      onEscape?: () => void;
      onEnter?: (element: HTMLElement) => void;
    } = {}
  ) {
    this.container = container;
    this.onEscape = options.onEscape;
    this.onEnter = options.onEnter;
    
    this.container.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.focusNext(target);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.focusPrevious(target);
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        event.preventDefault();
        this.focusLast();
        break;
      case 'Enter':
      case ' ':
        if (this.onEnter && target.tagName !== 'BUTTON' && target.tagName !== 'A') {
          event.preventDefault();
          this.onEnter(target);
        }
        break;
      case 'Escape':
        if (this.onEscape) {
          event.preventDefault();
          this.onEscape();
        }
        break;
    }
  };

  private focusNext(currentElement: HTMLElement): void {
    const next = FocusUtils.getNextFocusableElement(currentElement, this.container);
    if (next) {
      next.focus();
    }
  }

  private focusPrevious(currentElement: HTMLElement): void {
    const previous = FocusUtils.getPreviousFocusableElement(currentElement, this.container);
    if (previous) {
      previous.focus();
    }
  }

  private focusFirst(): void {
    const focusableElements = this.container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableElements[0] as HTMLElement;
    if (first) {
      first.focus();
    }
  }

  private focusLast(): void {
    const focusableElements = this.container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const last = focusableElements[focusableElements.length - 1] as HTMLElement;
    if (last) {
      last.focus();
    }
  }

  destroy(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);
  }
}