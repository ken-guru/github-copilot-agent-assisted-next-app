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
  },
  // Configure viewport size
  viewportWidth: 1280,
  viewportHeight: 720,
  // Enable video recording for test runs
  video: true,
  // Configure screenshots on failure
  screenshotOnRunFailure: true,
});
