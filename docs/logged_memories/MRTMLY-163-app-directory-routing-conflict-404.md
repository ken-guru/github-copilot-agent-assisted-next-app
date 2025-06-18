### Issue: Next.js 404 Error Due to Duplicate App Directories
**Date:** 2025-04-08
**Tags:** #debugging #next-js #routing #404-error
**Status:** In Progress

#### Initial State
- Application works correctly on Vercel deployment
- Local development server shows 404 error on homepage (http://localhost:3000/)
- Terminal logs show multiple "GET / 404" errors
- Previous import path fixes did not resolve the issue

#### Debug Process
1. Investigation of directory structure
   - Found two competing `app` directories in the project:
     - `/app` in project root (contains only `__tests__/`)
     - `/src/app` (contains actual components: `layout.tsx`, `page.tsx`, etc.)
   
2. Analysis of Next.js routing behavior
   - Next.js prioritizes the top-level `/app` directory for App Router
   - Since the root `/app` directory doesn't contain required files, Next.js returns 404
   - The actual application components in `/src/app` are not being used

3. Previous fix attempts
   - Fixed import paths in `src/app/page.tsx` to use proper `@/` alias
   - This didn't resolve the issue because the root problem is the directory structure

#### Resolution (in progress)
Planned solution:
1. Remove or rename the empty top-level `/app` directory 
2. Ensure Next.js uses the correct `/src/app` directory for routing
3. Verify file paths and imports are correctly set up
4. Restart development server to apply changes

#### Lessons Learned
- Next.js can get confused by duplicate `app` directories in different locations
- When using the App Router, directory structure is critical for proper routing
- Even with correct imports, the wrong directory structure can cause routing problems
