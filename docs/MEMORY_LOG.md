# Memory Log

## Purpose
This document tracks solutions attempted by AI for application issues. It prevents repetitive solution attempts by maintaining a history of approaches that have been tried.

## How to Use
1. Before attempting to solve an issue, check this log for similar problems
2. If a similar issue exists, review previous approaches before trying new solutions
3. If no similar issue exists, create a new entry using the template below
4. Add details of each solution attempt to the appropriate issue entry

## Entry Format
Each issue receives a unique ID (format: MRTMLY-XXX) and includes attempted approaches, outcomes, and relevant tags.

## Memory Template
```
### Issue: MRTMLY-XXX: [Brief Description]
- **Date:** YYYY-MM-DD
- **Attempted Approaches:**
  1. [Description of first approach]
  2. [Description of second approach]
- **Outcome:** [Final result]
- **Tags:** [Relevant keywords]
```

## Issue Log

### Issue: MRTMLY-001: Progress Bar Mobile Layout Enhancement
- **Date:** 2024-01-27
- **Tags:** #mobile #layout #progress-bar #optimization #responsive-design

#### Initial State
- Progress bar time markers positioned below the bar in mobile view
- Layout not optimized for mobile viewport
- Progress bar component had same behavior across all viewports

#### Implementation Process
1. Mobile-First Approach
   - Added mobile viewport detection with `window.matchMedia`
   - Implemented conditional rendering based on viewport size
   - Created mobile-specific CSS classes and styling

2. Time Markers Positioning
   - Moved time markers above progress bar in mobile view
   - Used flexbox order property for layout control
   - Maintained existing desktop layout

#### Resolution
- Successfully implemented mobile-optimized layout
- All tests passing (163/163)
- Maintained accessibility and theme compatibility
- No regressions in desktop view

#### Lessons Learned
- Using CSS order property provides clean DOM structure while allowing visual reordering
- Window.matchMedia with useEffect provides reliable viewport detection
- Test mocking for matchMedia is essential for reliable tests
- Mobile-specific styles should be clearly separated for maintainability

### Issue: MRTMLY-002: Vercel Deployment Verification Requirements
- **Date:** 2024-01-30
- **Tags:** #deployment #vercel #type-checking #quality-assurance
#### Initial State
- Need to ensure all code changes are Vercel-deployment ready
- Multiple verification steps required before considering work complete
#### Implementation Process
1. Required Verification Steps
   - Type checking with `npm run type-check` and `tsc`
   - Linting with `npm run lint`
   - All tests must pass
2. Implementation Guidelines
   - These checks must be run before considering any feature complete
   - All type errors must be resolved
   - All lint warnings must be addressed
   - No deployment-blocking issues should remain
#### Resolution
- Established clear verification process for all changes
- Added to standard workflow requirements
#### Lessons Learned
- Early verification prevents deployment issues
- Type checking catches potential runtime errors before deployment
- Linting ensures code quality and consistency
- Multiple verification steps provide better reliability

### Issue: Timeline Component Countdown Timer Fix
**Date:** 2024-01-26
**Tags:** #debugging #timer #useEffect #cleanup
**Status:** Resolved

#### Initial State
- Countdown timer in Timeline component stopped updating
- Timer display was not properly reflecting elapsed time
- Interval cleanup was not properly handled

#### Debug Process
1. Investigation of timer implementation
   - Found issue with useTimeDisplay hook using unnecessary refs
   - Identified missing interval cleanup in Timeline component
   - Discovered timing edge cases in elapsed time calculation

2. Solution implementation
   - Simplified useTimeDisplay hook to respond directly to prop changes
   - Added proper interval cleanup in both Timeline and useTimeDisplay
   - Implemented immediate timer update on start
   - Standardized elapsed time calculation using Math.floor

#### Resolution
- Timer now updates reliably every second
- Proper cleanup of intervals when component unmounts or timer stops
- Consistent timing calculations prevent state update misses
- All Timeline component tests passing

#### Lessons Learned
- Always ensure proper cleanup in useEffect hooks with timers
- Prefer direct prop dependencies over ref-based implementations for timer updates
- Important to handle immediate updates when starting timers to prevent initial delay
- Use consistent time calculations (Math.floor) to prevent timing edge cases

### Issue: Summary Component Test Suite Refactor
**Date:** 2024-02-06
**Tags:** #testing #refactoring #edge-cases #performance
**Status:** Resolved

