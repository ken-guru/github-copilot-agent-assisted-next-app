### Issue: Routing Conflict Between App Router and Pages Router
**Date:** 2025-04-10
**Tags:** #debugging #routing #next-js #deployment #vercel #testing
**Status:** Resolved

#### Initial State
- Vercel deployment failing with the error:
  ```
  ⨯ Conflicting app and page file was found, please remove the conflicting files to continue:
  ⨯   "pages/index.tsx" - "app/page.tsx"
  ```
- Both routing systems (Pages Router and App Router) have implementations for the home route
- The application is in the process of migrating from Pages Router to App Router
- Local development works due to specific configuration, but Vercel deployment is failing

#### Debug Process
1. Routing conflict analysis
   - Identified that both `pages/index.tsx` and `src/app/page.tsx` exist in the codebase
   - While local development can handle this with specific configurations, Vercel strictly enforces routing rules
   - Next.js does not allow the same route to be handled by both routing systems simultaneously

2. Testing approach
   - Created tests to verify proper routing structure
   - Ensured that appropriate root layout files exist for the chosen routing system
   - Checked for consistency in the routing approach

3. Migration strategy
   - Evaluated which router system to prioritize
   - Decided to complete migration to App Router as it's the recommended approach by Next.js
   - Preserved Pages Router code for reference during the transition

4. Test adaptation
   - Updated the routing structure tests to validate the new setup
   - Modified the Pages Router test to work with the App Router implementation
   - Ensured consistent testing across the codebase

#### Resolution
- Created a backup of the Pages Router implementation (`pages/index.tsx.bak`) for reference
- Removed the original `pages/index.tsx` file to eliminate the routing conflict
- Added tests to verify routing structure and prevent similar conflicts
- Updated the Pages Router test to reference the App Router implementation
- Ensured consistency in the App Router implementation with proper layouts and page components
- Verified all tests pass with the updated structure (326 tests passing)
- Confirmed successful deployment on Vercel without any routing conflicts

#### Lessons Learned
- Next.js strictly enforces routing separation between App Router and Pages Router
- Vercel deployments may expose routing conflicts not apparent in local development
- During migration between routing systems, it's important to:
  1. Fully commit to one system for each route
  2. Test deployments on Vercel before merging to main branch
  3. Document the migration process for team awareness
- Creating comprehensive tests for routing structure can prevent similar issues in the future
- Backup strategies help preserve code while resolving conflicts, aiding in complete migration
- Tests need to be updated as part of migration between routing systems:
  1. Tests that depend on specific files need to be modified to reference new implementations
  2. Test structure should mirror the application architecture
  3. Maintaining test coverage during migrations is essential for confidence in the changes
- A test-first approach provides confidence when making significant architectural changes like routing system migrations
