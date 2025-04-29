# MRTMLY-054: Layout Testing Hydration Error Fix

**Date:** 2025-04-10
**Tags:** #testing #layout #hydration-error #next-js #jest
**Status:** In Progress

## Initial State
- Tests for the RootLayout component are causing a hydration error
- Error message: "In HTML, \<html\> cannot be a child of \<div\>. This will cause a hydration error."
- The issue is related to testing Next.js app router layout components which return \<html\> elements
- React Testing Library's `render()` function places components in a \<div\> container
- HTML doesn't allow nesting \<html\> inside a \<div\>, causing the error

## Debug Process
1. First investigation
   - Identified the error was coming from line 62 in the layout test file
   - Error occurs when trying to render a Next.js layout component that returns an \<html\> tag
   - React Testing Library tries to render this inside a \<div\> container
   - This creates invalid HTML structure, triggering the error

2. Initial solution attempt
   - Created a new `Component Structure` section with tests that inspect the component structure
   - Used a temporary mock of React.createElement to capture the component structure
   - Inspected the generated element tree without actually rendering it
   - This approach successfully tested the component structure without causing hydration errors

3. Remaining issue
   - There's still a separate `Component Rendering` section using direct rendering
   - This section needs to be removed or modified to avoid rendering the \<html\> tag

## Resolution (in progress)
- Need to update or remove the remaining `Component Rendering` tests
- Will replace direct rendering with the structure inspection approach
- Will ensure all tests maintain the same coverage and assertions

## Current Solution Approach
Replace all direct rendering tests with structure inspection tests that:
- Examine the component structure without rendering it in a DOM container
- Verify all important aspects like HTML attributes, body class names, and child components
- Maintain the same level of test coverage without causing hydration errors
