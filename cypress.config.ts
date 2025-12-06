import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    // For handling uncaught exceptions
    experimentalRunAllSpecs: true,
    // Increased timeouts for Next.js 16 with Turbopack
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 120000,
    requestTimeout: 10000,
    responseTimeout: 30000,
  },
  // Configure viewport size
  viewportWidth: 1280,
  viewportHeight: 720,
  // Enable video recording for test runs
  video: true,
  // Configure screenshots on failure
  screenshotOnRunFailure: true,
  // Retry failed tests (helpful for timing issues)
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
