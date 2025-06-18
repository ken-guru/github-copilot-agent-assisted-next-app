### Issue: MRTMLY-010: Deployment Build Failing Due to CommonJS Require
**Date:** 2025-03-01
**Tags:** #deployment #testing #eslint #typescript
**Status:** Resolved

#### Initial State
- Vercel deployment build failing with error:
  "Error: require() of ES Module not supported"
- Local builds pass without errors
- Problem appears to be related to Jest configuration
- Deployment pipeline stuck, blocking feature release

#### Debug Process
1. Investigated build error logs
   - Found specific error related to importing jest-dom in test files
   - Identified difference in Node.js module resolution between local and CI
   - Determined issue was with how Jest modules were being imported

2. Solution attempts
   - Updated import statements in test files
     - Changed `require()` to ES module `import` syntax
     - Outcome: Some errors resolved but new TypeScript errors appeared
     - Issue: Type definitions needed updating

   - Updated tsconfig.json module settings
     - Changed "module": "CommonJS" to "ESNext" 
     - Outcome: TypeScript errors resolved but Jest now failing
     - Why: Jest configuration needed updates for ESM support

   - Configured dual module support
     - Kept CommonJS for Jest tests
     - Used ESM for production build
     - Modified next.config.ts to handle both
     - Outcome: Local tests passing but still build failures

3. Final approach
   - Complete overhaul of module handling
     - Updated all test imports to use ESM syntax
     - Configured Jest to properly handle ESM
     - Updated build scripts with proper Node flags
     - Outcome: Both tests and builds now working

#### Resolution
- Final solution implemented:
  - Standardized on ES modules throughout codebase
  - Updated Jest configuration for ESM compatibility
  - Added proper TypeScript configuration for dual module support
  - Implemented build-specific environment variables
- All builds now passing in both local and CI environments

#### Lessons Learned
- Key insights:
  - Module systems (CommonJS vs ESM) need consistent configuration
  - Testing environments should mirror production as closely as possible
  - CI environments may have subtle differences from local development
- Future considerations:
  - Create a module compatibility checker for the build pipeline
  - Document module usage patterns for the team
  - Consider moving fully to ESM for all environments