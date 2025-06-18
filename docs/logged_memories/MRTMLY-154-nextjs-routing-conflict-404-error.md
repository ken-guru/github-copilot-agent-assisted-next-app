### Issue: Next.js Routing Conflict Causing 404 Error
**Date:** 2025-04-07
**Tags:** #debugging #routing #next-js #deployment
**Status:** Resolved

#### Initial State
- Vercel deployment showing error due to conflicting routes:
  ```
  Conflicting app and page file was found, please remove the conflicting files to continue:
  "pages/index.tsx" - "app/page.tsx"
  ```
- After removing `pages/index.tsx` to fix the conflict, the home page now returns a 404 error
- Both Pages Router (`pages/index.tsx`) and App Router (`src/app/page.tsx`) implementations existed
- App Router implementation exists but is not being recognized correctly

#### Debug Process
1. Project structure analysis
   - Confirmed the error came from having both routing systems targeting the same route
   - Verified that `src/app/page.tsx` contains a valid Home component implementation
   - Examined that when `pages/index.tsx` was removed, the App Router version was not being recognized

2. Next.js configuration investigation
   - Examined `next.config.ts` and found it was using default settings
   - Next.js was not properly configured to recognize the `src` directory as the source directory
   - The issue stems from a setup where App Router content is in the `src` directory while Pages Router content is not

#### Resolution
- Updated `next.config.ts` to explicitly configure the source directory:
  ```typescript
  const nextConfig: NextConfig = {
    experimental: {
      appDir: true,
    },
    distDir: ".next",
    srcDir: "src",
  };
  ```
- This configuration tells Next.js to:
  1. Enable App Router explicitly (though it's enabled by default in Next.js 13+)
  2. Specify that source files are in the `src` directory
  3. Maintain the standard build output directory

#### Lessons Learned
- When migrating from Pages Router to App Router in Next.js, configuration must match your directory structure
- Using a non-standard directory structure requires explicit configuration
- When hosting in production environments like Vercel, routing conflicts need to be resolved completely
- It's important to test deployments after making changes to routing structure
- Next.js 13+ supports both routing systems simultaneously, but routes cannot overlap between systems