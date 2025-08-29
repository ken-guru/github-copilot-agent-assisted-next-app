/**
 * @jest-environment jsdom
 */

import {
  ShapeUtils,
  ElevationUtils,
  SurfaceUtils,
  AnimationUtils,
  ResponsiveUtils,
  AccessibilityUtils,
  Material3ShapeElevation,
  SHAPE_ELEVATION_UTILS
} from '../shape-elevation-utils';

describe('Material 3 Shape and Elevation Utilities', () => {
  let testElement: HTMLElement;

  beforeEach(() => {
    // Create a test element for each test
    testElement = document.createElement('div');
    document.body.appendChild(testElement);
    
    // Mock CSS custom properties
    document.documentElement.style.setProperty('--m3-shape-corner-sm', '8px');
    document.documentElement.style.setProperty('--m3-shape-corner-md', '12px');
    document.documentElement.style.setProperty('--m3-shape-corner-lg', '16px');
    document.documentElement.style.setProperty('--m3-elevation-level1', '0 1px 3px rgba(0,0,0,0.12)');
    document.documentElement.style.setProperty('--m3-elevation-level2', '0 4px 6px rgba(0,0,0,0.12)');
  });

  afterEach(() => {
    // Clean up
    if (testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
  });

  describe('ShapeUtils', () => {
    test('getShapeClass returns correct CSS class name', () => {
      expect(ShapeUtils.getShapeClass('sm')).toBe('m3-shape-sm');
      expect(ShapeUtils.getShapeClass('md')).toBe('m3-shape-md');
      expect(ShapeUtils.getShapeClass('lg')).toBe('m3-shape-lg');
      expect(ShapeUtils.getShapeClass('full')).toBe('m3-shape-full');
    });

    test('getExpressiveShapeClass returns correct CSS class name', () => {
      expect(ShapeUtils.getExpressiveShapeClass('sm-expressive')).toBe('m3-shape-sm-expressive');
      expect(ShapeUtils.getExpressiveShapeClass('lg-expressive')).toBe('m3-shape-lg-expressive');
    });

    test('getShapeProperty returns correct CSS custom property', () => {
      expect(ShapeUtils.getShapeProperty('sm')).toBe('--m3-shape-corner-sm');
      expect(ShapeUtils.getShapeProperty('md-expressive')).toBe('--m3-shape-corner-md-expressive');
    });

    test('applyShape applies correct CSS class to element', () => {
      ShapeUtils.applyShape(testElement, 'md');
      expect(testElement.classList.contains('m3-shape-md')).toBe(true);
      
      // Should remove previous shape and add new one
      ShapeUtils.applyShape(testElement, 'lg');
      expect(testElement.classList.contains('m3-shape-md')).toBe(false);
      expect(testElement.classList.contains('m3-shape-lg')).toBe(true);
    });

    test('getComponentShape returns component-specific shape class', () => {
      expect(ShapeUtils.getComponentShape('button')).toBe('m3-shape-button');
      expect(ShapeUtils.getComponentShape('card', true)).toBe('m3-shape-card-expressive');
      expect(ShapeUtils.getComponentShape('dialog')).toBe('m3-shape-dialog');
    });

    test('createAsymmetricShape joins corner values', () => {
      expect(ShapeUtils.createAsymmetricShape(['4px', '8px', '4px', '8px']))
        .toBe('4px 8px 4px 8px');
    });

    test('getResponsiveShapeClass returns responsive class', () => {
      expect(ShapeUtils.getResponsiveShapeClass('sm')).toBe('m3-shape-responsive-sm');
      expect(ShapeUtils.getResponsiveShapeClass('lg')).toBe('m3-shape-responsive-lg');
    });
  });

  describe('ElevationUtils', () => {
    test('getElevationClass returns correct CSS class name', () => {
      expect(ElevationUtils.getElevationClass(0)).toBe('m3-elevation-0');
      expect(ElevationUtils.getElevationClass(3)).toBe('m3-elevation-3');
      expect(ElevationUtils.getElevationClass(5)).toBe('m3-elevation-5');
    });

    test('getElevationProperty returns correct CSS custom property', () => {
      expect(ElevationUtils.getElevationProperty(1)).toBe('--m3-elevation-level1');
      expect(ElevationUtils.getElevationProperty(4)).toBe('--m3-elevation-level4');
    });

    test('applyElevation applies correct CSS class to element', () => {
      ElevationUtils.applyElevation(testElement, 2);
      expect(testElement.classList.contains('m3-elevation-2')).toBe(true);
      
      // Should remove previous elevation and add new one
      ElevationUtils.applyElevation(testElement, 4);
      expect(testElement.classList.contains('m3-elevation-2')).toBe(false);
      expect(testElement.classList.contains('m3-elevation-4')).toBe(true);
    });

    test('getComponentElevation returns component-specific elevation class', () => {
      expect(ElevationUtils.getComponentElevation('card')).toBe('m3-elevation-card');
      expect(ElevationUtils.getComponentElevation('card', 'hovered')).toBe('m3-elevation-card-hovered');
      expect(ElevationUtils.getComponentElevation('fab', 'pressed')).toBe('m3-elevation-fab-pressed');
    });

    test('makeInteractive adds interactive class', () => {
      ElevationUtils.makeInteractive(testElement);
      expect(testElement.classList.contains('m3-elevation-interactive')).toBe(true);
    });

    test('makeFocusable adds focusable class', () => {
      ElevationUtils.makeFocusable(testElement);
      expect(testElement.classList.contains('m3-elevation-focusable')).toBe(true);
    });

    test('makePressable adds pressable class', () => {
      ElevationUtils.makePressable(testElement);
      expect(testElement.classList.contains('m3-elevation-pressable')).toBe(true);
    });

    test('makeDraggable adds draggable class and attribute', () => {
      ElevationUtils.makeDraggable(testElement);
      expect(testElement.classList.contains('m3-elevation-draggable')).toBe(true);
      expect(testElement.getAttribute('draggable')).toBe('true');
    });

    test('animateElevation returns a promise and changes elevation', async () => {
      // Apply initial elevation
      ElevationUtils.applyElevation(testElement, 1);
      expect(testElement.classList.contains('m3-elevation-1')).toBe(true);
      
      // Animate to new elevation
      const promise = ElevationUtils.animateElevation(testElement, 1, 3, 50);
      expect(promise).toBeInstanceOf(Promise);
      
      await promise;
      expect(testElement.classList.contains('m3-elevation-1')).toBe(false);
      expect(testElement.classList.contains('m3-elevation-3')).toBe(true);
    });
  });

  describe('SurfaceUtils', () => {
    test('createSurface applies shape and elevation', () => {
      SurfaceUtils.createSurface(testElement, {
        shape: 'md',
        elevation: 2,
        interactive: true
      });
      
      expect(testElement.classList.contains('m3-shape-md')).toBe(true);
      expect(testElement.classList.contains('m3-elevation-2')).toBe(true);
      expect(testElement.classList.contains('m3-elevation-interactive')).toBe(true);
    });

    test('createSurface applies component-specific surface class', () => {
      SurfaceUtils.createSurface(testElement, {
        component: 'card',
        expressive: true
      });
      
      expect(testElement.classList.contains('m3-surface-card-expressive')).toBe(true);
    });

    test('getSurfaceClass returns correct surface class', () => {
      expect(SurfaceUtils.getSurfaceClass('card')).toBe('m3-surface-card');
      expect(SurfaceUtils.getSurfaceClass('dialog', 'elevated')).toBe('m3-surface-dialog-elevated');
    });

    test('applySurfaceState applies state classes', () => {
      SurfaceUtils.applySurfaceState(testElement, 'hover');
      expect(testElement.classList.contains('m3-elevation-interactive')).toBe(true);
      
      SurfaceUtils.applySurfaceState(testElement, 'focus');
      expect(testElement.classList.contains('m3-elevation-focusable')).toBe(true);
    });
  });

  describe('AnimationUtils', () => {
    test('morphShape returns a promise and changes shape', async () => {
      // Apply initial shape
      ShapeUtils.applyShape(testElement, 'sm');
      expect(testElement.classList.contains('m3-shape-sm')).toBe(true);
      
      // Animate to new shape
      const promise = AnimationUtils.morphShape(testElement, 'sm', 'lg', 50);
      expect(promise).toBeInstanceOf(Promise);
      
      await promise;
      expect(testElement.classList.contains('m3-shape-sm')).toBe(false);
      expect(testElement.classList.contains('m3-shape-lg')).toBe(true);
    });

    test('floatElement adds/removes float class', () => {
      AnimationUtils.floatElement(testElement, true);
      expect(testElement.classList.contains('m3-elevation-float')).toBe(true);
      
      AnimationUtils.floatElement(testElement, false);
      expect(testElement.classList.contains('m3-elevation-float')).toBe(false);
    });

    test('pulseElevation adds/removes pulse class', () => {
      AnimationUtils.pulseElevation(testElement, true);
      expect(testElement.classList.contains('m3-elevation-pulse')).toBe(true);
      
      AnimationUtils.pulseElevation(testElement, false);
      expect(testElement.classList.contains('m3-elevation-pulse')).toBe(false);
    });
  });

  describe('ResponsiveUtils', () => {
    test('applyResponsiveShape applies responsive class', () => {
      ResponsiveUtils.applyResponsiveShape(testElement, 'md');
      expect(testElement.classList.contains('m3-shape-responsive-md')).toBe(true);
    });

    test('getCurrentBreakpoint returns breakpoint based on window width', () => {
      // Mock window width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500
      });
      expect(ResponsiveUtils.getCurrentBreakpoint()).toBe('compact');
      
      window.innerWidth = 800;
      expect(ResponsiveUtils.getCurrentBreakpoint()).toBe('medium');
      
      window.innerWidth = 1400;
      expect(ResponsiveUtils.getCurrentBreakpoint()).toBe('expanded');
    });

    test('applyBreakpointConfig applies configuration based on current breakpoint', () => {
      // Mock compact breakpoint
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500
      });
      
      ResponsiveUtils.applyBreakpointConfig(testElement, {
        compact: { shape: 'sm', elevation: 1 },
        medium: { shape: 'md', elevation: 2 },
        expanded: { shape: 'lg', elevation: 3 }
      });
      
      expect(testElement.classList.contains('m3-shape-sm')).toBe(true);
      expect(testElement.classList.contains('m3-elevation-1')).toBe(true);
    });
  });

  describe('AccessibilityUtils', () => {
    test('enhanceFocusVisibility adds focusable class', () => {
      AccessibilityUtils.enhanceFocusVisibility(testElement);
      expect(testElement.classList.contains('m3-elevation-focusable')).toBe(true);
    });

    test('applyHighContrastMode adds/removes border', () => {
      AccessibilityUtils.applyHighContrastMode(testElement, true);
      expect(testElement.style.border).toBe('1px solid var(--m3-color-outline)');
      
      AccessibilityUtils.applyHighContrastMode(testElement, false);
      expect(testElement.style.border).toBe('');
    });

    test('prefersReducedMotion returns boolean', () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('reduce'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      expect(typeof AccessibilityUtils.prefersReducedMotion()).toBe('boolean');
    });

    test('applyMotionPreferences applies no-motion when reduced motion preferred', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          matches: true,
          media: '',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      AccessibilityUtils.applyMotionPreferences(testElement);
      expect(testElement.style.transition).toBe('none');
      expect(testElement.classList.contains('m3-no-motion')).toBe(true);
    });
  });

  describe('Material3ShapeElevation combined object', () => {
    test('exports all utility objects', () => {
      expect(Material3ShapeElevation.Shape).toBe(ShapeUtils);
      expect(Material3ShapeElevation.Elevation).toBe(ElevationUtils);
      expect(Material3ShapeElevation.Surface).toBe(SurfaceUtils);
      expect(Material3ShapeElevation.Animation).toBe(AnimationUtils);
      expect(Material3ShapeElevation.Responsive).toBe(ResponsiveUtils);
      expect(Material3ShapeElevation.Accessibility).toBe(AccessibilityUtils);
      expect(Material3ShapeElevation.Constants).toBe(SHAPE_ELEVATION_UTILS);
    });
  });

  describe('SHAPE_ELEVATION_UTILS constants', () => {
    test('contains expected shape sizes', () => {
      expect(SHAPE_ELEVATION_UTILS.SHAPE_SIZES).toContain('none');
      expect(SHAPE_ELEVATION_UTILS.SHAPE_SIZES).toContain('xs');
      expect(SHAPE_ELEVATION_UTILS.SHAPE_SIZES).toContain('sm');
      expect(SHAPE_ELEVATION_UTILS.SHAPE_SIZES).toContain('md');
      expect(SHAPE_ELEVATION_UTILS.SHAPE_SIZES).toContain('lg');
      expect(SHAPE_ELEVATION_UTILS.SHAPE_SIZES).toContain('xl');
      expect(SHAPE_ELEVATION_UTILS.SHAPE_SIZES).toContain('full');
    });

    test('contains expected expressive shapes', () => {
      expect(SHAPE_ELEVATION_UTILS.EXPRESSIVE_SHAPES).toContain('xs-expressive');
      expect(SHAPE_ELEVATION_UTILS.EXPRESSIVE_SHAPES).toContain('lg-expressive');
      expect(SHAPE_ELEVATION_UTILS.EXPRESSIVE_SHAPES).toContain('xl-expressive');
    });

    test('contains expected elevation levels', () => {
      expect(SHAPE_ELEVATION_UTILS.ELEVATION_LEVELS).toEqual([0, 1, 2, 3, 4, 5]);
    });

    test('contains expected components', () => {
      expect(SHAPE_ELEVATION_UTILS.COMPONENTS).toContain('card');
      expect(SHAPE_ELEVATION_UTILS.COMPONENTS).toContain('dialog');
      expect(SHAPE_ELEVATION_UTILS.COMPONENTS).toContain('fab');
    });

    test('contains animation durations', () => {
      expect(SHAPE_ELEVATION_UTILS.ANIMATION_DURATIONS.FAST).toBe(150);
      expect(SHAPE_ELEVATION_UTILS.ANIMATION_DURATIONS.NORMAL).toBe(300);
      expect(SHAPE_ELEVATION_UTILS.ANIMATION_DURATIONS.SLOW).toBe(500);
    });

    test('contains breakpoints', () => {
      expect(SHAPE_ELEVATION_UTILS.BREAKPOINTS.COMPACT).toBe(600);
      expect(SHAPE_ELEVATION_UTILS.BREAKPOINTS.MEDIUM).toBe(1200);
    });
  });

  describe('Edge cases and error handling', () => {
    test('handles server-side rendering gracefully', () => {
      // Mock missing window object
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally testing server-side context
      delete global.window;

      // Functions should not throw in SSR context
      expect(() => ShapeUtils.applyShape(testElement, 'md')).not.toThrow();
      expect(() => ElevationUtils.applyElevation(testElement, 2)).not.toThrow();
      expect(() => SurfaceUtils.createSurface(testElement, { shape: 'md' })).not.toThrow();
      
      // Restore window
      global.window = originalWindow;
    });

    test('handles element removal during animation', async () => {
      const promise = AnimationUtils.morphShape(testElement, 'sm', 'lg', 50);
      
      // Remove element during animation
      testElement.remove();
      
      // Should still resolve without error
      await expect(promise).resolves.toBeUndefined();
    });

    test('handles missing CSS custom properties gracefully', () => {
      // Remove CSS custom property
      document.documentElement.style.removeProperty('--m3-shape-corner-md');
      
      // Should still apply class without error
      expect(() => ShapeUtils.applyShape(testElement, 'md')).not.toThrow();
      expect(testElement.classList.contains('m3-shape-md')).toBe(true);
    });
  });
});