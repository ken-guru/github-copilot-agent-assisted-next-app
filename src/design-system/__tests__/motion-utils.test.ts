/**
 * Tests for Material 3 Motion System
 * Comprehensive test coverage for motion utilities, animations, and transitions
 */

import { Material3Motion } from '../motion-utils';

// Mock window.matchMedia for reduced motion tests
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Mock Element.animate
const mockAnimate = jest.fn().mockReturnValue({
  addEventListener: jest.fn(),
  playState: 'running',
  cancel: jest.fn(),
});

beforeEach(() => {
  // Setup DOM
  document.body.innerHTML = '';
  
  // Mock HTMLElement.animate
  HTMLElement.prototype.animate = mockAnimate;
  HTMLElement.prototype.getAnimations = jest.fn().mockReturnValue([]);
  
  // Reset mocks
  mockAnimate.mockClear();
  mockMatchMedia(false);
});

describe('Material3Motion.Duration', () => {
  test('getValue returns correct duration in milliseconds', () => {
    expect(Material3Motion.Duration.getValue('short1')).toBe(50);
    expect(Material3Motion.Duration.getValue('short4')).toBe(200);
    expect(Material3Motion.Duration.getValue('medium2')).toBe(300);
    expect(Material3Motion.Duration.getValue('long1')).toBe(450);
    expect(Material3Motion.Duration.getValue('extra-long4')).toBe(1000);
  });

  test('getCSS returns duration with ms unit', () => {
    expect(Material3Motion.Duration.getCSS('short2')).toBe('100ms');
    expect(Material3Motion.Duration.getCSS('medium3')).toBe('350ms');
  });

  test('apply sets transition duration on element', () => {
    const element = document.createElement('div');
    Material3Motion.Duration.apply(element, 'medium1');
    expect(element.style.transitionDuration).toBe('250ms');
  });

  test('getRecommended returns appropriate duration for element types', () => {
    expect(Material3Motion.Duration.getRecommended('button')).toBe('short4');
    expect(Material3Motion.Duration.getRecommended('card')).toBe('medium2');
    expect(Material3Motion.Duration.getRecommended('modal')).toBe('medium3');
    expect(Material3Motion.Duration.getRecommended('unknown')).toBe('medium2');
  });
});

describe('Material3Motion.Easing', () => {
  test('getValue returns correct cubic-bezier values', () => {
    expect(Material3Motion.Easing.getValue('standard')).toBe('cubic-bezier(0.2, 0.0, 0, 1.0)');
    expect(Material3Motion.Easing.getValue('emphasized')).toBe('cubic-bezier(0.2, 0.0, 0, 1.0)');
    expect(Material3Motion.Easing.getValue('expressive-bounce')).toBe('cubic-bezier(0.175, 0.885, 0.32, 1.275)');
    expect(Material3Motion.Easing.getValue('linear')).toBe('linear');
  });

  test('apply sets transition timing function on element', () => {
    const element = document.createElement('div');
    Material3Motion.Easing.apply(element, 'emphasized');
    expect(element.style.transitionTimingFunction).toBe('cubic-bezier(0.2, 0.0, 0, 1.0)');
  });

  test('getRecommended returns appropriate easing for interaction types', () => {
    expect(Material3Motion.Easing.getRecommended('hover')).toBe('standard');
    expect(Material3Motion.Easing.getRecommended('click')).toBe('emphasized');
    expect(Material3Motion.Easing.getRecommended('entrance')).toBe('expressive-entrance');
    expect(Material3Motion.Easing.getRecommended('bounce')).toBe('expressive-bounce');
  });
});

