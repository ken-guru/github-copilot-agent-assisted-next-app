# Planned Changes Prompt Template
This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation. Once implemented, move the change to IMPLEMENTED_CHANGES.md with a timestamp.

## Change Request Template
```markdown
# Feature/Change Title

## Context
Provide context about the part of the application this change affects.
- Which components/utilities are involved?
- What current behavior needs to change?
- What user needs does this address?

## Requirements
Detailed specifications for the change:
1. First requirement
   - Implementation details
   - Technical considerations
   - Testing requirements
2. Second requirement
   - Sub-points
   - Edge cases to handle
3. Additional requirements as needed

## Technical Guidelines
- Framework-specific considerations
- Performance requirements
- Accessibility requirements
- Theme compatibility requirements
- Testing approach

## Expected Outcome
Describe what success looks like:
- User perspective
- Technical perspective
- Testing criteria

## Validation Criteria
- [ ] Test cases written
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Theme compatibility verified
- [ ] Documentation updated
```

Note: When implementing a change, copy this template and fill it out completely. The more detailed the prompt, the better the AI assistance will be in implementation.

# Development Process Guidelines

## Sequential Implementation
- Work on one change at a time - never move to the next item until the current one is complete
- Complete all validation criteria for the current task before starting a new one
- Avoid parallel development to prevent code conflicts and maintain focus
- For multi-phase changes (like the Time Utilities Consolidation below), complete each phase fully before starting the next
- Mark completed items in the validation criteria as they are finished

## Testing Requirements
- Each implementation must include appropriate tests before considering it complete
- Tests should be written before or alongside implementation (Test-Driven Development)
- All tests must pass before a change is considered complete

## Documentation
- Update documentation alongside code changes
- Document all key decisions made during implementation
- Update the Memory Log for all significant changes or bug fixes

# Planned Changes - Code Refactoring for Large Files

## Overview

To reduce AI model token consumption and improve code maintainability, we need to refactor files exceeding 200 lines. This document outlines the files that need refactoring and proposes strategies based on file types.

## Refactoring Progress Tracker

| File | Status | Priority | Progress | Next Steps |
|------|--------|----------|----------|------------|
| `/src/utils/timeUtils.ts` | ✅ COMPLETED | HIGH | 100% | N/A |
| `/src/utils/serviceWorkerRegistration.ts` | ✅ COMPLETED | HIGH | 100% | N/A |
| `/src/utils/__tests__/serviceWorkerRegistration.test.ts` | ✅ COMPLETED | HIGH | 100% | N/A |
| `/next.config.js` | ✅ COMPLETED | HIGH | 100% | N/A |
| `/public/service-worker.js` | ✅ COMPLETED | MEDIUM | 100% | N/A |
| `/src/components/ActivityManager.tsx` | 🔄 IN PROGRESS | MEDIUM | 10% | Complete analysis phase |
| `/src/app/page.module.css` | ⏱️ PENDING | LOW | 0% | Awaiting completion of JS/TS refactoring |
| `/src/components/Timeline.module.css` | ⏱️ PENDING | LOW | 0% | Awaiting completion of JS/TS refactoring |
| `/src/components/Summary.module.css` | ⏱️ PENDING | LOW | 0% | Awaiting completion of JS/TS refactoring |
| `/src/components/__tests__/Summary.test.tsx` | ⏱️ PENDING | MEDIUM | 0% | Awaiting component refactoring |

## Files Exceeding 200 Lines

### JavaScript/TypeScript Files

1. **`/src/utils/serviceWorkerRegistration.ts`** [COMPLETED]
   - Current concerns:
     - Service worker registration logic
     - Update handling
     - Error handling
     - Network status detection
     - Retry mechanisms
   - Planned split:
     - `serviceWorkerCore.ts` - Core registration functionality
     - `serviceWorkerUpdates.ts` - Update handling
     - `serviceWorkerErrors.ts` - Error handling and reporting
     - `serviceWorkerRetry.ts` - Retry mechanisms
     - `serviceWorkerNetwork.ts` - Network status detection
   - Refactoring approach:
     1. ✅ Fix TypeScript errors in related files
     2. ✅ Complete file structure analysis to identify logical boundaries
     3. ✅ Create comprehensive tests for current functionality
     4. ✅ Create new directory structure in `/src/utils/serviceWorker/`
     5. ✅ Extract code by concern into separate files
     6. ✅ Create barrel file for backwards compatibility
     7. ✅ Update serviceWorkerRegistration.ts to re-export from new structure
     8. ✅ Update tests to use new structure

