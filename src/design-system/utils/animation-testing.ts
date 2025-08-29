/**
 * Animation Testing Suite
 * 
 * Comprehensive test utilities for all animation components and utilities.
 * Includes performance monitoring, reduced motion compliance, and
 * cross-browser compatibility testing.
 */

import { ANIMATION_DURATION, MATERIAL3_EASING, prefersReducedMotion } from '../utils/animation-utils';
import { createPageEnterAnimation, createPageExitAnimation } from '../utils/page-transition-animations';
import type { PageTransitionConfig } from '../utils/page-transition-animations';

export interface AnimationTestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  performanceMetrics?: {
    fps: number;
    droppedFrames: number;
    cpuUsage: number;
  };
}

export interface AnimationTestSuite {
  name: string;
  tests: AnimationTestResult[];
  totalPassed: number;
  totalFailed: number;
  averageDuration: number;
  performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * Animation Performance Monitor
 */
export class AnimationPerformanceMonitor {
  private rafId: number | null = null;
  private startTime: number = 0;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private frameTimes: number[] = [];

  start(): void {
    this.startTime = performance.now();
    this.frameCount = 0;
    this.frameTimes = [];
    this.lastFrameTime = this.startTime;
    this.measureFrame();
  }

  stop(): { fps: number; droppedFrames: number; duration: number } {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    const totalDuration = performance.now() - this.startTime;
    const averageFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    const targetFrameTime = 1000 / 60; // 60 FPS
    const fps = 1000 / averageFrameTime;
    const droppedFrames = this.frameTimes.filter(time => time > targetFrameTime * 1.5).length;

    return {
      fps: Math.round(fps),
      droppedFrames,
      duration: totalDuration
    };
  }

  private measureFrame = (): void => {
    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    
    this.frameTimes.push(frameTime);
    this.frameCount++;
    this.lastFrameTime = currentTime;

    this.rafId = requestAnimationFrame(this.measureFrame);
  };
}

/**
 * Test utilities for animation functions
 */
export class AnimationTestUtils {
  private static monitor = new AnimationPerformanceMonitor();

