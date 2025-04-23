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

## Files Exceeding 200 Lines

### JavaScript/TypeScript Files

1. **`/src/utils/serviceWorkerRegistration.ts`** [PENDING]
   - Current concerns:
     - Service worker registration logic
     - Update handling
     - Error handling
     - Network status detection
     - Retry mechanisms
   - Potential split:
     - `serviceWorkerCore.ts` - Core registration functionality
     - `serviceWorkerUpdates.ts` - Update handling
     - `serviceWorkerErrors.ts` - Error handling and reporting
     - `serviceWorkerRetry.ts` - Retry mechanisms

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

2. **`/src/utils/__tests__/serviceWorkerRegistration.test.ts`** [PENDING]
   - Current concerns:
     - Registration tests
     - Update tests
     - Error handling tests
   - Potential split:
     - `serviceWorkerRegistration.core.test.ts` - Core functionality tests
     - `serviceWorkerRegistration.updates.test.ts` - Update mechanism tests
     - `serviceWorkerRegistration.errors.test.ts` - Error handling tests