2. **`/public/service-worker.js`** [COMPLETED]
   - Current concerns:
     - Cache management
     - Fetch event handling
     - Installation/activation logic
     - Error handling
     - Offline fallbacks
   - Completed split:
     - ✅ `sw-cache-strategies.js` - Various caching strategies
     - ✅ `sw-fetch-handlers.js` - Request handling logic
     - ✅ `sw-lifecycle.js` - Installation and activation handlers
     - ✅ `sw-core.js` - Core service worker initialization
   - Remaining tasks:
     - [ ] Update main service worker entry point to import modular components
     - [ ] Verify integration with the full application

3. **`/src/components/ActivityManager.tsx`** [PENDING]
   - Current concerns:
     - State management
     - UI rendering
     - Event handling
     - Theme handling
   - Potential split:
     - `ActivityManagerCore.tsx` - Core component and state
     - `ActivityManagerUI.tsx` - UI rendering
     - `useActivityManagerState.ts` - Custom hook for state logic
     - `ActivityManagerTheme.tsx` - Theme-related functionality

4. **`/src/utils/timeUtils.ts`** [COMPLETED]
   - Successfully refactored into smaller, focused files
   - Divided into:
     - `/src/utils/time/types.ts`
     - `/src/utils/time/timeFormatters.ts`
     - `/src/utils/time/timeConversions.ts`
     - `/src/utils/time/timeDurations.ts`
     - `/src/utils/time/index.ts` (barrel file)
   - Original file now re-exports from new structure with deprecation notice
   - All tests passing with 100% backward compatibility
   - See IMPLEMENTED_CHANGES.md for details

### CSS Files

1. **`/src/app/page.module.css`** [PENDING]
   - Current concerns:
     - Layout styling
     - Component-specific styles
     - Media queries
     - Theme variables
   - Potential split:
     - `layout.module.css` - Core layout styles
     - `components.module.css` - Component-specific styles
     - `responsive.module.css` - Media query rules
     - Consider moving some styles to their respective component files

2. **`/src/components/Timeline.module.css`** [PENDING]
   - Current concerns:
     - Timeline visualization styles
     - Animation styles
     - Component-specific styles
     - Responsive design
   - Potential split:
     - `timeline-core.module.css` - Basic timeline styling
     - `timeline-animations.module.css` - Animation-specific styles
     - `timeline-responsive.module.css` - Mobile adaptations

3. **`/src/components/Summary.module.css`** [PENDING]
   - Current concerns:
     - Layout styles
     - Status message styles
     - Card styles
     - Responsive design
   - Potential split:
     - `summary-core.module.css` - Main component styles
     - `summary-cards.module.css` - Card-specific styles
     - `summary-responsive.module.css` - Mobile adaptations

### Test Files

1. **`/src/components/__tests__/Summary.test.tsx`** [PENDING]
   - Current concerns:
     - Render tests
     - State tests
     - Event tests
     - Performance tests
   - Potential split:
     - `Summary.render.test.tsx` - Rendering tests
     - `Summary.state.test.tsx` - State management tests
     - `Summary.events.test.tsx` - Event handling tests
     - `Summary.performance.test.tsx` - Performance tests

2. **`/src/utils/__tests__/serviceWorkerRegistration.test.ts`** [COMPLETED]
   - Successfully refactored and updated to work with the new modular structure
   - All tests pass with the new architecture

## Service Worker Registration Refactoring - Detailed Plan

The service worker registration refactoring is now complete. Here's a summary of what was accomplished:

### ✅ 1. Testing Phase - COMPLETED
- [x] Reviewed existing test coverage for service worker registration
- [x] Identified untested functionality in the current implementation
- [x] Created additional tests for:
  - [x] Core registration process
  - [x] Update detection and handling
  - [x] Error scenarios and recovery
  - [x] Network status change handling
  - [x] Retry mechanisms with different timing scenarios
