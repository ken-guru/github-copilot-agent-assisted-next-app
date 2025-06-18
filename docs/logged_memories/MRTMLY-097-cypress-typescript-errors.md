### Issue: TypeScript Errors in Cypress Tests
**Date:** 2025-04-28
**Tags:** #debugging #typescript #cypress #serviceWorker
**Status:** Resolved

#### Initial State
- Build failing with TypeScript errors in Cypress test files
- Issues found in:
  - `service-worker.cy.ts` - Unknown type 'registrations'
  - `cypress/support/commands.ts` - Type mismatch in Cypress.Commands.add
  - `activity-state-transitions.cy.ts` - Cannot find name 'cy'

#### Debug Process
1. Service worker registration issue:
   - Changed direct Promise handling with the `getRegistrations` method
   - Applied explicit type casting to `ServiceWorkerRegistration[]` 
   
2. Cypress commands typing issues:
   - Rewrote `waitForServiceWorkerRegistration` command to properly use Promise<void>
   - Created a cleaner implementation with proper type handling
   
3. Triple-slash reference issue:
   - Added `/// <reference types="cypress" />` to Cypress test files
   - Modified tsconfig.json to include Cypress types globally
   - Created a Cypress-specific tsconfig.json for better typing

#### Resolution
1. Fixed service worker Promise handling:
   - Used proper typing for returned Promises
   - Simplified chain of Promise resolution

2. Fixed Cypress commands:
   - Completely rewrote problematic commands with correct type signatures 
   - Used a more reliable approach for service worker waiting

3. Fixed TypeScript configuration:
   - Added Cypress types globally to main tsconfig.json
   - Created a dedicated tsconfig.json for Cypress
   - Ensured consistent type declarations across files

#### Lessons Learned
- Cypress has its own TypeScript ecosystem that requires special handling
- When working with browser APIs in tests, explicit typing is crucial
- Delaying techniques (like waiting for service worker registration) should be implemented carefully
- Having dedicated TypeScript configurations for test frameworks helps keep type safety
- Sometimes a complete rewrite of a function is better than patching type issues