  /**
   * Test animation duration accuracy
   */
  static async testAnimationDuration(
    animationFn: () => Animation,
    expectedDuration: number,
    tolerance: number = 50
  ): Promise<AnimationTestResult> {
    const testName = 'Animation Duration Accuracy';
    const startTime = performance.now();

    try {
      const animation = animationFn();
      await animation.finished;
      
      const actualDuration = performance.now() - startTime;
      const passed = Math.abs(actualDuration - expectedDuration) <= tolerance;

      return {
        testName,
        passed,
        duration: actualDuration,
        error: passed ? undefined : `Expected ~${expectedDuration}ms, got ${actualDuration.toFixed(2)}ms`
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test animation performance
   */
  static async testAnimationPerformance(
    animationFn: () => Animation,
    minFps: number = 30
  ): Promise<AnimationTestResult> {
    const testName = 'Animation Performance';

    try {
      this.monitor.start();
      const animation = animationFn();
      await animation.finished;
      const metrics = this.monitor.stop();

      const passed = metrics.fps >= minFps;

      return {
        testName,
        passed,
        duration: metrics.duration,
        error: passed ? undefined : `FPS too low: ${metrics.fps} (min: ${minFps})`,
        performanceMetrics: {
          fps: metrics.fps,
          droppedFrames: metrics.droppedFrames,
          cpuUsage: 0 // Would need additional APIs
        }
      };
    } catch (error) {
      this.monitor.stop();
      return {
        testName,
        passed: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test reduced motion compliance
   */
  static async testReducedMotionCompliance(
    animationFn: () => Animation,
    fallbackDuration: number = 200
  ): Promise<AnimationTestResult> {
    const testName = 'Reduced Motion Compliance';

    try {
      // Mock prefers-reduced-motion
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = ((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      })) as any;

      const startTime = performance.now();
      const animation = animationFn();
      await animation.finished;
      const duration = performance.now() - startTime;

      // Restore original matchMedia
      window.matchMedia = originalMatchMedia;

      const passed = duration <= fallbackDuration + 50; // 50ms tolerance

      return {
        testName,
        passed,
        duration,
        error: passed ? undefined : `Animation too long with reduced motion: ${duration.toFixed(2)}ms`
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test animation cleanup (no memory leaks)
   */
  static async testAnimationCleanup(
    animationFn: () => Animation
  ): Promise<AnimationTestResult> {
    const testName = 'Animation Cleanup';

    try {
      const initialAnimationCount = document.getAnimations().length;
      
      const animation = animationFn();
      await animation.finished;
      
      // Wait a frame to ensure cleanup
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const finalAnimationCount = document.getAnimations().length;
      const passed = finalAnimationCount === initialAnimationCount;

      return {
        testName,
        passed,
        duration: 0,
        error: passed ? undefined : `Memory leak detected: ${finalAnimationCount - initialAnimationCount} animations not cleaned up`
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Page Transition Animation Tests
 */
export class PageTransitionTests {
  static async runAllTests(element: HTMLElement): Promise<AnimationTestSuite> {
    const tests: AnimationTestResult[] = [];
    
    const config: PageTransitionConfig = {
      type: 'fade',
      duration: ANIMATION_DURATION.medium2
    };

    const context = {
      fromRoute: '/test-from',
      toRoute: '/test-to',
      direction: 'forward' as const,
      isInitialLoad: false
    };

    // Test fade enter animation
    tests.push(await AnimationTestUtils.testAnimationDuration(
      () => createPageEnterAnimation(element, config, context),
      config.duration || ANIMATION_DURATION.medium2
    ));

    // Test fade exit animation
    tests.push(await AnimationTestUtils.testAnimationPerformance(
      () => createPageExitAnimation(element, config, context)
    ));

    // Test slide animations
    const slideConfig: PageTransitionConfig = {
      type: 'slide',
      direction: 'left',
      duration: ANIMATION_DURATION.medium2
    };

    tests.push(await AnimationTestUtils.testAnimationDuration(
      () => createPageEnterAnimation(element, slideConfig, context),
      slideConfig.duration || ANIMATION_DURATION.medium2
    ));

    // Test reduced motion compliance
    tests.push(await AnimationTestUtils.testReducedMotionCompliance(
      () => createPageEnterAnimation(element, config, context)
    ));

    // Test cleanup
    tests.push(await AnimationTestUtils.testAnimationCleanup(
      () => createPageEnterAnimation(element, config, context)
    ));

    return this.compileSuiteResults('Page Transitions', tests);
  }

  private static compileSuiteResults(name: string, tests: AnimationTestResult[]): AnimationTestSuite {
    const totalPassed = tests.filter(t => t.passed).length;
    const totalFailed = tests.length - totalPassed;
    const averageDuration = tests.reduce((sum, t) => sum + t.duration, 0) / tests.length;
    
    // Calculate performance rating
    const passRate = totalPassed / tests.length;
    const avgFps = tests.reduce((sum, t) => sum + (t.performanceMetrics?.fps || 60), 0) / tests.length;
    
    let performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
    if (passRate >= 0.9 && avgFps >= 50) performanceRating = 'excellent';
    else if (passRate >= 0.8 && avgFps >= 40) performanceRating = 'good';
    else if (passRate >= 0.6 && avgFps >= 30) performanceRating = 'fair';
    else performanceRating = 'poor';

    return {
      name,
      tests,
      totalPassed,
      totalFailed,
      averageDuration,
      performanceRating
    };
  }
}

/**
 * Cross-browser compatibility tests
 */
export class CrossBrowserTests {
  /**
   * Test Web Animations API support
   */
  static testWebAnimationsSupport(): AnimationTestResult {
    const testName = 'Web Animations API Support';
    
    const supported = typeof Element.prototype.animate === 'function';
    
    return {
      testName,
      passed: supported,
      duration: 0,
      error: supported ? undefined : 'Web Animations API not supported'
    };
  }

  /**
   * Test CSS animation fallback
   */
  static testCSSAnimationFallback(): AnimationTestResult {
    const testName = 'CSS Animation Fallback';
    
    const element = document.createElement('div');
    element.style.animation = 'test 1s';
    const supported = element.style.animation === 'test 1s';
    
    return {
      testName,
      passed: supported,
      duration: 0,
      error: supported ? undefined : 'CSS animations not supported'
    };
  }

  /**
   * Test transform support
   */
  static testTransformSupport(): AnimationTestResult {
    const testName = 'CSS Transform Support';
    
    const element = document.createElement('div');
    element.style.transform = 'translateX(100px)';
    const supported = element.style.transform !== '';
    
    return {
      testName,
      passed: supported,
      duration: 0,
      error: supported ? undefined : 'CSS transforms not supported'
    };
  }
}

/**
 * Animation Test Runner
 */
export class AnimationTestRunner {
  static async runAllTests(): Promise<AnimationTestSuite[]> {
    const results: AnimationTestSuite[] = [];
    
    // Create test element
    const testElement = document.createElement('div');
    testElement.style.cssText = `
      position: fixed;
      top: -1000px;
      left: -1000px;
      width: 100px;
      height: 100px;
      background: red;
      opacity: 0;
    `;
    document.body.appendChild(testElement);

    try {
      // Run page transition tests
      results.push(await PageTransitionTests.runAllTests(testElement));

      // Run cross-browser tests
      const crossBrowserTests = [
        CrossBrowserTests.testWebAnimationsSupport(),
        CrossBrowserTests.testCSSAnimationFallback(),
        CrossBrowserTests.testTransformSupport()
      ];

      results.push({
        name: 'Cross-Browser Compatibility',
        tests: crossBrowserTests,
        totalPassed: crossBrowserTests.filter(t => t.passed).length,
        totalFailed: crossBrowserTests.filter(t => !t.passed).length,
        averageDuration: 0,
        performanceRating: crossBrowserTests.every(t => t.passed) ? 'excellent' : 'poor'
      });

    } finally {
      // Cleanup
      document.body.removeChild(testElement);
    }

    return results;
  }

  /**
   * Generate test report
   */
  static generateReport(suites: AnimationTestSuite[]): string {
    let report = '# Animation Test Report\n\n';
    
    const totalTests = suites.reduce((sum, suite) => sum + suite.tests.length, 0);
    const totalPassed = suites.reduce((sum, suite) => sum + suite.totalPassed, 0);
    const totalFailed = totalTests - totalPassed;
    
    report += `## Summary\n`;
    report += `- **Total Tests:** ${totalTests}\n`;
    report += `- **Passed:** ${totalPassed}\n`;
    report += `- **Failed:** ${totalFailed}\n`;
    report += `- **Pass Rate:** ${((totalPassed / totalTests) * 100).toFixed(1)}%\n\n`;

    suites.forEach(suite => {
      report += `## ${suite.name}\n`;
      report += `- **Performance Rating:** ${suite.performanceRating.toUpperCase()}\n`;
      report += `- **Tests Passed:** ${suite.totalPassed}/${suite.tests.length}\n`;
      report += `- **Average Duration:** ${suite.averageDuration.toFixed(2)}ms\n\n`;

      suite.tests.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        report += `### ${status} ${test.testName}\n`;
        if (!test.passed && test.error) {
          report += `- **Error:** ${test.error}\n`;
        }
        if (test.performanceMetrics) {
          report += `- **FPS:** ${test.performanceMetrics.fps}\n`;
          report += `- **Dropped Frames:** ${test.performanceMetrics.droppedFrames}\n`;
        }
        report += `- **Duration:** ${test.duration.toFixed(2)}ms\n\n`;
      });
    });

    return report;
  }
}