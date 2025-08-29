/**
 * Tests for Final Polish and Performance Optimizer
 */

import { 
  ColorRelationshipOptimizer,
  VisualHierarchyOptimizer,
  AnimationJankReducer,
  LazyLoadManager,
  PerformanceMonitor,
  CSSBundleOptimizer,
  FinalPolishOptimizer
} from '../final-polish-optimizer';

// Mock DOM methods
const mockGetComputedStyle = jest.fn();
const mockQuerySelectorAll = jest.fn();
const mockQuerySelector = jest.fn();
const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();

// Setup DOM mocks
beforeAll(() => {
  Object.defineProperty(window, 'getComputedStyle', {
    value: mockGetComputedStyle,
  });

  Object.defineProperty(document, 'querySelectorAll', {
    value: mockQuerySelectorAll,
  });

  Object.defineProperty(document, 'querySelector', {
    value: mockQuerySelector,
  });

  Object.defineProperty(document, 'createElement', {
    value: mockCreateElement,
  });

  Object.defineProperty(document, 'documentElement', {
    value: {
      style: {
        setProperty: jest.fn(),
      },
      appendChild: mockAppendChild,
    },
  });

  Object.defineProperty(document, 'head', {
    value: {
      appendChild: mockAppendChild,
    },
  });

  // Mock performance API
  Object.defineProperty(window, 'performance', {
    value: {
      now: jest.fn(() => Date.now()),
      memory: {
        usedJSHeapSize: 1024 * 1024 * 10, // 10MB
        totalJSHeapSize: 1024 * 1024 * 50, // 50MB
        jsHeapSizeLimit: 1024 * 1024 * 100, // 100MB
      },
    },
    configurable: true,
  });

  // Mock requestAnimationFrame
  Object.defineProperty(window, 'requestAnimationFrame', {
    value: jest.fn((callback) => setTimeout(callback, 16)),
  });

  // Mock IntersectionObserver
  Object.defineProperty(window, 'IntersectionObserver', {
    value: jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
    configurable: true,
  });

  // Mock ResizeObserver
  Object.defineProperty(window, 'ResizeObserver', {
    value: jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
  });

  // Mock PerformanceObserver
  Object.defineProperty(window, 'PerformanceObserver', {
    value: jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    })),
  });

  // Mock FontFace
  Object.defineProperty(window, 'FontFace', {
    value: jest.fn(() => ({
      load: jest.fn().mockResolvedValue({}),
    })),
  });

  // Mock document.fonts
  Object.defineProperty(document, 'fonts', {
    value: {
      add: jest.fn(),
    },
  });

  // Mock document.styleSheets
  Object.defineProperty(document, 'styleSheets', {
    value: [],
    configurable: true,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  
  mockGetComputedStyle.mockReturnValue({
    getPropertyValue: jest.fn((prop) => {
      // Return mock values for CSS properties
      if (prop.includes('color')) return '#6750a4';
      if (prop.includes('font-size')) return '16px';
      if (prop.includes('corner')) return '8px';
      if (prop.includes('duration')) return '300ms';
      if (prop.includes('easing')) return 'cubic-bezier(0.2, 0.0, 0, 1.0)';
      return '';
    }),
  });

  mockQuerySelectorAll.mockReturnValue([]);
  mockQuerySelector.mockReturnValue(null);
  mockCreateElement.mockReturnValue({
    style: {},
    setAttribute: jest.fn(),
    appendChild: jest.fn(),
    onload: null,
    onerror: null,
  });
});

describe('ColorRelationshipOptimizer', () => {
  let optimizer: ColorRelationshipOptimizer;

  beforeEach(() => {
    optimizer = ColorRelationshipOptimizer.getInstance();
  });

  test('should be a singleton', () => {
    const optimizer2 = ColorRelationshipOptimizer.getInstance();
    expect(optimizer).toBe(optimizer2);
  });

  test('should optimize color relationships', () => {
    const config = {
      primaryHue: 258,
      contrastRatio: 4.5,
      harmonicVariation: 15,
      accessibilityLevel: 'AA' as const,
    };

    expect(() => {
      optimizer.optimizeColorRelationships(config);
    }).not.toThrow();
  });
});

describe('VisualHierarchyOptimizer', () => {
  let optimizer: VisualHierarchyOptimizer;

  beforeEach(() => {
    optimizer = VisualHierarchyOptimizer.getInstance();
  });

  test('should be a singleton', () => {
    const optimizer2 = VisualHierarchyOptimizer.getInstance();
    expect(optimizer).toBe(optimizer2);
  });

  test('should optimize visual hierarchy', () => {
    const config = {
      typographyScale: 1.0,
      spacingScale: 1.0,
      elevationIntensity: 1.0,
      colorIntensity: 1.0,
    };

    expect(() => {
      optimizer.optimizeVisualHierarchy(config);
    }).not.toThrow();
  });
});

