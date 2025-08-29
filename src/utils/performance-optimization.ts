/**
 * Performance Optimization Utilities
 * 
 * Utilities for optimizing bundle size, loading performance,
 * and runtime performance of Material 3 Expressive components.
 */

/**
 * Bundle size optimization utilities
 */
export const bundleOptimization = {
  /**
   * Lazy load Material 3 components
   */
  lazyLoadComponent: async <T>(
    importFn: () => Promise<{ default: T }>,
    fallback?: T
  ): Promise<T> => {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      console.warn('Failed to lazy load component:', error);
      if (fallback) {
        return fallback;
      }
      throw error;
    }
  },

  /**
   * Conditionally load CSS based on browser support
   */
  conditionalCSS: (
    condition: boolean,
    cssPath: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!condition) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS: ${cssPath}`));
      
      document.head.appendChild(link);
    });
  },

  /**
   * Tree-shake unused Material 3 tokens
   */
  getUsedTokens: (usedFeatures: string[]): Record<string, string> => {
    const allTokens = {
      // Color tokens
      'primary': 'var(--md-sys-color-primary)',
      'on-primary': 'var(--md-sys-color-on-primary)',
      'primary-container': 'var(--md-sys-color-primary-container)',
      'on-primary-container': 'var(--md-sys-color-on-primary-container)',
      'secondary': 'var(--md-sys-color-secondary)',
      'on-secondary': 'var(--md-sys-color-on-secondary)',
      'surface': 'var(--md-sys-color-surface)',
      'on-surface': 'var(--md-sys-color-on-surface)',
      
      // Typography tokens
      'display-large': 'var(--md-sys-typescale-display-large)',
      'headline-large': 'var(--md-sys-typescale-headline-large)',
      'title-large': 'var(--md-sys-typescale-title-large)',
      'body-large': 'var(--md-sys-typescale-body-large)',
      'label-large': 'var(--md-sys-typescale-label-large)',
      
      // Shape tokens
      'corner-none': 'var(--md-sys-shape-corner-none)',
      'corner-small': 'var(--md-sys-shape-corner-small)',
      'corner-medium': 'var(--md-sys-shape-corner-medium)',
      'corner-large': 'var(--md-sys-shape-corner-large)',
      
      // Motion tokens
      'duration-short': 'var(--md-motion-duration-short1)',
      'duration-medium': 'var(--md-motion-duration-medium1)',
      'duration-long': 'var(--md-motion-duration-long1)',
      'easing-standard': 'var(--md-motion-easing-standard)',
      'easing-emphasized': 'var(--md-motion-easing-emphasized)',
    };

    return usedFeatures.reduce((tokens, feature) => {
      if (allTokens[feature]) {
        tokens[feature] = allTokens[feature];
      }
      return tokens;
    }, {} as Record<string, string>);
  },

  /**
   * Generate minimal CSS for used features only
   */
  generateMinimalCSS: (usedTokens: Record<string, string>): string => {
    const cssRules = Object.entries(usedTokens).map(([key, value]) => {
      return `.m3-${key} { ${key}: ${value}; }`;
    });

    return `:root { ${Object.values(usedTokens).join('; ')}; } ${cssRules.join(' ')}`;
  },
};

/**
 * Loading performance utilities
 */
export const loadingOptimization = {
  /**
   * Preload critical resources
   */
  preloadCriticalResources: (resources: string[]): void => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.match(/\.(woff2?|ttf|otf)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
        link.as = 'image';
      }
      
      link.href = resource;
      document.head.appendChild(link);
    });
  },

  /**
   * Lazy load non-critical resources
   */
  lazyLoadResources: (resources: string[], trigger: 'idle' | 'visible' | 'interaction' = 'idle'): void => {
    const loadResources = () => {
      resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = resource;
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
        document.head.appendChild(link);
      });
    };

    switch (trigger) {
      case 'idle':
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadResources);
        } else {
          setTimeout(loadResources, 1);
        }
        break;
      
      case 'visible':
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              loadResources();
              observer.disconnect();
            }
          });
          observer.observe(document.body);
        } else {
          loadResources();
        }
        break;
      
      case 'interaction':
        const events = ['mousedown', 'touchstart', 'keydown'];
        const handleInteraction = () => {
          loadResources();
          events.forEach(event => {
            document.removeEventListener(event, handleInteraction);
          });
        };
        events.forEach(event => {
          document.addEventListener(event, handleInteraction, { once: true });
        });
        break;
    }
  },

  /**
   * Optimize font loading
   */
  optimizeFontLoading: (fonts: Array<{ family: string; weight?: string; display?: string }>): void => {
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      
      const fontWeight = font.weight || '400';
      const fontDisplay = font.display || 'swap';
      
      // Construct Google Fonts URL
      const fontUrl = `https://fonts.googleapis.com/css2?family=${font.family.replace(' ', '+')}:wght@${fontWeight}&display=${fontDisplay}`;
      link.href = fontUrl;
      
      document.head.appendChild(link);
    });
  },

  /**
   * Implement resource hints
   */
  addResourceHints: (): void => {
    // DNS prefetch for external resources
    const dnsPrefetch = ['//fonts.googleapis.com', '//fonts.gstatic.com'];
    dnsPrefetch.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Preconnect to critical origins
    const preconnect = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
    preconnect.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },
};

/**
 * Runtime performance utilities
 */
