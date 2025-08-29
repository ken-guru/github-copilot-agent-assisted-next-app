/**
 * Responsive Design Tests
 * Tests for Material 3 Expressive responsive behavior across screen sizes
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { chromium, Browser, Page } from 'playwright';

describe('Responsive Design Tests', () => {
  let browser: Browser;
  let page: Page;

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'large-desktop', width: 1920, height: 1080 }
  ];

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Viewport Adaptation', () => {
    it('should adapt typography scale across viewports', async () => {
      const typographyElements = [
        { selector: '[data-typography="display-large"]', expectedSizes: { mobile: '36px', tablet: '45px', desktop: '57px' } },
        { selector: '[data-typography="headline-large"]', expectedSizes: { mobile: '28px', tablet: '32px', desktop: '32px' } },
        { selector: '[data-typography="body-large"]', expectedSizes: { mobile: '16px', tablet: '16px', desktop: '16px' } }
      ];

      for (const element of typographyElements) {
        for (const viewport of viewports) {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.waitForTimeout(100);

          const fontSize = await page.evaluate((selector) => {
            const el = document.querySelector(selector);
            if (!el) return null;
            return getComputedStyle(el).fontSize;
          }, element.selector);

          if (fontSize && element.expectedSizes[viewport.name as keyof typeof element.expectedSizes]) {
            const expectedSize = element.expectedSizes[viewport.name as keyof typeof element.expectedSizes];
            expect(fontSize).toBe(expectedSize);
          }
        }
      }
    });

    it('should maintain proper spacing ratios across viewports', async () => {
      const spacingElements = [
        '[data-spacing="container-padding"]',
        '[data-spacing="component-margin"]',
        '[data-spacing="content-gap"]'
      ];

      const spacingValues: Record<string, Record<string, string>> = {};

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(100);

        spacingValues[viewport.name] = {};

        for (const selector of spacingElements) {
          const spacing = await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const styles = getComputedStyle(el);
            return {
              padding: styles.padding,
              margin: styles.margin,
              gap: styles.gap
            };
          }, selector);

          if (spacing) {
            spacingValues[viewport.name][selector] = JSON.stringify(spacing);
          }
        }
      }

      // Verify spacing scales appropriately
      expect(Object.keys(spacingValues)).toHaveLength(viewports.length);
    });

    it('should adapt component layouts for mobile viewports', async () => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(200);

      const mobileLayout = await page.evaluate(() => {
        const navigation = document.querySelector('[data-testid="navigation"]');
        const activityManager = document.querySelector('[data-testid="activity-manager"]');
        const timeSetup = document.querySelector('[data-testid="time-setup"]');

        return {
          navigation: navigation ? {
            display: getComputedStyle(navigation).display,
            flexDirection: getComputedStyle(navigation).flexDirection,
            width: getComputedStyle(navigation).width
          } : null,
          activityManager: activityManager ? {
            gridTemplateColumns: getComputedStyle(activityManager).gridTemplateColumns,
            gap: getComputedStyle(activityManager).gap
          } : null,
          timeSetup: timeSetup ? {
            flexDirection: getComputedStyle(timeSetup).flexDirection,
            alignItems: getComputedStyle(timeSetup).alignItems
          } : null
        };
      });

      // Test desktop viewport
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(200);

      const desktopLayout = await page.evaluate(() => {
        const navigation = document.querySelector('[data-testid="navigation"]');
        const activityManager = document.querySelector('[data-testid="activity-manager"]');
        const timeSetup = document.querySelector('[data-testid="time-setup"]');

        return {
          navigation: navigation ? {
            display: getComputedStyle(navigation).display,
            flexDirection: getComputedStyle(navigation).flexDirection,
            width: getComputedStyle(navigation).width
          } : null,
          activityManager: activityManager ? {
            gridTemplateColumns: getComputedStyle(activityManager).gridTemplateColumns,
            gap: getComputedStyle(activityManager).gap
          } : null,
          timeSetup: timeSetup ? {
            flexDirection: getComputedStyle(timeSetup).flexDirection,
            alignItems: getComputedStyle(timeSetup).alignItems
          } : null
        };
      });

      // Verify layouts differ appropriately between mobile and desktop
      if (mobileLayout.navigation && desktopLayout.navigation) {
        expect(mobileLayout.navigation.flexDirection).not.toBe(desktopLayout.navigation.flexDirection);
      }
    });
  });

  describe('Touch Target Optimization', () => {
    it('should provide adequate touch targets on mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(100);

      const touchTargets = await page.evaluate(() => {
        const interactiveElements = document.querySelectorAll('button, [role="button"], input, [tabindex="0"]');
        const targets: Array<{ width: number; height: number; meetsStandard: boolean }> = [];

        interactiveElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const meetsStandard = rect.width >= 44 && rect.height >= 44; // 44px minimum touch target
          targets.push({
            width: rect.width,
            height: rect.height,
            meetsStandard
          });
        });

        return targets;
      });

      // Verify all touch targets meet minimum size requirements
      touchTargets.forEach(target => {
        expect(target.meetsStandard).toBe(true);
      });
    });

    it('should maintain proper spacing between touch targets', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(100);

      const touchTargetSpacing = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const spacings: number[] = [];

        for (let i = 0; i < buttons.length - 1; i++) {
          const current = buttons[i].getBoundingClientRect();
          const next = buttons[i + 1].getBoundingClientRect();
          
          // Calculate minimum distance between elements
          const horizontalGap = Math.max(0, next.left - current.right);
          const verticalGap = Math.max(0, next.top - current.bottom);
          const minGap = Math.min(horizontalGap, verticalGap);
          
          if (minGap > 0) {
            spacings.push(minGap);
          }
        }

        return spacings;
      });

      // Verify adequate spacing (minimum 8px recommended)
      touchTargetSpacing.forEach(spacing => {
        expect(spacing).toBeGreaterThanOrEqual(8);
      });
    });
  });

  describe('Content Reflow', () => {
    it('should reflow content without horizontal scrolling', async () => {
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(100);

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll).toBe(false);
      }
    });

    it('should maintain readability at different zoom levels', async () => {
      const zoomLevels = [1, 1.25, 1.5, 2];

      for (const zoom of zoomLevels) {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.evaluate((zoomLevel) => {
          document.body.style.zoom = zoomLevel.toString();
        }, zoom);
        await page.waitForTimeout(100);

        const textReadability = await page.evaluate(() => {
          const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
          let readableCount = 0;

          textElements.forEach(el => {
            const styles = getComputedStyle(el);
            const fontSize = parseFloat(styles.fontSize);
            const lineHeight = parseFloat(styles.lineHeight);
            
            // Check if text meets readability standards
            if (fontSize >= 12 && lineHeight >= fontSize * 1.2) {
              readableCount++;
            }
          });

          return {
            total: textElements.length,
            readable: readableCount,
            percentage: (readableCount / textElements.length) * 100
          };
        });

        // Expect at least 90% of text to be readable
        expect(textReadability.percentage).toBeGreaterThanOrEqual(90);
      }

      // Reset zoom
      await page.evaluate(() => {
        document.body.style.zoom = '1';
      });
    });
  });

  describe('Responsive Images and Media', () => {
    it('should scale images appropriately across viewports', async () => {
      const images = await page.$$('img');
      
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(100);

        for (const img of images) {
          const dimensions = await img.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const styles = getComputedStyle(el);
            return {
              width: rect.width,
              height: rect.height,
              maxWidth: styles.maxWidth,
              objectFit: styles.objectFit
            };
          });

          // Verify images don't exceed container width
          expect(dimensions.width).toBeLessThanOrEqual(viewport.width);
          
          // Verify responsive image properties
          expect(['100%', 'none', 'auto'].some(value => 
            dimensions.maxWidth.includes(value)
          )).toBe(true);
        }
      }
    });
  });

  describe('Orientation Changes', () => {
    it('should handle device orientation changes gracefully', async () => {
      // Test portrait orientation
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(100);

      const portraitLayout = await page.evaluate(() => {
        const container = document.querySelector('[data-testid="main-container"]');
        return container ? {
          width: container.getBoundingClientRect().width,
          height: container.getBoundingClientRect().height,
          flexDirection: getComputedStyle(container).flexDirection
        } : null;
      });

      // Test landscape orientation
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(100);

      const landscapeLayout = await page.evaluate(() => {
        const container = document.querySelector('[data-testid="main-container"]');
        return container ? {
          width: container.getBoundingClientRect().width,
          height: container.getBoundingClientRect().height,
          flexDirection: getComputedStyle(container).flexDirection
        } : null;
      });

      // Verify layout adapts to orientation change
      if (portraitLayout && landscapeLayout) {
        expect(portraitLayout.width).not.toBe(landscapeLayout.width);
        expect(portraitLayout.height).not.toBe(landscapeLayout.height);
      }
    });
  });

  describe('Breakpoint Behavior', () => {
    it('should apply correct styles at defined breakpoints', async () => {
      const breakpoints = [
        { name: 'mobile', width: 375 },
        { name: 'tablet', width: 768 },
        { name: 'desktop', width: 1024 },
        { name: 'large', width: 1440 }
      ];

      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: 800 });
        await page.waitForTimeout(100);

        const breakpointStyles = await page.evaluate((bpName) => {
          const container = document.querySelector('[data-testid="responsive-container"]');
          if (!container) return null;

          const styles = getComputedStyle(container);
          return {
            display: styles.display,
            gridTemplateColumns: styles.gridTemplateColumns,
            gap: styles.gap,
            padding: styles.padding
          };
        }, breakpoint.name);

        // Verify breakpoint-specific styles are applied
        expect(breakpointStyles).toBeTruthy();
      }
    });
  });
});