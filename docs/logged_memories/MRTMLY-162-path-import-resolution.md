# MRTMLY-008: Path Import Resolution for App Router

**Date:** 2025-04-08
**Tags:** #debugging #import-paths #app-router #build-error
**Status:** Resolved

## Initial State

The Next.js application was encountering build errors after resolving the routing conflict between Pages Router and App Router. The new error was related to import paths:

```
Type error: Cannot find module '@/contexts/LoadingContext' or its corresponding type declarations.

  1 | 'use client';
  2 | import { useState, useEffect, useRef } from 'react';
> 3 | import { LoadingProvider, useLoading } from '@/contexts/LoadingContext';
    |                                             ^
```

## Debug Process

1. First investigation step
   - Examined the paths of all imports in `src/app/page.tsx`
   - Found that the `@/` alias was being used, which typically points to the `src/` directory
   - Identified that `LoadingContext` was not in the expected location based on the import path

2. Solution attempts
   - Used file search to locate the actual paths of all components being imported
   - Discovered that `LoadingContext` was in the root `contexts/` directory, not in `src/contexts/`
   - Found that `SplashScreen` was in the root `components/splash/` directory
   - Determined that most other components like `TimeSetup`, `ActivityManager`, etc. were in `src/components/` directory

3. Implementation
   - Updated the import paths in `src/app/page.tsx` to use the correct relative paths:
     - Root components: `../../component/path`
     - src components: `../component/path`

## Resolution

Fixed all import paths in `src/app/page.tsx` to correctly point to the component locations:

1. Root directory components:
   ```typescript
   import { LoadingProvider, useLoading } from '../../contexts/LoadingContext';
   import { SplashScreen } from '../../components/splash/SplashScreen';
   ```

2. src directory components:
   ```typescript
   import TimeSetup from '../components/TimeSetup';
   import ActivityManager from '../components/ActivityManager';
   // etc.
   ```

The build now completes successfully with no type errors.

## Lessons Learned

1. Project structure analysis is crucial when resolving import path issues
2. Mixed directory structures (some components in root, others in src/) require careful path management
3. When using the App Router with existing codebases, import paths may need to be adjusted based on the actual file locations
4. The `@/` alias in Next.js typically points to the `src/` directory, so components outside this directory need relative paths
5. Always verify component locations before updating import paths