### Issue: Import Alias Resolution Error in Next.js
**Date:** 2025-04-08
**Tags:** #debugging #next-js #imports #module-resolution #typescript
**Status:** In Progress

#### Initial State
- Application is showing 500 error when accessing http://localhost:3000/
- Terminal showing module resolution error: "Module not found: Can't resolve '@/contexts/LoadingContext'"
- Next.js attempts to resolve @/ alias to './src/' but fails to find the modules
- Import map shows it's being aliased to './src/contexts/LoadingContext' which seems correct but isn't working

#### Debug Process
1. Investigating the module resolution error
   - Error occurs when trying to import using the @/ path alias in src/app/page.tsx
   - The error specifically mentions LoadingContext but likely affects all @/ imports
   - Next.js is correctly identifying the alias mapping to './src/' but can't resolve the files

2. Examining tsconfig.json and next.config.ts for path configuration
   - Need to verify path aliases are correctly configured in tsconfig.json
   - Check if there's any conflicting configuration in next.config.ts
   - Determine if the issue is with the alias configuration or file structure

3. Identified directory structure mismatch
   - LoadingContext.tsx exists in /contexts/ directory at project root
   - Import statement in src/app/page.tsx is using @/contexts/LoadingContext
   - @/ alias correctly maps to ./src/ but src/contexts/ directory doesn't exist
   - This mismatch is causing the 500 error when trying to load the application

4. Potential solutions
   - Option 1: Move components from root directories to src/ directory structure
   - Option 2: Update tsconfig.json paths to point to the root directories
   - Option 3: Update import statements to use relative paths
   
   Implementing Option 2 since it requires minimal changes and maintains the existing project structure

#### Resolution
- Updated tsconfig.json path aliases to correctly map to the actual file structure:
  - Changed `@/*` to map to `./*` instead of `./src/*`
  - Added specific path mappings for different module types (`@/contexts/*`, `@/components/*`, etc.)
  - Included fallback paths to support both root and src directory structures

- Updated next.config.ts to match the path alias configuration:
  - Added corresponding alias mappings in the turbo.resolveAlias section
  - Enhanced webpack configuration to use the same aliases
  - Ensured both build systems (turbopack and webpack) have consistent path resolution

- Verified solution by restarting the Next.js development server
  - Server started successfully with no module resolution errors
  - Application now loads correctly at http://localhost:3000

#### Lessons Learned
- Path aliases must be consistent between tsconfig.json and next.config.ts
- When working with hybrid directory structures (some files in root, some in src/), alias configuration needs special attention
- Next.js 15+ requires configuration in both webpack and turbopack sections for complete compatibility
- Import paths in the codebase should follow a consistent pattern that matches the configured aliases
- When troubleshooting module resolution errors, always check:
  1. The actual file structure
  2. The path alias configuration in tsconfig.json
  3. The webpack/turbopack configuration in next.config.ts
  4. The import statements in the code
