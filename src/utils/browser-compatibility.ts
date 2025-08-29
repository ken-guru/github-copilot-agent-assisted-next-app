/**
 * Browser Compatibility Utilities
 * 
 * Provides feature detection, progressive enhancement, and fallbacks
 * for Material 3 Expressive components across different browsers.
 */

export interface BrowserSupport {
  cssCustomProperties: boolean;
  cssGrid: boolean;
  flexbox: boolean;
  transforms: boolean;
  transitions: boolean;
  animations: boolean;
  backdropFilter: boolean;
  clipPath: boolean;
  containerQueries: boolean;
  aspectRatio: boolean;
  colorScheme: boolean;
  prefersReducedMotion: boolean;
  touchEvents: boolean;
  pointerEvents: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
}

/**
 * Detect browser support for various CSS features
 */
export function detectBrowserSupport(): BrowserSupport {
  // Server-side rendering fallback
  if (typeof window === 'undefined') {
    return {
      cssCustomProperties: true,
      cssGrid: true,
      flexbox: true,
      transforms: true,
      transitions: true,
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
  }

  const testElement = document.createElement('div');
  const style = testElement.style;

  return {
    cssCustomProperties: CSS.supports('color', 'var(--test)'),
    cssGrid: CSS.supports('display', 'grid'),
    flexbox: CSS.supports('display', 'flex'),
    transforms: CSS.supports('transform', 'translateX(1px)'),
    transitions: CSS.supports('transition', 'opacity 1s'),
    animations: CSS.supports('animation', 'test 1s'),
    backdropFilter: CSS.supports('backdrop-filter', 'blur(1px)'),
    clipPath: CSS.supports('clip-path', 'circle(50%)'),
    containerQueries: CSS.supports('container-type', 'inline-size'),
    aspectRatio: CSS.supports('aspect-ratio', '1/1'),
    colorScheme: CSS.supports('color-scheme', 'light dark'),
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion)').matches !== undefined,
    touchEvents: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    pointerEvents: 'onpointerdown' in window,
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
  };
}

/**
 * Get browser information
 */
export function getBrowserInfo() {
  if (typeof window === 'undefined') {
    return {
      name: 'unknown',
      version: 'unknown',
      engine: 'unknown',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    };
  }

  const userAgent = navigator.userAgent;
  const isEdge = /Edg/.test(userAgent);
  const isOpera = /OPR/.test(userAgent);
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor) && !isEdge;
  const isFirefox = /Firefox/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor) && !isChrome && !isEdge;

  const isMobile = /Mobi|Android/i.test(userAgent) && !/Tablet|iPad/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);

  let name = 'unknown';
  let engine = 'unknown';

  if (isEdge) {
    name = 'edge';
    engine = 'blink';
  } else if (isOpera) {
    name = 'opera';
    engine = 'blink';
  } else if (isChrome) {
    name = 'chrome';
    engine = 'blink';
  } else if (isFirefox) {
    name = 'firefox';
    engine = 'gecko';
  } else if (isSafari) {
    name = 'safari';
    engine = 'webkit';
  }

  // Extract version (simplified)
  const versionMatch = userAgent.match(/(Chrome|Firefox|Safari|Edg|OPR)\/(\d+)/);
  const version = versionMatch ? versionMatch[2] : 'unknown';

  return {
    name,
    version,
    engine,
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  };
}

/**
 * Apply progressive enhancement based on browser capabilities
 */
export function applyProgressiveEnhancement(support: BrowserSupport) {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;

  // Add feature classes to HTML element
  Object.entries(support).forEach(([feature, isSupported]) => {
    html.classList.add(isSupported ? `supports-${feature}` : `no-${feature}`);
  });

  // Add browser-specific classes
  const browserInfo = getBrowserInfo();
  html.classList.add(`browser-${browserInfo.name}`);
  html.classList.add(`engine-${browserInfo.engine}`);
  
  if (browserInfo.isMobile) html.classList.add('is-mobile');
  if (browserInfo.isTablet) html.classList.add('is-tablet');
  if (browserInfo.isDesktop) html.classList.add('is-desktop');
}

/**
 * CSS fallbacks for unsupported features
 */
export const cssFallbacks = {
  /**
   * Fallback for CSS custom properties
   */
  customProperties: (element: HTMLElement, property: string, fallback: string) => {
    if (!CSS.supports('color', 'var(--test)')) {
      element.style.setProperty(property, fallback);
    }
  },

  /**
   * Fallback for backdrop-filter
   */
  backdropFilter: (element: HTMLElement, fallbackBackground: string) => {
    if (!CSS.supports('backdrop-filter', 'blur(1px)')) {
      element.style.background = fallbackBackground;
    }
  },

  /**
   * Fallback for aspect-ratio
   */
  aspectRatio: (element: HTMLElement, ratio: number) => {
    if (!CSS.supports('aspect-ratio', '1/1')) {
      const width = element.offsetWidth;
      element.style.height = `${width / ratio}px`;
    }
  },

  /**
   * Fallback for container queries
   */
  containerQueries: (element: HTMLElement, callback: (width: number) => void) => {
    if (!CSS.supports('container-type', 'inline-size')) {
      // Use ResizeObserver as fallback
      if ('ResizeObserver' in window) {
        const observer = new ResizeObserver((entries) => {
          for (const entry of entries) {
            callback(entry.contentRect.width);
          }
        });
        observer.observe(element);
        return () => observer.disconnect();
      } else {
        // Fallback to window resize
        const handleResize = () => callback(element.offsetWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }
    }
  },
};

/**
 * Performance optimization utilities
 */
export const performanceUtils = {
  /**
   * Debounce function for performance-critical operations
   */
  debounce: <T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function for scroll/resize events
   */
  throttle: <T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Request animation frame with fallback
   */
  requestAnimationFrame: (callback: FrameRequestCallback): number => {
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      return window.requestAnimationFrame(callback);
    }
    return setTimeout(callback, 16) as unknown as number;
  },

  /**
   * Cancel animation frame with fallback
   */
  cancelAnimationFrame: (id: number): void => {
    if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  },

  /**
   * Check if device supports smooth scrolling
   */
  supportsSmoothScrolling: (): boolean => {
    return CSS.supports('scroll-behavior', 'smooth');
  },

  /**
   * Polyfill for smooth scrolling
   */
  smoothScrollTo: (element: Element, top: number, duration: number = 300) => {
    if (performanceUtils.supportsSmoothScrolling()) {
      element.scrollTo({ top, behavior: 'smooth' });
      return;
    }

    const start = element.scrollTop;
    const change = top - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      element.scrollTop = start + change * easeOut;

      if (progress < 1) {
        performanceUtils.requestAnimationFrame(animateScroll);
      }
    };

    performanceUtils.requestAnimationFrame(animateScroll);
  },
};

/**
 * Initialize browser compatibility features
 */
export function initializeBrowserCompatibility() {
  if (typeof window === 'undefined') return;

  const support = detectBrowserSupport();
  applyProgressiveEnhancement(support);

  // Add performance observer if available
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            console.log(`First Contentful Paint: ${entry.startTime}ms`);
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  return support;
}