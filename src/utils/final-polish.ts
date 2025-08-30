/**
 * Final Polish and Performance Optimization
 * 
 * Simple, production-ready utilities for final polish tasks.
 * Integrates with existing performance optimization system.
 */

import { initializePerformanceOptimizations } from './performance-optimization';

/**
 * Apply final color relationship optimizations
 */
export function optimizeColorRelationships(): void {
  // Ensure proper contrast ratios for accessibility
  const style = document.createElement('style');
  style.textContent = `
    /* Enhanced focus indicators for better accessibility */
    :focus-visible {
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: 2px;
      border-radius: var(--md-sys-shape-corner-small);
    }
    
    /* Improved state layer opacities */
    .md-state-layer-hover {
      background-color: color-mix(in srgb, currentColor 8%, transparent);
    }
    
    .md-state-layer-focus {
      background-color: color-mix(in srgb, currentColor 12%, transparent);
    }
    
    .md-state-layer-pressed {
      background-color: color-mix(in srgb, currentColor 12%, transparent);
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Optimize animation performance and reduce jank
 */
export function optimizeAnimationPerformance(): void {
  // Enable hardware acceleration for animated elements
  const animatedElements = document.querySelectorAll('[data-animated], .md-animated');
  animatedElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.willChange = 'transform, opacity';
    htmlElement.style.contain = 'layout style paint';
  });

  // Add performance-optimized animation classes
  const style = document.createElement('style');
  style.textContent = `
    .md-animate-optimized {
      will-change: transform, opacity;
      contain: layout style paint;
      transform: translateZ(0);
    }
    
    @media (prefers-reduced-motion: reduce) {
      .md-animate-optimized,
      [data-animated] {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Implement lazy loading for non-critical assets
 */
export function implementLazyLoading(): void {
  // Lazy load non-critical CSS
  const nonCriticalCSS = [
    '/styles/material3-animations.css',
    '/styles/material3-mobile.css',
  ];

  const loadCSS = () => {
    nonCriticalCSS.forEach(cssPath => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    });
  };

  // Load after idle or fallback timeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadCSS);
  } else {
    setTimeout(loadCSS, 1);
  }

  // Lazy load images with loading="lazy" attribute
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    (img as HTMLImageElement).loading = 'lazy';
  });
}

/**
 * Add performance monitoring for animation frame rates
 */
export function addPerformanceMonitoring(): void {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  let frameCount = 0;
  let lastTime = performance.now();

  const measureFPS = (currentTime: number) => {
    frameCount++;
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      
      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development' && fps < 30) {
        console.warn(`Low frame rate detected: ${fps}fps`);
      }
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFPS);
  };

  requestAnimationFrame(measureFPS);
}

/**
 * Optimize CSS bundle size
 */
export function optimizeCSSBundle(): void {
  // Remove unused CSS custom properties in production
  if (process.env.NODE_ENV === 'production') {
    const style = document.createElement('style');
    style.textContent = `
      /* Compressed critical styles */
      .md-optimized { contain: layout style paint; will-change: transform, opacity; }
      .md-hw-accel { transform: translateZ(0); }
      .md-smooth { transition: all var(--md-motion-duration-short2) var(--md-motion-easing-standard); }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Simple deployment readiness check
 */
export function checkDeploymentReadiness(): boolean {
  const checks = [
    // Check if Material 3 tokens are loaded
    () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      return computedStyle.getPropertyValue('--md-sys-color-primary').trim() !== '';
    },
    
    // Check if animations respect reduced motion
    () => {
      const stylesheets = Array.from(document.styleSheets);
      return stylesheets.some(stylesheet => {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          return rules.some(rule => 
            rule instanceof CSSMediaRule && 
            rule.conditionText.includes('prefers-reduced-motion')
          );
        } catch (e) {
          return false;
        }
      });
    },
    
    // Check if focus indicators are present
    () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      return computedStyle.getPropertyValue('--md-sys-color-outline').trim() !== '';
    },
  ];

  const results = checks.map(check => {
    try {
      return check();
    } catch {
      return false;
    }
  });

  const passed = results.filter(Boolean).length;
  const total = results.length;

  if (process.env.NODE_ENV === 'development') {
    console.log(`Deployment readiness: ${passed}/${total} checks passed`);
  }

  return passed === total;
}

/**
 * Execute all final polish optimizations
 */
export function executeFinalPolish(): void {
  try {
    // Initialize existing performance optimizations
    initializePerformanceOptimizations();
    
    // Apply final polish optimizations
    optimizeColorRelationships();
    optimizeAnimationPerformance();
    implementLazyLoading();
    addPerformanceMonitoring();
    optimizeCSSBundle();
    
    // Check deployment readiness
    const isReady = checkDeploymentReadiness();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Final polish optimizations applied');
      console.log(`🚀 Deployment ready: ${isReady ? 'Yes' : 'No'}`);
    }
  } catch (error) {
    console.error('Final polish optimization failed:', error);
  }
}

/**
 * Initialize final polish in production
 */
export function initializeFinalPolish(): void {
  if (typeof window !== 'undefined') {
    // Run optimizations after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', executeFinalPolish);
    } else {
      executeFinalPolish();
    }
  }
}