export const runtimeOptimization = {
  /**
   * Optimize animation performance
   */
  optimizeAnimations: (): void => {
    // Use CSS containment for animated elements
    const animatedElements = document.querySelectorAll('[data-animated]');
    animatedElements.forEach(element => {
      (element as HTMLElement).style.contain = 'layout style paint';
    });

    // Use transform3d to trigger hardware acceleration
    const transformElements = document.querySelectorAll('[data-transform]');
    transformElements.forEach(element => {
      (element as HTMLElement).style.transform += ' translateZ(0)';
    });
  },

  /**
   * Implement virtual scrolling for large lists
   */
  createVirtualScroller: (
    container: HTMLElement,
    items: any[],
    itemHeight: number,
    renderItem: (item: any, index: number) => HTMLElement
  ): void => {
    const viewportHeight = container.clientHeight;
    const visibleCount = Math.ceil(viewportHeight / itemHeight) + 2; // Buffer
    let scrollTop = 0;

    const updateVisibleItems = () => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount, items.length);

      // Clear container
      container.innerHTML = '';

      // Create spacer for items above viewport
      if (startIndex > 0) {
        const topSpacer = document.createElement('div');
        topSpacer.style.height = `${startIndex * itemHeight}px`;
        container.appendChild(topSpacer);
      }

      // Render visible items
      for (let i = startIndex; i < endIndex; i++) {
        const itemElement = renderItem(items[i], i);
        itemElement.style.height = `${itemHeight}px`;
        container.appendChild(itemElement);
      }

      // Create spacer for items below viewport
      const remainingItems = items.length - endIndex;
      if (remainingItems > 0) {
        const bottomSpacer = document.createElement('div');
        bottomSpacer.style.height = `${remainingItems * itemHeight}px`;
        container.appendChild(bottomSpacer);
      }
    };

    container.addEventListener('scroll', () => {
      scrollTop = container.scrollTop;
      requestAnimationFrame(updateVisibleItems);
    });

    updateVisibleItems();
  },

  /**
   * Implement efficient event delegation
   */
  delegateEvents: (
    container: HTMLElement,
    eventType: string,
    selector: string,
    handler: (event: Event, target: HTMLElement) => void
  ): () => void => {
    const delegatedHandler = (event: Event) => {
      const target = event.target as HTMLElement;
      const matchedElement = target.closest(selector) as HTMLElement;
      
      if (matchedElement && container.contains(matchedElement)) {
        handler(event, matchedElement);
      }
    };

    container.addEventListener(eventType, delegatedHandler);

    // Return cleanup function
    return () => {
      container.removeEventListener(eventType, delegatedHandler);
    };
  },

  /**
   * Optimize DOM queries with caching
   */
  createQueryCache: () => {
    const cache = new Map<string, NodeListOf<Element>>();

    return {
      query: (selector: string): NodeListOf<Element> => {
        if (!cache.has(selector)) {
          cache.set(selector, document.querySelectorAll(selector));
        }
        return cache.get(selector)!;
      },
      
      invalidate: (selector?: string): void => {
        if (selector) {
          cache.delete(selector);
        } else {
          cache.clear();
        }
      },
    };
  },

  /**
   * Implement efficient resize handling
   */
  optimizeResize: (
    callback: (entries: ResizeObserverEntry[]) => void,
    elements: HTMLElement[]
  ): () => void => {
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(callback);
      elements.forEach(element => resizeObserver.observe(element));
      
      return () => resizeObserver.disconnect();
    } else {
      // Fallback to throttled window resize
      let timeoutId: NodeJS.Timeout;
      const throttledCallback = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const entries = elements.map(element => ({
            target: element,
            contentRect: element.getBoundingClientRect(),
          })) as ResizeObserverEntry[];
          callback(entries);
        }, 16);
      };

      window.addEventListener('resize', throttledCallback);
      return () => window.removeEventListener('resize', throttledCallback);
    }
  },
};

/**
 * Memory optimization utilities
 */
export const memoryOptimization = {
  /**
   * Implement object pooling for frequently created objects
   */
  createObjectPool: <T>(
    createFn: () => T,
    resetFn: (obj: T) => void,
    maxSize: number = 100
  ) => {
    const pool: T[] = [];

    return {
      acquire: (): T => {
        return pool.pop() || createFn();
      },
      
      release: (obj: T): void => {
        if (pool.length < maxSize) {
          resetFn(obj);
          pool.push(obj);
        }
      },
      
      clear: (): void => {
        pool.length = 0;
      },
    };
  },

  /**
   * Implement weak references for cleanup
   */
  createWeakCache: <K extends object, V>() => {
    const cache = new WeakMap<K, V>();

    return {
      get: (key: K): V | undefined => cache.get(key),
      set: (key: K, value: V): void => cache.set(key, value),
      has: (key: K): boolean => cache.has(key),
      delete: (key: K): boolean => cache.delete(key),
    };
  },

  /**
   * Monitor memory usage
   */
  monitorMemory: (): void => {
    if ('memory' in performance) {
      const logMemory = () => {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
        });
      };

      // Log memory usage every 30 seconds
      setInterval(logMemory, 30000);
      logMemory(); // Initial log
    }
  },
};

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations(): void {
  // Add resource hints
  loadingOptimization.addResourceHints();

  // Optimize animations
  runtimeOptimization.optimizeAnimations();

  // Monitor memory in development
  if (process.env.NODE_ENV === 'development') {
    memoryOptimization.monitorMemory();
  }

  // Preload critical Material 3 resources
  loadingOptimization.preloadCriticalResources([
    '/styles/material3-tokens.css',
    '/styles/material3-animations.css',
  ]);

  // Lazy load non-critical resources
  loadingOptimization.lazyLoadResources([
    '/styles/material3-mobile.css',
    '/styles/browser-fallbacks.css',
  ], 'idle');

  // Optimize fonts
  loadingOptimization.optimizeFontLoading([
    { family: 'Inter', weight: '400,500,600', display: 'swap' },
  ]);
}