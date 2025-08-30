/**
 * Tests for Final Polish utilities
 */

import {
  optimizeColorRelationships,
  optimizeAnimationPerformance,
  implementLazyLoading,
  addPerformanceMonitoring,
  optimizeCSSBundle,
  checkDeploymentReadiness,
  executeFinalPolish,
} from '../final-polish';

// Mock DOM methods
const mockAppendChild = jest.fn();
const mockQuerySelectorAll = jest.fn();
const mockGetComputedStyle = jest.fn();
const mockCreateElement = jest.fn();

beforeAll(() => {
  Object.defineProperty(document, 'head', {
    value: { appendChild: mockAppendChild },
  });

  Object.defineProperty(document, 'querySelectorAll', {
    value: mockQuerySelectorAll,
  });

  Object.defineProperty(window, 'getComputedStyle', {
    value: mockGetComputedStyle,
  });

  Object.defineProperty(document, 'createElement', {
    value: mockCreateElement,
  });

  Object.defineProperty(document, 'styleSheets', {
    value: [],
    configurable: true,
  });

  Object.defineProperty(window, 'performance', {
    value: { now: jest.fn(() => Date.now()) },
  });

  Object.defineProperty(window, 'requestAnimationFrame', {
    value: jest.fn((callback) => setTimeout(callback, 16)),
  });

  Object.defineProperty(window, 'requestIdleCallback', {
    value: jest.fn((callback) => setTimeout(callback, 1)),
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  
  mockGetComputedStyle.mockReturnValue({
    getPropertyValue: jest.fn((prop) => {
      if (prop.includes('color')) return '#6750a4';
      return '';
    }),
  });

  mockQuerySelectorAll.mockReturnValue([]);
  
  mockCreateElement.mockReturnValue({
    style: {},
    setAttribute: jest.fn(),
    onload: null,
    onerror: null,
  });
});

describe('Final Polish utilities', () => {
  test('optimizeColorRelationships should add accessibility styles', () => {
    optimizeColorRelationships();
    
    expect(mockCreateElement).toHaveBeenCalledWith('style');
    expect(mockAppendChild).toHaveBeenCalled();
  });

  test('optimizeAnimationPerformance should optimize animated elements', () => {
    const mockElements = [
      { style: {} },
      { style: {} },
    ];
    mockQuerySelectorAll.mockReturnValue(mockElements);

    optimizeAnimationPerformance();

    expect(mockQuerySelectorAll).toHaveBeenCalledWith('[data-animated], .md-animated');
    expect(mockCreateElement).toHaveBeenCalledWith('style');
    expect(mockAppendChild).toHaveBeenCalled();
  });

  test('implementLazyLoading should set up lazy loading', () => {
    const mockImages = [
      { loading: undefined },
      { loading: undefined },
    ];
    mockQuerySelectorAll.mockReturnValue(mockImages);

    implementLazyLoading();

    expect(mockQuerySelectorAll).toHaveBeenCalledWith('img:not([loading])');
    mockImages.forEach(img => {
      expect(img.loading).toBe('lazy');
    });
  });

  test('addPerformanceMonitoring should start FPS monitoring', () => {
    addPerformanceMonitoring();
    
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  test('optimizeCSSBundle should add optimized styles in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    optimizeCSSBundle();

    expect(mockCreateElement).toHaveBeenCalledWith('style');
    expect(mockAppendChild).toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  test('checkDeploymentReadiness should return boolean', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: jest.fn(() => '#6750a4'),
    });

    const result = checkDeploymentReadiness();
    
    expect(typeof result).toBe('boolean');
  });

  test('executeFinalPolish should run all optimizations', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    executeFinalPolish();

    expect(mockCreateElement).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('should handle errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockCreateElement.mockImplementation(() => {
      throw new Error('Test error');
    });

    expect(() => {
      executeFinalPolish();
    }).not.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});