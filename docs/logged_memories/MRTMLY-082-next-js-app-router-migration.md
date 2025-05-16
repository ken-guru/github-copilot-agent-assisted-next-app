### Migration: Next.js App Router Structure Implementation
**Date:** 2025-05-16
**Tags:** #migration #next-js #folder-structure #app-router #path-aliases
**Status:** Completed

#### Initial State
- The application was using the Next.js Pages Router pattern
- Components, contexts, utilities, and hooks were scattered throughout the codebase
- Import paths were inconsistent
- Tests were failing due to path resolution issues

#### Migration Process
1. Set up basic App Router structure 
   - Created src/app directory with page.tsx and layout.tsx
   - Set up app/_components for app-specific components
   
2. Created new directory structure
   - Organized components/feature and components/ui directories
   - Established lib/service-worker, lib/activity, lib/events directories
   - Created consistent pattern for hooks and contexts
   
3. Migrated core functionality
   - Moved and updated context providers
   - Relocated utility functions to appropriate directories
   - Migrated custom hooks to dedicated locations
   - Updated components to use new import paths
   
4. Fixed test issues
   - Updated SplashScreen test to handle CSS module classes
   - Removed duplicate test files
   - Fixed typings for import statements
   
5. Updated configuration
   - Added path aliases in tsconfig.json
   - Updated jest.config.js for proper test resolution
   - Added .eslintrc.json for better development experience

#### Resolution
- All tests are now passing (456 tests across 73 test suites)
- Build process completes with only minor ESLint warnings
- Application structure follows Next.js best practices with App Router

#### Lessons Learned
- When migrating to App Router structure, page-specific components should go in _components directory
- CSS Modules require special handling in tests (checking for class name substrings)
- Path aliases need to be consistent across tsconfig.json and jest.config.js
- Duplicate test files can cause confusion during migration
- ESLint warnings should be addressed gradually after migration is complete
