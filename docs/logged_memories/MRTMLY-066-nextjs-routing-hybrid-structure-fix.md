### Issue: Next.js Routing Hybrid Structure Fix
**Date:** 2025-04-08
**Tags:** #debugging #routing #next-js #hybrid-routing #app-router #pages-router
**Status:** In Progress

#### Initial State
- After updating `next.config.ts` to address routing conflict with proper src directory configuration, 404 error still persists
- Project has a complex hybrid structure:
  - `/pages/_app.tsx` exists (Pages Router)
  - No `/pages/index.tsx` (was removed)
  - `/src/app/page.tsx` exists (App Router)
  - `/src/app/layout.tsx` exists (App Router)
- Browser shows 404 error even after clearing site data

#### Debug Process
1. Configuration analysis
   - Verified the updated `next.config.ts` has correct srcDir configuration
   - Confirmed settings for App Router enabled in experimental section
   - Checked that webpack configuration is present

2. Project structure investigation
   - Identified that the project has a hybrid Pages/App Router setup
   - Found that `pages/_app.tsx` imports CSS from both routing systems
   - Discovered reference to App Router's CSS in Pages Router files, indicating intentional hybrid approach

3. Hybrid routing diagnosis
   - In Next.js, hybrid routing requires careful coordination
   - App Router (`/src/app/*`) handles routes that don't exist in Pages Router
   - When `/pages/index.tsx` was removed, App Router should take over the root route
   - The continued 404 suggests Next.js is not properly connecting the routing systems