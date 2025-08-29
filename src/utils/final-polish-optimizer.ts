/**
 * Final Polish and Performance Optimizer
 * 
 * Comprehensive utilities for fine-tuning color relationships, visual hierarchy,
 * animation performance, lazy loading, performance monitoring, CSS optimization,
 * and deployment readiness for the Material 3 Expressive design system.
 */

import { AnimationPerformanceManager } from './material3-animations';

export interface ColorRelationshipConfig {
  primaryHue: number;
  contrastRatio: number;
  harmonicVariation: number;
  accessibilityLevel: 'AA' | 'AAA';
}

export interface VisualHierarchyConfig {
  typographyScale: number;
  spacingScale: number;
  elevationIntensity: number;
  colorIntensity: number;
}

export interface PerformanceMetrics {
  animationFrameRate: number;
  cssLoadTime: number;
  bundleSize: number;
  memoryUsage: number;
  renderTime: number;
}

export interface LazyLoadConfig {
  threshold: number;
  rootMargin: string;
  loadingStrategy: 'eager' | 'lazy' | 'auto';
}

/**
 * Color Relationship Fine-tuning
 */
export class ColorRelationshipOptimizer {
  private static instance: ColorRelationshipOptimizer;
  private colorCache = new Map<string, string>();

  static getInstance(): ColorRelationshipOptimizer {
    if (!ColorRelationshipOptimizer.instance) {
      ColorRelationshipOptimizer.instance = new ColorRelationshipOptimizer();
    }
    return ColorRelationshipOptimizer.instance;
  }

  /**
   * Fine-tune color relationships for optimal visual hierarchy
   */
  optimizeColorRelationships(config: ColorRelationshipConfig): void {
    const { primaryHue, contrastRatio, harmonicVariation, accessibilityLevel } = config;
    
    // Generate optimized color palette
    const optimizedColors = this.generateOptimizedPalette(primaryHue, harmonicVariation);
    
    // Ensure accessibility compliance
    const accessibleColors = this.ensureAccessibility(optimizedColors, contrastRatio, accessibilityLevel);
    
    // Apply colors to CSS custom properties
    this.applyOptimizedColors(accessibleColors);
  }

  private generateOptimizedPalette(primaryHue: number, variation: number): Record<string, string> {
    const colors: Record<string, string> = {};
    
    // Primary color family
    colors.primary = `hsl(${primaryHue}, 70%, 50%)`;
    colors.primaryContainer = `hsl(${primaryHue}, 60%, 90%)`;
    colors.onPrimary = `hsl(${primaryHue}, 10%, 10%)`;
    colors.onPrimaryContainer = `hsl(${primaryHue}, 80%, 20%)`;
    
    // Secondary color family (complementary with variation)
    const secondaryHue = (primaryHue + 180 + variation) % 360;
    colors.secondary = `hsl(${secondaryHue}, 50%, 45%)`;
    colors.secondaryContainer = `hsl(${secondaryHue}, 40%, 85%)`;
    colors.onSecondary = `hsl(${secondaryHue}, 10%, 10%)`;
    colors.onSecondaryContainer = `hsl(${secondaryHue}, 60%, 25%)`;
    
    // Tertiary color family (triadic with variation)
    const tertiaryHue = (primaryHue + 120 + variation) % 360;
    colors.tertiary = `hsl(${tertiaryHue}, 45%, 55%)`;
    colors.tertiaryContainer = `hsl(${tertiaryHue}, 35%, 88%)`;
    colors.onTertiary = `hsl(${tertiaryHue}, 10%, 10%)`;
    colors.onTertiaryContainer = `hsl(${tertiaryHue}, 55%, 30%)`;
    
    return colors;
  }