describe('Material3Motion.Transition', () => {
  test('apply sets complete transition on element', () => {
    const element = document.createElement('div');
    Material3Motion.Transition.apply(element, {
      duration: 'medium2',
      easing: 'emphasized',
      properties: ['transform', 'opacity']
    });
    
    expect(element.style.transition).toContain('transform 300ms cubic-bezier(0.2, 0.0, 0, 1.0)');
    expect(element.style.transition).toContain('opacity 300ms cubic-bezier(0.2, 0.0, 0, 1.0)');
  });

  test('create returns transition string', () => {
    const transition = Material3Motion.Transition.create({
      duration: 'short4',
      easing: 'standard',
      properties: ['background-color']
    });
    
    expect(transition).toBe('background-color 200ms cubic-bezier(0.2, 0.0, 0, 1.0)');
  });

  test('remove clears transitions from element', () => {
    const element = document.createElement('div');
    element.style.transition = 'all 300ms ease';
    Material3Motion.Transition.remove(element);
    expect(element.style.transition).toBe('none');
  });

  test('disable temporarily removes transitions', () => {
    const element = document.createElement('div');
    element.style.transition = 'all 300ms ease';
    const callback = jest.fn();
    
    // During disable, transition should be none
    Material3Motion.Transition.disable(element, () => {
      expect(element.style.transition).toBe('none');
      callback();
    });
    
    expect(callback).toHaveBeenCalled();
  });
});

describe('Material3Motion.Animation', () => {
  test('animate calls element.animate with correct parameters', () => {
    const element = document.createElement('div');
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];
    
    Material3Motion.Animation.animate(element, keyframes, {
      duration: 'medium2',
      easing: 'emphasized'
    });
    
    expect(mockAnimate).toHaveBeenCalledWith(keyframes, {
      duration: 300,
      easing: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
      fill: 'both',
      iterations: 1,
    });
  });

  test('fadeIn creates fade in animation', () => {
    const element = document.createElement('div');
    Material3Motion.Animation.fadeIn(element);
    
    expect(mockAnimate).toHaveBeenCalledWith([
      { opacity: 0 },
      { opacity: 1 }
    ], expect.objectContaining({
      duration: 300,
      easing: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    }));
  });

  test('fadeOut creates fade out animation', () => {
    const element = document.createElement('div');
    Material3Motion.Animation.fadeOut(element);
    
    expect(mockAnimate).toHaveBeenCalledWith([
      { opacity: 1 },
      { opacity: 0 }
    ], expect.objectContaining({
      duration: 250,
    }));
  });

  test('scaleIn creates scale in animation', () => {
    const element = document.createElement('div');
    Material3Motion.Animation.scaleIn(element);
    
    expect(mockAnimate).toHaveBeenCalledWith([
      { opacity: 0, transform: 'scale(0.8)' },
      { opacity: 1, transform: 'scale(1)' }
    ], expect.objectContaining({
      duration: 300,
    }));
  });

  test('slideIn creates slide animation from correct direction', () => {
    const element = document.createElement('div');
    Material3Motion.Animation.slideIn(element, 'left');
    
    expect(mockAnimate).toHaveBeenCalledWith([
      { opacity: 0, transform: 'translateX(-100%)' },
      { opacity: 1, transform: 'translate(0, 0)' }
    ], expect.anything());
  });

  test('bounce creates bounce animation', () => {
    const element = document.createElement('div');
    Material3Motion.Animation.bounce(element);
    
    expect(mockAnimate).toHaveBeenCalledWith([
      { transform: 'scale(1)' },
      { transform: 'scale(1.1)' },
      { transform: 'scale(0.9)' },
      { transform: 'scale(1.02)' },
      { transform: 'scale(1)' }
    ], expect.objectContaining({
      duration: 450,
    }));
  });

  test('shake creates shake animation', () => {
    const element = document.createElement('div');
    Material3Motion.Animation.shake(element);
    
    expect(mockAnimate).toHaveBeenCalledWith([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(-2px)' },
      { transform: 'translateX(2px)' },
      { transform: 'translateX(0)' }
    ], expect.objectContaining({
      duration: 250,
    }));
  });
});

