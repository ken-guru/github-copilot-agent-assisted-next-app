/**
 * @jest-environment jsdom
 */

import {
  Material3Easing,
  Material3Duration,
  getDurationForAnimationType,
  createTransition,
  SharedElementTransitions,
  PerformanceOptimizedAnimations,
  MicroInteractions,
  ReducedMotionAlternatives,
  AnimationFrameUtils,
  applyMotionStyles,
  createKeyframeAnimation,
  getMotionCSSProperties,
  type AnimationType,
  type TransitionConfig
} from '../material3-motion-system';

describe('Material3 Motion System', () => {
  describe('Material3Easing', () => {
    it('should provide correct easing curve values', () => {
      expect(Material3Easing.standard).toBe('cubic-bezier(0.2, 0.0, 0, 1.0)');
      expect(Material3Easing.emphasized).toBe('cubic-bezier(0.2, 0.0, 0, 1.0)');
      expect(Material3Easing.emphasizedDecelerate).toBe('cubic-bezier(0.05, 0.7, 0.1, 1.0)');
      expect(Material3Easing.emphasizedAccelerate).toBe('cubic-bezier(0.3, 0.0, 0.8, 0.15)');
      expect(Material3Easing.legacy).toBe('cubic-bezier(0.4, 0.0, 0.2, 1.0)');
      expect(Material3Easing.linear).toBe('cubic-bezier(0.0, 0.0, 1.0, 1.0)');
    });

    it('should have all required easing curves', () => {
      const expectedEasings = [
        'standard',
        'emphasized',
        'emphasizedDecelerate',
        'emphasizedAccelerate',
        'legacy',
        'linear'
      ];

      expectedEasings.forEach(easing => {
        expect(Material3Easing).toHaveProperty(easing);
        expect(typeof Material3Easing[easing as keyof typeof Material3Easing]).toBe('string');
      });
    });
  });

  describe('Material3Duration', () => {
    it('should provide correct duration values in milliseconds', () => {
      expect(Material3Duration.short1).toBe(50);
      expect(Material3Duration.short2).toBe(100);
      expect(Material3Duration.short3).toBe(150);
      expect(Material3Duration.short4).toBe(200);
      expect(Material3Duration.medium1).toBe(250);
      expect(Material3Duration.medium2).toBe(300);
      expect(Material3Duration.medium3).toBe(350);
      expect(Material3Duration.medium4).toBe(400);
      expect(Material3Duration.long1).toBe(450);
      expect(Material3Duration.long2).toBe(500);
      expect(Material3Duration.long3).toBe(550);
      expect(Material3Duration.long4).toBe(600);
      expect(Material3Duration.extraLong1).toBe(700);
      expect(Material3Duration.extraLong2).toBe(800);
      expect(Material3Duration.extraLong3).toBe(900);
      expect(Material3Duration.extraLong4).toBe(1000);
    });

    it('should have progressive duration scaling', () => {
      // Short durations should be under 250ms
      expect(Material3Duration.short1).toBeLessThan(250);
      expect(Material3Duration.short4).toBeLessThan(250);

      // Medium durations should be 250-400ms
      expect(Material3Duration.medium1).toBeGreaterThanOrEqual(250);
      expect(Material3Duration.medium4).toBeLessThanOrEqual(400);

      // Long durations should be 400-600ms
      expect(Material3Duration.long1).toBeGreaterThan(400);
      expect(Material3Duration.long4).toBeLessThanOrEqual(600);

      // Extra long durations should be over 600ms
      expect(Material3Duration.extraLong1).toBeGreaterThan(600);
    });
  });

  describe('getDurationForAnimationType', () => {
    it('should return appropriate durations for each animation type', () => {
      expect(getDurationForAnimationType('micro')).toBe(Material3Duration.short1);
      expect(getDurationForAnimationType('simple')).toBe(Material3Duration.short3);
      expect(getDurationForAnimationType('complex')).toBe(Material3Duration.medium2);
      expect(getDurationForAnimationType('elaborate')).toBe(Material3Duration.long2);
      expect(getDurationForAnimationType('expressive')).toBe(Material3Duration.extraLong1);
    });

    it('should return default duration for unknown animation type', () => {
      expect(getDurationForAnimationType('unknown' as AnimationType)).toBe(Material3Duration.medium2);
    });
  });

  describe('createTransition', () => {
    it('should create basic transition with defaults', () => {
      const transition = createTransition({});
      expect(transition).toBe('all 300ms cubic-bezier(0.2, 0.0, 0, 1.0) 0ms');
    });

    it('should create transition with custom property', () => {
      const transition = createTransition({ property: 'opacity' });
      expect(transition).toBe('opacity 300ms cubic-bezier(0.2, 0.0, 0, 1.0) 0ms');
    });

    it('should create transition with multiple properties', () => {
      const transition = createTransition({ property: ['opacity', 'transform'] });
      expect(transition).toBe('opacity 300ms cubic-bezier(0.2, 0.0, 0, 1.0) 0ms, transform 300ms cubic-bezier(0.2, 0.0, 0, 1.0) 0ms');
    });

    it('should create transition with custom duration as number', () => {
      const transition = createTransition({ duration: 500 });
      expect(transition).toBe('all 500ms cubic-bezier(0.2, 0.0, 0, 1.0) 0ms');
    });

    it('should create transition with custom duration as key', () => {
      const transition = createTransition({ duration: 'long1' });
      expect(transition).toBe('all 450ms cubic-bezier(0.2, 0.0, 0, 1.0) 0ms');
    });

    it('should create transition with custom easing', () => {
      const transition = createTransition({ easing: 'emphasizedDecelerate' });
      expect(transition).toBe('all 300ms cubic-bezier(0.05, 0.7, 0.1, 1.0) 0ms');
    });

    it('should create transition with delay', () => {
      const transition = createTransition({ delay: 100 });
      expect(transition).toBe('all 300ms cubic-bezier(0.2, 0.0, 0, 1.0) 100ms');
    });

    it('should create complex transition with all options', () => {
      const transition = createTransition({
        property: ['opacity', 'transform'],
        duration: 'medium4',
        easing: 'emphasizedAccelerate',
        delay: 50
      });
      expect(transition).toBe('opacity 400ms cubic-bezier(0.3, 0.0, 0.8, 0.15) 50ms, transform 400ms cubic-bezier(0.3, 0.0, 0.8, 0.15) 50ms');
    });
  });

  describe('SharedElementTransitions', () => {
    it('should provide fade transition states', () => {
      const fade = SharedElementTransitions.fade;
      
      expect(fade.enter).toHaveProperty('opacity', 0);
      expect(fade.enter).toHaveProperty('transition');
      expect(fade.enterActive).toHaveProperty('opacity', 1);
      expect(fade.exit).toHaveProperty('opacity', 1);
      expect(fade.exit).toHaveProperty('transition');
      expect(fade.exitActive).toHaveProperty('opacity', 0);
    });

    it('should provide scale transition states', () => {
      const scale = SharedElementTransitions.scale;
      
      expect(scale.enter).toHaveProperty('opacity', 0);
      expect(scale.enter).toHaveProperty('transform', 'scale(0.8)');
      expect(scale.enterActive).toHaveProperty('opacity', 1);
      expect(scale.enterActive).toHaveProperty('transform', 'scale(1)');
      expect(scale.exit).toHaveProperty('transform', 'scale(1)');
      expect(scale.exitActive).toHaveProperty('transform', 'scale(0.9)');
    });

    it('should provide slide transition states', () => {
      const slide = SharedElementTransitions.slide;
      
      expect(slide.enter).toHaveProperty('transform', 'translateX(24px)');
      expect(slide.enterActive).toHaveProperty('transform', 'translateX(0)');
      expect(slide.exit).toHaveProperty('transform', 'translateX(0)');
      expect(slide.exitActive).toHaveProperty('transform', 'translateX(-24px)');
    });

    it('should provide elevation transition states', () => {
      const elevation = SharedElementTransitions.elevation;
      
      expect(elevation.enter).toHaveProperty('boxShadow', 'var(--md-sys-elevation-level0)');
      expect(elevation.enterActive).toHaveProperty('boxShadow', 'var(--md-sys-elevation-level2)');
      expect(elevation.exit).toHaveProperty('boxShadow', 'var(--md-sys-elevation-level2)');
      expect(elevation.exitActive).toHaveProperty('boxShadow', 'var(--md-sys-elevation-level0)');
    });
  });

  describe('PerformanceOptimizedAnimations', () => {
    it('should provide transform optimization styles', () => {
      const transform = PerformanceOptimizedAnimations.transform;
      
      expect(transform).toHaveProperty('willChange', 'transform');
      expect(transform).toHaveProperty('backfaceVisibility', 'hidden');
      expect(transform).toHaveProperty('perspective', 1000);
    });

    it('should provide opacity optimization styles', () => {
      const opacity = PerformanceOptimizedAnimations.opacity;
      
      expect(opacity).toHaveProperty('willChange', 'opacity');
    });

    it('should provide combined optimization styles', () => {
      const combined = PerformanceOptimizedAnimations.transformOpacity;
      
      expect(combined).toHaveProperty('willChange', 'transform, opacity');
      expect(combined).toHaveProperty('backfaceVisibility', 'hidden');
      expect(combined).toHaveProperty('perspective', 1000);
    });

    it('should provide cleanup styles', () => {
      const cleanup = PerformanceOptimizedAnimations.cleanup;
      
      expect(cleanup).toHaveProperty('willChange', 'auto');
      expect(cleanup).toHaveProperty('backfaceVisibility', 'visible');
      expect(cleanup).toHaveProperty('perspective', 'none');
    });
  });

  describe('MicroInteractions', () => {
    it('should provide button press interaction', () => {
      const buttonPress = MicroInteractions.buttonPress;
      
      expect(buttonPress).toHaveProperty('transform', 'scale(0.98)');
      expect(buttonPress).toHaveProperty('transition');
      expect(buttonPress.transition).toContain('transform');
    });

    it('should provide card hover interaction', () => {
      const cardHover = MicroInteractions.cardHover;
      
      expect(cardHover).toHaveProperty('transform', 'translateY(-2px)');
      expect(cardHover).toHaveProperty('boxShadow', 'var(--md-sys-elevation-level3)');
      expect(cardHover).toHaveProperty('transition');
    });

    it('should provide focus ring interaction', () => {
      const focusRing = MicroInteractions.focusRing;
      
      expect(focusRing).toHaveProperty('outline', '2px solid var(--md-sys-color-primary)');
      expect(focusRing).toHaveProperty('outlineOffset', '2px');
      expect(focusRing).toHaveProperty('transition');
    });

    it('should provide loading pulse interaction', () => {
      const loadingPulse = MicroInteractions.loadingPulse;
      
      expect(loadingPulse).toHaveProperty('animation');
      expect(loadingPulse.animation).toContain('pulse');
      expect(loadingPulse.animation).toContain('infinite');
    });

    it('should provide ripple interaction', () => {
      const ripple = MicroInteractions.ripple;
      
      expect(ripple).toHaveProperty('position', 'relative');
      expect(ripple).toHaveProperty('overflow', 'hidden');
      expect(ripple).toHaveProperty('&::before');
      expect(ripple).toHaveProperty('&:active::before');
    });
  });

  describe('ReducedMotionAlternatives', () => {
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

      expect(ReducedMotionAlternatives.prefersReducedMotion()).toBe(true);
    });

    it('should return normal transition when reduced motion is not preferred', () => {
      const normalTransition = 'opacity 300ms ease';
      const result = ReducedMotionAlternatives.getTransition(normalTransition);
      
      expect(result).toBe(normalTransition);
    });

    it('should return reduced transition when reduced motion is preferred', () => {
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

      const normalTransition = 'opacity 300ms ease';
      const reducedTransition = 'opacity 100ms linear';
      const result = ReducedMotionAlternatives.getTransition(normalTransition, reducedTransition);
      
      expect(result).toBe(reducedTransition);
    });

    it('should return "none" when reduced motion is preferred and no alternative provided', () => {
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

      const normalTransition = 'opacity 300ms ease';
      const result = ReducedMotionAlternatives.getTransition(normalTransition);
      
      expect(result).toBe('none');
    });

    it('should provide reduced motion variants', () => {
      const variants = ReducedMotionAlternatives.variants;
      
      expect(variants).toHaveProperty('fade');
      expect(variants).toHaveProperty('scale');
      expect(variants).toHaveProperty('slide');
      
      expect(variants.fade).toHaveProperty('normal');
      expect(variants.fade).toHaveProperty('reduced');
      expect(variants.scale).toHaveProperty('normal');
      expect(variants.scale).toHaveProperty('reduced');
      expect(variants.slide).toHaveProperty('normal');
      expect(variants.slide).toHaveProperty('reduced');
    });
  });

  describe('AnimationFrameUtils', () => {
    beforeEach(() => {
      // Mock requestAnimationFrame and cancelAnimationFrame
      global.requestAnimationFrame = jest.fn((callback) => {
        setTimeout(callback, 16);
        return 1;
      });
      global.cancelAnimationFrame = jest.fn();
      
      // Mock performance
      Object.defineProperty(window, 'performance', {
        writable: true,
        value: {
          now: jest.fn(() => Date.now())
        }
      });
    });

    it('should request animation frame', () => {
      const callback = jest.fn();
      const id = AnimationFrameUtils.requestFrame(callback);
      
      expect(global.requestAnimationFrame).toHaveBeenCalledWith(callback);
      expect(typeof id).toBe('number');
    });

    it('should cancel animation frame', () => {
      const id = 1;
      AnimationFrameUtils.cancelFrame(id);
      
      expect(global.cancelAnimationFrame).toHaveBeenCalledWith(id);
    });

    it('should measure animation performance', () => {
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
      const callback = jest.fn();
      
      AnimationFrameUtils.measurePerformance('test-animation', callback);
      
      expect(callback).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Animation "test-animation" took')
      );
      
      consoleSpy.mockRestore();
    });

    it('should throttle to frame rate', (done) => {
      const callback = jest.fn();
      const throttledCallback = AnimationFrameUtils.throttleToFrame(callback);
      
      // Call multiple times rapidly
      throttledCallback();
      throttledCallback();
      throttledCallback();
      
      // Should only call once per frame
      setTimeout(() => {
        expect(callback).toHaveBeenCalledTimes(1);
        done();
      }, 20);
    });
  });

  describe('applyMotionStyles', () => {
    it('should apply regular CSS properties', () => {
      const element = document.createElement('div');
      const styles = {
        opacity: '0.5',
        transform: 'scale(1.1)'
      };
      
      applyMotionStyles(element, styles);
      
      expect(element.style.opacity).toBe('0.5');
      expect(element.style.transform).toBe('scale(1.1)');
    });

    it('should apply CSS custom properties', () => {
      const element = document.createElement('div');
      const styles = {
        '--custom-property': 'value',
        '--another-property': '10px'
      };
      
      applyMotionStyles(element, styles);
      
      expect(element.style.getPropertyValue('--custom-property')).toBe('value');
      expect(element.style.getPropertyValue('--another-property')).toBe('10px');
    });

    it('should apply mixed properties', () => {
      const element = document.createElement('div');
      const styles = {
        opacity: '0.8',
        '--custom-duration': '300ms',
        transform: 'translateY(10px)'
      };
      
      applyMotionStyles(element, styles);
      
      expect(element.style.opacity).toBe('0.8');
      expect(element.style.transform).toBe('translateY(10px)');
      expect(element.style.getPropertyValue('--custom-duration')).toBe('300ms');
    });
  });

  describe('createKeyframeAnimation', () => {
    beforeEach(() => {
      // Clear any existing style elements
      document.head.innerHTML = '';
    });

    it('should create keyframe animation string', () => {
      const keyframes = {
        '0%': { opacity: '0', transform: 'scale(0.8)' },
        '100%': { opacity: '1', transform: 'scale(1)' }
      };
      
      const animation = createKeyframeAnimation('test-animation', keyframes);
      
      expect(animation).toBe('test-animation 300ms cubic-bezier(0.2, 0.0, 0, 1.0) 1 normal both');
    });

    it('should create keyframe animation with custom options', () => {
      const keyframes = {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      };
      
      const animation = createKeyframeAnimation('custom-animation', keyframes, {
        duration: 500,
        easing: 'emphasizedDecelerate',
        iterations: 'infinite',
        direction: 'alternate',
        fillMode: 'forwards'
      });
      
      expect(animation).toBe('custom-animation 500ms cubic-bezier(0.05, 0.7, 0.1, 1.0) infinite alternate forwards');
    });

    it('should inject keyframes into document head', () => {
      const keyframes = {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      };
      
      createKeyframeAnimation('injected-animation', keyframes);
      
      const styleElement = document.getElementById('keyframes-injected-animation');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toContain('@keyframes injected-animation');
      expect(styleElement?.textContent).toContain('opacity: 0');
      expect(styleElement?.textContent).toContain('opacity: 1');
    });

    it('should not inject duplicate keyframes', () => {
      const keyframes = {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      };
      
      createKeyframeAnimation('duplicate-animation', keyframes);
      createKeyframeAnimation('duplicate-animation', keyframes);
      
      const styleElements = document.querySelectorAll('#keyframes-duplicate-animation');
      expect(styleElements.length).toBe(1);
    });
  });

  describe('getMotionCSSProperties', () => {
    it('should return all motion CSS properties', () => {
      const properties = getMotionCSSProperties();
      
      // Check easing properties
      expect(properties).toHaveProperty('--md-sys-motion-easing-standard');
      expect(properties).toHaveProperty('--md-sys-motion-easing-emphasized');
      expect(properties).toHaveProperty('--md-sys-motion-easing-emphasized-decelerate');
      expect(properties).toHaveProperty('--md-sys-motion-easing-emphasized-accelerate');
      expect(properties).toHaveProperty('--md-sys-motion-easing-legacy');
      expect(properties).toHaveProperty('--md-sys-motion-easing-linear');
      
      // Check duration properties
      expect(properties).toHaveProperty('--md-sys-motion-duration-short1');
      expect(properties).toHaveProperty('--md-sys-motion-duration-medium2');
      expect(properties).toHaveProperty('--md-sys-motion-duration-long4');
      expect(properties).toHaveProperty('--md-sys-motion-duration-extra-long4');
    });

    it('should have correct easing values', () => {
      const properties = getMotionCSSProperties();
      
      expect(properties['--md-sys-motion-easing-standard']).toBe('cubic-bezier(0.2, 0.0, 0, 1.0)');
      expect(properties['--md-sys-motion-easing-emphasized-decelerate']).toBe('cubic-bezier(0.05, 0.7, 0.1, 1.0)');
    });

    it('should have correct duration values with ms suffix', () => {
      const properties = getMotionCSSProperties();
      
      expect(properties['--md-sys-motion-duration-short1']).toBe('50ms');
      expect(properties['--md-sys-motion-duration-medium2']).toBe('300ms');
      expect(properties['--md-sys-motion-duration-extra-long4']).toBe('1000ms');
    });

    it('should have all required duration scales', () => {
      const properties = getMotionCSSProperties();
      const durationKeys = Object.keys(properties).filter(key => key.includes('duration'));
      
      expect(durationKeys.length).toBe(16); // 4 short + 4 medium + 4 long + 4 extra-long
    });

    it('should have all required easing curves', () => {
      const properties = getMotionCSSProperties();
      const easingKeys = Object.keys(properties).filter(key => key.includes('easing'));
      
      expect(easingKeys.length).toBe(6); // standard, emphasized, emphasized-decelerate, emphasized-accelerate, legacy, linear
    });
  });

  describe('Integration Tests', () => {
    it('should work together to create complex animations', () => {
      const element = document.createElement('div');
      
      // Apply performance optimization
      applyMotionStyles(element, PerformanceOptimizedAnimations.transformOpacity);
      
      // Create transition
      const transition = createTransition({
        property: ['opacity', 'transform'],
        duration: 'medium3',
        easing: 'emphasizedDecelerate'
      });
      
      // Apply transition
      applyMotionStyles(element, { transition });
      
      expect(element.style.willChange).toBe('transform, opacity');
      expect(element.style.transition).toContain('opacity');
      expect(element.style.transition).toContain('transform');
      expect(element.style.transition).toContain('350ms');
    });

    it('should respect reduced motion preferences in complex scenarios', () => {
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

      const normalTransition = createTransition({
        property: 'transform',
        duration: 'long2',
        easing: 'emphasizedDecelerate'
      });

      const finalTransition = ReducedMotionAlternatives.getTransition(
        normalTransition,
        ReducedMotionAlternatives.variants.fade.reduced
      );

      expect(finalTransition).toBe(ReducedMotionAlternatives.variants.fade.reduced);
      expect(finalTransition).toContain('50ms'); // Short duration for reduced motion
    });
  });
});