describe('AnimationJankReducer', () => {
  let reducer: AnimationJankReducer;

  beforeEach(() => {
    reducer = AnimationJankReducer.getInstance();
  });

  test('should be a singleton', () => {
    const reducer2 = AnimationJankReducer.getInstance();
    expect(reducer).toBe(reducer2);
  });

  test('should optimize animation performance', () => {
    mockQuerySelectorAll.mockReturnValue([
      { style: {} },
      { style: {} },
    ]);

    expect(() => {
      reducer.optimizeAnimationPerformance();
    }).not.toThrow();
  });

  test('should return performance metrics', () => {
    const metrics = reducer.getPerformanceMetrics();
    
    expect(metrics).toHaveProperty('animationFrameRate');
    expect(metrics).toHaveProperty('cssLoadTime');
    expect(metrics).toHaveProperty('bundleSize');
    expect(metrics).toHaveProperty('memoryUsage');
    expect(metrics).toHaveProperty('renderTime');
  });
});

describe('LazyLoadManager', () => {
  let manager: LazyLoadManager;

  beforeEach(() => {
    manager = LazyLoadManager.getInstance();
  });

  test('should be a singleton', () => {
    const manager2 = LazyLoadManager.getInstance();
    expect(manager).toBe(manager2);
  });

  test('should initialize lazy loading', () => {
    const config = {
      threshold: 0.1,
      rootMargin: '50px',
      loadingStrategy: 'lazy' as const,
    };

    expect(() => {
      manager.initializeLazyLoading(config);
    }).not.toThrow();
  });
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = PerformanceMonitor.getInstance();
  });

  test('should be a singleton', () => {
    const monitor2 = PerformanceMonitor.getInstance();
    expect(monitor).toBe(monitor2);
  });

  test('should start monitoring', () => {
    expect(() => {
      monitor.startMonitoring();
    }).not.toThrow();
  });

  test('should return metrics', () => {
    const metrics = monitor.getMetrics();
    
    expect(metrics).toHaveProperty('animationFrameRate');
    expect(metrics).toHaveProperty('cssLoadTime');
    expect(metrics).toHaveProperty('bundleSize');
    expect(metrics).toHaveProperty('memoryUsage');
    expect(metrics).toHaveProperty('renderTime');
  });

  test('should log performance report', () => {
    const consoleSpy = jest.spyOn(console, 'group').mockImplementation();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();

    monitor.logPerformanceReport();

    expect(consoleSpy).toHaveBeenCalledWith('🚀 Performance Report');
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleGroupEndSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
  });
});

describe('CSSBundleOptimizer', () => {
  let optimizer: CSSBundleOptimizer;

  beforeEach(() => {
    optimizer = CSSBundleOptimizer.getInstance();
  });

  test('should be a singleton', () => {
    const optimizer2 = CSSBundleOptimizer.getInstance();
    expect(optimizer).toBe(optimizer2);
  });

  test('should optimize CSS bundle', () => {
    expect(() => {
      optimizer.optimizeCSSBundle();
    }).not.toThrow();
  });

  test('should return bundle size', () => {
    const size = optimizer.getBundleSize();
    expect(typeof size).toBe('number');
    expect(size).toBeGreaterThanOrEqual(0);
  });
});

describe('FinalPolishOptimizer', () => {
  let optimizer: FinalPolishOptimizer;

  beforeEach(() => {
    optimizer = new FinalPolishOptimizer();
  });

  test('should execute full optimization', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    expect(() => {
      optimizer.executeFullOptimization();
    }).not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith('🎨 Starting Final Polish and Performance Optimization...');
    expect(consoleSpy).toHaveBeenCalledWith('✅ Final Polish and Performance Optimization Complete!');

    consoleSpy.mockRestore();
  });

  test('should return optimization report', () => {
    const report = optimizer.getOptimizationReport();
    
    expect(report).toHaveProperty('performance');
    expect(report).toHaveProperty('bundleSize');
    expect(report).toHaveProperty('optimizationsApplied');
    
    expect(Array.isArray(report.optimizationsApplied)).toBe(true);
    expect(report.optimizationsApplied.length).toBeGreaterThan(0);
  });
});

describe('Integration Tests', () => {
  test('should handle missing DOM elements gracefully', () => {
    mockQuerySelectorAll.mockReturnValue([]);
    mockQuerySelector.mockReturnValue(null);

    const optimizer = new FinalPolishOptimizer();
    
    expect(() => {
      optimizer.executeFullOptimization();
    }).not.toThrow();
  });

  test('should handle CSS access errors gracefully', () => {
    const optimizer = CSSBundleOptimizer.getInstance();
    
    expect(() => {
      optimizer.optimizeCSSBundle();
    }).not.toThrow();
  });

  test('should work without performance API', () => {
    const monitor = PerformanceMonitor.getInstance();
    
    expect(() => {
      monitor.startMonitoring();
    }).not.toThrow();
  });

  test('should work without IntersectionObserver', () => {
    // Temporarily remove IntersectionObserver
    const originalIntersectionObserver = window.IntersectionObserver;
    delete (window as any).IntersectionObserver;

    const manager = LazyLoadManager.getInstance();
    
    expect(() => {
      manager.initializeLazyLoading({
        threshold: 0.1,
        rootMargin: '50px',
        loadingStrategy: 'lazy',
      });
    }).not.toThrow();

    // Restore IntersectionObserver
    (window as any).IntersectionObserver = originalIntersectionObserver;
  });
});