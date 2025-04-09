### Issue: Service Worker TypeScript Error in Build
**Date:** 2025-04-09
**Tags:** #debugging #typescript #type-error #service-worker #build-failure #deployment
**Status:** In Progress

#### Initial State
- Build is failing with a TypeScript error in `src/utils/serviceWorkerRegistration.ts`
- Error message: "'updateError' is of type 'unknown'"
- Error occurs on line 207 when trying to access the `message` property on `updateError`
- The offending code is: `const errorMessage = updateError.message || String(updateError);`
- This is part of our error handling for service worker update failures

#### Debug Process
1. Initial analysis of the error
   - TypeScript is correctly preventing unsafe access to properties on an `unknown` type
   - Need to check how `updateError` is typed in the catch clause
   - Need to add proper type guards before accessing the `message` property
   - Will follow test-first approach by updating/enhancing service worker tests

2. Implementing a type-safe solution
   - Created a new test case to verify handling of various error types
   - Added a helper function `getErrorMessage()` to safely extract error message from unknown types
   - Updated catch blocks to explicitly type error parameters as `unknown`
   - Used proper type guards to access properties on error objects
   - Implemented defensive error handling for null, undefined, string, Error objects and plain objects

3. Testing the solution
   - All service worker tests now pass successfully
   - Verified that production code has no TypeScript errors
   - Next.js build completes successfully without type errors

4. Build verification
   - Successfully ran full Next.js build without TypeScript errors
   - Production build now completes properly, fixing the deployment error

#### Resolution
- Fixed the TypeScript error in `serviceWorkerRegistration.ts` by implementing proper type-safe error handling
- Added a utility function `getErrorMessage()` to safely handle different error types
- Updated all catch blocks to use the explicit `unknown` type for errors
- Added proper type guards before accessing properties on error objects
- Enhanced error handling to support various error object structures
- Added a new test case to verify handling of different error types
- Verified that production build now completes successfully

#### Lessons Learned
- Always use explicit type annotations for catch clause variables (`catch (error: unknown)`)
- Add proper type guards before accessing properties on unknown types
- Create utility functions to centralize error handling logic
- Test various error types to ensure robust error handling
- Use TypeScript's type checking features to catch potential runtime errors during build
- TypeScript errors in catch blocks are common but often overlooked during development

**Status:** Resolved
