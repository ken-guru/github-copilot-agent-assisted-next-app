import { lazy, useCallback } from 'react';
import { useViewport } from '../hooks/useViewport';

/**
 * Enhanced version of React.lazy with preloading capability
 * @param {Function} factory - Import function
 * @param {Function} [performanceCallback] - Optional callback for performance metrics
 * @returns {React.LazyExoticComponent} Lazy component with preload method
 */
export const lazyWithPreload = (factory, performanceCallback = null) => {
  // Create standard lazy component
  const LazyComponent = lazy(() => {
    if (performanceCallback) {
      return measureLoadingPerformance(
        getComponentNameFromFactory(factory),
        factory,
        performanceCallback
      );
    }
    return factory();
  });

  // Add preload capability
  LazyComponent.preload = () => {
    factory().catch(error => {
      console.warn('Error preloading component:', error);
    });
  };

  return LazyComponent;
};

/**
 * Extract component name from import factory function
 * @param {Function} factory - Import function
 * @returns {string} Component name
 */
const getComponentNameFromFactory = (factory) => {
  const factoryStr = factory.toString();
  const matches = factoryStr.match(/import\(['"]\.\.\/(.+)['"]\)/);
  return matches && matches[1] ? matches[1] : 'UnknownComponent';
};

/**
 * Hook to get a preloader function for lazy components
 * @returns {Function} Preloader function that accepts array of lazy components
 */
export const useComponentPreloader = () => {
  const { isMobile, connectionType } = useViewport();

  const preloadComponents = useCallback((components) => {
    // Skip preloading on slow connections
    if (isMobile && connectionType === 'slow-2g' || connectionType === '2g') {
      return;
    }
    
    // Preload each component
    components.forEach(component => {
      if (component && typeof component.preload === 'function') {
        component.preload();
      }
    });
  }, [isMobile, connectionType]);

  return preloadComponents;
};

/**
 * Measure component loading performance
 * @param {string} componentName - Name of the component
 * @param {Function} loadFn - Component loading function
 * @param {Function} callback - Callback with performance data
 * @returns {Promise} Promise resolved with loaded component
 */
export const measureLoadingPerformance = async (componentName, loadFn, callback) => {
  const startTime = performance.now();
  
  try {
    const result = await loadFn();
    const endTime = performance.now();
    
    const perfData = {
      componentName,
      loadTimeMs: endTime - startTime,
      timestamp: Date.now()
    };
    
    if (typeof callback === 'function') {
      callback(perfData);
    }
    
    return result;
  } catch (error) {
    console.error(`Error loading component ${componentName}:`, error);
    throw error;
  }
};

/**
 * Hook for lazy loading components based on viewport
 * @param {Object} options - Configuration options
 * @param {React.LazyExoticComponent} options.mobileComponent - Component for mobile
 * @param {React.LazyExoticComponent} options.desktopComponent - Component for desktop
 * @param {React.LazyExoticComponent} options.fallbackComponent - Fallback component
 * @returns {React.LazyExoticComponent} The appropriate component based on viewport
 */
export const useViewportLazyComponent = ({ mobileComponent, desktopComponent, fallbackComponent }) => {
  const { isMobile, isTablet, isDesktop } = useViewport();
  
  if (isMobile && mobileComponent) return mobileComponent;
  if (isTablet && desktopComponent) return desktopComponent;
  if (isDesktop && desktopComponent) return desktopComponent;
  
  return fallbackComponent || desktopComponent || mobileComponent;
};

/**
 * Tracks loading performance metrics
 */
export const loadingPerformanceData = {
  metrics: [],
  
  /**
   * Add performance metric
   * @param {Object} metric - Performance metric object
   */
  addMetric(metric) {
    this.metrics.push({
      ...metric,
      timestamp: metric.timestamp || Date.now()
    });
    
    // Keep only the last 100 metrics to avoid memory issues
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  },
  
  /**
   * Get summary of performance metrics
   * @returns {Object} Performance summary
   */
  getSummary() {
    const allLoadTimes = this.metrics
      .filter(m => typeof m.loadTimeMs === 'number')
      .map(m => m.loadTimeMs);
      
    if (allLoadTimes.length === 0) return null;
    
    const avgLoadTime = allLoadTimes.reduce((sum, time) => sum + time, 0) / allLoadTimes.length;
    const maxLoadTime = Math.max(...allLoadTimes);
    const minLoadTime = Math.min(...allLoadTimes);
    
    return {
      averageLoadTimeMs: avgLoadTime,
      maxLoadTimeMs: maxLoadTime,
      minLoadTimeMs: minLoadTime,
      totalComponentsLoaded: allLoadTimes.length
    };
  },
  
  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
  }
};
