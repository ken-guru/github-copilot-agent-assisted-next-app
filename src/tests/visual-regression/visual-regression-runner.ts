/**
 * Visual Regression Testing Runner
 * Automated visual testing system for Material 3 Expressive components
 */

import { Page, Browser, chromium, firefox, webkit } from 'playwright';
import { VisualTestConfig, ViewportConfig, ThemeConfig, ComponentState } from './visual-regression.config';
import { compareImages, generateScreenshotPath, ensureDirectoryExists } from './visual-regression-utils';

export class VisualRegressionRunner {
  private browsers: Map<string, Browser> = new Map();
  private baselineDir = 'src/tests/visual-regression/baselines';
  private actualDir = 'src/tests/visual-regression/actual';
  private diffDir = 'src/tests/visual-regression/diff';

  async initialize(): Promise<void> {
    // Initialize browsers for cross-browser testing
    const browsers = [
      { name: 'chromium', launcher: chromium },
      { name: 'firefox', launcher: firefox },
      { name: 'webkit', launcher: webkit }
    ];

    for (const { name, launcher } of browsers) {
      try {
        const browser = await launcher.launch({ headless: true });
        this.browsers.set(name, browser);
        console.log(`✓ Initialized ${name} browser`);
      } catch (error) {
        console.warn(`⚠ Failed to initialize ${name} browser:`, error);
      }
    }

    // Ensure output directories exist
    await ensureDirectoryExists(this.baselineDir);
    await ensureDirectoryExists(this.actualDir);
    await ensureDirectoryExists(this.diffDir);
  }

  async runVisualTests(configs: VisualTestConfig[]): Promise<VisualTestResult[]> {
    const results: VisualTestResult[] = [];

    for (const config of configs) {
      console.log(`\n🧪 Testing component: ${config.component}`);
      
      for (const [browserName, browser] of this.browsers) {
        const browserResults = await this.testComponentInBrowser(
          config,
          browser,
          browserName
        );
        results.push(...browserResults);
      }
    }

    return results;
  }

  private async testComponentInBrowser(
    config: VisualTestConfig,
    browser: Browser,
    browserName: string
  ): Promise<VisualTestResult[]> {
    const results: VisualTestResult[] = [];
    const page = await browser.newPage();

    try {
      // Navigate to component test page
      await page.goto(`http://localhost:3000/test-components/${config.component}`);
      
      for (const variant of config.variants) {
        for (const viewport of config.viewports) {
          for (const theme of config.themes) {
            for (const state of config.states) {
              const result = await this.captureComponentScreenshot(
                page,
                config,
                variant,
                viewport,
                theme,
                state,
                browserName
              );
              results.push(result);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error testing ${config.component} in ${browserName}:`, error);
    } finally {
      await page.close();
    }

    return results;
  }

  private async captureComponentScreenshot(
    page: Page,
    config: VisualTestConfig,
    variant: string,
    viewport: ViewportConfig,
    theme: ThemeConfig,
    state: ComponentState,
    browserName: string
  ): Promise<VisualTestResult> {
    const testId = `${config.component}-${variant}-${viewport.name}-${theme.name}-${state.name}-${browserName}`;
    
    try {
      // Set viewport
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      // Set theme
      await page.evaluate((themeName) => {
        document.documentElement.setAttribute('data-theme', themeName);
      }, theme.name);

      // Configure component variant and props
      await page.evaluate(({ variant, props }) => {
        const component = document.querySelector('[data-testid="component-under-test"]');
        if (component) {
          component.setAttribute('data-variant', variant);
          if (props) {
            Object.entries(props).forEach(([key, value]) => {
              component.setAttribute(`data-${key}`, String(value));
            });
          }
        }
      }, { variant, props: state.props });

      // Apply interactions if specified
      if (state.interactions) {
        for (const interaction of state.interactions) {
          await this.performInteraction(page, interaction);
        }
      }

      // Wait for animations to settle if enabled
      if (config.animations) {
        await page.waitForTimeout(500);
      }

      // Capture screenshot
      const screenshotPath = generateScreenshotPath(this.actualDir, testId);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false,
        clip: await this.getComponentBounds(page)
      });

      // Compare with baseline
      const baselinePath = generateScreenshotPath(this.baselineDir, testId);
      const diffPath = generateScreenshotPath(this.diffDir, testId);
      
      const comparison = await compareImages(baselinePath, screenshotPath, diffPath);

      return {
        testId,
        component: config.component,
        variant,
        viewport: viewport.name,
        theme: theme.name,
        state: state.name,
        browser: browserName,
        passed: comparison.passed,
        difference: comparison.difference,
        screenshotPath,
        baselinePath,
        diffPath: comparison.passed ? undefined : diffPath
      };

    } catch (error) {
      return {
        testId,
        component: config.component,
        variant,
        viewport: viewport.name,
        theme: theme.name,
        state: state.name,
        browser: browserName,
        passed: false,
        error: error.message,
        screenshotPath: '',
        baselinePath: ''
      };
    }
  }

  private async performInteraction(page: Page, interaction: any): Promise<void> {
    const selector = interaction.selector || '[data-testid="component-under-test"]';
    
    switch (interaction.type) {
      case 'hover':
        await page.hover(selector);
        break;
      case 'focus':
        await page.focus(selector);
        break;
      case 'click':
        await page.click(selector);
        break;
      case 'scroll':
        await page.evaluate(() => window.scrollBy(0, 100));
        break;
    }

    if (interaction.delay) {
      await page.waitForTimeout(interaction.delay);
    }
  }

  private async getComponentBounds(page: Page): Promise<{ x: number; y: number; width: number; height: number }> {
    return await page.evaluate(() => {
      const component = document.querySelector('[data-testid="component-under-test"]');
      if (component) {
        const rect = component.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        };
      }
      return { x: 0, y: 0, width: 800, height: 600 };
    });
  }

  async cleanup(): Promise<void> {
    for (const [name, browser] of this.browsers) {
      await browser.close();
      console.log(`✓ Closed ${name} browser`);
    }
    this.browsers.clear();
  }
}

export interface VisualTestResult {
  testId: string;
  component: string;
  variant: string;
  viewport: string;
  theme: string;
  state: string;
  browser: string;
  passed: boolean;
  difference?: number;
  error?: string;
  screenshotPath: string;
  baselinePath: string;
  diffPath?: string;
}