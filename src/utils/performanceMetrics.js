/**
 * Performance metrics utility for measuring and tracking performance
 * in the mobile UI refinement phase
 */

// Track component render performance
export const measureRenderTime = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log or report the timing
    console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`);
    
    // Optional: Report to analytics or monitoring system
    if (window.__PERFORMANCE_METRICS__) {
      window.__PERFORMANCE_METRICS__.push({
        component: componentName,
        renderTime: duration,
        timestamp: Date.now()
      });
    }
    
    return duration;
  };
};

// Measure interaction response time
export const measureInteractionTime = (interactionName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`[Performance] Interaction "${interactionName}" took ${duration.toFixed(2)}ms`);
    
    return duration;
  };
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    // Create global metrics container
    window.__PERFORMANCE_METRICS__ = [];
    
    // Monitor long tasks
    if (window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
            
            window.__PERFORMANCE_METRICS__.push({
              type: 'longTask',
              duration: entry.duration,
              timestamp: Date.now()
            });
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.error('Performance monitoring not supported', e);
      }
    }
    
    // Monitor FID (First Input Delay)
    if (window.PerformanceObserver) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const delay = entry.processingStart - entry.startTime;
            
            console.log(`[Performance] FID: ${delay.toFixed(2)}ms`);
            
            window.__PERFORMANCE_METRICS__.push({
              type: 'fid',
              delay: delay,
              timestamp: Date.now()
            });
          }
        });
        
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.error('FID monitoring not supported', e);
      }
    }
    
    return window.__PERFORMANCE_METRICS__;
  }
  
  return null;
};

// Get performance report
export const getPerformanceReport = () => {
  if (typeof window !== 'undefined' && window.__PERFORMANCE_METRICS__) {
    const metrics = window.__PERFORMANCE_METRICS__;
    
    // Calculate averages
    const renderTimes = metrics.filter(m => m.renderTime);
    const interactions = metrics.filter(m => m.type === 'interaction');
    const longTasks = metrics.filter(m => m.type === 'longTask');
    
    const avgRenderTime = renderTimes.length ? 
      renderTimes.reduce((sum, m) => sum + m.renderTime, 0) / renderTimes.length : 0;
    
    const avgInteractionTime = interactions.length ?
      interactions.reduce((sum, m) => sum + m.duration, 0) / interactions.length : 0;
    
    return {
      averageRenderTime: avgRenderTime,
      averageInteractionTime: avgInteractionTime,
      longTaskCount: longTasks.length,
      totalMetricsCollected: metrics.length,
      detailedMetrics: metrics
    };
  }
  
  return null;
};
