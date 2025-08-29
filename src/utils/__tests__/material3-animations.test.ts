/**
 * Tests for Material 3 Animation System
 */

import {
  createSharedElementTransition,
  createLoadingAnimation,
  createMicroInteraction,
  createPageTransition,
  createOptimizedAnimation,
  AnimationPerformanceManager,
  MATERIAL3_EASING,
  MATERIAL3_DURATION,
} from '../material3-animations';

// Mock Web Animations API
const mockAnimate = jest.fn();
const mockAnimation = {
  cancel: jest.fn(),
  pause: jest.fn(),
  play: jest.fn(),
  reverse: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  finish: jest.fn(),
};

// Mock DOM methods
Object.defineProperty(HTMLElement.prototype, 'animate', {
  value: mockAnimate.mockReturnValue(mockAnimation),
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  value: jest.fn(() => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
  })),
  writable: true,
});

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

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

describe('Material3 Animation System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Animation Constants', () => {
    it('should have correct easing curves', () => {
      expect(MATERIAL3_EASING.standard).toBe('cubic-bezier(0.2, 0.0, 0, 1.0)');
      expect(MATERIAL3_EASING.emphasized).toBe('cubic-bezier(0.05, 0.7, 0.1, 1.0)');
      expect(MATERIAL3_EASING.decelerated).toBe('cubic-bezier(0.0, 0.0, 0.2, 1.0)');
      expect(MATERIAL3_EASING.accelerated).toBe('cubic-bezier(0.4, 0.0, 1, 1.0)');
      expect(MATERIAL3_EASING.expressive).toBe('cubic-bezier(0.4, 0.0, 0.2, 1.0)');
      expect(MATERIAL3_EASING.organic).toBe('cubic-bezier(0.25, 0.46, 0.45, 0.94)');
    });

    it('should have correct duration tokens', () => {
      expect(MATERIAL3_DURATION.short1).toBe('50ms');
      expect(MATERIAL3_DURATION.short4).toBe('200ms');
      expect(MATERIAL3_DURATION.medium2).toBe('300ms');
      expect(MATERIAL3_DURATION.long2).toBe('500ms');
      expect(MATERIAL3_DURATION.extraLong4).toBe('1000ms');
    });
  });

  describe('createSharedElementTransition', () => {
    it('should create shared element transition animation', () => {
      const element = document.createElement('div');
      const targetElement = document.createElement('div');

      const animation = createSharedElementTransition({
        element,
        targetElement,
      });

      expect(mockAnimate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            transform: 'translate(0, 0) scale(1)',
            opacity: 1,
          }),
          expect.objectContaining({
            transform: expect.stringContaining('translate'),
            opacity: 1,
          }),
        ]),
        expect.objectContaining({
          duration: 300,
          easing: MATERIAL3_EASING.emphasized,
          fill: 'forwards',
        })
      );

      expect(animation).toBe(mockAnimation);
    });

    it('should return null for invalid element', () => {
      const animation = createSharedElementTransition({
        element: null as any,
      });

      expect(animation).toBeNull();
      expect(mockAnimate).not.toHaveBeenCalled();
    });

    it('should use custom duration and easing', () => {
      const element = document.createElement('div');

      createSharedElementTransition({
        element,
        duration: MATERIAL3_DURATION.long2,
        easing: MATERIAL3_EASING.organic,
      });

      expect(mockAnimate).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          duration: 500,
          easing: MATERIAL3_EASING.organic,
        })
      );
    });
  });

  describe('createLoadingAnimation', () => {
    it('should create pulse loading animation', () => {
      const element = document.createElement('div');

      const animation = createLoadingAnimation(element, {
        type: 'pulse',
        intensity: 'moderate',
      });

      expect(mockAnimate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ opacity: 0.6, transform: 'scale(1)' }),
          expect.objectContaining({ opacity: 1, transform: 'scale(1.05)' }),
          expect.objectContaining({ opacity: 0.6, transform: 'scale(1)' }),
        ]),
        expect.objectContaining({
          duration: 500,
          easing: MATERIAL3_EASING.organic,
          iterations: Infinity,
        })
      );

      expect(animation).toBe(mockAnimation);
    });

    it('should create wave loading animation', () => {
      const element = document.createElement('div');

      createLoadingAnimation(element, {
        type: 'wave',
        intensity: 'subtle',
      });

      expect(mockAnimate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ transform: 'translateX(-100%)', opacity: 0 }),
          expect.objectContaining({ transform: 'translateX(0%)', opacity: 0.8 }),
          expect.objectContaining({ transform: 'translateX(100%)', opacity: 0 }),
        ]),
        expect.objectContaining({
          duration: 750,
          easing: MATERIAL3_EASING.emphasized,
          iterations: Infinity,
        })
      );
    });

    it('should create organic loading animation', () => {
      const element = document.createElement('div');

      createLoadingAnimation(element, {
        type: 'organic',
        intensity: 'prominent',
      });

      expect(mockAnimate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            transform: 'scale(1) rotate(0deg)',
            borderRadius: '50%',
            opacity: 0.8,
          }),
          expect.objectContaining({
            transform: 'scale(1.8) rotate(180deg)',
            borderRadius: '30%',
            opacity: 1,
          }),
          expect.objectContaining({
            transform: 'scale(1) rotate(360deg)',
            borderRadius: '50%',
            opacity: 0.8,
          }),
        ]),
        expect.objectContaining({
          duration: 1000,
          easing: MATERIAL3_EASING.organic,
          iterations: Infinity,
        })
      );
    });

    it('should return null for invalid element', () => {
      const animation = createLoadingAnimation(null as any, { type: 'pulse' });

      expect(animation).toBeNull();
      expect(mockAnimate).not.toHaveBeenCalled();
    });
  });

  describe('createMicroInteraction', () => {
    it('should create scale micro-interaction', () => {
      const element = document.createElement('div');

      const animation = createMicroInteraction(element, {
        trigger: 'hover',
        animation: 'scale',
        intensity: 'moderate',
      });

      expect(mockAnimate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ transform: 'scale(1)' }),
          expect.objectContaining({ transform: 'scale(1.05)' }),
          expect.objectContaining({ transform: 'scale(1)' }),
        ]),
        expect.objectContaining({
          duration: 200,
          easing: MATERIAL3_EASING.emphasized,
        })
      );

      expect(animation).toBe(mockAnimation);
    });

    it('should create shake micro-interaction', () => {
      const element = document.createElement('div');

      createMicroInteraction(element, {
        trigger: 'validation',
        animation: 'shake',
        intensity: 'subtle',
      });

      expect(mockAnimate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ transform: 'translateX(0)' }),
          expect.objectContaining({ transform: 'translateX(-2px)' }),
          expect.objectContaining({ transform: 'translateX(2px)' }),
        ]),
        expect.objectContaining({
          duration: 400,
          easing: MATERIAL3_EASING.emphasized,
        })
      );
    });

    it('should create ripple micro-interaction', () => {
      const element = document.createElement('div');
      element.style.position = 'relative';

      const animation = createMicroInteraction(element, {
        trigger: 'click',
        animation: 'ripple',
        intensity: 'moderate',
      });

      expect(element.children.length).toBe(1);
      expect(element.children[0].tagName).toBe('DIV');
      expect(animation).toBe(mockAnimation);
    });

    it('should return null for invalid element', () => {
      const animation = createMicroInteraction(null as any, {
        trigger: 'hover',
        animation: 'scale',
      });

      expect(animation).toBeNull();
      expect(mockAnimate).not.toHaveBeenCalled();
    });
  });

  describe('createPageTransition', () => {
    it('should create forward page transition', async () => {
      const exitElement = document.createElement('div');
      const enterElement = document.createElement('div');

      const transitionPromise = createPageTransition(exitElement, enterElement, 'forward');

      expect(mockAnimate).toHaveBeenCalledTimes(2);

      // Simulate animation completion
      const enterAnimationCall = mockAnimate.mock.calls[1];
      const mockEnterAnimation = mockAnimate.mock.results[1].value;
      
      // Trigger the finish event
      setTimeout(() => {
        const finishHandler = mockEnterAnimation.addEventListener.mock.calls
          .find(call => call[0] === 'finish')?.[1];
        if (finishHandler) {
          finishHandler();
        }
      }, 0);

      await transitionPromise;

      expect(enterElement.style.transform).toBe('');
      expect(enterElement.style.opacity).toBe('');
    });

    it('should create backward page transition', async () => {
      const exitElement = document.createElement('div');
      const enterElement = document.createElement('div');

      const transitionPromise = createPageTransition(exitElement, enterElement, 'backward');

      expect(mockAnimate).toHaveBeenCalledTimes(2);

      // Check exit animation
      const exitAnimationCall = mockAnimate.mock.calls[0];
      expect(exitAnimationCall[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ transform: 'translateX(0)', opacity: 1 }),
          expect.objectContaining({ transform: 'translateX(100%)', opacity: 0 }),
        ])
      );

      // Check enter animation
      const enterAnimationCall = mockAnimate.mock.calls[1];
      expect(enterAnimationCall[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ transform: 'translateX(-100%)', opacity: 0 }),
          expect.objectContaining({ transform: 'translateX(0)', opacity: 1 }),
        ])
      );
    });
  });

  describe('AnimationPerformanceManager', () => {
    let manager: AnimationPerformanceManager;

    beforeEach(() => {
      manager = AnimationPerformanceManager.getInstance();
    });

    it('should be a singleton', () => {
      const manager2 = AnimationPerformanceManager.getInstance();
      expect(manager).toBe(manager2);
    });

    it('should register and track animations', () => {
      const animation = mockAnimation;
      
      manager.registerAnimation(animation);
      
      expect(manager.getActiveAnimationCount()).toBe(1);
    });

    it('should pause and resume animations', () => {
      const animation = mockAnimation;
      manager.registerAnimation(animation);

      manager.pauseAllAnimations();
      expect(animation.pause).toHaveBeenCalled();

      manager.resumeAllAnimations();
      expect(animation.play).toHaveBeenCalled();
    });

    it('should detect reduced motion preference', () => {
      const isReducedMotion = manager.isReducedMotionPreferred();
      expect(typeof isReducedMotion).toBe('boolean');
    });

    it('should optimize for device capabilities', () => {
      const config = manager.optimizeForDevice();
      
      expect(config).toHaveProperty('duration');
      expect(config).toHaveProperty('easing');
      expect(typeof config.duration).toBe('string');
      expect(typeof config.easing).toBe('string');
    });

    it('should cancel animations for reduced motion', () => {
      // Mock reduced motion
      (window.matchMedia as jest.Mock).mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
      });

      const newManager = new (AnimationPerformanceManager as any)();
      const animation = mockAnimation;

      newManager.registerAnimation(animation);

      expect(animation.cancel).toHaveBeenCalled();
    });
  });

  describe('createOptimizedAnimation', () => {
    it('should create optimized animation', () => {
      const element = document.createElement('div');
      const keyframes = [
        { transform: 'scale(1)' },
        { transform: 'scale(1.1)' },
      ];
      const options = {
        duration: 300,
        easing: MATERIAL3_EASING.emphasized,
      };

      const animation = createOptimizedAnimation(element, keyframes, options);

      expect(mockAnimate).toHaveBeenCalledWith(keyframes, expect.objectContaining(options));
      expect(animation).toBe(mockAnimation);
    });

    it('should return null for reduced motion', () => {
      // Mock reduced motion
      const manager = AnimationPerformanceManager.getInstance();
      jest.spyOn(manager, 'isReducedMotionPreferred').mockReturnValue(true);

      const element = document.createElement('div');
      const keyframes = [{ transform: 'scale(1)' }];
      const options = { duration: 300 };

      const animation = createOptimizedAnimation(element, keyframes, options);

      expect(animation).toBeNull();
      expect(mockAnimate).not.toHaveBeenCalled();
    });

    it('should apply final state for reduced motion', () => {
      // Mock reduced motion
      const manager = AnimationPerformanceManager.getInstance();
      jest.spyOn(manager, 'isReducedMotionPreferred').mockReturnValue(true);

      const element = document.createElement('div');
      const keyframes = [
        { transform: 'scale(1)', opacity: '0' },
        { transform: 'scale(1.1)', opacity: '1' },
      ];

      createOptimizedAnimation(element, keyframes, { duration: 300 });

      expect(element.style.transform).toBe('scale(1.1)');
      expect(element.style.opacity).toBe('1');
    });
  });

  describe('Performance Monitoring', () => {
    it('should setup performance observer when available', () => {
      expect(global.PerformanceObserver).toHaveBeenCalled();
    });

    it('should handle performance observer errors gracefully', () => {
      const originalObserve = PerformanceObserver.prototype.observe;
      PerformanceObserver.prototype.observe = jest.fn().mockImplementation(() => {
        throw new Error('Not supported');
      });

      expect(() => {
        AnimationPerformanceManager.getInstance();
      }).not.toThrow();

      PerformanceObserver.prototype.observe = originalObserve;
    });
  });

  describe('Device Detection', () => {
    it('should detect low-end device based on memory', () => {
      // Mock low device memory
      Object.defineProperty(navigator, 'deviceMemory', {
        value: 2,
        writable: true,
      });

      const manager = AnimationPerformanceManager.getInstance();
      const config = manager.optimizeForDevice();

      expect(config.duration).toBe(MATERIAL3_DURATION.short2);
      expect(config.easing).toBe(MATERIAL3_EASING.standard);
    });

    it('should detect low-end device based on CPU cores', () => {
      // Mock low hardware concurrency
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 2,
        writable: true,
      });

      const manager = AnimationPerformanceManager.getInstance();
      const config = manager.optimizeForDevice();

      expect(config.duration).toBe(MATERIAL3_DURATION.short2);
    });
  });
});