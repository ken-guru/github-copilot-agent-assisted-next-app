/**
 * Final Polish and Performance Optimization Initializer
 * 
 * Main entry point for executing all final polish and performance
 * optimization tasks for the Material 3 Expressive design system.
 */

import { FinalPolishOptimizer } from './final-polish-optimizer';
import { DeploymentChecklistManager } from './deployment-checklist';
import { UserAcceptanceTestingManager } from './user-acceptance-testing';
import { initializePerformanceOptimizations } from './performance-optimization';

export interface FinalPolishConfig {
  enableColorOptimization: boolean;
  enableVisualHierarchyOptimization: boolean;
  enableAnimationOptimization: boolean;
  enableLazyLoading: boolean;
  enablePerformanceMonitoring: boolean;
  enableCSSOptimization: boolean;
  runDeploymentChecklist: boolean;
  enableUserAcceptanceTesting: boolean;
}

export interface FinalPolishResults {
  optimizationReport: any;
  deploymentReport: any;
  uatReport: any;
  performanceMetrics: any;
  recommendations: string[];
  overallStatus: 'ready' | 'needs-attention' | 'not-ready';
}

/**
 * Main Final Polish Manager
 */
export class FinalPolishManager {
  private static instance: FinalPolishManager;
  private optimizer: FinalPolishOptimizer;
  private checklistManager: DeploymentChecklistManager;
  private uatManager: UserAcceptanceTestingManager;
  private isInitialized = false;

  static getInstance(): FinalPolishManager {
    if (!FinalPolishManager.instance) {
      FinalPolishManager.instance = new FinalPolishManager();
    }
    return FinalPolishManager.instance;
  }

  constructor() {
    this.optimizer = new FinalPolishOptimizer();
    this.checklistManager = DeploymentChecklistManager.getInstance();
    this.uatManager = UserAcceptanceTestingManager.getInstance();
  }

  /**
   * Initialize final polish and performance optimization
   */
  async initialize(config: Partial<FinalPolishConfig> = {}): Promise<void> {
    if (this.isInitialized) {
      console.log('Final polish already initialized');
      return;
    }

    const defaultConfig: FinalPolishConfig = {
      enableColorOptimization: true,
      enableVisualHierarchyOptimization: true,
      enableAnimationOptimization: true,
      enableLazyLoading: true,
      enablePerformanceMonitoring: true,
      enableCSSOptimization: true,
      runDeploymentChecklist: true,
      enableUserAcceptanceTesting: false, // Manual process
    };

    const finalConfig = { ...defaultConfig, ...config };

    console.log('🎨 Initializing Final Polish and Performance Optimization...');

    try {
      // Initialize performance optimizations first
      initializePerformanceOptimizations();

      // Execute main optimization
      if (this.shouldRunOptimization(finalConfig)) {
        this.optimizer.executeFullOptimization();
      }

      // Wait a moment for optimizations to take effect
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.isInitialized = true;
      console.log('✅ Final Polish and Performance Optimization Initialized Successfully!');

    } catch (error) {
      console.error('❌ Failed to initialize final polish:', error);
      throw error;
    }
  }