describe('Material3Motion.Components', () => {
  describe('button', () => {
    test('setup applies correct transition', () => {
      const element = document.createElement('button');
      Material3Motion.Components.button.setup(element);
      
      expect(element.style.transition).toContain('background-color 200ms');
      expect(element.style.transition).toContain('box-shadow 200ms');
      expect(element.style.transition).toContain('transform 200ms');
    });

    test('press creates scale down animation', () => {
      const element = document.createElement('button');
      Material3Motion.Components.button.press(element);
      
      expect(mockAnimate).toHaveBeenCalledWith([
        { transform: 'scale(1)' },
        { transform: 'scale(0.98)' }
      ], expect.objectContaining({
        duration: 50,
      }));
    });

    test('release creates scale up animation', () => {
      const element = document.createElement('button');
      Material3Motion.Components.button.release(element);
      
      expect(mockAnimate).toHaveBeenCalledWith([
        { transform: 'scale(0.98)' },
        { transform: 'scale(1)' }
      ], expect.objectContaining({
        duration: 100,
      }));
    });
  });

  describe('card', () => {
    test('setup applies correct transition', () => {
      const element = document.createElement('div');
      Material3Motion.Components.card.setup(element);
      
      expect(element.style.transition).toContain('transform 300ms');
      expect(element.style.transition).toContain('box-shadow 300ms');
    });

    test('hover applies transform', () => {
      const element = document.createElement('div');
      Material3Motion.Components.card.hover(element);
      expect(element.style.transform).toBe('translateY(-4px)');
    });

    test('unhover resets transform', () => {
      const element = document.createElement('div');
      Material3Motion.Components.card.unhover(element);
      expect(element.style.transform).toBe('translateY(0)');
    });
  });

  describe('fab', () => {
    test('setup applies correct transition', () => {
      const element = document.createElement('button');
      Material3Motion.Components.fab.setup(element);
      
      expect(element.style.transition).toContain('transform 250ms');
      expect(element.style.transition).toContain('cubic-bezier(0.175, 0.885, 0.32, 1.275)');
    });

    test('hover applies scale transform', () => {
      const element = document.createElement('button');
      Material3Motion.Components.fab.hover(element);
      expect(element.style.transform).toBe('scale(1.1)');
    });

    test('press applies scale down', () => {
      const element = document.createElement('button');
      Material3Motion.Components.fab.press(element);
      expect(element.style.transform).toBe('scale(0.95)');
    });

    test('reset restores original scale', () => {
      const element = document.createElement('button');
      Material3Motion.Components.fab.reset(element);
      expect(element.style.transform).toBe('scale(1)');
    });
  });

  describe('modal', () => {
    test('enter creates scale in animation', () => {
      const element = document.createElement('div');
      Material3Motion.Components.modal.enter(element);
      
      expect(mockAnimate).toHaveBeenCalledWith([
        { opacity: 0, transform: 'scale(0.8)' },
        { opacity: 1, transform: 'scale(1)' }
      ], expect.objectContaining({
        duration: 350,
      }));
    });

    test('exit creates scale out animation', () => {
      const element = document.createElement('div');
      Material3Motion.Components.modal.exit(element);
      
      expect(mockAnimate).toHaveBeenCalledWith([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.8)' }
      ], expect.objectContaining({
        duration: 250,
      }));
    });
  });
});

