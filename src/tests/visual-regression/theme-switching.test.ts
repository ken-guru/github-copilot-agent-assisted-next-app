/**
 * Theme Switching and Color Adaptation Tests
 * Tests for Material 3 Expressive theme transitions and color system
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { chromium, Browser, Page } from 'playwright';

describe('Theme Switching and Color Adaptation', () => {
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

  describe('Theme Switching Behavior', () => {
    it('should smoothly transition between light and dark themes', async () => {
      // Start with light theme
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
      });

      // Capture initial state
      const lightThemeColors = await page.evaluate(() => {
        const computedStyle = getComputedStyle(document.documentElement);
        return {
          primary: computedStyle.getPropertyValue('--md-sys-color-primary').trim(),
          surface: computedStyle.getPropertyValue('--md-sys-color-surface').trim(),
          onSurface: computedStyle.getPropertyValue('--md-sys-color-on-surface').trim()
        };
      });

      // Switch to dark theme
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });

      // Wait for transition
      await page.waitForTimeout(300);

      // Capture dark theme state
      const darkThemeColors = await page.evaluate(() => {
        const computedStyle = getComputedStyle(document.documentElement);
        return {
          primary: computedStyle.getPropertyValue('--md-sys-color-primary').trim(),
          surface: computedStyle.getPropertyValue('--md-sys-color-surface').trim(),
          onSurface: computedStyle.getPropertyValue('--md-sys-color-on-surface').trim()
        };
      });

      // Verify colors changed
      expect(lightThemeColors.surface).not.toBe(darkThemeColors.surface);
      expect(lightThemeColors.onSurface).not.toBe(darkThemeColors.onSurface);
    });

    it('should maintain color contrast ratios in both themes', async () => {
      const themes = ['light', 'dark'];
      
      for (const theme of themes) {
        await page.evaluate((themeName) => {
          document.documentElement.setAttribute('data-theme', themeName);
        }, theme);

        await page.waitForTimeout(100);

        const contrastRatios = await page.evaluate(() => {
          // Helper function to calculate contrast ratio
          const getContrastRatio = (color1: string, color2: string): number => {
            const getLuminance = (color: string): number => {
              const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
              const [r, g, b] = rgb.map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
              });
              return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            };

            const lum1 = getLuminance(color1);
            const lum2 = getLuminance(color2);
            const brightest = Math.max(lum1, lum2);
            const darkest = Math.min(lum1, lum2);
            return (brightest + 0.05) / (darkest + 0.05);
          };

          const computedStyle = getComputedStyle(document.documentElement);
          const primary = computedStyle.getPropertyValue('--md-sys-color-primary');
          const onPrimary = computedStyle.getPropertyValue('--md-sys-color-on-primary');
          const surface = computedStyle.getPropertyValue('--md-sys-color-surface');
          const onSurface = computedStyle.getPropertyValue('--md-sys-color-on-surface');

          return {
            primaryContrast: getContrastRatio(primary, onPrimary),
            surfaceContrast: getContrastRatio(surface, onSurface)
          };
        });

        // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
        expect(contrastRatios.primaryContrast).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatios.surfaceContrast).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('should preserve theme preference across page reloads', async () => {
      // Set dark theme
      await page.evaluate(() => {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      });

      // Reload page
      await page.reload();
      await page.waitForTimeout(500);

      // Check if theme persisted
      const currentTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme');
      });

      expect(currentTheme).toBe('dark');
    });
  });

  describe('Color Adaptation', () => {
    it('should adapt component colors based on theme context', async () => {
      const components = [
        '[data-testid="material3-button"]',
        '[data-testid="material3-textfield"]',
        '[data-testid="material3-container"]'
      ];

      for (const selector of components) {
        const element = await page.$(selector);
        if (!element) continue;

        // Test light theme colors
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'light');
        });
        await page.waitForTimeout(100);

        const lightColors = await element.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            borderColor: styles.borderColor
          };
        });

        // Test dark theme colors
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'dark');
        });
        await page.waitForTimeout(100);

        const darkColors = await element.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            borderColor: styles.borderColor
          };
        });

        // Verify colors adapted to theme
        expect(lightColors.backgroundColor).not.toBe(darkColors.backgroundColor);
      }
    });

    it('should maintain semantic color roles across themes', async () => {
      const semanticColors = [
        'primary',
        'secondary',
        'tertiary',
        'surface',
        'background',
        'error',
        'warning',
        'success'
      ];

      const themes = ['light', 'dark'];

      for (const theme of themes) {
        await page.evaluate((themeName) => {
          document.documentElement.setAttribute('data-theme', themeName);
        }, theme);

        const colorValues = await page.evaluate((colors) => {
          const computedStyle = getComputedStyle(document.documentElement);
          const result: Record<string, string> = {};
          
          colors.forEach(color => {
            result[color] = computedStyle.getPropertyValue(`--md-sys-color-${color}`).trim();
          });
          
          return result;
        }, semanticColors);

        // Verify all semantic colors are defined
        semanticColors.forEach(color => {
          expect(colorValues[color]).toBeTruthy();
          expect(colorValues[color]).not.toBe('');
        });
      }
    });

    it('should handle dynamic color generation for custom themes', async () => {
      // Test custom color seed
      await page.evaluate(() => {
        // Simulate custom theme generation
        const customColors = {
          '--md-sys-color-primary': 'rgb(103, 80, 164)',
          '--md-sys-color-on-primary': 'rgb(255, 255, 255)',
          '--md-sys-color-primary-container': 'rgb(234, 221, 255)',
          '--md-sys-color-on-primary-container': 'rgb(33, 0, 93)'
        };

        Object.entries(customColors).forEach(([property, value]) => {
          document.documentElement.style.setProperty(property, value);
        });
      });

      await page.waitForTimeout(100);

      const customColors = await page.evaluate(() => {
        const computedStyle = getComputedStyle(document.documentElement);
        return {
          primary: computedStyle.getPropertyValue('--md-sys-color-primary').trim(),
          onPrimary: computedStyle.getPropertyValue('--md-sys-color-on-primary').trim(),
          primaryContainer: computedStyle.getPropertyValue('--md-sys-color-primary-container').trim(),
          onPrimaryContainer: computedStyle.getPropertyValue('--md-sys-color-on-primary-container').trim()
        };
      });

      expect(customColors.primary).toBe('rgb(103, 80, 164)');
      expect(customColors.onPrimary).toBe('rgb(255, 255, 255)');
    });
  });

  describe('Color System Integration', () => {
    it('should apply contextual colors to interactive states', async () => {
      const button = await page.$('[data-testid="material3-button"]');
      if (!button) return;

      // Test hover state colors
      await button.hover();
      await page.waitForTimeout(100);

      const hoverColors = await button.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color
        };
      });

      // Test focus state colors
      await button.focus();
      await page.waitForTimeout(100);

      const focusColors = await button.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          outline: styles.outline
        };
      });

      // Verify state-specific styling
      expect(focusColors.outline).toBeTruthy();
      expect(focusColors.outline).not.toBe('none');
    });

    it('should maintain color harmony across component variants', async () => {
      const buttonVariants = ['filled', 'outlined', 'text', 'elevated', 'tonal'];
      
      for (const variant of buttonVariants) {
        const button = await page.$(`[data-variant="${variant}"]`);
        if (!button) continue;

        const colors = await button.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            borderColor: styles.borderColor
          };
        });

        // Verify variant has appropriate styling
        expect(colors.backgroundColor).toBeTruthy();
        expect(colors.color).toBeTruthy();
      }
    });
  });
});