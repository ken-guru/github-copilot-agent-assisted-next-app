/**
 * Tests for Material 3 accessibility enhancements
 */

import {
  Material3ColorAccessibility,
  Material3FocusManager,
  Material3MotionAccessibility,
  Material3AriaEnhancements,
  initializeMaterial3Accessibility,
  defaultAccessibilityConfig,
} from '../material3-accessibility';

// Mock the accessibility utils
jest.mock('../accessibility-utils', () => ({
  validateColorCombination: jest.fn().mockReturnValue({
    ratio: 4.5,
    level: 'AA',
  }),
  prefersReducedMotion: jest.fn().mockReturnValue(false),
  focusManager: {
    setFocus: jest.fn(),
    restoreFocus: jest.fn(),
    trapFocus: jest.fn(),
    releaseFocusTrap: jest.fn(),
  },
  screenReader: {
    announce: jest.fn(),
  },
}));

describe('Material3ColorAccessibility', () => {
  let colorAccessibility: Material3ColorAccessibility;

  beforeEach(() => {
    colorAccessibility = new Material3ColorAccessibility();
  });

  describe('validateColorTokens', () => {
    it('should validate common Material 3 color combinations', () => {
      const tokens = {
        primary: '#6750a4',
        onPrimary: '#ffffff',
        secondary: '#625b71',
        onSecondary: '#ffffff',
        surface: '#fffbfe',
        onSurface: '#1c1b1f',
      };

      const results = colorAccessibility.validateColorTokens(tokens);

      expect(results).toHaveProperty('primary');
      expect(results).toHaveProperty('secondary');
      expect(results).toHaveProperty('surface');
      
      expect(Array.isArray(results.primary)).toBe(true);
      expect(results.primary.length).toBeGreaterThan(0);
    });

    it('should handle missing color tokens gracefully', () => {
      const tokens = {
        primary: '#6750a4',
        // Missing onPrimary
      };

      const results = colorAccessibility.validateColorTokens(tokens);
      expect(results).toEqual({});
    });
  });

  describe('getFocusRingColor', () => {
    it('should return default focus color for good contrast', () => {
      const focusColor = colorAccessibility.getFocusRingColor('#ffffff');
      expect(focusColor).toBe('#0066cc');
    });

    it('should return high contrast alternative for poor contrast', () => {
      // Mock poor contrast
      const mockValidateColorCombination = require('../accessibility-utils').validateColorCombination;
      mockValidateColorCombination.mockReturnValueOnce({
        ratio: 2.0,
        level: 'FAIL',
      });

      const focusColor = colorAccessibility.getFocusRingColor('#0066cc');
      expect(focusColor).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});

describe('Material3FocusManager', () => {
  let focusManager: Material3FocusManager;

  beforeEach(() => {
    focusManager = Material3FocusManager.getInstance();
    
    // Clear any existing styles
    const existingStyles = document.querySelectorAll('style');
    existingStyles.forEach(style => {
      if (style.textContent?.includes('m3-focus-ring')) {
        style.remove();
      }
    });
  });

  afterEach(() => {
    focusManager.destroy();
  });

  describe('initialize', () => {
    it('should add global focus styles', () => {
      focusManager.initialize();
      
      const styles = document.querySelectorAll('style');
      const focusStyles = Array.from(styles).find(style => 
        style.textContent?.includes('m3-focus-ring')
      );
      
      expect(focusStyles).toBeTruthy();
    });

    it('should enhance existing interactive elements', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      
      focusManager.initialize();
      
      expect(button.classList.contains('m3-focus-ring')).toBe(true);
      
      document.body.removeChild(button);
    });
  });

  describe('singleton pattern', () => {
    it('should return same instance', () => {
      const instance1 = Material3FocusManager.getInstance();
      const instance2 = Material3FocusManager.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
});

describe('Material3MotionAccessibility', () => {
  let motionAccessibility: Material3MotionAccessibility;

  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    motionAccessibility = new Material3MotionAccessibility();
  });

  describe('registerMotionElement', () => {
    it('should add motion classes to element', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      motionAccessibility.registerMotionElement(element, 'standard');
      
      expect(element.classList.contains('m3-motion-standard')).toBe(true);
      
      document.body.removeChild(element);
    });
  });

  describe('unregisterMotionElement', () => {
    it('should remove element from tracking', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      motionAccessibility.registerMotionElement(element, 'standard');
      motionAccessibility.unregisterMotionElement(element);
      
      // Should not throw or cause issues
      expect(() => {
        motionAccessibility.unregisterMotionElement(element);
      }).not.toThrow();
      
      document.body.removeChild(element);
    });
  });
});

describe('Material3AriaEnhancements', () => {
  describe('enhanceButton', () => {
    it('should add ARIA attributes to button', () => {
      const button = document.createElement('button');
      
      Material3AriaEnhancements.enhanceButton(button, {
        label: 'Test button',
        pressed: true,
        expanded: false,
        controls: 'menu-1',
      });
      
      expect(button.getAttribute('aria-label')).toBe('Test button');
      expect(button.getAttribute('aria-pressed')).toBe('true');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-controls')).toBe('menu-1');
    });

    it('should handle optional attributes', () => {
      const button = document.createElement('button');
      
      Material3AriaEnhancements.enhanceButton(button, {
        label: 'Simple button',
      });
      
      expect(button.getAttribute('aria-label')).toBe('Simple button');
      expect(button.hasAttribute('aria-pressed')).toBe(false);
    });
  });

  describe('enhanceFormField', () => {
    it('should add ARIA attributes to form field', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      document.body.appendChild(input);
      
      Material3AriaEnhancements.enhanceFormField(input, {
        label: 'Test input',
        required: true,
        invalid: true,
        errorMessage: 'This field is required',
      });
      
      expect(input.getAttribute('aria-label')).toBe('Test input');
      expect(input.getAttribute('aria-required')).toBe('true');
      expect(input.getAttribute('aria-invalid')).toBe('true');
      
      // Should create error element
      const errorElement = document.getElementById('test-input-error');
      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toBe('This field is required');
      
      document.body.removeChild(input);
      if (errorElement) {
        document.body.removeChild(errorElement);
      }
    });
  });

  describe('createLiveRegion', () => {
    it('should create live region element', () => {
      const liveRegion = Material3AriaEnhancements.createLiveRegion('test-region', 'assertive');
      
      expect(liveRegion.id).toBe('test-region');
      expect(liveRegion.getAttribute('aria-live')).toBe('assertive');
      expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
      expect(liveRegion.classList.contains('sr-only')).toBe(true);
      
      // Should be in DOM
      expect(document.getElementById('test-region')).toBe(liveRegion);
      
      // Cleanup
      document.body.removeChild(liveRegion);
    });

    it('should return existing live region if already exists', () => {
      const firstCall = Material3AriaEnhancements.createLiveRegion('existing-region');
      const secondCall = Material3AriaEnhancements.createLiveRegion('existing-region');
      
      expect(firstCall).toBe(secondCall);
      
      // Cleanup
      document.body.removeChild(firstCall);
    });
  });
});

describe('initializeMaterial3Accessibility', () => {
  beforeEach(() => {
    // Clear any existing live regions
    const existingRegions = document.querySelectorAll('[aria-live]');
    existingRegions.forEach(region => region.remove());
  });

  it('should initialize with default config', () => {
    initializeMaterial3Accessibility();
    
    // Should create global live regions
    expect(document.getElementById('m3-announcements')).toBeTruthy();
    expect(document.getElementById('m3-alerts')).toBeTruthy();
  });

  it('should respect custom config', () => {
    const customConfig = {
      enhancedFocusIndicators: false,
      respectReducedMotion: false,
    };
    
    initializeMaterial3Accessibility(customConfig);
    
    // Should still create live regions
    expect(document.getElementById('m3-announcements')).toBeTruthy();
    expect(document.getElementById('m3-alerts')).toBeTruthy();
  });

  it('should announce initialization', () => {
    const mockAnnounce = require('../accessibility-utils').screenReader.announce;
    
    initializeMaterial3Accessibility();
    
    expect(mockAnnounce).toHaveBeenCalledWith(
      'Material 3 accessibility enhancements loaded',
      'polite'
    );
  });
});