describe('Material3Motion.Utils', () => {
  test('prefersReducedMotion detects user preference', () => {
    mockMatchMedia(true);
    expect(Material3Motion.Utils.prefersReducedMotion()).toBe(true);
    
    mockMatchMedia(false);
    expect(Material3Motion.Utils.prefersReducedMotion()).toBe(false);
  });

  test('getSafeDuration respects reduced motion preference', () => {
    mockMatchMedia(false);
    expect(Material3Motion.Utils.getSafeDuration('medium2')).toBe(300);
    
    mockMatchMedia(true);
    expect(Material3Motion.Utils.getSafeDuration('medium2')).toBe(1);
  });

  test('createSafeConfig modifies duration for reduced motion', () => {
    mockMatchMedia(false);
    const config = Material3Motion.Utils.createSafeConfig({
      duration: 'long1',
      easing: 'emphasized'
    });
    expect(config.duration).toBe('long1');
    
    mockMatchMedia(true);
    const reducedConfig = Material3Motion.Utils.createSafeConfig({
      duration: 'long1',
      easing: 'emphasized'
    });
    expect(reducedConfig.duration).toBe('short1');
  });

  test('waitForAnimation returns promise that resolves on finish', async () => {
    const mockAnimation = {
      addEventListener: jest.fn((event, callback) => {
        if (event === 'finish') {
          setTimeout(callback, 0);
        }
      }),
    } as unknown as Animation;
    
    await expect(Material3Motion.Utils.waitForAnimation(mockAnimation)).resolves.toBeUndefined();
    expect(mockAnimation.addEventListener).toHaveBeenCalledWith('finish', expect.any(Function), { once: true });
  });

  test('cancelAnimations calls cancel on all element animations', () => {
    const mockAnimations = [
      { cancel: jest.fn() },
      { cancel: jest.fn() },
    ];
    
    const element = document.createElement('div');
    HTMLElement.prototype.getAnimations = jest.fn().mockReturnValue(mockAnimations);
    
    Material3Motion.Utils.cancelAnimations(element);
    
    expect(mockAnimations[0].cancel).toHaveBeenCalled();
    expect(mockAnimations[1].cancel).toHaveBeenCalled();
  });

  test('hasRunningAnimations detects running animations', () => {
    const element = document.createElement('div');
    
    HTMLElement.prototype.getAnimations = jest.fn().mockReturnValue([
      { playState: 'running' },
      { playState: 'finished' },
    ]);
    
    expect(Material3Motion.Utils.hasRunningAnimations(element)).toBe(true);
    
    HTMLElement.prototype.getAnimations = jest.fn().mockReturnValue([
      { playState: 'finished' },
      { playState: 'paused' },
    ]);
    
    expect(Material3Motion.Utils.hasRunningAnimations(element)).toBe(false);
  });
});

describe('Material3Motion.Sequence', () => {
  test('sequential runs animations one after another', async () => {
    const animations = [
      jest.fn().mockReturnValue({ addEventListener: jest.fn((_, cb) => setTimeout(cb, 10)) }),
      jest.fn().mockReturnValue({ addEventListener: jest.fn((_, cb) => setTimeout(cb, 10)) }),
    ];
    
    await Material3Motion.Sequence.sequential(animations);
    
    expect(animations[0]).toHaveBeenCalled();
    expect(animations[1]).toHaveBeenCalled();
  });

  test('parallel runs animations simultaneously', async () => {
    const animations = [
      jest.fn().mockReturnValue({ addEventListener: jest.fn((_, cb) => setTimeout(cb, 10)) }),
      jest.fn().mockReturnValue({ addEventListener: jest.fn((_, cb) => setTimeout(cb, 15)) }),
    ];
    
    const promises = Material3Motion.Sequence.parallel(animations);
    
    expect(animations[0]).toHaveBeenCalled();
    expect(animations[1]).toHaveBeenCalled();
    
    await expect(promises).resolves.toHaveLength(2);
  });

  test('stagger applies delays between element animations', async () => {
    const elements = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
    ];
    
    const animationFn = jest.fn().mockReturnValue({
      addEventListener: jest.fn((_, cb) => setTimeout(cb, 5))
    });
    
    const staggerDelay = 50;
    const startTime = Date.now();
    
    await Material3Motion.Sequence.stagger(elements, animationFn, staggerDelay);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    expect(animationFn).toHaveBeenCalledTimes(3);
    expect(totalTime).toBeGreaterThanOrEqual(100); // At least 2 * staggerDelay
  });
});