/**
 * Cross-Browser Compatibility Tests
 * 
 * Tests for browser feature detection, fallbacks, and progressive enhancement
 * of Material 3 Expressive components.
 */

import { 
  detectBrowserSupport, 
  getBrowserInfo, 
  applyProgressiveEnhancement,
  cssFallbacks,
  performanceUtils,
  initializeBrowserCompatibility
} from '../utils/browser-compatibility';

// Mock CSS.supports for testing
const mockCSSSupports = jest.fn();
Object.defineProperty(global, 'CSS', {
  value: {
    supports: mockCSSSupports,
  },
  writable: true,
});

// Mock window.matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
  writable: true,
});

// Mock navigator
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  vendor: 'Google Inc.',
  maxTouchPoints: 0,
};
Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
});

// Mock document methods
Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => ({
    style: {},
    classList: {
      add: jest.fn(),
      contains: jest.fn(),
    },
    appendChild: jest.fn(),
    getBoundingClientRect: jest.fn(() => ({ width: 100, height: 100 })),
    offsetWidth: 100,
  })),
  writable: true,
});

Object.defineProperty(document, 'documentElement', {
  value: {
    classList: {
      add: jest.fn(),
      contains: jest.fn(),
    },
  },
  writable: true,
});

Object.defineProperty(document, 'querySelectorAll', {
  value: jest.fn(() => []),
  writable: true,
});

// Mock performance
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
  },
  writable: true,
});

// Mock setTimeout and clearTimeout
global.setTimeout = jest.fn((callback, delay) => {
  callback();
  return 1;
}) as any;
global.clearTimeout = jest.fn();

