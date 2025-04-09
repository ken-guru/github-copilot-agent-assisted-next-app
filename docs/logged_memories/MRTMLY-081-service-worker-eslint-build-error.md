### Issue: Service Worker Test ESLint Build Error
**Date:** 2025-04-09
**Tags:** #debugging #eslint #build-error #service-worker #tests #deployment #typescript
**Status:** Resolved

#### Initial State
- Vercel deployment was failing with ESLint errors in `src/utils/__tests__/serviceWorkerUpdateError.test.ts`
- Two specific ESLint errors were detected:
  1. `'originalSetTimeout' is assigned a value but never used. @typescript-eslint/no-unused-vars`
  2. `'_timeout' is defined but never used. @typescript-eslint/no-unused-vars`
- These errors were causing the build to fail in the Vercel deployment pipeline
- Previous changes to fix TypeScript errors in this test file did not address the ESLint issues

#### Debug Process
1. Identified the exact location of the errors
   - First error occurs on line 191: `const originalSetTimeout = global.setTimeout;` - variable assigned but never used
   - Second error occurs on line 195: `(cb: () => void, _timeout?: number)` - parameter defined but never used
   - Both issues are related to the setTimeout mock implementation in the tests

2. Error analysis
   - The `originalSetTimeout` variable was stored but never actually used for restoration
   - The test was correctly using `jest.spyOn(global, 'setTimeout').mockRestore()` for cleanup
   - The `_timeout` parameter was needed in the function signature but not used in the implementation

3. Resolution approach
   - Remove the unused originalSetTimeout variable
   - Add ESLint disable comment for the unused parameter case
   - Ensured test functionality remained unchanged while fixing linting errors

4. Build verification
   - Ran `npm run build` locally to verify the ESLint errors were fixed
   - Confirmed that the build now completes successfully
   - The fixes should allow the Vercel deployment to proceed without errors

#### Resolution
- Removed the unused `originalSetTimeout` variable that was assigned but never used
- Added an ESLint disable comment (`// eslint-disable-next-line @typescript-eslint/no-unused-vars`) to properly handle the unused `timeout` parameter
- Maintained the original test functionality while addressing the linting issues
- Build now completes successfully with no ESLint errors

#### Lessons Learned
- Always verify that both TypeScript and ESLint checks pass after fixing type errors
- When mocking built-in functions, ensure proper cleanup using jest.spyOn().mockRestore() rather than storing and restoring original references
- Use ESLint disable comments sparingly and only for specific lines where the warning cannot be addressed by code changes
- When parameters are required for function signature compatibility but not used in the implementation, properly mark them with ESLint disable directives
- Run the full build process locally before committing to catch any potential deployment issues

**Status:** Resolved