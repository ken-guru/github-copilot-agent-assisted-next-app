### Issue: MRTMLY-034: Time Utils TypeScript Linting Fix
**Date:** 2025-04-02
**Tags:** #typescript #linting #testing #time-utils #type-safety
**Status:** Resolved

#### Initial State
- TypeScript linting errors in src/utils/testUtils/timeUtils.ts:
  - Line 74:50 - Using generic `Function` type instead of specific function signature
  - Line 78:42 - Using generic `Function` type instead of specific function signature
- Error reported: "@typescript-eslint/no-unsafe-function-type" - The `Function` type accepts any function-like value and doesn't provide proper type safety
- Code was functional but didn't follow type-safety best practices

#### Debug Process
1. Initial investigation
   - Identified that the issue was in the timer mock implementation:
     ```typescript
     const timeoutMap = new Map<number, { callback: Function; delay: number; startTime: number }>();
     global.setTimeout = jest.fn((callback: Function, delay: number) => {
     ```
   - The generic `Function` type was being used which violates the linting rule requiring more specific function signatures
   - This was causing TypeScript linting errors that could block deployment

2. Solution implementation
   - Created a specific type definition for timer callbacks:
     ```typescript
     type TimerCallback = (...args: any[]) => void;
     ```
   - Updated Map and setTimeout to use this more specific type
   - Encountered additional TypeScript errors related to the Node.js timer interfaces
   - Needed to ensure our mocked timer functions matched the exact TypeScript signatures expected

3. Final solution
   - Completely refactored the timer mock implementation:
     - Created properly typed mock functions for setTimeout and clearTimeout
     - Added the required `__promisify__` property to match the Node.js setTimeout interface
     - Ensured proper handling of NodeJS.Timeout objects
     - Used type assertions to correctly match the global timer interfaces

#### Resolution
- Final solution implemented:
  - Created specific `TimerCallback` type to replace generic `Function` type
  - Implemented correctly typed timer mocks that match the Node.js interfaces
  - Used proper type annotations and assertions to ensure type compatibility
- Linting errors successfully resolved and type safety improved
- Test validation confirms changes maintain existing functionality

#### Lessons Learned
- Key insights:
  - Generic `Function` type in TypeScript should be avoided in favor of specific function signatures
  - When mocking built-in JavaScript functions, it's important to match the TypeScript interface definitions exactly
  - Node.js timer interfaces have specific properties (like `__promisify__`) that must be implemented
  - Type assertions should be used carefully to ensure mocked functions match their original interfaces
- Future considerations:
  - Consider creating a reusable pattern for mocking browser/Node.js APIs in testing utilities
  - Document the specific TypeScript interface requirements for commonly mocked functions
  - Review other test utilities for similar type safety issues
  - Standardize the approach for timer mocking across the codebase