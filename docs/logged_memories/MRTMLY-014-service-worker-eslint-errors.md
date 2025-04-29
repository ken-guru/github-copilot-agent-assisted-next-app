### Issue: MRTMLY-011: Service Worker ESLint Errors Blocking Build
**Date:** 2024-12-10
**Tags:** #debugging #eslint #build #serviceworker
**Status:** Resolved

#### Initial State
- Vercel deployment failing due to ESLint errors in service worker code
- Local development passing without errors
- CI/CD pipeline reporting specific ESLint rules violations
- Build process blocked by strict ESLint configuration

#### Debug Process
1. Analyzed ESLint errors in build logs
   - Found multiple "no-restricted-globals" violations
   - Identified inconsistent ESLint configuration between environments
   - Determined need for service worker-specific ESLint rules

2. Solution attempts
   - Added ESLint ignores for service worker file
     - Used `/* eslint-disable */` comments for specific rules
     - Outcome: Build passed but introduced technical debt
     - Issue: Not addressing the underlying code quality concerns

   - Updated service worker code to fix violations
     - Refactored code to avoid restricted globals
     - Added proper window references
     - Outcome: Some errors fixed but new ones appeared
     - Why: Service worker context differs from normal JavaScript

   - Created specialized ESLint configuration
     - Added .eslintrc.serviceworker.js with context-specific rules
     - Updated build process to use different config for service workers
     - Created documentation for service worker linting requirements
     - Outcome: Successfully resolved all linting errors

#### Resolution
- Final solution implemented:
  - Service worker-specific ESLint configuration
  - Code refactoring to follow best practices
  - Documentation of service worker coding standards
  - CI/CD pipeline updates to apply correct rules
- All builds now passing ESLint checks consistently

#### Lessons Learned
- Key insights:
  - Service workers require specific linting rules due to their execution context
  - ESLint configuration should be tailored to different code environments
  - Code quality tools need adaptability for special file types
- Future considerations:
  - Create comprehensive service worker development guide
  - Consider automating context detection for linting
  - Implement more sophisticated build pipeline for specialized files