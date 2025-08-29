/**
 * Browser-specific Cypress Configuration
 * 
 * Configuration for running cross-browser tests across different browsers
 * and devices for Material 3 Expressive components.
 */

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Browser-specific settings
    chromeWebSecurity: false,
    
    // Viewport settings for responsive testing
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Video and screenshot settings
    video: true,
    screenshotOnRunFailure: true,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Retry settings for flaky tests
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    setupNodeEvents(on, config) {
      // Browser launch options
      on('before:browser:launch', (browser, launchOptions) => {
        console.log('Launching browser:', browser.name, browser.version);
        
        if (browser.name === 'chrome') {
          // Chrome-specific flags
          launchOptions.args.push(
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          );
          
          // Enable experimental features for testing
          launchOptions.args.push(
            '--enable-experimental-web-platform-features',
            '--enable-features=CSSContainerQueries'
          );
        }
        
        if (browser.name === 'firefox') {
          // Firefox-specific preferences
          launchOptions.preferences = {
            ...launchOptions.preferences,
            'layout.css.container-queries.enabled': true,
            'layout.css.backdrop-filter.enabled': true,
            'gfx.webrender.all': true,
          };
        }
        
        if (browser.name === 'edge') {
          // Edge-specific flags (similar to Chrome)
          launchOptions.args.push(
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--enable-experimental-web-platform-features'
          );
        }
        
        return launchOptions;
      });
      
      // Performance monitoring
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Custom task for measuring performance
        measurePerformance: async (url: string) => {
          const puppeteer = require('puppeteer');
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          
          await page.goto(url);
          
          const metrics = await page.metrics();
          const performanceEntries = await page.evaluate(() => {
            return JSON.stringify(performance.getEntriesByType('navigation'));
          });
          
          await browser.close();
          
          return {
            metrics,
            performanceEntries: JSON.parse(performanceEntries),
          };
        },
        
        // Custom task for accessibility testing
        checkAccessibility: async (url: string) => {
          const { chromium } = require('playwright');
          const { injectAxe, checkA11y } = require('axe-playwright');
          
          const browser = await chromium.launch();
          const page = await browser.newPage();
          
          await page.goto(url);
          await injectAxe(page);
          
          const results = await checkA11y(page, null, {
            detailedReport: true,
            detailedReportOptions: { html: true },
          });
          
          await browser.close();
          
          return results;
        },
      });
      
      // Environment-specific configuration
      if (config.env.BROWSER === 'mobile') {
        config.viewportWidth = 375;
        config.viewportHeight = 667;
        config.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15';
      }
      
      if (config.env.BROWSER === 'tablet') {
        config.viewportWidth = 768;
        config.viewportHeight = 1024;
        config.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15';
      }
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});

// Browser-specific test configurations
export const browserConfigs = {
  chrome: {
    browser: 'chrome',
    args: [
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--enable-experimental-web-platform-features',
    ],
  },
  
  firefox: {
    browser: 'firefox',
    preferences: {
      'layout.css.container-queries.enabled': true,
      'layout.css.backdrop-filter.enabled': true,
    },
  },
  
  edge: {
    browser: 'edge',
    args: [
      '--disable-web-security',
      '--enable-experimental-web-platform-features',
    ],
  },
  
  safari: {
    browser: 'webkit',
    // Safari-specific configuration would go here
    // Note: Cypress doesn't support Safari directly, but Playwright does
  },
};

// Device-specific configurations
export const deviceConfigs = {
  mobile: {
    viewportWidth: 375,
    viewportHeight: 667,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
    deviceScaleFactor: 2,
  },
  
  tablet: {
    viewportWidth: 768,
    viewportHeight: 1024,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
    deviceScaleFactor: 2,
  },
  
  desktop: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    deviceScaleFactor: 1,
  },
};

// Performance testing configuration
export const performanceConfig = {
  budgets: {
    firstContentfulPaint: 2000, // 2 seconds
    largestContentfulPaint: 4000, // 4 seconds
    firstInputDelay: 100, // 100ms
    cumulativeLayoutShift: 0.1, // 0.1 CLS score
    totalBlockingTime: 300, // 300ms
  },
  
  metrics: [
    'first-paint',
    'first-contentful-paint',
    'largest-contentful-paint',
    'first-input-delay',
    'cumulative-layout-shift',
    'total-blocking-time',
  ],
};

// Accessibility testing configuration
export const a11yConfig = {
  rules: {
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
    'aria-labels': { enabled: true },
    'semantic-markup': { enabled: true },
  },
  
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  
  exclude: [
    // Exclude third-party components that we can't control
    '[data-testid="third-party-widget"]',
  ],
};