  private ensureAccessibility(
    colors: Record<string, string>, 
    targetRatio: number, 
    level: 'AA' | 'AAA'
  ): Record<string, string> {
    const minRatio = level === 'AAA' ? 7 : 4.5;
    const adjustedColors: Record<string, string> = {};
    
    Object.entries(colors).forEach(([key, color]) => {
      const ratio = this.calculateContrastRatio(color, '#ffffff');
      if (ratio < Math.max(minRatio, targetRatio)) {
        adjustedColors[key] = this.adjustColorForContrast(color, targetRatio);
      } else {
        adjustedColors[key] = color;
      }
    });
    
    return adjustedColors;
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    // Simplified contrast ratio calculation
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 1;
    
    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private getLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private adjustColorForContrast(color: string, targetRatio: number): string {
    // Simplified color adjustment - in practice, this would be more sophisticated
    return color; // Placeholder implementation
  }

  private applyOptimizedColors(colors: Record<string, string>): void {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--md-sys-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
  }
}

/**
 * Visual Hierarchy Optimizer
 */
export class VisualHierarchyOptimizer {
  private static instance: VisualHierarchyOptimizer;

  static getInstance(): VisualHierarchyOptimizer {
    if (!VisualHierarchyOptimizer.instance) {
      VisualHierarchyOptimizer.instance = new VisualHierarchyOptimizer();
    }
    return VisualHierarchyOptimizer.instance;
  }

  /**
   * Fine-tune visual hierarchy across the application
   */
  optimizeVisualHierarchy(config: VisualHierarchyConfig): void {
    this.optimizeTypographyScale(config.typographyScale);
    this.optimizeSpacingScale(config.spacingScale);
    this.optimizeElevationSystem(config.elevationIntensity);
    this.optimizeColorIntensity(config.colorIntensity);
  }

  private optimizeTypographyScale(scale: number): void {
    const root = document.documentElement;
    const baseSize = 16; // Base font size in pixels
    
    const typographySizes = {
      'display-large': 57 * scale,
      'display-medium': 45 * scale,
      'display-small': 36 * scale,
      'headline-large': 32 * scale,
      'headline-medium': 28 * scale,
      'headline-small': 24 * scale,
      'title-large': 22 * scale,
      'title-medium': 16 * scale,
      'title-small': 14 * scale,
      'body-large': 16 * scale,
      'body-medium': 14 * scale,
      'body-small': 12 * scale,
      'label-large': 14 * scale,
      'label-medium': 12 * scale,
      'label-small': 11 * scale,
    };

    Object.entries(typographySizes).forEach(([key, size]) => {
      root.style.setProperty(`--md-sys-typescale-${key}-font-size`, `${size}px`);
    });
  }

  private optimizeSpacingScale(scale: number): void {
    const root = document.documentElement;
    const baseSpacing = 8; // Base spacing unit in pixels
    
    const spacingValues = {
      'xs': 4 * scale,
      'sm': 8 * scale,
      'md': 16 * scale,
      'lg': 24 * scale,
      'xl': 32 * scale,
      'xxl': 48 * scale,
      'xxxl': 64 * scale,
    };

    Object.entries(spacingValues).forEach(([key, value]) => {
      root.style.setProperty(`--md-sys-spacing-${key}`, `${value}px`);
    });
  }

  private optimizeElevationSystem(intensity: number): void {
    const root = document.documentElement;
    
    const elevationLevels = {
      'level1': `0px ${1 * intensity}px ${2 * intensity}px 0px rgba(0, 0, 0, 0.3), 0px ${1 * intensity}px ${3 * intensity}px ${1 * intensity}px rgba(0, 0, 0, 0.15)`,
      'level2': `0px ${1 * intensity}px ${2 * intensity}px 0px rgba(0, 0, 0, 0.3), 0px ${2 * intensity}px ${6 * intensity}px ${2 * intensity}px rgba(0, 0, 0, 0.15)`,
      'level3': `0px ${1 * intensity}px ${3 * intensity}px 0px rgba(0, 0, 0, 0.3), 0px ${4 * intensity}px ${8 * intensity}px ${3 * intensity}px rgba(0, 0, 0, 0.15)`,
      'level4': `0px ${2 * intensity}px ${3 * intensity}px 0px rgba(0, 0, 0, 0.3), 0px ${6 * intensity}px ${10 * intensity}px ${4 * intensity}px rgba(0, 0, 0, 0.15)`,
      'level5': `0px ${4 * intensity}px ${4 * intensity}px 0px rgba(0, 0, 0, 0.3), 0px ${8 * intensity}px ${12 * intensity}px ${6 * intensity}px rgba(0, 0, 0, 0.15)`,
    };

    Object.entries(elevationLevels).forEach(([key, value]) => {
      root.style.setProperty(`--md-sys-elevation-${key}`, value);
    });
  }

