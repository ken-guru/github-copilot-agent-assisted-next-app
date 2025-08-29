/**
 * Initialize Material 3 accessibility system
 * This should be called once when the application starts
 */

import { initializeMaterial3Accessibility } from './material3-accessibility';

/**
 * Initialize all accessibility enhancements
 */
export function initializeAccessibility(): void {
  // Initialize Material 3 accessibility enhancements
  initializeMaterial3Accessibility({
    respectReducedMotion: true,
    enforceContrastRatios: true,
    enhancedFocusIndicators: true,
    screenReaderOptimizations: true,
    keyboardNavigationEnhancements: true,
  });

  // Add skip link to page
  addSkipLink();

  // Set up global keyboard navigation
  setupGlobalKeyboardNavigation();

  // Add high contrast mode detection
  setupHighContrastMode();

  // Add print styles
  addPrintStyles();
}

/**
 * Add skip link for keyboard navigation
 */
function addSkipLink(): void {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'm3-skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.setAttribute('aria-label', 'Skip to main content');
  
  // Insert at the beginning of body
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Set up global keyboard navigation patterns
 */
function setupGlobalKeyboardNavigation(): void {
  let isKeyboardNavigation = false;

  // Detect keyboard navigation
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      isKeyboardNavigation = true;
      document.body.classList.add('m3-keyboard-navigation');
    }
  });

  // Detect mouse navigation
  document.addEventListener('mousedown', () => {
    isKeyboardNavigation = false;
    document.body.classList.remove('m3-keyboard-navigation');
  });

  // Handle escape key for dismissible elements
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const activeElement = document.activeElement as HTMLElement;
      
      // Close modals, dropdowns, etc.
      const dismissible = activeElement?.closest('[data-dismissible]') as HTMLElement;
      if (dismissible) {
        const closeButton = dismissible.querySelector('[data-dismiss]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    }
  });
}

/**
 * Set up high contrast mode detection and handling
 */
function setupHighContrastMode(): void {
  const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
  
  const handleHighContrastChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      document.body.classList.add('m3-high-contrast');
    } else {
      document.body.classList.remove('m3-high-contrast');
    }
  };

  // Initial check
  if (highContrastQuery.matches) {
    document.body.classList.add('m3-high-contrast');
  }

  // Listen for changes
  highContrastQuery.addEventListener('change', handleHighContrastChange);
}

/**
 * Add print-specific accessibility styles
 */
function addPrintStyles(): void {
  const printStyles = document.createElement('style');
  printStyles.textContent = `
    @media print {
      .m3-skip-link {
        position: static !important;
        display: block !important;
      }
      
      .sr-only {
        position: static !important;
        width: auto !important;
        height: auto !important;
        clip: auto !important;
        overflow: visible !important;
      }
      
      [aria-label]::after {
        content: " (" attr(aria-label) ")";
        font-size: 0.8em;
        color: #666;
      }
      
      .m3-button,
      .m3-text-field,
      .m3-card {
        border: 1px solid #000 !important;
        background: transparent !important;
        color: #000 !important;
      }
    }
  `;
  
  document.head.appendChild(printStyles);
}

/**
 * Validate color contrast for all elements on page
 */
export function validatePageContrast(): void {
  const elements = document.querySelectorAll('*');
  const violations: Array<{ element: Element; issue: string }> = [];

  elements.forEach(element => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      // This would need a proper contrast checking implementation
      // For now, just log elements that might have contrast issues
      if (color === backgroundColor) {
        violations.push({
          element,
          issue: 'Text color same as background color'
        });
      }
    }
  });

  if (violations.length > 0) {
    console.warn('Potential contrast violations found:', violations);
  }
}

/**
 * Check if all interactive elements have proper accessibility attributes
 */
export function validateAccessibilityAttributes(): void {
  const interactiveElements = document.querySelectorAll(
    'button, [role="button"], input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
  );

  const violations: Array<{ element: Element; issues: string[] }> = [];

  interactiveElements.forEach(element => {
    const issues: string[] = [];

    // Check for accessible name
    const hasAccessibleName = 
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.textContent?.trim() ||
      (element as HTMLInputElement).labels?.length > 0;

    if (!hasAccessibleName) {
      issues.push('Missing accessible name');
    }

    // Check for proper roles
    if (element.getAttribute('role') === 'button' && element.tagName !== 'BUTTON') {
      if (!element.hasAttribute('tabindex')) {
        issues.push('Custom button missing tabindex');
      }
    }

    // Check form fields
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
      const input = element as HTMLInputElement;
      if (input.required && !element.hasAttribute('aria-required')) {
        issues.push('Required field missing aria-required');
      }
    }

    if (issues.length > 0) {
      violations.push({ element, issues });
    }
  });

  if (violations.length > 0) {
    console.warn('Accessibility attribute violations found:', violations);
  }
}

/**
 * Run comprehensive accessibility audit
 */
export function auditAccessibility(): void {
  console.log('Running accessibility audit...');
  
  validatePageContrast();
  validateAccessibilityAttributes();
  
  // Check for proper heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  const headingViolations: string[] = [];

  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (level > previousLevel + 1) {
      headingViolations.push(`Heading level ${level} follows level ${previousLevel} - skipped level(s)`);
    }
    
    previousLevel = level;
  });

  if (headingViolations.length > 0) {
    console.warn('Heading structure violations:', headingViolations);
  }

  // Check for images without alt text
  const images = document.querySelectorAll('img');
  const imageViolations: Element[] = [];

  images.forEach(img => {
    if (!img.hasAttribute('alt') && !img.hasAttribute('aria-label')) {
      imageViolations.push(img);
    }
  });

  if (imageViolations.length > 0) {
    console.warn('Images without alt text:', imageViolations);
  }

  console.log('Accessibility audit complete');
}