- [x] Ensured tests are isolated and don't depend on implementation details
- [x] Documented test coverage metrics before refactoring

### ✅ 2. Structure Creation Phase - COMPLETED
- [x] Created directory structure:
  ```
  /src/utils/serviceWorker/
  ├── index.ts (barrel file)
  ```
- [x] Created initial type definitions in barrel file
- [x] Setup barrel file with all required exports

### ✅ 3. Code Extraction Phase - COMPLETED
- [x] Extracted core registration logic to `serviceWorkerCore.ts`
  - [x] Function: `register(config)`
  - [x] Function: `unregister()`
  - [x] Function: `registerValidSW()` 
  - [x] Function: `checkValidServiceWorker()`
- [x] Extracted update handling to `serviceWorkerUpdates.ts`
  - [x] Function: `handleRegistration()`
  - [x] Function: `checkForUpdates()`
  - [x] Function: `trackInstallation()`
- [x] Extracted error handling to `serviceWorkerErrors.ts`
  - [x] Function: `handleServiceWorkerError()`
  - [x] Function: `isLocalhost()`
  - [x] Function: `logCacheEvent()`
- [x] Extracted retry mechanisms to `serviceWorkerRetry.ts`
  - [x] Function: `registerWithRetry()`
  - [x] Function: `checkValidServiceWorker()`

### ✅ 4. Integration Phase - COMPLETED
- [x] Updated barrel file to export all functionality
- [x] Transformed original `serviceWorkerRegistration.ts` to:
  - [x] Re-export all functionality from the new structure
  - [x] Added deprecation notices with migration guidance
  - [x] Ensured full backward compatibility
- [x] Updated any direct imports in the codebase
- [x] Ensured all tests pass with the new structure

### ✅ 5. Documentation Phase - COMPLETED
- [x] Created Memory Log entries documenting the refactoring process
- [x] Documented key decisions made during the refactoring
- [x] Updated API documentation for the service worker utilities

### ✅ 6. Final Review - COMPLETED
- [x] Verified runtime performance is maintained or improved
- [x] Checked for any regressions in service worker functionality
- [x] Updated progress tracker in PLANNED_CHANGES.md
- [x] Added entries to IMPLEMENTED_CHANGES.md with timestamp

### ✅ 7. Test Type Safety and Linting - COMPLETED
- [x] Fixed TypeScript errors in test files
- [x] Fixed ESLint errors in test files
- [x] Improved type safety with proper interfaces and type assertions
- [x] Documented the process in Memory Log entries

## Next.js Configuration Updates - COMPLETED

We've improved the Next.js configuration to resolve warnings and test failures:

### ✅ 1. Turbopack Configuration Fix - COMPLETED
- [x] Removed invalid `loaders` property from the `turbopack` configuration
- [x] Added required `rules` and `resolveAlias` properties for test compatibility
- [x] Documented changes in Memory Log

### ✅ 2. Server Actions Configuration Fix - COMPLETED
- [x] Updated `serverActions` from a boolean to an object with proper configuration
- [x] Added `bodySizeLimit` and `allowedOrigins` properties
- [x] Documented changes in Memory Log
- [x] Verified all tests are passing

## Current Target: Service Worker (SW) Refactoring

Now that the service worker registration refactoring is complete, we are proceeding with the service worker file refactoring:

### `/public/service-worker.js` Refactoring Plan - ETA: 7 days [COMPLETED]

#### 1. Analysis Phase - ETA: 2 days [COMPLETED]
- [x] Review current service worker implementation 
- [x] Identify logical separation points for caching strategies
- [x] Identify logical separation points for:
  - [x] Fetch handlers
  - [x] Lifecycle events
  - [x] Error handling
- [x] Document current behavior and test coverage

#### 2. Testing Preparation - ETA: 1 day [COMPLETED]
- [x] Enhance existing tests for caching strategies
- [x] Improve test console output
- [x] Create additional tests for fetch handlers
- [x] Create additional tests for lifecycle events
- [x] Document baseline performance metrics

#### 3. Structure Creation Phase - ETA: 1 day [COMPLETED]
- [x] Create the first modular file:
  ```
  /public/sw-cache-strategies.js
  ```
