/**
 * @jest-environment jsdom
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import {
  useMotionPreferences,
  useTransition,
  useSharedElementTransition,
  usePerformanceOptimizedAnimation,
  useMicroInteraction,
  useKeyframeAnimation,
  useAnimationFrame,
  useAnimationPerformance,
  useRippleEffect,
  useMotionSystem
} from '../useMotionSystem';

// Mock the motion system utilities
jest.mock('../../utils/material3-motion-system', () => ({
  createTransition: jest.fn((config) => `transition: ${config.property || 'all'} ${config.duration || 300}ms`),
  SharedElementTransitions: {
    fade: {
      enter: { opacity: 0, transition: 'opacity 300ms ease' },
      enterActive: { opacity: 1 },
      exit: { opacity: 1, transition: 'opacity 200ms ease' },
      exitActive: { opacity: 0 }
    },
    scale: {
      enter: { opacity: 0, transform: 'scale(0.8)', transition: 'opacity 350ms ease, transform 350ms ease' },
      enterActive: { opacity: 1, transform: 'scale(1)' },
      exit: { opacity: 1, transform: 'scale(1)', transition: 'opacity 300ms ease, transform 300ms ease' },
      exitActive: { opacity: 0, transform: 'scale(0.9)' }
    }
  },
  PerformanceOptimizedAnimations: {
    transform: { willChange: 'transform', backfaceVisibility: 'hidden', perspective: 1000 },
    opacity: { willChange: 'opacity' },
    transformOpacity: { willChange: 'transform, opacity', backfaceVisibility: 'hidden', perspective: 1000 },
    cleanup: { willChange: 'auto', backfaceVisibility: 'visible', perspective: 'none' }
  },
  MicroInteractions: {
    buttonPress: { transform: 'scale(0.98)', transition: 'transform 50ms ease' },
    cardHover: { transform: 'translateY(-2px)', boxShadow: 'var(--md-sys-elevation-level3)', transition: 'transform 200ms ease, box-shadow 200ms ease' }
  },
  ReducedMotionAlternatives: {
    getTransition: jest.fn((normal, reduced) => normal)
  },
  AnimationFrameUtils: {
    requestFrame: jest.fn((callback) => {
      setTimeout(callback, 16);
      return 1;
    }),
    cancelFrame: jest.fn(),
    throttleToFrame: jest.fn((callback) => callback)
  },
  applyMotionStyles: jest.fn(),
  createKeyframeAnimation: jest.fn((name) => `${name} 300ms ease forwards`)
}));

describe('useMotionSystem Hooks', () => {
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

    // Mock performance
    Object.defineProperty(window, 'performance', {
      writable: true,
      value: {
        now: jest.fn(() => Date.now())
      }
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('useMotionPreferences', () => {
    it('should initialize with reduced motion preference', () => {
      const { result } = renderHook(() => useMotionPreferences());
      
      expect(result.current.prefersReducedMotion).toBe(false);
      expect(typeof result.current.getTransition).toBe('function');
    });

    it('should detect reduced motion preference', () => {
      // Mock reduced motion preference
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useMotionPreferences());
      
      expect(result.current.prefersReducedMotion).toBe(true);
    });

    it('should handle media query changes', () => {
      let mediaQueryCallback: ((e: MediaQueryListEvent) => void) | null = null;
      
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((event, callback) => {
          if (event === 'change') {
            mediaQueryCallback = callback;
          }
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useMotionPreferences());
      
      expect(result.current.prefersReducedMotion).toBe(false);

      // Simulate media query change
      if (mediaQueryCallback) {
        act(() => {
          mediaQueryCallback({ matches: true } as MediaQueryListEvent);
        });
      }

      expect(result.current.prefersReducedMotion).toBe(true);
    });
  });

  describe('useTransition', () => {
    it('should create transition with default config', () => {
      const { result } = renderHook(() => useTransition());
      
      expect(result.current.transition).toBeDefined();
      expect(result.current.style).toHaveProperty('transition');
    });

    it('should create transition with custom config', () => {
      const config = { property: 'opacity', duration: 500 };
      const { result } = renderHook(() => useTransition(config));
      
      expect(result.current.transition).toBeDefined();
      expect(result.current.style.transition).toBeDefined();
    });
  });

  describe('useSharedElementTransition', () => {
    it('should initialize with default fade transition', () => {
      const { result } = renderHook(() => useSharedElementTransition());
      
      expect(result.current.isEntering).toBe(false);
      expect(result.current.isExiting).toBe(false);
      expect(typeof result.current.enter).toBe('function');
      expect(typeof result.current.exit).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('should handle enter transition', () => {
      const { result } = renderHook(() => useSharedElementTransition('fade'));
      
      act(() => {
        result.current.enter();
      });
      
      expect(result.current.isEntering).toBe(true);
      expect(result.current.isExiting).toBe(false);
    });

    it('should handle exit transition', () => {
      const { result } = renderHook(() => useSharedElementTransition('fade'));
      
      act(() => {
        result.current.exit();
      });
      
      expect(result.current.isEntering).toBe(false);
      expect(result.current.isExiting).toBe(true);
    });

    it('should reset transition state', () => {
      const { result } = renderHook(() => useSharedElementTransition('fade'));
      
      act(() => {
        result.current.enter();
      });
      
      expect(result.current.isEntering).toBe(true);
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.isEntering).toBe(false);
      expect(result.current.isExiting).toBe(false);
    });

    it('should return appropriate styles for different states', () => {
      const { result } = renderHook(() => useSharedElementTransition('fade'));
      
      // Initial state
      expect(result.current.styles).toEqual({ opacity: 0, transition: 'opacity 300ms ease' });
      
      // Entering state
      act(() => {
        result.current.enter();
      });
      
      expect(result.current.styles).toEqual({ 
        opacity: 1, 
        transition: 'opacity 300ms ease' 
      });
      
      // Exiting state
      act(() => {
        result.current.exit();
      });
      
      expect(result.current.styles).toEqual({ 
        opacity: 0, 
        transition: 'opacity 200ms ease' 
      });
    });

    it('should handle scale transition type', () => {
      const { result } = renderHook(() => useSharedElementTransition('scale'));
      
      expect(result.current.styles).toEqual({ 
        opacity: 0, 
        transform: 'scale(0.8)', 
        transition: 'opacity 350ms ease, transform 350ms ease' 
      });
    });

    it('should simplify styles for reduced motion', () => {
      // Mock reduced motion preference
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useSharedElementTransition('scale'));
      
      // Should return simplified styles for reduced motion
      expect(result.current.styles).toEqual({});
      
      act(() => {
        result.current.enter();
      });
      
      expect(result.current.styles).toEqual({ opacity: 1 });
    });
  });

  describe('usePerformanceOptimizedAnimation', () => {
    it('should initialize with default transform-opacity optimization', () => {
      const { result } = renderHook(() => usePerformanceOptimizedAnimation());
      
      expect(result.current.isAnimating).toBe(false);
      expect(typeof result.current.startAnimation).toBe('function');
      expect(typeof result.current.endAnimation).toBe('function');
      expect(result.current.optimizationStyles).toEqual({
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        perspective: 1000
      });
    });

    it('should handle different animation types', () => {
      const { result } = renderHook(() => usePerformanceOptimizedAnimation('opacity'));
      
      expect(result.current.optimizationStyles).toEqual({
        willChange: 'opacity'
      });
    });

    it('should manage animation state', () => {
      const { result } = renderHook(() => usePerformanceOptimizedAnimation());
      
      act(() => {
        result.current.startAnimation();
      });
      
      expect(result.current.isAnimating).toBe(true);
      
      act(() => {
        result.current.endAnimation();
      });
      
      expect(result.current.isAnimating).toBe(false);
    });
  });

  describe('useMicroInteraction', () => {
    it('should initialize micro-interaction', () => {
      const { result } = renderHook(() => useMicroInteraction('buttonPress'));
      
      expect(result.current.isActive).toBe(false);
      expect(typeof result.current.activate).toBe('function');
      expect(typeof result.current.deactivate).toBe('function');
      expect(result.current.handlers).toHaveProperty('onMouseDown');
      expect(result.current.handlers).toHaveProperty('onMouseUp');
    });

    it('should activate and deactivate interaction', () => {
      const { result } = renderHook(() => useMicroInteraction('buttonPress'));
      
      act(() => {
        result.current.activate();
      });
      
      expect(result.current.isActive).toBe(true);
      expect(result.current.styles).toEqual({
        transform: 'scale(0.98)',
        transition: 'transform 50ms ease'
      });
      
      act(() => {
        result.current.deactivate();
      });
      
      expect(result.current.isActive).toBe(false);
      expect(result.current.styles).toEqual({});
    });

    it('should respect reduced motion preference', () => {
      // Mock reduced motion preference
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useMicroInteraction('buttonPress'));
      
      act(() => {
        result.current.activate();
      });
      
      // Should not activate with reduced motion
      expect(result.current.isActive).toBe(false);
    });
  });

  describe('useKeyframeAnimation', () => {
    it('should initialize keyframe animation manager', () => {
      const { result } = renderHook(() => useKeyframeAnimation());
      
      expect(result.current.activeAnimations).toEqual([]);
      expect(typeof result.current.createAnimation).toBe('function');
      expect(typeof result.current.removeAnimation).toBe('function');
      expect(typeof result.current.clearAllAnimations).toBe('function');
    });

    it('should create and track animations', () => {
      const { result } = renderHook(() => useKeyframeAnimation());
      
      const keyframes = {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      };
      
      let animation: string;
      act(() => {
        animation = result.current.createAnimation('test-animation', keyframes);
      });
      
      expect(animation!).toBe('test-animation 300ms ease forwards');
      expect(result.current.activeAnimations).toContain('test-animation');
    });

    it('should remove animations', () => {
      const { result } = renderHook(() => useKeyframeAnimation());
      
      const keyframes = {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      };
      
      act(() => {
        result.current.createAnimation('test-animation', keyframes);
      });
      
      expect(result.current.activeAnimations).toContain('test-animation');
      
      act(() => {
        result.current.removeAnimation('test-animation');
      });
      
      expect(result.current.activeAnimations).not.toContain('test-animation');
    });

    it('should clear all animations', () => {
      const { result } = renderHook(() => useKeyframeAnimation());
      
      const keyframes = {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      };
      
      act(() => {
        result.current.createAnimation('animation1', keyframes);
        result.current.createAnimation('animation2', keyframes);
      });
      
      expect(result.current.activeAnimations.length).toBe(2);
      
      act(() => {
        result.current.clearAllAnimations();
      });
      
      expect(result.current.activeAnimations).toEqual([]);
    });

    it('should return "none" for reduced motion', () => {
      // Mock reduced motion preference
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useKeyframeAnimation());
      
      const keyframes = {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      };
      
      let animation: string;
      act(() => {
        animation = result.current.createAnimation('test-animation', keyframes);
      });
      
      expect(animation!).toBe('none');
    });
  });

  describe('useAnimationFrame', () => {
    it('should manage animation frame callbacks', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useAnimationFrame(callback));
      
      expect(result.current.isRunning).toBe(false);
      expect(typeof result.current.start).toBe('function');
      expect(typeof result.current.stop).toBe('function');
    });

    it('should start and stop animation frames', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useAnimationFrame(callback));
      
      // Test that functions exist and can be called
      expect(typeof result.current.start).toBe('function');
      expect(typeof result.current.stop).toBe('function');
      
      act(() => {
        result.current.start();
      });
      
      act(() => {
        result.current.stop();
      });
      
      // Just verify the functions can be called without error
      expect(result.current.start).toBeDefined();
      expect(result.current.stop).toBeDefined();
    });
  });

  describe('useAnimationPerformance', () => {
    it('should initialize performance measurement', () => {
      const { result } = renderHook(() => useAnimationPerformance());
      
      expect(result.current.measurements).toEqual({});
      expect(typeof result.current.measureAnimation).toBe('function');
      expect(typeof result.current.clearMeasurements).toBe('function');
      expect(typeof result.current.getAverageTime).toBe('function');
    });

    it('should measure animation performance', () => {
      const { result } = renderHook(() => useAnimationPerformance());
      
      const animationCallback = jest.fn();
      
      act(() => {
        result.current.measureAnimation('test-animation', animationCallback);
      });
      
      expect(animationCallback).toHaveBeenCalled();
      expect(result.current.measurements).toHaveProperty('test-animation');
      expect(typeof result.current.measurements['test-animation']).toBe('number');
    });

    it('should clear measurements', () => {
      const { result } = renderHook(() => useAnimationPerformance());
      
      act(() => {
        result.current.measureAnimation('test-animation', jest.fn());
      });
      
      expect(Object.keys(result.current.measurements).length).toBeGreaterThan(0);
      
      act(() => {
        result.current.clearMeasurements();
      });
      
      expect(result.current.measurements).toEqual({});
    });

    it('should calculate average time', () => {
      const { result } = renderHook(() => useAnimationPerformance());
      
      act(() => {
        result.current.measureAnimation('test-animation-1', jest.fn());
        result.current.measureAnimation('test-animation-2', jest.fn());
      });
      
      const average = result.current.getAverageTime('test-animation');
      expect(typeof average).toBe('number');
      expect(average).toBeGreaterThanOrEqual(0);
    });
  });

  describe('useRippleEffect', () => {
    it('should initialize ripple effect', () => {
      const { result } = renderHook(() => useRippleEffect());
      
      expect(result.current.ref).toBeDefined();
      expect(typeof result.current.createRipple).toBe('function');
      expect(result.current.rippleHandlers).toHaveProperty('onMouseDown');
      expect(result.current.rippleHandlers).toHaveProperty('onTouchStart');
    });

    it('should create ripple on interaction', () => {
      const { result } = renderHook(() => useRippleEffect());
      
      // Mock container element
      const mockContainer = document.createElement('div');
      mockContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        right: 100,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: jest.fn()
      }));
      
      // Set the ref
      if (result.current.ref.current) {
        result.current.ref.current = mockContainer;
      }
      
      const mockEvent = {
        clientX: 50,
        clientY: 50
      } as React.MouseEvent;
      
      act(() => {
        result.current.createRipple(mockEvent);
      });
      
      // Should create ripple element (in real implementation)
      // This is a basic test to ensure the function runs without error
      expect(result.current.createRipple).toBeDefined();
    });
  });

  describe('useMotionSystem', () => {
    it('should combine all motion system hooks', () => {
      const { result } = renderHook(() => useMotionSystem());
      
      // Should include properties from all sub-hooks
      expect(result.current).toHaveProperty('prefersReducedMotion');
      expect(result.current).toHaveProperty('getTransition');
      expect(result.current).toHaveProperty('startAnimation');
      expect(result.current).toHaveProperty('endAnimation');
      expect(result.current).toHaveProperty('createAnimation');
      expect(result.current).toHaveProperty('measureAnimation');
      expect(result.current).toHaveProperty('createRipple');
      expect(result.current).toHaveProperty('createTransition');
      expect(result.current).toHaveProperty('useTransition');
      expect(result.current).toHaveProperty('useSharedElementTransition');
      expect(result.current).toHaveProperty('useMicroInteraction');
      expect(result.current).toHaveProperty('useAnimationFrame');
    });
  });
});