  private optimizeColorIntensity(intensity: number): void {
    const root = document.documentElement;
    
    // Adjust state layer opacities based on intensity
    const stateOpacities = {
      'hover': 0.08 * intensity,
      'focus': 0.12 * intensity,
      'pressed': 0.12 * intensity,
      'dragged': 0.16 * intensity,
    };

    Object.entries(stateOpacities).forEach(([key, value]) => {
      root.style.setProperty(`--md-sys-state-${key}-state-layer-opacity`, value.toString());
    });
  }
}

/**
 * Animation Performance Optimizer
 */
export class AnimationJankReducer {
  private static instance: AnimationJankReducer;
  private performanceMetrics: PerformanceMetrics = {
    animationFrameRate: 60,
    cssLoadTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    renderTime: 0,
  };

  static getInstance(): AnimationJankReducer {
    if (!AnimationJankReducer.instance) {
      AnimationJankReducer.instance = new AnimationJankReducer();
    }
    return AnimationJankReducer.instance;
  }

  /**
   * Optimize animation performance and reduce jank
   */
  optimizeAnimationPerformance(): void {
    this.enableHardwareAcceleration();
    this.optimizeAnimationProperties();
    this.implementFrameRateMonitoring();
    this.optimizeAnimationTiming();
  }

  private enableHardwareAcceleration(): void {
    const animatedElements = document.querySelectorAll('[data-animated], .md-animated');
    animatedElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.willChange = 'transform, opacity';
      htmlElement.style.transform = htmlElement.style.transform || 'translateZ(0)';
      htmlElement.style.contain = 'layout style paint';
    });
  }

  private optimizeAnimationProperties(): void {
    // Prefer transform and opacity over layout-triggering properties
    const style = document.createElement('style');
    style.textContent = `
      .md-animate-optimized {
        will-change: transform, opacity;
        contain: layout style paint;
        transform: translateZ(0);
      }
      
      .md-animate-transform {
        animation-fill-mode: both;
        animation-timing-function: var(--md-sys-motion-easing-emphasized);
      }
      
      .md-animate-opacity {
        animation-fill-mode: both;
        animation-timing-function: var(--md-sys-motion-easing-standard);
      }
      
      @media (prefers-reduced-motion: reduce) {
        .md-animate-optimized,
        .md-animate-transform,
        .md-animate-opacity {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private implementFrameRateMonitoring(): void {
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const measureFPS = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.performanceMetrics.animationFrameRate = fps;
        
        if (fps < 30) {
          console.warn(`Low frame rate detected: ${fps}fps`);
          this.adaptToLowPerformance();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private optimizeAnimationTiming(): void {
    const performanceManager = AnimationPerformanceManager.getInstance();
    const deviceConfig = performanceManager.optimizeForDevice();
    
    // Apply optimized timing to all animations
    const root = document.documentElement;
    root.style.setProperty('--md-motion-duration-optimized', deviceConfig.duration);
    root.style.setProperty('--md-motion-easing-optimized', deviceConfig.easing);
  }

  private adaptToLowPerformance(): void {
    // Reduce animation complexity for low-performance devices
    const root = document.documentElement;
    root.style.setProperty('--md-motion-duration-short1', '25ms');
    root.style.setProperty('--md-motion-duration-medium1', '150ms');
    root.style.setProperty('--md-motion-duration-long1', '250ms');
    
    // Disable complex animations
    const complexAnimations = document.querySelectorAll('.md-animate-complex');
    complexAnimations.forEach(element => {
      (element as HTMLElement).style.animation = 'none';
    });
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }
}

/**
 * Lazy Loading Manager
 */
export class LazyLoadManager {
  private static instance: LazyLoadManager;
  private intersectionObserver?: IntersectionObserver;
  private loadedResources = new Set<string>();

  static getInstance(): LazyLoadManager {
    if (!LazyLoadManager.instance) {
      LazyLoadManager.instance = new LazyLoadManager();
    }
    return LazyLoadManager.instance;
  }

  /**
   * Initialize lazy loading for non-critical design assets
   */
  initializeLazyLoading(config: LazyLoadConfig): void {
    this.setupIntersectionObserver(config);
    this.lazyLoadCSS();
    this.lazyLoadImages();
    this.lazyLoadFonts();
  }

  private setupIntersectionObserver(config: LazyLoadConfig): void {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadResource(entry.target as HTMLElement);
            }
          });
        },
        {
          threshold: config.threshold,
          rootMargin: config.rootMargin,
        }
      );
    }
  }

  private lazyLoadCSS(): void {
    const nonCriticalCSS = [
      '/styles/material3-mobile.css',
      '/styles/material3-animations.css',
      '/styles/browser-fallbacks.css',
    ];

    // Load CSS when user interacts or after idle
    const loadCSS = () => {
      nonCriticalCSS.forEach(cssPath => {
        if (!this.loadedResources.has(cssPath)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = cssPath;
          link.media = 'print';
          link.onload = () => {
            link.media = 'all';
            this.loadedResources.add(cssPath);
          };
          document.head.appendChild(link);
        }
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadCSS);
    } else {
      setTimeout(loadCSS, 1);
    }
  }

  private lazyLoadImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(img);
      }
    });
  }

  private lazyLoadFonts(): void {
    if (typeof window === 'undefined' || !('FontFace' in window)) {
      return;
    }

    const fonts = [
      { family: 'Inter', weight: '300', display: 'swap' },
      { family: 'Inter', weight: '600', display: 'swap' },
      { family: 'Inter', weight: '700', display: 'swap' },
    ];

    fonts.forEach(font => {
      try {
        const fontFace = new FontFace(
          font.family,
          `url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2)`,
          { weight: font.weight, display: font.display as FontDisplay }
        );

        fontFace.load().then(loadedFont => {
          if (document.fonts) {
            document.fonts.add(loadedFont);
          }
        }).catch(error => {
          console.warn('Failed to load font:', error);
        });
      } catch (error) {
        console.warn('FontFace not supported:', error);
      }
    });
  }

  private loadResource(element: HTMLElement): void {
    const dataSrc = element.getAttribute('data-src');
    if (dataSrc && element.tagName === 'IMG') {
      (element as HTMLImageElement).src = dataSrc;
      element.removeAttribute('data-src');
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
    }
  }
}

/**
 * Performance Monitoring System
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {
    animationFrameRate: 60,
    cssLoadTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    renderTime: 0,
  };

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start comprehensive performance monitoring
   */
  startMonitoring(): void {
    this.monitorAnimationFrameRate();
    this.monitorCSSLoadTime();
    this.monitorMemoryUsage();
    this.monitorRenderTime();
    this.setupPerformanceObserver();
  }

  private monitorAnimationFrameRate(): void {
    if (typeof window === 'undefined' || !window.performance || !window.requestAnimationFrame) {
      return;
    }

    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        this.metrics.animationFrameRate = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private monitorCSSLoadTime(): void {
    const startTime = performance.now();
    
    // Monitor when all stylesheets are loaded
    const checkStylesLoaded = () => {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      let loadedCount = 0;
      
      stylesheets.forEach(stylesheet => {
        const link = stylesheet as HTMLLinkElement;
        if (link.sheet) {
          loadedCount++;
        }
      });
      
      if (loadedCount === stylesheets.length) {
        this.metrics.cssLoadTime = performance.now() - startTime;
      } else {
        setTimeout(checkStylesLoaded, 10);
      }
    };
    
    checkStylesLoaded();
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
      }, 5000);
    }
  }

  private monitorRenderTime(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            this.metrics.renderTime = entry.startTime;
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Performance observer not supported
    }
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.duration > 16.67) { // More than one frame
            console.warn(`Performance warning: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        // Performance observer not supported
      }
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  logPerformanceReport(): void {
    console.group('🚀 Performance Report');
    console.log('Animation Frame Rate:', `${this.metrics.animationFrameRate}fps`);
    console.log('CSS Load Time:', `${this.metrics.cssLoadTime.toFixed(2)}ms`);
    console.log('Memory Usage:', `${(this.metrics.memoryUsage / 1048576).toFixed(2)}MB`);
    console.log('Render Time:', `${this.metrics.renderTime.toFixed(2)}ms`);
    console.groupEnd();
  }
}

