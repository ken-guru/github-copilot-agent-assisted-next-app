### Issue: MRTMLY-033: ThemeProvider Test Suite Integration
**Date:** 2025-03-31
**Tags:** #testing #theme #context #dark-mode #test-suite-fixes
**Status:** Resolved

#### Initial State
- Multiple test failures with consistent error: "useTheme must be used within a ThemeProvider"
- Components using the `useTheme` hook in tests weren't properly wrapped with ThemeProvider
- The `renderWithTheme` utility existed but wasn't used consistently across all test files
- ThemeToggle system preference test was failing due to timing issues with theme changes

#### Debug Process
1. Initial investigation of theme context implementation
   - Examined the `useTheme` hook implementation and error handling
   - Found that components using the hook need to be wrapped in a `ThemeProvider`
   - Located existing `renderWithTheme` utility in `/src/test/utils/renderWithTheme.tsx`
   - Identified affected test files that weren't using the utility

2. Updating test files to use renderWithTheme
   - Modified `ProgressBar.test.tsx` to use `renderWithTheme` instead of the standard render
   - Updated `Timeline.breaks.test.tsx` to use `renderWithTheme`
   - Updated `Timeline.render.test.tsx` to use `renderWithTheme`
   - Initial outcome: Most tests passing, but one ThemeToggle test still failing

3. ThemeToggle system preference test fix
   - Problem: The test was simulating a system preference change but not handling async theme update timing
   - Found that `ThemeToggle` component uses `setTimeout` for theme validation
   - Added Jest fake timers to properly control timing in the test
   - Modified the test to properly run pending timers after simulating the system preference change
   - Outcome: ThemeToggle test now passing

#### Resolution
- Successfully fixed all failing tests by:
  1. Consistently using `renderWithTheme` utility across all test files
  2. Properly handling asynchronous theme changes in ThemeToggle test
  3. Verifying that components using `useTheme` are properly wrapped during testing
- The team now has a consistent approach for testing components that use theme context

#### Lessons Learned
- Key insights:
  - When using React context in components, always ensure test renders wrap components appropriately
  - Test utilities like `renderWithTheme` should be used consistently across the test suite
  - Asynchronous operations (like theme changes with `setTimeout`) need proper handling in tests
  - Jest's fake timers are essential for controlling timing in tests with delayed operations
  
- Future considerations:
  - Consider adding automated test linting to enforce the use of `renderWithTheme` for components that use theme context
  - Document the requirement to use `renderWithTheme` in the test documentation
  - Implement a central Test Provider component that combines all context providers needed for tests
  - Set up ESLint rules to catch improper test usage of context-dependent components