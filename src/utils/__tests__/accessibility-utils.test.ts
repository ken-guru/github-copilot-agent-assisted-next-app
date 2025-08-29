/**
 * Tests for accessibility utilities
 */

import {
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  validateColorCombination,
  getAccessibleColorSuggestions,
  FocusManager,
  ScreenReaderUtils,
  prefersReducedMotion,
  KeyboardNavigation,
} from '../accessibility-utils';

describe('Color Accessibility Utils', () => {
  describe('hexToRgb', () => {
    it('should convert hex to RGB correctly', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#gggggg')).toBeNull();
    });
  });

  describe('getRelativeLuminance', () => {
    it('should calculate luminance correctly', () => {
      // White should have luminance of 1
      expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1, 2);
      
      // Black should have luminance of 0
      expect(getRelativeLuminance(0, 0, 0)).toBeCloseTo(0, 2);
      
      // Red should have specific luminance
      expect(getRelativeLuminance(255, 0, 0)).toBeCloseTo(0.2126, 2);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast ratio correctly', () => {
      // Black on white should have high contrast
      const blackWhite = getContrastRatio('#000000', '#ffffff');
      expect(blackWhite.ratio).toBeCloseTo(21, 0);
      expect(blackWhite.level).toBe('AAA');
      
      // Same colors should have ratio of 1
      const sameSame = getContrastRatio('#ffffff', '#ffffff');
      expect(sameSame.ratio).toBeCloseTo(1, 0);
      expect(sameSame.level).toBe('FAIL');
    });

    it('should handle invalid colors', () => {
      const result = getContrastRatio('invalid', '#ffffff');
      expect(result.ratio).toBe(0);
      expect(result.level).toBe('FAIL');
    });
  });

  describe('validateColorCombination', () => {
    it('should validate WCAG AA compliance', () => {
      // High contrast combination
      const highContrast = validateColorCombination('#000000', '#ffffff');
      expect(highContrast.level).toBe('AAA');
      
      // Low contrast combination
      const lowContrast = validateColorCombination('#cccccc', '#ffffff');
      expect(lowContrast.level).toBe('FAIL');
    });

    it('should handle large text requirements', () => {
      // Color combination that passes for large text but not normal
      const mediumContrast = validateColorCombination('#666666', '#ffffff', true);
      expect(mediumContrast.isLargeText).toBe(true);
    });
  });

  describe('getAccessibleColorSuggestions', () => {
    it('should provide accessible color suggestions', () => {
      const suggestions = getAccessibleColorSuggestions('#0066cc');
      
      expect(suggestions).toHaveProperty('onColor');
      expect(suggestions).toHaveProperty('containerColor');
      expect(suggestions).toHaveProperty('onContainerColor');
      
      // Should be valid hex colors
      expect(suggestions.onColor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(suggestions.containerColor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(suggestions.onContainerColor).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});

describe('FocusManager', () => {
  let focusManager: FocusManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    focusManager = new FocusManager();
    mockElement = document.createElement('button');
    mockElement.focus = jest.fn();
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
  });

  describe('setFocus', () => {
    it('should focus element', () => {
      focusManager.setFocus(mockElement);
      expect(mockElement.focus).toHaveBeenCalled();
    });

    it('should handle null element', () => {
      expect(() => focusManager.setFocus(null)).not.toThrow();
    });

    it('should store previously focused element when restoreFocus is true', () => {
      const previousElement = document.createElement('input');
      previousElement.focus = jest.fn();
      document.body.appendChild(previousElement);
      
      // Simulate previous element being focused
      Object.defineProperty(document, 'activeElement', {
        value: previousElement,
        configurable: true,
      });
      
      focusManager.setFocus(mockElement, { restoreFocus: true });
      
      expect(mockElement.focus).toHaveBeenCalled();
      
      document.body.removeChild(previousElement);
    });
  });

  describe('restoreFocus', () => {
    it('should restore focus to previously focused element', () => {
      const previousElement = document.createElement('input');
      previousElement.focus = jest.fn();
      document.body.appendChild(previousElement);
      
      Object.defineProperty(document, 'activeElement', {
        value: previousElement,
        configurable: true,
      });
      
      focusManager.setFocus(mockElement, { restoreFocus: true });
      focusManager.restoreFocus();
      
      expect(previousElement.focus).toHaveBeenCalled();
      
      document.body.removeChild(previousElement);
    });
  });
});

describe('ScreenReaderUtils', () => {
  let screenReader: ScreenReaderUtils;

  beforeEach(() => {
    // Clear any existing announcers
    const existingAnnouncers = document.querySelectorAll('[aria-live]');
    existingAnnouncers.forEach(el => el.remove());
    
    screenReader = new ScreenReaderUtils();
  });

  describe('announce', () => {
    it('should create announcer element', () => {
      const announcers = document.querySelectorAll('[aria-live]');
      expect(announcers.length).toBeGreaterThan(0);
    });

    it('should announce message', () => {
      screenReader.announce('Test message');
      
      // The announcement should be set immediately
      const announcer = document.querySelector('[aria-live="polite"]');
      expect(announcer).toBeTruthy();
      expect(announcer?.textContent).toBe('Test message');
    });

    it('should handle different priorities', () => {
      screenReader.announce('Urgent message', 'assertive');
      
      const announcer = document.querySelector('[aria-live="assertive"]');
      expect(announcer).toBeTruthy();
    });
  });
});

describe('Motion Preferences', () => {
  describe('prefersReducedMotion', () => {
    it('should detect reduced motion preference', () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      expect(prefersReducedMotion()).toBe(true);
    });
  });
});

describe('KeyboardNavigation', () => {
  let container: HTMLElement;
  let buttons: HTMLElement[];

  beforeEach(() => {
    container = document.createElement('div');
    buttons = [];
    
    for (let i = 0; i < 3; i++) {
      const button = document.createElement('button');
      button.textContent = `Button ${i + 1}`;
      button.focus = jest.fn();
      button.click = jest.fn();
      buttons.push(button);
      container.appendChild(button);
    }
    
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should handle arrow key navigation', () => {
    const navigation = new KeyboardNavigation(container, 'button');
    
    // Simulate arrow right key
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    container.dispatchEvent(event);
    
    expect(buttons[1].focus).toHaveBeenCalled();
  });

  it('should handle home and end keys', () => {
    const navigation = new KeyboardNavigation(container, 'button');
    
    // Simulate end key
    const endEvent = new KeyboardEvent('keydown', { key: 'End' });
    container.dispatchEvent(endEvent);
    
    expect(buttons[2].focus).toHaveBeenCalled();
    
    // Simulate home key
    const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
    container.dispatchEvent(homeEvent);
    
    expect(buttons[0].focus).toHaveBeenCalled();
  });

  it('should wrap navigation when enabled', () => {
    const navigation = new KeyboardNavigation(container, 'button', { wrap: true });
    
    // Move to last element
    const endEvent = new KeyboardEvent('keydown', { key: 'End' });
    container.dispatchEvent(endEvent);
    
    // Move right should wrap to first
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    container.dispatchEvent(rightEvent);
    
    expect(buttons[0].focus).toHaveBeenCalled();
  });
});