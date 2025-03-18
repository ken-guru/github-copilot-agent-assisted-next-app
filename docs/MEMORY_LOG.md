# Memory Log

This document serves as a record of solutions attempted for various issues encountered during development. Use this log to avoid repeating unsuccessful approaches and to build on successful ones.

## Purpose
This document tracks solutions attempted by AI for application issues. It prevents repetitive solution attempts by maintaining a history of approaches that have been tried.

## How to Use
1. Before attempting to solve an issue, check this log for similar problems
2. If a similar issue exists, review previous approaches before trying new solutions
3. If no similar issue exists, create a new entry using the template below
4. Add details of each solution attempt to the appropriate issue entry

## Entry Format
```markdown
### Issue: [Brief Description]
**Date:** YYYY-MM-DD
**Tags:** #tag1 #tag2
**Status:** [Resolved|Unresolved|Partially-Resolved]

#### Context
Brief description of the issue and its impact

#### Attempted Solutions
1. First attempt
   - What was tried
   - Outcome
   - Why it did/didn't work

2. Second attempt
   - What was tried
   - Outcome
   - Why it did/didn't work

#### Resolution
Description of final solution (if resolved)

#### Lessons Learned
Key takeaways that might be useful for future reference
```

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
<!-- Entries will be added here as issues are addressed -->

### Issue: ActivityButton Remove Button Disabled State Not Working
**Date:** 2024-01-06
**Tags:** #react #testing #state-management #ui
**Status:** Resolved

#### Context
While implementing the 4-state model (Setup → Planning → Activity → Completed), we encountered an issue where the remove button in ActivityButton component isn't being properly disabled when an activity appears in the timeline.

#### Attempted Solutions
1. Conditional onRemove prop
   - What was tried: Used conditional logic to pass onRemove prop as undefined when activity should not be removable
   - Outcome: Failed - Test still expected button to be disabled via DOM attribute
   - Why it didn't work: While this prevented the remove functionality, it didn't set the disabled attribute that the test was checking for

2. isInUse state check
   - What was tried: Used timelineEntries to determine if activity is in use and set disabled prop
   - Outcome: Failed - Test still showed button as not disabled
   - Why it didn't work: Implementation correctly set disabled={isInUse} but something was preventing the attribute from being properly applied

3. Explicit isInTimeline prop with updated test
   - What was tried: Added new isInTimeline prop to ActivityButton and updated test to explicitly set this prop
   - Outcome: Success - Button properly shows as disabled in test and functionality works as expected
   - Why it worked: By making the disabled state explicit through a prop rather than derived state, we ensured consistent behavior between the component and test

#### Resolution
The issue was resolved by:
1. Adding an explicit isInTimeline prop to ActivityButton component
2. Updating ActivityManager to calculate and pass this prop based on timeline entries
3. Modifying the test to provide the isInTimeline prop directly
4. Using the prop to control both the disabled attribute and click handler behavior

This solution provides better separation of concerns - ActivityManager determines whether an activity can be removed, while ActivityButton handles the UI representation of that state.

#### Lessons Learned
1. When dealing with disabled states in React, tests specifically look for the DOM disabled attribute
2. Conditional rendering of buttons is not equivalent to disabling them for testing purposes
3. Explicit props can be clearer and more testable than derived state
4. State management between parent and child components needs careful consideration for proper prop passing
5. Always check both the component implementation and test setup when debugging UI state issues

### Issue: AppStateMachine Console Errors in Tests
**Date:** 2024-01-06
**Tags:** #testing #state-management #error-handling
**Status:** Resolved

#### Context
While implementing the 4-state model (Setup → Planning → Activity → Completed), we observed console.error messages in our test output when testing invalid state transitions in the AppStateMachine.

#### Investigation
The console errors appear when testing invalid state transitions such as:
- Attempting to move from SETUP directly to ACTIVITY
- Attempting to move from SETUP directly to COMPLETED
- Attempting to move from PLANNING directly to COMPLETED
- Attempting to reset from non-COMPLETED states

#### Resolution
Determined that these console.error messages are expected and actually indicate correct behavior:
1. The errors are part of our error handling strategy in useAppState
2. They occur before the errors are thrown and caught by our test assertions
3. The tests correctly verify that invalid transitions are prevented
4. The error messages provide useful debugging information during development

No changes were needed as this is working as designed.

#### Lessons Learned
1. Console errors in tests aren't always indicators of problems - they may be part of expected error handling
2. Error logging before throwing helps with debugging without affecting the error handling flow
3. When testing error cases, consider both the error messages and the actual error handling
4. Document expected error messages to prevent future confusion

### Issue: Progress Bar Color States Implementation
**Date:** 2024-01-06
**Tags:** #ui #animation #testing #time-tracking
**Status:** Resolved

#### Context
As part of the 4-state model implementation, we needed to add color-coded progress bar indicators based on remaining time:
- >50% time remaining: green glow
- 25-50% time remaining: yellow glow
- <25% time remaining: orange glow
- Time expired: pulsing red glow

#### Technical Implementation
1. Added new CSS classes for each state with glow effects
2. Implemented time-based state calculation
3. Added pulsing animation for expired state
4. Ensured dark mode compatibility for all states

#### Test Strategy
1. Created comprehensive test suite covering all time thresholds
2. Added test helper to properly access progress bar container
3. Verified both regular and pulsing states
4. Ensured bar doesn't exceed 100% in overtime

#### Resolution
Successfully implemented and tested all color states with:
1. CSS modules for styling
2. Time-based state calculation logic
3. Accessible color combinations
4. Animation for expired state
5. Dark mode support

#### Lessons Learned
1. When testing DOM elements with multiple nested containers, use helper functions to consistently access the right element
2. CSS animations and transitions should be theme-aware
3. Use CSS modules to prevent style leakage and maintain clean separation
4. Document expected console errors in tests to avoid confusion

### Issue: State Transition Error Handling
**Date:** 2024-01-06
**Tags:** #state-management #error-handling #testing
**Status:** Resolved

#### Context
While implementing the 4-state model (Setup → Planning → Activity → Completed), we needed to ensure proper error handling for invalid state transitions.

#### Implementation Details
1. Added error handling for all invalid transitions:
   - SETUP to ACTIVITY/COMPLETED
   - PLANNING to COMPLETED
   - Reset from non-COMPLETED states

2. Implemented error logging for debugging
3. Added comprehensive test coverage for invalid transitions

#### Test Strategy
1. Created test cases for each invalid transition
2. Verified error messages and state preservation
3. Ensured proper error throwing and catching
4. Documented expected console errors

#### Resolution
Successfully implemented strict state transition validation with:
1. Clear error messages
2. State preservation on invalid transitions
3. Complete test coverage
4. Proper error handling and logging

#### Lessons Learned
1. Console errors in tests can be valid when testing error cases
2. Document expected error messages to avoid confusion
3. Test both valid and invalid state transitions
4. Error messages should be descriptive for debugging

## Current Progress on 4-State Model Implementation
- ✅ Progress bar color states
- ✅ State transition validation
- ✅ Invalid state handling
- ✅ Test coverage for new features

## Next Steps
1. Complete Planning state UI implementation
2. Add activity reordering functionality
3. Implement clear transition buttons between states
4. Update documentation for new workflow