- [x] Create the next modular file:
  ```
  /public/sw-fetch-handlers.js
  ```
- [x] Create the next modular file:
  ```
  /public/sw-lifecycle.js
  ```
- [x] Create remaining file:
  ```
  /public/sw-core.js
  ```
- [x] Set up module pattern for service worker files
- [x] Create main entry point that imports all modules

#### 4. Implementation Phase - ETA: 2 days [COMPLETED]
- [x] Extract cache strategies to `sw-cache-strategies.js`
- [x] Extract fetch handlers to `sw-fetch-handlers.js`
- [x] Extract lifecycle events to `sw-lifecycle.js`
- [x] Maintain core service worker functionality in `sw-core.js`

#### 5. Testing and Documentation - ETA: 1 day [COMPLETED]
- [x] Verify all functionality works as expected
- [x] Document the new service worker structure
- [x] Update Memory Log with implementation details

## Next Target: ActivityManager.tsx Refactoring

Based on the completion of the service worker refactoring, we are now moving to:

### `/src/components/ActivityManager.tsx` Refactoring Plan - ETA: 10 days

#### 1. Analysis Phase - ETA: 3 days [IN PROGRESS - 30% COMPLETE]
- [x] Review current ActivityManager implementation
- [x] Identify logical separation points for:
  - [x] Core state management
  - [x] UI rendering concerns
  - [x] Event handling
  - [x] Theme integration
- [ ] Document current behavior and test coverage
- [ ] Create detailed test plan for new structure

#### 2. Testing Preparation - ETA: 2 days [PENDING]
- [ ] Enhance existing tests for ActivityManager
- [ ] Create additional tests for specific functionality that will be extracted
- [ ] Document baseline performance metrics

#### 3. Implementation Phase - ETA: 3 days [PENDING]
- [ ] Create the first extracted file:
  ```
  /src/components/ActivityManagerCore.tsx
  ```
- [ ] Create custom hook:
  ```
  /src/hooks/useActivityManagerState.ts
  ```
- [ ] Create UI rendering component:
  ```
  /src/components/ActivityManagerUI.tsx
  ```
- [ ] Update the main ActivityManager.tsx to use the new structure

#### 4. Testing and Documentation - ETA: 2 days [PENDING]
- [ ] Verify all functionality works as expected
- [ ] Document the new component structure
- [ ] Update Memory Log with implementation details

## CSS Refactoring - ETA: To be determined [DEFERRED]

Lower priority task to be scheduled after component refactoring
- Will focus on improving modularity and reducing CSS duplication
- Will coordinate with the UI team on the best approach

## Session Summary and Next Steps

### Completed Items
- ✅ Service Worker Registration refactoring (`/src/utils/serviceWorkerRegistration.ts`)
- ✅ Service Worker file refactoring (`/public/service-worker.js`)
- ✅ NextJS Configuration updates (`/next.config.js`)
- ✅ Time Utilities refactoring (`/src/utils/timeUtils.ts`)

### Current Progress
- 🔄 ActivityManager refactoring - Analysis phase (30% complete)

### Next Session Tasks
When resuming this refactoring work, the following steps should be taken:

1. **Complete ActivityManager Analysis**
   - Document current behavior and test coverage
   - Create detailed test plan for the new structure
   - Identify all components and hooks that will interact with the refactored code

2. **Test Creation**
   - Begin with the testing preparation phase
   - Create comprehensive tests for both existing and new functionality
   - Ensure tests are isolated from implementation details

3. **Implementation Strategy**
   - Start with the `useActivityManagerState.ts` hook for state management
   - Then implement the `ActivityManagerCore.tsx` component
   - Follow with UI components that use the hook and core component
   - Finally update the main `ActivityManager.tsx` to use the new structure

4. **Scheduling Recommendation**
   - Allocate 1-2 hour sessions to tackle one phase at a time
   - Schedule separate sessions for test creation and implementation
   - Plan for documentation updates after implementation is complete

### Reference Information for Next Session
- The original `ActivityManager.tsx` contains approximately 250 lines of code
- Primary concerns are state management, UI rendering, and event handling
- Several component-specific hooks may need to be created or refactored
- Theme integration spans multiple aspects of the component
- Existing tests will need to be updated to reflect the new structure
