### Issue: Build Process with Typescript Errors in Cypress Tests
**Date:** 2025-04-28
**Tags:** #debugging #typescript #cypress #build
**Status:** Resolved

#### Initial State
- Build was failing due to TypeScript errors in Cypress test files
- Even after fixing individual errors, new TypeScript errors kept appearing
- Project needed a solution to reliably build without being affected by Cypress TypeScript errors

#### Debug Process
1. Analysis of build failures
   - Identified that Cypress test files were causing TypeScript errors during Next.js build
   - Fixed individual errors including service worker registration typing issues
   - Realized we needed a more systematic approach for the build process
   
2. Solutions exploration
   - Considered adding explicit TypeScript ignore comments
   - Tried creating a separate tsconfig.json for Cypress (which helped with IDE support)
   - Looked into excluding Cypress files from the main build process

#### Resolution
1. Created an extended build script:
   - Developed a custom `scripts/extended-build.js` that temporarily excludes Cypress files
   - The script backs up the original tsconfig.json, modifies it to exclude Cypress files
   - It then runs the build and restores the original config when done

2. Updated package.json:
   - Added new `build:extended` script to run our custom build
   - Updated the `clean-build` script to use our extended build approach
   - Kept the original build command for local development

3. Final build configuration structure:
   - Main tsconfig.json remains clean for development purposes
   - Cypress has its own tsconfig.json with specific settings
   - The build process dynamically modifies config when needed

#### Lessons Learned
- Test files that are only used for testing shouldn't interfere with production builds
- Creating separate TypeScript configurations for different parts of the codebase is good practice
- Build scripts can dynamically modify configurations to solve specific problems
- Next.js doesn't have built-in exclusions for test files, requiring custom solutions
- Maintaining separate configurations for test tools like Cypress helps with long-term maintenance
