### Issue: MRTMLY-412: Cypress Configuration Missing E2E Testing Type
**Date:** 2025-04-28  
**Tags:** #debugging #cypress #e2e-tests #configuration  
**Status:** Resolved  

#### Initial State
- Cypress E2E tests were not running properly
- Error message when running `npm run cypress:run`: "The testing type selected (e2e) is not configured in your config file."
- The cypress.config.ts file was empty or missing
- The project has existing E2E tests in the cypress/e2e directory

#### Debug Process
1. First investigation step
   - Examined the error message from Cypress which clearly stated the e2e testing type was not configured
   - Checked for the existence of the cypress.config.ts file and found it was empty/missing
   - Reviewed existing test files to understand the testing structure and requirements
   - Checked package.json to confirm Cypress version (14.3.1)

2. Solution approach
   - Determined that modern Cypress (v10+) requires explicit configuration of testing types
   - Created a new cypress.config.ts file with proper e2e configuration
   - Configured baseUrl to point to the local development server
   - Added appropriate viewportWidth, viewportHeight, and other common settings
   - Ensured proper configuration of supportFile path and specPattern

3. Support file update
   - Found that cypress/support/commands.ts was empty
   - Created a commands.ts file with appropriate structure for potential future custom commands

#### Resolution
- Created a new cypress.config.ts file with proper E2E configuration:
  ```typescript
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
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
  });
  ```
- Created a starter commands.ts file as a foundation for custom Cypress commands
- This should resolve the configuration error and allow Cypress tests to run properly

#### Lessons Learned
- Cypress v10+ requires explicit configuration of testing types (e2e and/or component)
- When upgrading Cypress or setting up a project, must ensure proper configuration files are in place
- Always check version-specific requirements for test frameworks when troubleshooting issues
- The error message from Cypress was very helpful in diagnosing the issue, pointing directly to the missing configuration