  /**
   * Run comprehensive final polish process
   */
  async runFinalPolish(config: Partial<FinalPolishConfig> = {}): Promise<FinalPolishResults> {
    console.log('🚀 Starting Comprehensive Final Polish Process...');

    const defaultConfig: FinalPolishConfig = {
      enableColorOptimization: true,
      enableVisualHierarchyOptimization: true,
      enableAnimationOptimization: true,
      enableLazyLoading: true,
      enablePerformanceMonitoring: true,
      enableCSSOptimization: true,
      runDeploymentChecklist: true,
      enableUserAcceptanceTesting: false,
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Ensure initialization
    if (!this.isInitialized) {
      await this.initialize(finalConfig);
    }

    const results: Partial<FinalPolishResults> = {
      recommendations: [],
    };

    try {
      // 1. Get optimization report
      console.log('📊 Generating optimization report...');
      results.optimizationReport = this.optimizer.getOptimizationReport();

      // 2. Run deployment checklist
      if (finalConfig.runDeploymentChecklist) {
        console.log('📋 Running deployment checklist...');
        results.deploymentReport = await this.checklistManager.runFullValidation();
        this.checklistManager.printReport(results.deploymentReport);
      }

      // 3. Generate UAT report (if sessions exist)
      if (finalConfig.enableUserAcceptanceTesting) {
        console.log('🧪 Generating user acceptance testing report...');
        results.uatReport = this.uatManager.generateUATReport();
        this.uatManager.printUATReport(results.uatReport);
      }

      // 4. Collect performance metrics
      console.log('⚡ Collecting performance metrics...');
      results.performanceMetrics = results.optimizationReport.performance;

      // 5. Generate overall recommendations
      results.recommendations = this.generateOverallRecommendations(results);

      // 6. Determine overall status
      results.overallStatus = this.determineOverallStatus(results);

      console.log('✅ Final Polish Process Complete!');
      this.printFinalReport(results as FinalPolishResults);

      return results as FinalPolishResults;

    } catch (error) {
      console.error('❌ Final polish process failed:', error);
      throw error;
    }
  }

  /**
   * Quick optimization for development
   */
  async quickOptimize(): Promise<void> {
    console.log('⚡ Running quick optimization...');

    await this.initialize({
      enableColorOptimization: true,
      enableAnimationOptimization: true,
      enablePerformanceMonitoring: true,
      runDeploymentChecklist: false,
      enableUserAcceptanceTesting: false,
    });

    console.log('✅ Quick optimization complete!');
  }

  /**
   * Production-ready optimization
   */
  async productionOptimize(): Promise<FinalPolishResults> {
    console.log('🏭 Running production optimization...');

    return await this.runFinalPolish({
      enableColorOptimization: true,
      enableVisualHierarchyOptimization: true,
      enableAnimationOptimization: true,
      enableLazyLoading: true,
      enablePerformanceMonitoring: true,
      enableCSSOptimization: true,
      runDeploymentChecklist: true,
      enableUserAcceptanceTesting: false, // Manual process
    });
  }

  /**
   * Start user acceptance testing session
   */
  startUATSession(tester: string, device: string, browser: string): string {
    console.log(`🧪 Starting UAT session for ${tester} on ${device} (${browser})`);
    return this.uatManager.startTestSession(tester, device, browser);
  }

  /**
   * Get UAT scenarios for testing
   */
  getUATScenarios(category?: string) {
    if (category) {
      return this.uatManager.getScenariosByCategory(category as any);
    }
    return this.uatManager.getAllTestSessions();
  }

  /**
   * Complete UAT session
   */
  completeUATSession(sessionId: string, feedback: string, rating: number): void {
    this.uatManager.completeTestSession(sessionId, feedback, rating);
    console.log(`✅ UAT session ${sessionId} completed with rating ${rating}/5`);
  }

  /**
   * Get deployment checklist
   */
  getDeploymentChecklist() {
    return this.checklistManager.getAllChecklistItems();
  }

  /**
   * Update checklist item
   */
  updateChecklistItem(id: string, status: 'pending' | 'in-progress' | 'completed' | 'failed', details?: string): void {
    this.checklistManager.updateItemStatus(id, status, details);
  }

  private shouldRunOptimization(config: FinalPolishConfig): boolean {
    return config.enableColorOptimization ||
           config.enableVisualHierarchyOptimization ||
           config.enableAnimationOptimization ||
           config.enableLazyLoading ||
           config.enableCSSOptimization;
  }

  private generateOverallRecommendations(results: Partial<FinalPolishResults>): string[] {
    const recommendations: string[] = [];

    // Add optimization recommendations
    if (results.optimizationReport) {
      recommendations.push(...results.optimizationReport.optimizationsApplied.map(
        (opt: string) => `✅ ${opt} completed`
      ));
    }

    // Add deployment recommendations
    if (results.deploymentReport) {
      recommendations.push(...results.deploymentReport.recommendations);
    }

    // Add UAT recommendations
    if (results.uatReport) {
      recommendations.push(...results.uatReport.recommendations);
    }

    // Add performance recommendations
    if (results.performanceMetrics) {
      const metrics = results.performanceMetrics;
      if (metrics.animationFrameRate < 60) {
        recommendations.push('⚠️ Animation frame rate is below 60fps - consider optimizing animations');
      }
      if (metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
        recommendations.push('⚠️ Memory usage is high - consider optimizing memory consumption');
      }
    }

    return recommendations;
  }

  private determineOverallStatus(results: Partial<FinalPolishResults>): 'ready' | 'needs-attention' | 'not-ready' {
    // Check deployment status
    if (results.deploymentReport) {
      if (results.deploymentReport.overallStatus === 'not-ready') {
        return 'not-ready';
      }
      if (results.deploymentReport.overallStatus === 'needs-attention') {
        return 'needs-attention';
      }
    }

    // Check UAT status
    if (results.uatReport) {
      if (results.uatReport.criticalIssues.length > 0) {
        return 'not-ready';
      }
      if (results.uatReport.failedScenarios > 0) {
        return 'needs-attention';
      }
    }

    // Check performance metrics
    if (results.performanceMetrics) {
      const metrics = results.performanceMetrics;
      if (metrics.animationFrameRate < 30) {
        return 'not-ready';
      }
      if (metrics.animationFrameRate < 60) {
        return 'needs-attention';
      }
    }

    return 'ready';
  }

  private printFinalReport(results: FinalPolishResults): void {
    console.group('🎯 Final Polish and Performance Optimization Report');
    
    console.log(`Overall Status: ${results.overallStatus.toUpperCase()}`);
    
    if (results.performanceMetrics) {
      console.group('⚡ Performance Metrics');
      console.log(`Animation Frame Rate: ${results.performanceMetrics.animationFrameRate}fps`);
      console.log(`CSS Load Time: ${results.performanceMetrics.cssLoadTime.toFixed(2)}ms`);
      console.log(`Memory Usage: ${(results.performanceMetrics.memoryUsage / 1048576).toFixed(2)}MB`);
      console.log(`Bundle Size: ${(results.optimizationReport.bundleSize / 1024).toFixed(2)}KB`);
      console.groupEnd();
    }
    
    if (results.deploymentReport) {
      console.group('📋 Deployment Readiness');
      console.log(`Checklist: ${results.deploymentReport.completedItems}/${results.deploymentReport.totalItems} items completed`);
      if (results.deploymentReport.criticalIssues.length > 0) {
        console.log(`Critical Issues: ${results.deploymentReport.criticalIssues.length}`);
      }
      console.groupEnd();
    }
    
    if (results.uatReport) {
      console.group('🧪 User Acceptance Testing');
      console.log(`Test Results: ${results.uatReport.passedScenarios}/${results.uatReport.totalScenarios} scenarios passed`);
      console.log(`Overall Rating: ${results.uatReport.overallRating.toFixed(1)}/5.0`);
      console.groupEnd();
    }
    
    console.group('📋 Recommendations');
    results.recommendations.forEach(rec => console.log(rec));
    console.groupEnd();
    
    console.groupEnd();
  }
}

/**
 * Convenience functions for easy access
 */

// Initialize final polish (call this in your app initialization)
export async function initializeFinalPolish(config?: Partial<FinalPolishConfig>): Promise<void> {
  const manager = FinalPolishManager.getInstance();
  await manager.initialize(config);
}

// Quick optimization for development
export async function quickOptimize(): Promise<void> {
  const manager = FinalPolishManager.getInstance();
  await manager.quickOptimize();
}

// Production optimization
export async function productionOptimize(): Promise<FinalPolishResults> {
  const manager = FinalPolishManager.getInstance();
  return await manager.productionOptimize();
}

// Start UAT session
export function startUATSession(tester: string, device: string, browser: string): string {
  const manager = FinalPolishManager.getInstance();
  return manager.startUATSession(tester, device, browser);
}

// Get deployment checklist
export function getDeploymentChecklist() {
  const manager = FinalPolishManager.getInstance();
  return manager.getDeploymentChecklist();
}

// Export the main manager for advanced usage
export { FinalPolishManager };

// Auto-initialize in development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Auto-initialize with development-friendly settings
  initializeFinalPolish({
    enableColorOptimization: true,
    enableAnimationOptimization: true,
    enablePerformanceMonitoring: true,
    runDeploymentChecklist: false,
    enableUserAcceptanceTesting: false,
  }).catch(console.error);
}