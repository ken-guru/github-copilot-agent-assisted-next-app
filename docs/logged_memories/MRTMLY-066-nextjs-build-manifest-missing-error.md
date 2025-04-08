### Issue: Next.js Missing Build Manifest File Error
**Date:** 2025-04-08
**Tags:** #debugging #next-js #deployment #build-error
**Status:** In Progress

#### Initial State
- Next.js application failing with ENOENT error:
  ```
  ⨯ [Error: ENOENT: no such file or directory, open '/Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/.next/server/app/_not-found/page/app-build-manifest.json'] {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: '/Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/.next/server/app/_not-found/page/app-build-manifest.json'
  }
  ```
- Error indicates Next.js is trying to access a build manifest file in the `_not-found` directory that doesn't exist
- This follows the resolution of a routing conflict between Pages Router and App Router (see MRTMLY-065)

#### Debug Process
1. Build system analysis
   - Error occurs when Next.js is attempting to load the app-build-manifest.json
   - The missing file is specifically for the not-found page in the App Router
   - This suggests that the build process was interrupted or incomplete

2. Investigation of potential causes
   - Recent configuration change to `next.config.ts` (adding srcDir setting)
   - Incomplete transition from Pages Router to App Router
   - Missing or incomplete implementation of custom error/not-found pages in App Router structure

3. Solution attempts
   - Deleted `.next` directory to ensure a clean build
   - Ran `npm run build` to regenerate all build artifacts
   - Verified App Router directory structure follows Next.js conventions with required files

#### Resolution (if reached)
- [To be completed after resolution]

#### Lessons Learned
- Build artifacts can become inconsistent when switching between routing systems
- Custom error pages need special attention during Pages Router to App Router migration
- The `_not-found` page is a required component in Next.js App Router that must be properly implemented
- After configuration changes, a clean build is often necessary to avoid artifacts from previous configurations
