### Issue: MRTMLY-007: Service Worker Test Build Error Fix
**Date:** 2025-03-01
**Tags:** #debugging #tests #typescript #linting
**Status:** Resolved

#### Initial State
- Service worker tests failing during build process
- TypeScript errors in test files: "Property 'serviceWorker' does not exist on type 'Navigator'"
- Inconsistency between local development and CI/CD pipeline
- Tests passing locally but failing in build environment

#### Debug Process
1. Investigated TypeScript configuration
   - Found navigator.serviceWorker not properly typed in test files
   - Identified missing TypeScript lib configuration
   - Determined inconsistent type definitions between environments

2. Solution attempts
   - Added service worker types to tsconfig.json
     - Updated lib array to include "WebWorker"
     - Outcome: Improved but still some type errors
     - Issue: Test-specific TypeScript configuration needed

   - Created test-specific TypeScript configuration
     - Added separate tsconfig.test.json with appropriate settings
     - Updated Jest configuration to use test-specific TypeScript config
     - Outcome: Better but still build failures
     - Why: Missing type definitions for service worker mocks

   - Implemented comprehensive type definition solution
     - Created custom type declarations for service worker tests
     - Added proper TypeScript module augmentation
     - Updated build process to include test types
     - Outcome: Successfully resolved all type errors

#### Resolution
- Final solution implemented:
  - Custom type definitions for service worker testing
  - Test-specific TypeScript configuration
  - Proper module augmentation for navigator types
  - Updated build process to handle test types correctly
- All tests now pass in both local and CI environments

#### Lessons Learned
- Key insights:
  - Test environments need specialized type definitions
  - TypeScript configuration should be adaptable to different contexts
  - Module augmentation provides safe type extension
- Future considerations:
  - Create standardized approach for test-specific types
  - Consider more sophisticated build pipeline for test files
  - Document type definition patterns for testing browser APIs