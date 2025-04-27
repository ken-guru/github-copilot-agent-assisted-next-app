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
| `/src/utils/serviceWorkerRegistration.ts` | 🔄 IN PROGRESS | HIGH | 55% | ✅ TypeScript errors fixed; ✅ File structure analysis completed; 🔄 Creating tests for current functionality |
| `/public/service-worker.js` | ⏱️ PENDING | MEDIUM | 0% | Awaiting completion of serviceWorkerRegistration |
| `/src/components/ActivityManager.tsx` | ⏱️ PENDING | MEDIUM | 0% | Awaiting completion of service worker files |
| `/src/app/page.module.css` | ⏱️ PENDING | LOW | 0% | Awaiting completion of JS/TS refactoring |
| `/src/components/Timeline.module.css` | ⏱️ PENDING | LOW | 0% | Awaiting completion of JS/TS refactoring |
| `/src/components/Summary.module.css` | ⏱️ PENDING | LOW | 0% | Awaiting completion of JS/TS refactoring |
| `/src/components/__tests__/Summary.test.tsx` | ⏱️ PENDING | MEDIUM | 0% | Awaiting component refactoring |
| `/src/utils/__tests__/serviceWorkerRegistration.test.ts` | 🔄 IN PROGRESS | HIGH | 55% | ✅ TypeScript errors fixed; ✅ Initial test analysis completed; 🔄 Expanding test coverage |

## Files Exceeding 200 Lines

### JavaScript/TypeScript Files

1. **`/src/utils/serviceWorkerRegistration.ts`** [IN PROGRESS]
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
     3. 🔄 Create comprehensive tests for current functionality
     4. Create new directory structure in `/src/utils/serviceWorker/`
     5. Extract code by concern into separate files
     6. Create barrel file for backwards compatibility
     7. Update serviceWorkerRegistration.ts to re-export from new structure
     8. Update tests to use new structure

2. **`/public/service-worker.js`** [PENDING]
   - Current concerns:
     - Cache management
     - Fetch event handling
     - Installation/activation logic
     - Error handling
     - Offline fallbacks
   - Potential split:
     - `sw-core.js` - Core service worker initialization
     - `sw-cache-strategies.js` - Various caching strategies
     - `sw-fetch-handlers.js` - Request handling logic
     - `sw-lifecycle.js` - Installation and activation handlers

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

2. **`/src/utils/__tests__/serviceWorkerRegistration.test.ts`** [NEXT UP]
   - Current concerns:
     - Registration tests
     - Update tests
     - Error handling tests
   - Potential split:
     - `serviceWorkerRegistration.core.test.ts` - Core functionality tests
     - `serviceWorkerRegistration.updates.test.ts` - Update mechanism tests
     - `serviceWorkerRegistration.errors.test.ts` - Error handling tests

## Service Worker Registration Refactoring - Detailed Plan

Having completed the TypeScript errors fixing and file structure analysis, we're now progressing with the following phases:

### 1. Testing Phase (Current) - ETA: 3 days
- [ ] Review existing test coverage for service worker registration
- [ ] Identify untested functionality in the current implementation
- [ ] Create additional tests for:
  - [ ] Core registration process
  - [ ] Update detection and handling
  - [ ] Error scenarios and recovery
  - [ ] Network status change handling
  - [ ] Retry mechanisms with different timing scenarios
- [ ] Ensure tests are isolated and don't depend on implementation details
- [ ] Document test coverage metrics before refactoring

### 2. Structure Creation Phase - ETA: 1 day
- [ ] Create directory structure:
  ```
  /src/utils/serviceWorker/
  ├── types.ts
  ├── core.ts
  ├── updates.ts
  ├── errors.ts
  ├── network.ts
  ├── retry.ts
  └── index.ts
  ```
- [ ] Create initial type definitions in `types.ts`
- [ ] Setup barrel file (`index.ts`) with placeholder exports

### 3. Code Extraction Phase - ETA: 5 days
- [ ] Extract core registration logic to `core.ts`
  - [ ] Function: `register(config)`
  - [ ] Function: `unregister()`
  - [ ] Basic registration validity checks
- [ ] Extract update handling to `updates.ts`
  - [ ] Function: `onUpdate(registration, config)`
  - [ ] Function: `checkForUpdates(registration)`
  - [ ] Update notification logic
- [ ] Extract error handling to `errors.ts`
  - [ ] Function: `handleRegistrationError(error, config)`
  - [ ] Function: `logServiceWorkerErrors()`
- [ ] Extract network detection to `network.ts`
  - [ ] Function: `setupNetworkStatusListeners()`
  - [ ] Function: `handleNetworkStatusChange()`
- [ ] Extract retry mechanisms to `retry.ts`
  - [ ] Function: `setupRetryMechanism(registration, config)`
  - [ ] Function: `calculateRetryDelay(attempt)`

### 4. Integration Phase - ETA: 2 days
- [ ] Update barrel file to export all functionality
- [ ] Transform original `serviceWorkerRegistration.ts` to:
  - [ ] Re-export all functionality from the new structure
  - [ ] Add deprecation notices with migration guidance
  - [ ] Ensure full backward compatibility
- [ ] Update any direct imports in the codebase
- [ ] Ensure all tests pass with the new structure

### 5. Documentation Phase - ETA: 1 day
- [ ] Create Memory Log entry documenting the refactoring process
- [ ] Document key decisions made during the refactoring
- [ ] Update API documentation for the service worker utilities
- [ ] Create usage examples for the new module structure

### 6. Final Review - ETA: 1 day
- [ ] Review bundle size impact
- [ ] Verify runtime performance is maintained or improved
- [ ] Check for any regressions in service worker functionality
- [ ] Update progress tracker in PLANNED_CHANGES.md
- [ ] Mark as completed in IMPLEMENTED_CHANGES.md with timestamp

## Next Target after Service Worker Refactoring

Once the service worker registration refactoring is complete, we will proceed with:

1. `/public/service-worker.js` refactoring
   - Will build upon lessons learned from the registration refactoring
   - Will focus on separating cache strategies from lifecycle management
   - Target completion: Within 7 days of completing the registration refactoring

2. Begin preparing for `ActivityManager.tsx` refactoring
   - Will conduct preliminary analysis while service worker refactoring is in progress
   - Will focus on extracting state management from UI rendering