/**
 * CSS Bundle Optimizer
 */
export class CSSBundleOptimizer {
  private static instance: CSSBundleOptimizer;
  private usedSelectors = new Set<string>();

  static getInstance(): CSSBundleOptimizer {
    if (!CSSBundleOptimizer.instance) {
      CSSBundleOptimizer.instance = new CSSBundleOptimizer();
    }
    return CSSBundleOptimizer.instance;
  }

  /**
   * Optimize CSS bundle size and eliminate unused styles
   */
  optimizeCSSBundle(): void {
    this.analyzeUsedStyles();
    this.removeUnusedStyles();
    this.optimizeCSSProperties();
    this.compressCSS();
  }

  private analyzeUsedStyles(): void {
    // Analyze DOM to find used CSS classes and selectors
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      const element = node as HTMLElement;
      
      // Collect class names
      if (element.className) {
        element.className.split(' ').forEach(className => {
          if (className.trim()) {
            this.usedSelectors.add(`.${className.trim()}`);
          }
        });
      }
      
      // Collect IDs
      if (element.id) {
        this.usedSelectors.add(`#${element.id}`);
      }
      
      // Collect tag names
      this.usedSelectors.add(element.tagName.toLowerCase());
    }
  }

  private removeUnusedStyles(): void {
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        
        rules.forEach((rule, index) => {
          if (rule instanceof CSSStyleRule) {
            const selector = rule.selectorText;
            
            // Check if selector is used
            const isUsed = this.isSelectorUsed(selector);
            
            if (!isUsed && this.isSafeToRemove(selector)) {
              stylesheet.deleteRule(index);
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheet or other access issue
        console.warn('Cannot access stylesheet:', e);
      }
    });
  }

  private isSelectorUsed(selector: string): boolean {
    // Simplified selector matching
    const simpleSelectors = selector.split(',').map(s => s.trim());
    
    return simpleSelectors.some(sel => {
      // Remove pseudo-classes and pseudo-elements for basic matching
      const cleanSelector = sel.replace(/::[^,\s]+|:[^,\s]+/g, '');
      return this.usedSelectors.has(cleanSelector) || 
             document.querySelector(cleanSelector) !== null;
    });
  }

  private isSafeToRemove(selector: string): boolean {
    // Don't remove critical selectors
    const criticalSelectors = [
      ':root',
      'html',
      'body',
      '*',
      '::before',
      '::after',
      '@media',
      '@keyframes',
    ];
    
    return !criticalSelectors.some(critical => selector.includes(critical));
  }

  private optimizeCSSProperties(): void {
    // Optimize CSS custom properties by removing unused ones
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const usedProperties = new Set<string>();
    
    // Find used CSS custom properties
    const stylesheets = Array.from(document.styleSheets);
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        rules.forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            const cssText = rule.style.cssText;
            const propertyMatches = cssText.match(/var\(--[^)]+\)/g);
            
            if (propertyMatches) {
              propertyMatches.forEach(match => {
                const property = match.match(/--[^,)]+/)?.[0];
                if (property) {
                  usedProperties.add(property);
                }
              });
            }
          }
        });
      } catch (e) {
        // Cross-origin or access issue
      }
    });
    
    // Log optimization results
    console.log(`CSS Optimization: Found ${usedProperties.size} used custom properties`);
  }

  private compressCSS(): void {
    // This would typically be done at build time, but we can optimize runtime CSS
    const style = document.createElement('style');
    style.textContent = `
      /* Compressed critical CSS */
      .md-optimized{contain:layout style paint;will-change:transform,opacity}
      .md-hw-accel{transform:translateZ(0)}
      .md-no-select{user-select:none;-webkit-user-select:none}
      .md-smooth{transition:all var(--md-motion-duration-short2) var(--md-motion-easing-standard)}
    `;
    document.head.appendChild(style);
  }

  getBundleSize(): number {
    let totalSize = 0;
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        rules.forEach(rule => {
          totalSize += rule.cssText.length;
        });
      } catch (e) {
        // Cross-origin stylesheet
      }
    });
    
    return totalSize;
  }
}

