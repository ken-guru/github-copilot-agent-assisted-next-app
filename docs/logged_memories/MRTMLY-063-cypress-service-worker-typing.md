### Issue: TypeScript Error in Cypress Service Worker Tests
**Date:** 2025-04-28
**Tags:** #debugging #typescript #cypress #serviceWorker
**Status:** Resolved

#### Initial State
- Build failing with TypeScript error in service worker Cypress tests
- Error message: `Type error: 'registrations' is of type 'unknown'`
- The issue was in `cypress/e2e/service-worker.cy.ts`, where Cypress was attempting to work with an untyped object

#### Debug Process
1. Analysis of the error
   - The error occurred because `getRegistrations()` returns a Promise that resolves to an array that TypeScript marked as `unknown`
   - Explicit type casting was needed but had to be compatible with Cypress's typing system
   - First attempt to add type annotation to the `.then()` parameter failed

2. Investigation of Cypress typing
   - Discovered that `cy.wrap()` doesn't properly propagate typings for service worker objects
   - Found that mixing direct Promise handling with Cypress commands was causing type conflicts
   - Researched alternative patterns for handling Promises in Cypress tests

#### Resolution
1. Fixed the unregistration code:
   - Replaced `cy.wrap(win.navigator.serviceWorker.getRegistrations())` with direct Promise handling
   - Added explicit type casting using `as ServiceWorkerRegistration[]` to ensure proper typing
   - This allowed the `.map()` operation to proceed without TypeScript errors

2. Fixed the registration check:
   - Used Cypress.Promise to bridge between native Promises and Cypress commands
   - Properly wrapped the result to enable Cypress assertions
   - Used `should('not.be.undefined')` instead of `should('exist')` for better type compatibility

#### Lessons Learned
- Cypress and native Promise handling require careful type management
- When dealing with browser APIs in Cypress tests, explicit type casting is often necessary
- Using native Promises first and then bridging to Cypress commands with `cy.wrap()` helps maintain proper typing
- Browser APIs like Service Workers require special handling in TypeScript to ensure type safety
- Cypress.Promise can be useful for bridging between native Promises and Cypress commands
