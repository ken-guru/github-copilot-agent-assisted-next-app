### Issue: SplashScreen Test Failures Debugging Session
**Date:** 2023-09-15
**Tags:** #debugging #tests #splash-screen #css-modules
**Status:** Resolved

#### Initial State
- Two failing tests in the SplashScreen component test file:
  1. The minimum display time test fails: the splash screen isn't correctly hiding after the minimum time passes
  2. A class name mismatch in the theme test: expected 'splash-screen' but received 'splashScreen'
- These failures are preventing the completion of the splash screen implementation

#### Debug Process
1. Class name mismatch investigation
   - The test was expecting a kebab-case class name ('splash-screen')
   - The actual CSS module uses camelCase ('splashScreen')
   - The mismatch occurs because we're using CSS modules, which maintain camelCase in the imported styles object

2. Minimum display time test failures
   - The issue appears to be with how the test was updating the loading state
   - The component wasn't correctly responding to loading state changes in the mock
   - We needed to use a more specific mock implementation approach to properly simulate state changes
   - Using a local variable to track mock state value and updating it between renders

#### Resolution
1. CSS class name issue:
   - Added explicit CSS module mocking to ensure class names match between test and implementation
   - Updated the test to expect 'splashScreen' instead of 'splash-screen' to match the CSS module convention

2. Minimum display time test:
   - Improved mock implementation of the useLoading hook to properly track state changes
   - Used a local variable to control the mock's return value between renders
   - Ensured proper test scheduling with jest.advanceTimersByTime
   - Verified component correctly maintains display during minimum time, then hides after
   
3. Enhanced test robustness:
   - Used rerender to properly simulate component updates
   - Added clearer state transitions in the tests

#### Lessons Learned
- When testing components that use CSS modules, explicit mocking of the modules is often necessary
- CSS module class names use camelCase in JavaScript but may be kebab-case in the actual CSS
- For components that rely on context and timing behaviors, more complex mocking strategies are needed
- When dealing with time-based tests, ensure that all timing effects are properly accounted for
- React's state update cycle combined with setTimeout can be tricky to test - ensure proper act() wrapping and timing advancement

### Issue: LoadingContext Type Error Debugging Session
**Date:** 2023-09-20
**Tags:** #debugging #context #typescript
**Status:** Resolved

#### Initial State
- Deployment error due to a type error in `LoadingContext`:
  ```
  Type error: Type 'LoadingContextType' is missing the following properties from type 'Context<LoadingContextType | undefined>': Provider, Consumer, $$typeof
  ```

#### Debug Process
1. Investigated the type error in `LoadingContext`
   - The `LoadingContext` type was missing the `Provider`, `Consumer`, and `$$typeof` properties
   - The context was not correctly typed as `Context<LoadingContextType | undefined>`

2. Updated the `LoadingContext` type
   - Added the missing properties to the `LoadingContext` type
   - Ensured the `LoadingContext` is correctly typed as `Context<LoadingContextType | undefined>`

3. Created a new `useLoading` hook
   - Defined and exported the `useLoading` hook
   - Ensured the hook uses the `LoadingContext` and throws an error if used outside of a `LoadingProvider`

4. Updated tests for `LoadingContext` and `useLoading` hook
   - Updated tests to ensure the `LoadingContext` is correctly typed and used
   - Added tests for the new `useLoading` hook to ensure it throws an error when used outside of a `LoadingProvider`

#### Resolution
1. Updated `LoadingContext` type:
   - Added `Provider`, `Consumer`, and `$$typeof` properties to the `LoadingContext` type
   - Ensured the `LoadingContext` is correctly typed as `Context<LoadingContextType | undefined>`

2. Created `useLoading` hook:
   - Defined and exported the `useLoading` hook
   - Ensured the hook uses the `LoadingContext` and throws an error if used outside of a `LoadingProvider`

3. Updated tests:
   - Updated tests to ensure the `LoadingContext` is correctly typed and used
   - Added tests for the new `useLoading` hook to ensure it throws an error when used outside of a `LoadingProvider`

#### Lessons Learned
- Ensure context types include all necessary properties (`Provider`, `Consumer`, `$$typeof`)
- When creating custom hooks that use context, ensure they throw errors if used outside of the appropriate provider
- Update tests to cover new hooks and ensure proper context usage