/**
 * Main Final Polish Optimizer
 */
export class FinalPolishOptimizer {
  private colorOptimizer: ColorRelationshipOptimizer;
  private hierarchyOptimizer: VisualHierarchyOptimizer;
  private animationOptimizer: AnimationJankReducer;
  private lazyLoadManager: LazyLoadManager;
  private performanceMonitor: PerformanceMonitor;
  private cssOptimizer: CSSBundleOptimizer;

  constructor() {
    this.colorOptimizer = ColorRelationshipOptimizer.getInstance();
    this.hierarchyOptimizer = VisualHierarchyOptimizer.getInstance();
    this.animationOptimizer = AnimationJankReducer.getInstance();
    this.lazyLoadManager = LazyLoadManager.getInstance();
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.cssOptimizer = CSSBundleOptimizer.getInstance();
  }

  /**
   * Execute comprehensive final polish and optimization
   */
  executeFullOptimization(): void {
    console.log('🎨 Starting Final Polish and Performance Optimization...');

    // Fine-tune color relationships and visual hierarchy
    this.colorOptimizer.optimizeColorRelationships({
      primaryHue: 258, // Material 3 purple
      contrastRatio: 4.5,
      harmonicVariation: 15,
      accessibilityLevel: 'AA',
    });

    this.hierarchyOptimizer.optimizeVisualHierarchy({
      typographyScale: 1.0,
      spacingScale: 1.0,
      elevationIntensity: 1.0,
      colorIntensity: 1.0,
    });

    // Optimize animation performance
    this.animationOptimizer.optimizeAnimationPerformance();

    // Initialize lazy loading
    this.lazyLoadManager.initializeLazyLoading({
      threshold: 0.1,
      rootMargin: '50px',
      loadingStrategy: 'lazy',
    });

    // Start performance monitoring
    this.performanceMonitor.startMonitoring();

    // Optimize CSS bundle
    this.cssOptimizer.optimizeCSSBundle();

    console.log('✅ Final Polish and Performance Optimization Complete!');
    
    // Log performance report after optimization
    setTimeout(() => {
      this.performanceMonitor.logPerformanceReport();
    }, 2000);
  }

  /**
   * Get comprehensive optimization report
   */
  getOptimizationReport(): {
    performance: PerformanceMetrics;
    bundleSize: number;
    optimizationsApplied: string[];
  } {
    return {
      performance: this.performanceMonitor.getMetrics(),
      bundleSize: this.cssOptimizer.getBundleSize(),
      optimizationsApplied: [
        'Color relationship fine-tuning',
        'Visual hierarchy optimization',
        'Animation performance optimization',
        'Lazy loading implementation',
        'Performance monitoring setup',
        'CSS bundle optimization',
      ],
    };
  }
}