import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Increase default timeout for service worker operations
    defaultCommandTimeout: 10000,
    // Add configuration for handling uncaught exceptions
    uncaughtExceptionHandler: false,
    
    // Video recording configuration
    video: true,
    videosFolder: 'cypress/videos',
    videoCompression: 32, // Lower compression value (15-40 is good for CI)
    
    // Screenshot configuration
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    
    // Clean before runs to avoid stale artifacts
    trashAssetsBeforeRuns: true,
  },
})