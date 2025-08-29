/**
 * Tests for Material 3 Expressive Mobile Optimization Utilities
 */

import {
  MATERIAL3_TOUCH_TARGETS,
  MATERIAL3_MOBILE_BREAKPOINTS,
  MATERIAL3_MOBILE_SPACING,
  MATERIAL3_TOUCH_FEEDBACK,
  isTouchDevice,
  isPortraitOrientation,
  getViewportSize,
  isMobileViewport,
  isTabletViewport,
  getTouchOptimizedSpacing,
  getTouchOptimizedSize,
  createMobileMediaQuery,
  createTouchOptimizedCSS,
  handleOrientationChange,
  createRippleEffect,
  RIPPLE_KEYFRAMES,
} from '../material3-mobile-utils';

// Mock window methods
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockRemoveEventListener,
});

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock navigator
Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  configurable: true,
  value: 0,
});

// Mock ontouchstart detection
const originalWindow = global.window;

describe('Material3 Mobile Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    window.innerWidth = 1024;
    window.innerHeight = 768;
    navigator.maxTouchPoints = 0;
    // Remove ontouchstart if it exists
    delete (window as any).ontouchstart;
  });

  describe('Constants', () => {
    test('should have correct touch target sizes', () => {
      expect(MATERIAL3_TOUCH_TARGETS.MINIMUM).toBe(44);
      expect(MATERIAL3_TOUCH_TARGETS.STANDARD).toBe(48);
      expect(MATERIAL3_TOUCH_TARGETS.LARGE).toBe(56);
      expect(MATERIAL3_TOUCH_TARGETS.EXTRA_LARGE).toBe(64);
    });

    test('should have correct mobile breakpoints', () => {
      expect(MATERIAL3_MOBILE_BREAKPOINTS.XS).toBe(0);
      expect(MATERIAL3_MOBILE_BREAKPOINTS.SM).toBe(576);
      expect(MATERIAL3_MOBILE_BREAKPOINTS.MD).toBe(768);
      expect(MATERIAL3_MOBILE_BREAKPOINTS.LG).toBe(992);
      expect(MATERIAL3_MOBILE_BREAKPOINTS.XL).toBe(1200);
      expect(MATERIAL3_MOBILE_BREAKPOINTS.XXL).toBe(1400);
    });

    test('should have correct mobile spacing values', () => {
      expect(MATERIAL3_MOBILE_SPACING.XS).toBe('4px');
      expect(MATERIAL3_MOBILE_SPACING.SM).toBe('8px');
      expect(MATERIAL3_MOBILE_SPACING.MD).toBe('16px');
      expect(MATERIAL3_MOBILE_SPACING.LG).toBe('24px');
      expect(MATERIAL3_MOBILE_SPACING.XL).toBe('32px');
      expect(MATERIAL3_MOBILE_SPACING.XXL).toBe('48px');
    });

    test('should have correct touch feedback configuration', () => {
      expect(MATERIAL3_TOUCH_FEEDBACK.RIPPLE_DURATION).toBe('600ms');
      expect(MATERIAL3_TOUCH_FEEDBACK.PRESS_SCALE).toBe(0.95);
      expect(MATERIAL3_TOUCH_FEEDBACK.HOVER_SCALE).toBe(1.02);
      expect(MATERIAL3_TOUCH_FEEDBACK.TOUCH_OPACITY).toBe(0.12);
    });
  });

  describe('Device Detection', () => {
    test('should detect touch device correctly', () => {
      // Non-touch device
      expect(isTouchDevice()).toBe(false);

      // Touch device with maxTouchPoints
      navigator.maxTouchPoints = 1;
      expect(isTouchDevice()).toBe(true);

      // Reset
      navigator.maxTouchPoints = 0;

      // Touch device with ontouchstart
      Object.defineProperty(window, 'ontouchstart', {
        value: null,
        configurable: true,
      });
      expect(isTouchDevice()).toBe(true);

      // Cleanup
      delete (window as any).ontouchstart;
    });

    test('should detect portrait orientation correctly', () => {
      // Landscape
      window.innerWidth = 1024;
      window.innerHeight = 768;
      expect(isPortraitOrientation()).toBe(false);

      // Portrait
      window.innerWidth = 768;
      window.innerHeight = 1024;
      expect(isPortraitOrientation()).toBe(true);

      // Square (considered portrait)
      window.innerWidth = 800;
      window.innerHeight = 800;
      expect(isPortraitOrientation()).toBe(true);
    });
  });

  describe('Viewport Size Detection', () => {
    test('should detect viewport size correctly', () => {
      // Extra small
      window.innerWidth = 400;
      expect(getViewportSize()).toBe('xs');

      // Small
      window.innerWidth = 600;
      expect(getViewportSize()).toBe('sm');

      // Medium
      window.innerWidth = 800;
      expect(getViewportSize()).toBe('md');

      // Large
      window.innerWidth = 1000;
      expect(getViewportSize()).toBe('lg');

      // Extra large
      window.innerWidth = 1300;
      expect(getViewportSize()).toBe('xl');

      // Extra extra large
      window.innerWidth = 1500;
      expect(getViewportSize()).toBe('xxl');
    });

    test('should detect mobile viewport correctly', () => {
      // Mobile
      window.innerWidth = 400;
      expect(isMobileViewport()).toBe(true);

      window.innerWidth = 600;
      expect(isMobileViewport()).toBe(true);

      // Not mobile
      window.innerWidth = 800;
      expect(isMobileViewport()).toBe(false);
    });

    test('should detect tablet viewport correctly', () => {
      // Not tablet
      window.innerWidth = 400;
      expect(isTabletViewport()).toBe(false);

      // Tablet
      window.innerWidth = 800;
      expect(isTabletViewport()).toBe(true);

      window.innerWidth = 1000;
      expect(isTabletViewport()).toBe(true);

      // Not tablet
      window.innerWidth = 1300;
      expect(isTabletViewport()).toBe(false);
    });
  });

  describe('Touch Optimization', () => {
    test('should get touch-optimized spacing', () => {
      // Extra small viewport
      window.innerWidth = 400;
      expect(getTouchOptimizedSpacing('20px')).toBe('8px');

      // Small viewport
      window.innerWidth = 600;
      expect(getTouchOptimizedSpacing('20px')).toBe('16px');

      // Medium viewport
      window.innerWidth = 800;
      expect(getTouchOptimizedSpacing('20px')).toBe('24px');

      // Large viewport
      window.innerWidth = 1000;
      expect(getTouchOptimizedSpacing('20px')).toBe('20px');
    });

    test('should get touch-optimized size', () => {
      // Mobile viewport
      window.innerWidth = 400;
      expect(getTouchOptimizedSize('button')).toBe(48);
      expect(getTouchOptimizedSize('input')).toBe(56);
      expect(getTouchOptimizedSize('icon')).toBe(24);

      // Desktop viewport
      window.innerWidth = 1000;
      expect(getTouchOptimizedSize('button')).toBe(44);
      expect(getTouchOptimizedSize('input')).toBe(48);
      expect(getTouchOptimizedSize('icon')).toBe(20);
    });
  });

  describe('CSS Generation', () => {
    test('should create mobile media query', () => {
      expect(createMobileMediaQuery('SM')).toBe('@media (min-width: 576px)');
      expect(createMobileMediaQuery('MD')).toBe('@media (min-width: 768px)');
      expect(createMobileMediaQuery('LG')).toBe('@media (min-width: 992px)');
    });

    test('should create touch-optimized CSS', () => {
      const css = createTouchOptimizedCSS();
      expect(css).toContain('.touch-target');
      expect(css).toContain('min-height: 44px');
      expect(css).toContain('.touch-feedback');
      expect(css).toContain('transform: scale(0.95)');
      expect(css).toContain('@media (hover: hover)');
      expect(css).toContain('@media (hover: none)');
    });

    test('should have ripple keyframes', () => {
      expect(RIPPLE_KEYFRAMES).toContain('@keyframes ripple');
      expect(RIPPLE_KEYFRAMES).toContain('transform: scale(0)');
      expect(RIPPLE_KEYFRAMES).toContain('transform: scale(1)');
      expect(RIPPLE_KEYFRAMES).toContain('opacity: 0.12');
    });
  });

  describe('Orientation Change Handling', () => {
    test('should handle orientation change', () => {
      const callback = jest.fn();
      const cleanup = handleOrientationChange(callback);

      expect(mockAddEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

      // Test cleanup
      cleanup();
      expect(mockRemoveEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Ripple Effect', () => {
    test('should create ripple effect', () => {
      const element = document.createElement('div');
      element.getBoundingClientRect = jest.fn().mockReturnValue({
        left: 10,
        top: 10,
        width: 100,
        height: 100,
      });
      element.appendChild = jest.fn();

      const event = {
        clientX: 60,
        clientY: 60,
      } as MouseEvent;

      createRippleEffect(element, event);

      expect(element.appendChild).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
    });

    test('should handle ripple cleanup', (done) => {
      const element = document.createElement('div');
      element.getBoundingClientRect = jest.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      });

      const event = {
        clientX: 50,
        clientY: 50,
      } as MouseEvent;

      // Mock setTimeout to execute immediately
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        (callback as Function)();
        return 0 as any;
      });

      createRippleEffect(element, event);

      // Verify ripple was added and removed
      setTimeout(() => {
        expect(element.children.length).toBe(0);
        done();
      }, 0);

      jest.restoreAllMocks();
    });
  });

  describe('Server-side Rendering', () => {
    test.skip('should handle SSR gracefully', () => {
      // SSR handling is tested in integration tests
      // This test is skipped to avoid complex mocking scenarios
    });
  });
});