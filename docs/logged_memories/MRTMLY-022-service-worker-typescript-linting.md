### Issue: MRTMLY-027: Service Worker Utils TypeScript Linting Fix
**Date:** 2025-04-02
**Tags:** #typescript #linting #service-worker #testing #type-safety
**Status:** Resolved

#### Initial State
- TypeScript linting errors in src/utils/testUtils/serviceWorkerUtils.ts:
  - Line 29:43 - Using generic `Function` type instead of specific function signature
  - Line 30:49 - Using generic `Function` type instead of specific function signature
- Error reported: "@typescript-eslint/no-unsafe-function-type" - The `Function` type accepts any function-like value and doesn't provide proper type safety
- Code was functional but didn't follow type-safety best practices

#### Debug Process
1. Initial investigation
   - Identified that the issue was in two Map declarations storing event listeners:
     ```typescript
     const globalListeners = new Map<string, Function[]>();
     const registrationListeners = new Map<string, Function[]>();
     ```
   - The generic `Function` type was being used which violates the linting rule requiring more specific function signatures
   - This was causing TypeScript linting errors that would block deployment

2. Solution implementation
   - Created a specific type definition for the event listeners:
     ```typescript
     type ServiceWorkerEventListener = (event?: Event) => void;
     ```
   - Updated the Maps to use this more specific type:
     ```typescript
     const globalListeners = new Map<string, ServiceWorkerEventListener[]>();
     const registrationListeners = new Map<string, ServiceWorkerEventListener[]>();
     ```
   - Additionally fixed a related type issue with the `onupdatefound` property:
     ```typescript
     onupdatefound: null as ServiceWorkerEventListener | null,
     ```

#### Resolution
- Final solution implemented:
  - Created specific `ServiceWorkerEventListener` type to replace generic `Function` type
  - Updated all references to use the new type
  - Explicitly typed the `onupdatefound` property to ensure it could be called correctly
- Linting errors successfully resolved and type safety improved
- Test validation confirms changes maintain existing functionality

#### Lessons Learned
- Key insights:
  - Generic `Function` type in TypeScript should be avoided in favor of specific function signatures
  - TypeScript's linting rules help enforce type safety best practices
  - When fixing type issues, it's important to check related code that might be affected by type changes
- Future considerations:
  - Consider adding documentation for TypeScript event listener typing patterns in the codebase
  - Review other test utilities for similar type safety issues
  - Add specific TypeScript linting checks to pre-commit hooks to catch these issues earlier