#### Initial State
- Some tests were testing component visibility, which is handled by page component
- Missing edge cases in time calculation tests
- No performance tests for large activity sets
- Test structure needed improvement for better organization

#### Debug Process
1. Component Responsibility Analysis
   - Identified Summary's core responsibilities
   - Found overlap with page component's visibility control
   - Located critical time calculation edge cases

2. Test Coverage Review
   - Identified redundant visibility tests
   - Found gaps in time calculation edge cases
   - Discovered need for performance testing

#### Resolution
1. Removed redundant visibility tests that overlapped with page component
2. Added comprehensive edge case tests:
   - Zero duration activities
   - Single activity sessions
   - Sessions with only breaks
   - Maximum duration values
3. Added performance test with 100 activities
4. Improved test organization with logical groupings:
   - Time Metrics Display
   - Status Messages
   - Time Up State
   - Performance
   - Edge Cases

#### Lessons Learned
- Component tests should focus on component-specific responsibilities
- Page-level behavior should be tested at the page level
- Edge cases in time calculations need explicit testing
- Performance benchmarks help prevent regression in data-heavy components
- Test organization should reflect component's logical responsibilities

### Issue: Summary Component Status Message Bug Fix
**Date:** 2024-02-06
**Tags:** #bugfix #testing #ui #state-management
**Status:** Resolved

#### Initial State
- Status messages weren't correctly reflecting time differences
- Messages defaulted to "Great job!" even when over planned duration
- Small overtime durations (e.g., 2 seconds) weren't showing correct message
- Unnecessary complexity with "on time" state and 60-second threshold

#### Debug Process
1. Status Message Logic Analysis
   - Found unnecessary complexity in status message conditions
   - Identified incorrect order of time difference checks
   - Located threshold-based logic causing improper message selection
   - Discovered issue with mock timeline entries affecting test accuracy

2. Implementation Approach
   - Simplified status message states to just early/late completion
   - Removed unnecessary "on time" state and threshold
   - Fixed time calculation tests to use accurate timeline entries
   - Updated test suite to verify small time differences

#### Resolution
1. Simplified Logic Implementation
   - Removed 60-second threshold for "on time" state
   - Simplified to two states: early or late completion
   - Fixed time difference calculation checks
   - Added test for 2-second overtime scenario

2. Test Improvements
   - Added specific test case for small overtime durations
   - Updated timeline entry mocks to match test scenarios
   - Verified overtime message shows for any duration > 0
   - Maintained existing test coverage while simplifying logic

#### Lessons Learned
- Simpler state management often leads to more reliable behavior
- Edge cases (like exact-time completion) can be eliminated when improbable
- Test data should match real-world scenarios as closely as possible
- Small time differences need explicit test coverage

### Issue: Test-Friendly Reset Functionality with Custom Dialog
**Date:** 2025-03-24
**Tags:** #testing #dialog #reset #refactoring
**Status:** Resolved

#### Initial State
- Application reset functionality used window.location.reload() which is not test-friendly
- Reset confirmation relied on native browser confirm dialog
- Tests had to mock window.confirm explicitly for each test case

#### Implementation Process
1. Reset Service Design
   - Created a central resetService utility
   - Implemented callback-based reset system instead of page reload
   - Added support for configurable confirmation behavior
   - Made service fully testable with proper TypeScript typing

2. Custom Dialog Implementation
   - Built ConfirmationDialog component using HTML `<dialog>` element
   - Created React.forwardRef API for imperatively showing the dialog
   - Added support for custom confirm/cancel text
   - Implemented Promise-based confirmation pattern

3. Home Component Integration
   - Updated Home component to register reset callbacks
   - Integrated custom dialog with resetService
   - Made dialog state management stable across renders

4. Test Suite Enhancements
   - Created comprehensive tests for resetService
   - Added tests for ConfirmationDialog component
   - Updated Home component tests to use mock dialog
   - Fixed TypeScript and linting issues

#### Resolution
- Successfully replaced window.location.reload() with a test-friendly implementation
- Added a more user-friendly and stylable custom dialog
- All tests passing (181 tests across 22 test suites)
- Preserved backward compatibility with a fallback to window.confirm if no dialog callback is provided

#### Lessons Learned
- HTML dialog element provides a clean way to create modal dialogs without third-party libraries
- Promise-based patterns work well for asynchronous user confirmations
- Centralized services help make code more testable by removing direct browser API dependencies
- Prefer callback registration over direct function calls for more flexible code architecture

### Issue: Service Worker Test Build Error Fix
**Date:** 2025-03-24
**Tags:** #debugging #tests #typescript #linting
**Status:** Resolved