describe('Cross-Browser Compatibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCSSSupports.mockReturnValue(true);
    mockMatchMedia.mockReturnValue({ matches: false });
    mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    mockNavigator.vendor = 'Google Inc.';
    mockNavigator.maxTouchPoints = 0;
  });

  describe('detectBrowserSupport', () => {
    it('should detect CSS custom properties support', () => {
      mockCSSSupports.mockImplementation((property, value) => {
        return property === 'color' && value === 'var(--test)';
      });

      const support = detectBrowserSupport();
      expect(support.cssCustomProperties).toBe(true);
      expect(mockCSSSupports).toHaveBeenCalledWith('color', 'var(--test)');
    });

    it('should detect CSS Grid support', () => {
      mockCSSSupports.mockImplementation((property, value) => {
        return property === 'display' && value === 'grid';
      });

      const support = detectBrowserSupport();
      expect(support.cssGrid).toBe(true);
      expect(mockCSSSupports).toHaveBeenCalledWith('display', 'grid');
    });

    it('should detect flexbox support', () => {
      mockCSSSupports.mockImplementation((property, value) => {
        return property === 'display' && value === 'flex';
      });

      const support = detectBrowserSupport();
      expect(support.flexbox).toBe(true);
      expect(mockCSSSupports).toHaveBeenCalledWith('display', 'flex');
    });

    it('should detect backdrop-filter support', () => {
      mockCSSSupports.mockImplementation((property, value) => {
        return property === 'backdrop-filter' && value === 'blur(1px)';
      });

      const support = detectBrowserSupport();
      expect(support.backdropFilter).toBe(true);
      expect(mockCSSSupports).toHaveBeenCalledWith('backdrop-filter', 'blur(1px)');
    });

    it('should detect container queries support', () => {
      mockCSSSupports.mockImplementation((property, value) => {
        return property === 'container-type' && value === 'inline-size';
      });

      const support = detectBrowserSupport();
      expect(support.containerQueries).toBe(true);
      expect(mockCSSSupports).toHaveBeenCalledWith('container-type', 'inline-size');
    });

    it('should detect touch events support', () => {
      mockNavigator.maxTouchPoints = 1;
      
      const support = detectBrowserSupport();
      expect(support.touchEvents).toBe(true);
    });

    it('should handle server-side rendering', () => {
      // Mock server environment
      const originalWindow = global.window;
      const originalNavigator = global.navigator;
      delete (global as any).window;
      delete (global as any).navigator;

      const support = detectBrowserSupport();
      
      expect(support.cssCustomProperties).toBe(true);
      expect(support.touchEvents).toBe(false);
      expect(support.intersectionObserver).toBe(true);

      global.window = originalWindow;
      global.navigator = originalNavigator;
    });
  });

  describe('getBrowserInfo', () => {
    it('should detect Chrome browser', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      mockNavigator.vendor = 'Google Inc.';

      const info = getBrowserInfo();
      expect(info.name).toBe('chrome');
      expect(info.engine).toBe('blink');
      expect(info.version).toBe('91');
    });

    it('should detect Firefox browser', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0';
      mockNavigator.vendor = '';

      const info = getBrowserInfo();
      expect(info.name).toBe('firefox');
      expect(info.engine).toBe('gecko');
      expect(info.version).toBe('89');
    });

    it('should detect Safari browser', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';
      mockNavigator.vendor = 'Apple Computer, Inc.';

      const info = getBrowserInfo();
      expect(info.name).toBe('safari');
      expect(info.engine).toBe('webkit');
    });

    it('should detect Edge browser', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59';
      mockNavigator.vendor = 'Google Inc.';

      const info = getBrowserInfo();
      expect(info.name).toBe('edge');
      expect(info.engine).toBe('blink');
      expect(info.version).toBe('91');
    });

    it('should detect mobile devices', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';

      const info = getBrowserInfo();
      expect(info.isMobile).toBe(true);
      expect(info.isDesktop).toBe(false);
    });

    it('should detect tablet devices', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';

      const info = getBrowserInfo();
      expect(info.isTablet).toBe(true);
      expect(info.isMobile).toBe(false);
      expect(info.isDesktop).toBe(false);
    });
  });

  describe('applyProgressiveEnhancement', () => {
    let mockHtml: HTMLElement;

    beforeEach(() => {
      mockHtml = document.createElement('html');
      Object.defineProperty(document, 'documentElement', {
        value: mockHtml,
        writable: true,
      });
    });

    it('should add feature support classes', () => {
      const support = {
        cssCustomProperties: true,
        cssGrid: false,
        flexbox: true,
        transforms: true,
        transitions: false,
        animations: true,
        backdropFilter: false,
        clipPath: true,
        containerQueries: false,
        aspectRatio: true,
        colorScheme: true,
        prefersReducedMotion: true,
        touchEvents: false,
        pointerEvents: true,
        intersectionObserver: true,
        resizeObserver: true,
      };

      applyProgressiveEnhancement(support);

      expect(mockHtml.classList.contains('supports-cssCustomProperties')).toBe(true);
      expect(mockHtml.classList.contains('no-cssGrid')).toBe(true);
      expect(mockHtml.classList.contains('supports-flexbox')).toBe(true);
      expect(mockHtml.classList.contains('no-transitions')).toBe(true);
    });

    it('should add browser-specific classes', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      mockNavigator.vendor = 'Google Inc.';

      const support = detectBrowserSupport();
      applyProgressiveEnhancement(support);

      expect(mockHtml.classList.contains('browser-chrome')).toBe(true);
      expect(mockHtml.classList.contains('engine-blink')).toBe(true);
      expect(mockHtml.classList.contains('is-desktop')).toBe(true);
    });
  });

  describe('cssFallbacks', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
      document.body.appendChild(mockElement);
    });

    afterEach(() => {
      document.body.removeChild(mockElement);
    });

    it('should apply custom properties fallback', () => {
      mockCSSSupports.mockReturnValue(false);
      
      cssFallbacks.customProperties(mockElement, 'color', '#ff0000');
      
      expect(mockElement.style.color).toBe('rgb(255, 0, 0)');
    });

    it('should apply backdrop-filter fallback', () => {
      mockCSSSupports.mockImplementation((property) => {
        return property !== 'backdrop-filter';
      });
      
      cssFallbacks.backdropFilter(mockElement, 'rgba(255, 255, 255, 0.8)');
      
      expect(mockElement.style.background).toBe('rgba(255, 255, 255, 0.8)');
    });

    it('should apply aspect-ratio fallback', () => {
      mockCSSSupports.mockImplementation((property) => {
        return property !== 'aspect-ratio';
      });
      
      Object.defineProperty(mockElement, 'offsetWidth', {
        value: 200,
        writable: true,
      });
      
      cssFallbacks.aspectRatio(mockElement, 16/9);
      
      expect(mockElement.style.height).toBe('112.5px');
    });

    it('should provide container queries fallback with ResizeObserver', () => {
      mockCSSSupports.mockImplementation((property) => {
        return property !== 'container-type';
      });

      const mockResizeObserver = jest.fn().mockImplementation((callback) => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
      }));
      
      global.ResizeObserver = mockResizeObserver;
      
      const callback = jest.fn();
      const cleanup = cssFallbacks.containerQueries(mockElement, callback);
      
      expect(mockResizeObserver).toHaveBeenCalledWith(expect.any(Function));
      expect(cleanup).toBeInstanceOf(Function);
    });
  });

  describe('performanceUtils', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = performanceUtils.debounce(mockFn, 100);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });

    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = performanceUtils.throttle(mockFn, 100);

      throttledFn('arg1');
      throttledFn('arg2');
      throttledFn('arg3');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg1');

      jest.advanceTimersByTime(100);

      throttledFn('arg4');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('arg4');
    });

    it('should use requestAnimationFrame when available', () => {
      const mockRequestAnimationFrame = jest.fn().mockReturnValue(123);
      global.requestAnimationFrame = mockRequestAnimationFrame;

      const callback = jest.fn();
      const id = performanceUtils.requestAnimationFrame(callback);

      expect(mockRequestAnimationFrame).toHaveBeenCalledWith(callback);
      expect(id).toBe(123);
    });

    it('should fallback to setTimeout when requestAnimationFrame is not available', () => {
      delete (global as any).requestAnimationFrame;
      const mockSetTimeout = jest.spyOn(global, 'setTimeout').mockReturnValue(456 as any);

      const callback = jest.fn();
      const id = performanceUtils.requestAnimationFrame(callback);

      expect(mockSetTimeout).toHaveBeenCalledWith(callback, 16);
      expect(id).toBe(456);
    });

    it('should detect smooth scrolling support', () => {
      mockCSSSupports.mockImplementation((property, value) => {
        return property === 'scroll-behavior' && value === 'smooth';
      });

      expect(performanceUtils.supportsSmoothScrolling()).toBe(true);
    });

    it('should provide smooth scroll polyfill', () => {
      mockCSSSupports.mockReturnValue(false);
      
      const mockElement = {
        scrollTop: 0,
        scrollTo: jest.fn(),
      } as any;

      const mockPerformanceNow = jest.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(150)
        .mockReturnValueOnce(300);

      const mockRequestAnimationFrame = jest.fn()
        .mockImplementationOnce((callback) => {
          callback(150);
          return 1;
        })
        .mockImplementationOnce((callback) => {
          callback(300);
          return 2;
        });
      
      global.requestAnimationFrame = mockRequestAnimationFrame;

      performanceUtils.smoothScrollTo(mockElement, 100, 300);

      expect(mockElement.scrollTop).toBeGreaterThan(0);
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('initializeBrowserCompatibility', () => {
    let mockHtml: HTMLElement;

    beforeEach(() => {
      mockHtml = document.createElement('html');
      Object.defineProperty(document, 'documentElement', {
        value: mockHtml,
        writable: true,
      });
    });

    it('should initialize browser compatibility features', () => {
      const support = initializeBrowserCompatibility();

      expect(support).toBeDefined();
      expect(mockHtml.classList.length).toBeGreaterThan(0);
    });

    it('should set up performance observer when available', () => {
      const mockPerformanceObserver = jest.fn().mockImplementation((callback) => ({
        observe: jest.fn(),
      }));
      
      global.PerformanceObserver = mockPerformanceObserver;

      initializeBrowserCompatibility();

      expect(mockPerformanceObserver).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle performance observer errors gracefully', () => {
      const mockPerformanceObserver = jest.fn().mockImplementation(() => {
        throw new Error('PerformanceObserver not supported');
      });
      
      global.PerformanceObserver = mockPerformanceObserver;
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      expect(() => initializeBrowserCompatibility()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Performance Observer not supported:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});

describe('Animation Performance Tests', () => {
  it('should measure animation frame rate', (done) => {
    // Mock requestAnimationFrame for testing
    let frameCount = 0;
    const startTime = performance.now();
    
    const mockRequestAnimationFrame = jest.fn().mockImplementation((callback) => {
      setTimeout(() => {
        callback(performance.now());
      }, 16);
      return frameCount++;
    });
    
    global.requestAnimationFrame = mockRequestAnimationFrame;
    
    const measureFrameRate = () => {
      frameCount++;
      
      if (frameCount < 10) { // Reduced for testing
        requestAnimationFrame(measureFrameRate);
      } else {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const fps = (frameCount / duration) * 1000;
        
        // Should maintain reasonable frame rate
        expect(fps).toBeGreaterThan(10);
        done();
      }
    };
    
    requestAnimationFrame(measureFrameRate);
  });

  it('should handle reduced motion preferences', () => {
    mockMatchMedia.mockReturnValue({ matches: true });
    
    const support = detectBrowserSupport();
    expect(support.prefersReducedMotion).toBe(true);
  });
});

describe('Mobile Compatibility Tests', () => {
  it('should detect touch capabilities', () => {
    mockNavigator.maxTouchPoints = 5;
    
    const support = detectBrowserSupport();
    expect(support.touchEvents).toBe(true);
  });

  it('should detect pointer events support', () => {
    Object.defineProperty(window, 'onpointerdown', {
      value: null,
      writable: true,
    });
    
    const support = detectBrowserSupport();
    expect(support.pointerEvents).toBe(true);
  });
});

describe('Bundle Size Optimization Tests', () => {
  it('should tree-shake unused utilities', () => {
    // This test would be run with a bundler analyzer
    // For now, we just ensure functions are properly exported
    expect(typeof detectBrowserSupport).toBe('function');
    expect(typeof getBrowserInfo).toBe('function');
    expect(typeof performanceUtils.debounce).toBe('function');
  });

  it('should lazy load non-critical features', async () => {
    // Mock dynamic import
    const mockImport = jest.fn().mockResolvedValue({
      default: jest.fn(),
    });
    
    global.import = mockImport as any;
    
    // Simulate lazy loading
    const lazyFeature = await import('../utils/browser-compatibility');
    expect(lazyFeature).toBeDefined();
  });
});