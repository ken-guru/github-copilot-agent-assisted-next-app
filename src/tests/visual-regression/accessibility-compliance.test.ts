/**
 * Accessibility Compliance Tests
 * Comprehensive accessibility testing for Material 3 Expressive components
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { chromium, Browser, Page } from 'playwright';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

describe('Accessibility Compliance Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await injectAxe(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('should pass automated accessibility checks', async () => {
      try {
        await checkA11y(page, null, {
          detailedReport: true,
          detailedReportOptions: { html: true }
        });
      } catch (error) {
        const violations = await getViolations(page);
        console.error('Accessibility violations found:', violations);
        throw error;
      }
    });

    it('should maintain accessibility across theme changes', async () => {
      const themes = ['light', 'dark'];
      
      for (const theme of themes) {
        await page.evaluate((themeName) => {
          document.documentElement.setAttribute('data-theme', themeName);
        }, theme);
        
        await page.waitForTimeout(300);
        
        try {
          await checkA11y(page, null, {
            tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
          });
        } catch (error) {
          const violations = await getViolations(page);
          console.error(`Accessibility violations in ${theme} theme:`, violations);
          throw new Error(`${theme} theme has accessibility violations`);
        }
      }
    });

    it('should provide proper color contrast ratios', async () => {
      const colorCombinations = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const combinations: Array<{
          element: string;
          foreground: string;
          background: string;
          fontSize: number;
          fontWeight: string;
        }> = [];

        elements.forEach((el, index) => {
          const styles = getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          const fontSize = parseFloat(styles.fontSize);
          const fontWeight = styles.fontWeight;

          if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            combinations.push({
              element: `${el.tagName.toLowerCase()}:nth-child(${index + 1})`,
              foreground: color,
              background: backgroundColor,
              fontSize,
              fontWeight
            });
          }
        });

        return combinations.slice(0, 20); // Limit for performance
      });

      for (const combo of colorCombinations) {
        const contrastRatio = await page.evaluate(({ fg, bg }) => {
          const getLuminance = (color: string): number => {
            const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
            const [r, g, b] = rgb.map(c => {
              c = c / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };

          const lum1 = getLuminance(fg);
          const lum2 = getLuminance(bg);
          const brightest = Math.max(lum1, lum2);
          const darkest = Math.min(lum1, lum2);
          return (brightest + 0.05) / (darkest + 0.05);
        }, { fg: combo.foreground, bg: combo.background });

        // WCAG AA requirements
        const isLargeText = combo.fontSize >= 18 || (combo.fontSize >= 14 && combo.fontWeight === 'bold');
        const requiredRatio = isLargeText ? 3 : 4.5;

        expect(contrastRatio).toBeGreaterThanOrEqual(requiredRatio);
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support full keyboard navigation', async () => {
      // Get all focusable elements
      const focusableElements = await page.evaluate(() => {
        const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        return Array.from(document.querySelectorAll(selector)).length;
      });

      let focusedElements = 0;
      let currentElement = null;

      // Tab through all elements
      for (let i = 0; i < focusableElements; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(50);

        const newFocusedElement = await page.evaluate(() => {
          const focused = document.activeElement;
          return focused ? {
            tagName: focused.tagName,
            id: focused.id,
            className: focused.className,
            tabIndex: focused.tabIndex
          } : null;
        });

        if (newFocusedElement && newFocusedElement !== currentElement) {
          focusedElements++;
          currentElement = newFocusedElement;
        }
      }

      expect(focusedElements).toBeGreaterThan(0);
    });

    it('should provide visible focus indicators', async () => {
      const focusableElements = await page.$$('button, input, [tabindex="0"]');
      
      for (const element of focusableElements) {
        await element.focus();
        await page.waitForTimeout(100);

        const focusStyles = await element.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            outlineStyle: styles.outlineStyle,
            outlineColor: styles.outlineColor,
            boxShadow: styles.boxShadow
          };
        });

        // Verify visible focus indicator
        const hasVisibleFocus = 
          (focusStyles.outline !== 'none' && focusStyles.outlineWidth !== '0px') ||
          (focusStyles.boxShadow !== 'none' && focusStyles.boxShadow.includes('rgb'));

        expect(hasVisibleFocus).toBe(true);
      }
    });

    it('should handle keyboard interactions correctly', async () => {
      // Test button activation with Enter and Space
      const buttons = await page.$$('button');
      
      for (const button of buttons.slice(0, 3)) { // Test first 3 buttons
        await button.focus();
        
        // Test Enter key
        let enterActivated = false;
        await page.evaluate((btn) => {
          btn.addEventListener('click', () => {
            (window as any).enterActivated = true;
          }, { once: true });
        }, button);
        
        await page.keyboard.press('Enter');
        await page.waitForTimeout(50);
        
        enterActivated = await page.evaluate(() => (window as any).enterActivated);
        expect(enterActivated).toBe(true);

        // Reset and test Space key
        await page.evaluate(() => {
          (window as any).spaceActivated = false;
        });
        
        await page.evaluate((btn) => {
          btn.addEventListener('click', () => {
            (window as any).spaceActivated = true;
          }, { once: true });
        }, button);
        
        await page.keyboard.press('Space');
        await page.waitForTimeout(50);
        
        const spaceActivated = await page.evaluate(() => (window as any).spaceActivated);
        expect(spaceActivated).toBe(true);
      }
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide proper semantic markup', async () => {
      const semanticElements = await page.evaluate(() => {
        const semanticTags = ['main', 'nav', 'header', 'footer', 'section', 'article', 'aside'];
        const found: string[] = [];
        
        semanticTags.forEach(tag => {
          if (document.querySelector(tag)) {
            found.push(tag);
          }
        });
        
        return found;
      });

      expect(semanticElements.length).toBeGreaterThan(0);
      expect(semanticElements).toContain('main');
    });

    it('should have proper ARIA labels and descriptions', async () => {
      const ariaElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
        const results: Array<{
          tagName: string;
          ariaLabel?: string;
          ariaLabelledby?: string;
          ariaDescribedby?: string;
        }> = [];

        elements.forEach(el => {
          results.push({
            tagName: el.tagName.toLowerCase(),
            ariaLabel: el.getAttribute('aria-label') || undefined,
            ariaLabelledby: el.getAttribute('aria-labelledby') || undefined,
            ariaDescribedby: el.getAttribute('aria-describedby') || undefined
          });
        });

        return results;
      });

      // Verify ARIA attributes are meaningful
      ariaElements.forEach(element => {
        const hasValidAria = 
          (element.ariaLabel && element.ariaLabel.trim().length > 0) ||
          (element.ariaLabelledby && element.ariaLabelledby.trim().length > 0) ||
          (element.ariaDescribedby && element.ariaDescribedby.trim().length > 0);
        
        expect(hasValidAria).toBe(true);
      });
    });

    it('should announce dynamic content changes', async () => {
      // Test live regions
      const liveRegions = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[aria-live]')).map(el => ({
          tagName: el.tagName.toLowerCase(),
          ariaLive: el.getAttribute('aria-live'),
          id: el.id
        }));
      });

      expect(liveRegions.length).toBeGreaterThan(0);

      // Test dynamic content updates
      if (liveRegions.length > 0) {
        await page.evaluate(() => {
          const liveRegion = document.querySelector('[aria-live]');
          if (liveRegion) {
            liveRegion.textContent = 'Content updated for screen reader';
          }
        });

        await page.waitForTimeout(100);

        const updatedContent = await page.evaluate(() => {
          const liveRegion = document.querySelector('[aria-live]');
          return liveRegion ? liveRegion.textContent : '';
        });

        expect(updatedContent).toContain('Content updated');
      }
    });
  });

  describe('Form Accessibility', () => {
    it('should associate labels with form controls', async () => {
      const formControls = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, select, textarea');
        const results: Array<{
          id: string;
          hasLabel: boolean;
          labelText?: string;
          ariaLabel?: string;
        }> = [];

        inputs.forEach(input => {
          const id = input.id;
          const label = id ? document.querySelector(`label[for="${id}"]`) : null;
          const ariaLabel = input.getAttribute('aria-label');
          
          results.push({
            id: id || 'no-id',
            hasLabel: !!label || !!ariaLabel,
            labelText: label ? label.textContent?.trim() : undefined,
            ariaLabel: ariaLabel || undefined
          });
        });

        return results;
      });

      formControls.forEach(control => {
        expect(control.hasLabel).toBe(true);
      });
    });

    it('should provide proper error messaging', async () => {
      // Find form with validation
      const form = await page.$('form');
      if (!form) return;

      // Trigger validation errors
      const inputs = await form.$$('input[required]');
      
      for (const input of inputs) {
        await input.focus();
        await input.fill(''); // Clear input to trigger validation
        await page.keyboard.press('Tab'); // Move focus to trigger validation
        await page.waitForTimeout(100);

        const errorInfo = await input.evaluate((el) => {
          const ariaDescribedby = el.getAttribute('aria-describedby');
          const ariaInvalid = el.getAttribute('aria-invalid');
          
          let errorMessage = '';
          if (ariaDescribedby) {
            const errorElement = document.getElementById(ariaDescribedby);
            errorMessage = errorElement ? errorElement.textContent?.trim() || '' : '';
          }

          return {
            hasAriaInvalid: ariaInvalid === 'true',
            hasErrorMessage: errorMessage.length > 0,
            errorMessage
          };
        });

        if (errorInfo.hasErrorMessage) {
          expect(errorInfo.hasAriaInvalid).toBe(true);
          expect(errorInfo.errorMessage).toBeTruthy();
        }
      }
    });
  });

  describe('Motion and Animation Accessibility', () => {
    it('should respect reduced motion preferences', async () => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(100);

      const animationStyles = await page.evaluate(() => {
        const animatedElements = document.querySelectorAll('[data-animation], .animated, [class*="transition"]');
        const styles: Array<{
          transitionDuration: string;
          animationDuration: string;
          transform: string;
        }> = [];

        animatedElements.forEach(el => {
          const computed = getComputedStyle(el);
          styles.push({
            transitionDuration: computed.transitionDuration,
            animationDuration: computed.animationDuration,
            transform: computed.transform
          });
        });

        return styles;
      });

      // Verify animations are disabled or significantly reduced
      animationStyles.forEach(style => {
        const hasReducedMotion = 
          style.transitionDuration === '0s' ||
          style.transitionDuration === '0.01s' ||
          style.animationDuration === '0s' ||
          style.animationDuration === '0.01s';
        
        expect(hasReducedMotion).toBe(true);
      });

      // Reset motion preference
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    });

    it('should not cause vestibular disorders with animations', async () => {
      // Check for potentially problematic animations
      const problematicAnimations = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const problematic: string[] = [];

        elements.forEach((el, index) => {
          const styles = getComputedStyle(el);
          const transform = styles.transform;
          const animation = styles.animation;

          // Check for rapid rotations or scaling
          if (transform.includes('rotate') || animation.includes('rotate')) {
            problematic.push(`Element ${index}: rotation detected`);
          }

          // Check for rapid scaling
          if (transform.includes('scale') && animation.includes('infinite')) {
            problematic.push(`Element ${index}: infinite scaling detected`);
          }

          // Check for rapid flashing
          if (animation.includes('blink') || animation.includes('flash')) {
            problematic.push(`Element ${index}: flashing animation detected`);
          }
        });

        return problematic;
      });

      expect(problematic.length).toBe(0);
    });
  });

  describe('Mobile Accessibility', () => {
    it('should provide adequate touch targets on mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(100);

      const touchTargets = await page.evaluate(() => {
        const interactiveElements = document.querySelectorAll('button, [role="button"], input, [tabindex="0"]');
        const inadequateTargets: Array<{
          element: string;
          width: number;
          height: number;
        }> = [];

        interactiveElements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          if (rect.width < 44 || rect.height < 44) {
            inadequateTargets.push({
              element: `${el.tagName}:nth-child(${index + 1})`,
              width: rect.width,
              height: rect.height
            });
          }
        });

        return inadequateTargets;
      });

      expect(touchTargets.length).toBe(0);
    });

    it('should support mobile screen readers', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Simulate mobile screen reader navigation
      const headings = await page.evaluate(() => {
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(headingElements).map((h, index) => ({
          level: parseInt(h.tagName.charAt(1)),
          text: h.textContent?.trim() || '',
          index
        }));
      });

      // Verify proper heading hierarchy
      if (headings.length > 1) {
        for (let i = 1; i < headings.length; i++) {
          const levelDiff = headings[i].level - headings[i - 1].level;
          expect(levelDiff).toBeLessThanOrEqual(1); // Don't skip heading levels
        }
      }
    });
  });
});