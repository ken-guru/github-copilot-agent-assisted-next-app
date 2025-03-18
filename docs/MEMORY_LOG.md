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