#### Initial State
- Build failing due to TypeScript linting error
- Unused interface `MockServiceWorkerContainer` in serviceWorkerRegistration.test.ts
- Error message: "'MockServiceWorkerContainer' is defined but never used"

#### Debug Process
1. Code Analysis
   - Identified unused interface in test file
   - Confirmed interface wasn't necessary for test functionality

2. Solution Implementation
   - Removed unused interface while preserving test functionality
   - Kept type safety through implicit typing of mock objects

#### Resolution
- Removed unused interface
- Build passes successfully with all type checks and linting
- All tests continue to pass with proper type safety

#### Lessons Learned
- Keep test mock types minimal and remove unused type definitions
- TypeScript interfaces should be used only when explicitly needed
- Implicit typing can be sufficient for simple mock objects in tests

### Issue: Header Component Mobile Layout Enhancement
**Date:** 2025-03-24
**Tags:** #mobile #layout #header #accessibility #testing
**Status:** Resolved

#### Initial State
- Header components lacked proper touch target sizes
- Layout not optimized for mobile screens
- Test suite relied on computed styles causing unreliable tests

#### Implementation Process
1. Header Layout Optimization
   - Implemented fixed minimum dimensions (44px) for touch targets
   - Adjusted spacing and padding for mobile view
   - Ensured proper stacking of header elements

2. ThemeToggle Component Updates
   - Added explicit touch target sizing
   - Optimized button spacing for mobile
   - Maintained theme switching functionality

3. Test Suite Improvements
   - Moved from computed style checks to class-based assertions
   - Added specific mobile viewport test cases
   - Improved test reliability and maintainability

#### Resolution
- Successfully implemented mobile-friendly header layout
- All tests passing with improved reliability
- Maintained WCAG compliance for touch targets
- Preserved desktop layout compatibility

#### Lessons Learned
- Prefer class-based assertions over computed style checks in Jest
- Use explicit dimensions for touch targets rather than relative sizes
- Consider mobile breakpoints early in component design
- Document mobile-specific style requirements in tests

### Issue: Offline Indicator Layout and Test Optimization
**Date:** 2025-03-24
**Tags:** #layout #testing #accessibility #mobile
**Status:** Resolved

#### Initial State
- Offline indicator overlapped with header due to fixed positioning
- Tests relied on computed styles causing brittle assertions
- CSS module class testing was unreliable in Jest environment

#### Implementation Process
1. Layout Restructuring
   - Moved offline indicator between header and content
   - Removed fixed positioning in favor of natural document flow
   - Added proper margin for spacing from content
   - Maintained animation for smooth appearance

2. Component Structure Enhancement
   - Added proper nested structure for content
   - Improved semantic HTML with status role
   - Maintained consistent theme integration

3. Test Suite Improvements
   - Moved from computed style checks to structure verification
   - Added explicit tests for component hierarchy
   - Improved test reliability and maintainability
   - Removed brittle CSS module class tests

#### Resolution
- Successfully repositioned offline indicator without overlap
- All tests passing with improved reliability
- Maintained accessibility and semantic structure
- Preserved responsive layout and animations

#### Lessons Learned
- Prefer testing component structure over computed styles in Jest
- Use natural document flow over fixed positioning when possible
- Consider component positioning in the overall page layout
- Document element role and semantic structure in tests

### Issue: Deployment Build Failing Due to CommonJS Require
**Date:** 2025-03-24
**Tags:** #deployment #testing #eslint #typescript
**Status:** Resolved

#### Initial State
- Build failing during deployment with ESLint error
- Error in page.test.tsx: "A `require()` style import is forbidden"
- Using CommonJS require() for dynamic mock during test

#### Debug Process
1. Issue Investigation
   - Located problematic code in OfflineIndicator integration test
   - Found inline jest.mock() using require() style import
   - ESLint rule @typescript-eslint/no-require-imports triggered failure

2. Solution Implementation
   - Moved mock setup to top-level with other mocks
   - Created reusable mockUseActivityState function
   - Used mockImplementationOnce for state-specific mocks
   - Maintained test functionality while following ES module patterns

#### Resolution
- Refactored test to use ES module imports
- Created centralized mock setup
- Verified build passes without ESLint errors
- Maintained test coverage and functionality

#### Lessons Learned
- Always use ES module imports in Next.js projects
- Keep mocks at top-level when possible
- Use mockImplementation/mockImplementationOnce for dynamic mocks
- Verify build process locally before deployment