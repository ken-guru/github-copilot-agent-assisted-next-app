/**
 * Performance monitoring utilities for activity reordering
 * Provides tools to measure and track performance metrics
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface PerformanceThresholds {
  dragStart: number;
  dragEnd: number;
  reorder: number;
  render: number;
  storage: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private thresholds: PerformanceThresholds = {
    dragStart: 16, // 1 frame at 60fps
    dragEnd: 16,
    reorder: 100,
    render: 50,
    storage: 200,
  };
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  /**
   * Start measuring a performance metric
   */
  start(name: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.metrics.set(name, metric);
  }

  /**
   * End measuring a performance metric
   */
  end(name: string): number | null {
    if (!this.isEnabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" was not started`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Check against thresholds
    this.checkThreshold(name, duration);

    return duration;
  }

  /**
   * Measure a function's execution time
   */
  measure<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    if (!this.isEnabled) return fn();

    this.start(name, metadata);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Measure an async function's execution time
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    if (!this.isEnabled) return fn();

    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
  }

  /**
   * Get metrics by name pattern
   */
  getMetricsByPattern(pattern: RegExp): PerformanceMetric[] {
    return this.getMetrics().filter(m => pattern.test(m.name));
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Set performance thresholds
   */
  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * Check if a metric exceeds its threshold
   */
  private checkThreshold(name: string, duration: number): void {
    const thresholdKey = this.getThresholdKey(name);
    const threshold = this.thresholds[thresholdKey];

    if (threshold && duration > threshold) {
      console.warn(
        `Performance warning: "${name}" took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
      );
    }
  }

  /**
   * Get threshold key for a metric name
   */
  private getThresholdKey(name: string): keyof PerformanceThresholds {
    if (name.includes('drag-start')) return 'dragStart';
    if (name.includes('drag-end')) return 'dragEnd';
    if (name.includes('reorder')) return 'reorder';
    if (name.includes('render')) return 'render';
    if (name.includes('storage')) return 'storage';
    return 'render'; // default
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const metrics = this.getMetrics();
    if (metrics.length === 0) {
      return 'No performance metrics recorded';
    }

    const report = ['Performance Report', '='.repeat(50)];
    
    // Group metrics by category
    const categories = new Map<string, PerformanceMetric[]>();
    metrics.forEach(metric => {
      const category = metric.name.split('-')[0] || 'other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(metric);
    });

    categories.forEach((categoryMetrics, category) => {
      report.push(`\n${category.toUpperCase()}:`);
      
      categoryMetrics.forEach(metric => {
        const duration = metric.duration!.toFixed(2);
        const threshold = this.thresholds[this.getThresholdKey(metric.name)];
        const status = threshold && metric.duration! > threshold ? '⚠️' : '✅';
        
        report.push(`  ${status} ${metric.name}: ${duration}ms`);
        
        if (metric.metadata) {
          Object.entries(metric.metadata).forEach(([key, value]) => {
            report.push(`    ${key}: ${value}`);
          });
        }
      });
    });

    // Summary statistics
    const totalDuration = metrics.reduce((sum, m) => sum + m.duration!, 0);
    const avgDuration = totalDuration / metrics.length;
    const maxDuration = Math.max(...metrics.map(m => m.duration!));
    const minDuration = Math.min(...metrics.map(m => m.duration!));

    report.push('\nSUMMARY:');
    report.push(`  Total metrics: ${metrics.length}`);
    report.push(`  Total duration: ${totalDuration.toFixed(2)}ms`);
    report.push(`  Average duration: ${avgDuration.toFixed(2)}ms`);
    report.push(`  Max duration: ${maxDuration.toFixed(2)}ms`);
    report.push(`  Min duration: ${minDuration.toFixed(2)}ms`);

    return report.join('\n');
  }

  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Check if monitoring is enabled
   */
  isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const startPerformanceTimer = (name: string, metadata?: Record<string, any>) => 
  performanceMonitor.start(name, metadata);

export const endPerformanceTimer = (name: string) => 
  performanceMonitor.end(name);

export const measurePerformance = <T>(name: string, fn: () => T, metadata?: Record<string, any>) => 
  performanceMonitor.measure(name, fn, metadata);

export const measureAsyncPerformance = <T>(
  name: string, 
  fn: () => Promise<T>, 
  metadata?: Record<string, any>
) => 
  performanceMonitor.measureAsync(name, fn, metadata);

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  return {
    start: startPerformanceTimer,
    end: endPerformanceTimer,
    measure: measurePerformance,
    measureAsync: measureAsyncPerformance,
    getReport: () => performanceMonitor.generateReport(),
    clear: () => performanceMonitor.clear(),
    setThresholds: (thresholds: Partial<PerformanceThresholds>) => 
      performanceMonitor.setThresholds(thresholds),
  };
};

export default performanceMonitor;