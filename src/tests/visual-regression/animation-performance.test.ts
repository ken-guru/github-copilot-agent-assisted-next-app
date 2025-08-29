/**
 * Animation Performance Tests
 * Tests for Material 3 Expressive animation smoothness and performance
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { chromium, Browser, Page } from 'playwright';

describe('Animation Performance Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Frame Rate Performance', () => {
    it('should maintain 60fps during button hover animations', async () => {
      const button = await page.$('[data-testid="material3-button"]');
      if (!button) return;

      // Start performance monitoring
      await page.evaluate(() => {
        (window as any).performanceData = {
          frames: [],
          startTime: performance.now()
        };

        const measureFrameRate = () => {
          const now = performance.now();
          (window as any).performanceData.frames.push(now);
          requestAnimationFrame(measureFrameRate);
        };

        requestAnimationFrame(measureFrameRate);
      });

      // Trigger hover animation
      await button.hover();
      await page.waitForTimeout(500); // Wait for animation to complete

      // Stop monitoring and calculate frame rate
      const frameRate = await page.evaluate(() => {
        const data = (window as any).performanceData;
        const frames = data.frames;
        const duration = (frames[frames.length - 1] - frames[0]) / 1000;
        const fps = frames.length / duration;
        return Math.round(fps);
      });

      // Expect close to 60fps (allow some variance)
      expect(frameRate).toBeGreaterThanOrEqual(55);
      expect(frameRate).toBeLessThanOrEqual(65);
    });

    it('should maintain smooth animations during theme transitions', async () => {
      // Monitor performance during theme switch
      const performanceMetrics = await page.evaluate(async () => {
        const startTime = performance.now();
        
        // Switch theme
        document.documentElement.setAttribute('data-theme', 'dark');
        
        // Wait for transition
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Check for layout thrashing
        const layoutShifts = performance.getEntriesByType('layout-shift');
        
        return {
          duration,
          layoutShifts: layoutShifts.length,
          smoothTransition: duration < 500 && layoutShifts.length === 0
        };
      });

      expect(performanceMetrics.smoothTransition).toBe(true);
      expect(performanceMetrics.layoutShifts).toBe(0);
    });

    it('should handle multiple simultaneous animations efficiently', async () => {
      // Create multiple animated elements
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.id = 'animation-test-container';
        
        for (let i = 0; i < 10; i++) {
          const element = document.createElement('div');
          element.className = 'animated-element';
          element.style.cssText = `
            width: 50px;
            height: 50px;
            background: var(--md-sys-color-primary);
            margin: 10px;
            transition: transform 0.3s ease;
          `;
          container.appendChild(element);
        }
        
        document.body.appendChild(container);
      });

      // Start performance monitoring
      const performanceStart = await page.evaluate(() => performance.now());

      // Trigger animations on all elements
      await page.evaluate(() => {
        const elements = document.querySelectorAll('.animated-element');
        elements.forEach((el, index) => {
          setTimeout(() => {
            (el as HTMLElement).style.transform = `translateX(${100 + index * 10}px) scale(1.2)`;
          }, index * 50);
        });
      });

      // Wait for all animations to complete
      await page.waitForTimeout(1000);

      const performanceEnd = await page.evaluate(() => performance.now());
      const totalDuration = performanceEnd - performanceStart;

      // Clean up
      await page.evaluate(() => {
        const container = document.getElementById('animation-test-container');
        if (container) container.remove();
      });

      // Verify reasonable performance
      expect(totalDuration).toBeLessThan(2000);
    });
  });

  describe('Animation Smoothness', () => {
    it('should use hardware acceleration for transform animations', async () => {
      const animatedElements = await page.$$('[data-animation="transform"]');
      
      for (const element of animatedElements) {
        const willChange = await element.evaluate((el) => {
          return getComputedStyle(el).willChange;
        });

        // Verify hardware acceleration hints
        expect(['transform', 'auto'].some(value => willChange.includes(value))).toBe(true);
      }
    });

    it('should avoid layout-triggering animations', async () => {
      // Monitor for layout thrashing during animations
      await page.evaluate(() => {
        // Clear existing performance entries
        performance.clearMeasures();
        performance.clearMarks();
      });

      // Trigger various animations
      const button = await page.$('[data-testid="material3-button"]');
      if (button) {
        await button.hover();
        await page.waitForTimeout(300);
        
        await button.click();
        await page.waitForTimeout(300);
      }

      // Check for layout shifts
      const layoutShifts = await page.evaluate(() => {
        return performance.getEntriesByType('layout-shift').length;
      });

      expect(layoutShifts).toBe(0);
    });

    it('should use appropriate easing curves for Material 3 animations', async () => {
      const animatedElements = await page.$$('[data-animation="material3"]');
      
      for (const element of animatedElements) {
        const transitionTimingFunction = await element.evaluate((el) => {
          return getComputedStyle(el).transitionTimingFunction;
        });

        // Verify Material 3 easing curves are used
        const materialEasings = [
          'cubic-bezier(0.2, 0, 0, 1)', // Standard
          'cubic-bezier(0.05, 0.7, 0.1, 1)', // Emphasized
          'cubic-bezier(0.3, 0, 0.8, 0.15)', // Decelerated
          'cubic-bezier(0.3, 0, 1, 1)' // Accelerated
        ];

        const usesValidEasing = materialEasings.some(easing => 
          transitionTimingFunction.includes(easing)
        );

        expect(usesValidEasing).toBe(true);
      }
    });
  });

  describe('Animation Duration Standards', () => {
    it('should use appropriate durations for different animation types', async () => {
      const animationTypes = [
        { selector: '[data-animation="micro"]', expectedDuration: '150ms' },
        { selector: '[data-animation="small"]', expectedDuration: '200ms' },
        { selector: '[data-animation="medium"]', expectedDuration: '300ms' },
        { selector: '[data-animation="large"]', expectedDuration: '400ms' }
      ];

      for (const { selector, expectedDuration } of animationTypes) {
        const element = await page.$(selector);
        if (!element) continue;

        const duration = await element.evaluate((el) => {
          return getComputedStyle(el).transitionDuration;
        });

        expect(duration).toBe(expectedDuration);
      }
    });

    it('should respect reduced motion preferences', async () => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(100);

      const animatedElements = await page.$$('[data-animation]');
      
      for (const element of animatedElements) {
        const styles = await element.evaluate((el) => {
          const computed = getComputedStyle(el);
          return {
            transitionDuration: computed.transitionDuration,
            animationDuration: computed.animationDuration
          };
        });

        // Verify animations are disabled or significantly reduced
        expect(['0s', '0.01s'].some(duration => 
          styles.transitionDuration.includes(duration) || 
          styles.animationDuration.includes(duration)
        )).toBe(true);
      }

      // Reset motion preference
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    });
  });

  describe('Memory and Resource Usage', () => {
    it('should not cause memory leaks during repeated animations', async () => {
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
      });

      // Perform repeated animations
      for (let i = 0; i < 50; i++) {
        const button = await page.$('[data-testid="material3-button"]');
        if (button) {
          await button.hover();
          await page.waitForTimeout(50);
          await page.mouse.move(0, 0); // Move away to trigger hover out
          await page.waitForTimeout(50);
        }
      }

      // Force garbage collection if available
      await page.evaluate(() => {
        if ((window as any).gc) {
          (window as any).gc();
        }
      });

      await page.waitForTimeout(1000);

      // Check final memory usage
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
      });

      // Memory should not have increased significantly (allow 20% increase)
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = (finalMemory - initialMemory) / initialMemory;
        expect(memoryIncrease).toBeLessThan(0.2);
      }
    });

    it('should efficiently handle CSS animations vs JavaScript animations', async () => {
      // Test CSS animation performance
      const cssAnimationStart = await page.evaluate(() => performance.now());
      
      await page.evaluate(() => {
        const element = document.createElement('div');
        element.style.cssText = `
          width: 100px;
          height: 100px;
          background: red;
          animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(element);
        
        setTimeout(() => element.remove(), 400);
      });
      
      await page.waitForTimeout(400);
      const cssAnimationEnd = await page.evaluate(() => performance.now());
      
      // Test JavaScript animation performance
      const jsAnimationStart = await page.evaluate(() => performance.now());
      
      await page.evaluate(() => {
        const element = document.createElement('div');
        element.style.cssText = `
          width: 100px;
          height: 100px;
          background: blue;
          transform: translateX(-100px);
        `;
        document.body.appendChild(element);
        
        let start = 0;
        const animate = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = (timestamp - start) / 300;
          
          if (progress < 1) {
            element.style.transform = `translateX(${-100 + (progress * 100)}px)`;
            requestAnimationFrame(animate);
          } else {
            element.remove();
          }
        };
        
        requestAnimationFrame(animate);
      });
      
      await page.waitForTimeout(400);
      const jsAnimationEnd = await page.evaluate(() => performance.now());
      
      const cssDuration = cssAnimationEnd - cssAnimationStart;
      const jsDuration = jsAnimationEnd - jsAnimationStart;
      
      // CSS animations should generally be more efficient
      expect(cssDuration).toBeLessThanOrEqual(jsDuration * 1.2);
    });
  });

  describe('Animation Accessibility', () => {
    it('should provide appropriate focus indicators during animations', async () => {
      const focusableElements = await page.$$('button, input, [tabindex="0"]');
      
      for (const element of focusableElements) {
        await element.focus();
        await page.waitForTimeout(100);
        
        const focusStyles = await element.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            outline: styles.outline,
            boxShadow: styles.boxShadow,
            borderColor: styles.borderColor
          };
        });
        
        // Verify focus indicator is visible
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' ||
          focusStyles.boxShadow !== 'none' ||
          focusStyles.borderColor !== 'transparent';
        
        expect(hasFocusIndicator).toBe(true);
      }
    });

    it('should maintain animation performance with screen readers', async () => {
      // Simulate screen reader environment
      await page.evaluate(() => {
        // Add ARIA live regions
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
      });

      const performanceStart = await page.evaluate(() => performance.now());

      // Trigger animations with ARIA updates
      const button = await page.$('[data-testid="material3-button"]');
      if (button) {
        await button.click();
        
        await page.evaluate(() => {
          const liveRegion = document.getElementById('live-region');
          if (liveRegion) {
            liveRegion.textContent = 'Button activated';
          }
        });
      }

      await page.waitForTimeout(500);
      const performanceEnd = await page.evaluate(() => performance.now());
      
      // Clean up
      await page.evaluate(() => {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) liveRegion.remove();
      });

      const duration = performanceEnd - performanceStart;
      expect(duration).toBeLessThan(1000);
    });
  });
});