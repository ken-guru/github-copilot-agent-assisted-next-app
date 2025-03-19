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

### Issue: Planning State UI Implementation
**Date:** 2024-01-06
**Tags:** #ui #state-management #testing #user-experience
**Status:** Resolved

#### Context
As part of the 4-state model implementation, we needed to implement the Planning state UI with:
- Empty activity list by default
- Ability to add/remove activities
- Clear transition button to Activity state

#### Technical Implementation
1. Modified ActivityManager to handle planning mode:
   - Added planningMode prop
   - Removed default activities in planning mode
   - Added Start Activities transition button
   - Maintained existing activity CRUD functionality

2. Added proper disabled state handling:
   - Disabled Start Activities button when no activities exist
   - Added aria-disabled attribute for accessibility
   - Applied consistent button styling with theme support

#### Test Strategy
1. Created test suite for Planning mode covering:
   - Empty initial state
   - Activity addition/removal
   - Transition button visibility
   - Button disabled state management
2. Verified CRUD operations in planning mode
3. Ensured proper transition button behavior

#### Resolution
Successfully implemented Planning state UI with:
1. Empty initial state working as designed
2. Activity management working correctly
3. Start Activities transition button properly handling disabled states
4. Comprehensive test coverage
5. Theme compatibility maintained

#### Lessons Learned
1. When implementing button disabled states, need both disabled attribute and aria-disabled
2. Empty states should provide clear user guidance
3. State-specific UI variations benefit from explicit mode props
4. Test both presence and absence of default data
5. Consider accessibility in state transitions

### Issue: Planning State Transition Button Disabled State
**Date:** 2024-01-06
**Tags:** #ui #testing #state-management #react
**Status:** Unresolved

#### Context
While implementing the Planning state UI's "Start Activities" transition button, we encountered an issue where the button's disabled state isn't properly reflecting the presence/absence of activities. The button should be disabled when there are no activities, but the test `should disable transition button when no activities are planned` is failing.

#### Attempted Solutions
1. Basic disabled state implementation
   - What was tried: Added disabled={!hasActivities} and aria-disabled={!hasActivities}
   - Outcome: Failed - Button shows correct aria-disabled but test expects button to be disabled
   - Why it didn't work: Test is specifically checking DOM disabled attribute

2. Synchronous activity state update
   - What was tried: Updated activities state synchronously in handleRemoveActivity
   - Outcome: Failed - Button still not showing as disabled in test
   - Why it didn't work: State updates may not be reflecting in time for the test assertion

#### Investigation
Test output shows:
```html
<button aria-disabled="false" aria-label="Start Activities" class="startActivitiesButton" type="button" />
```
Key issues:
1. Button doesn't have disabled attribute set
2. aria-disabled is false when it should be true
3. React's state update timing may be affecting the test

#### Next Steps
1. Investigate test implementation to understand timing of state updates
2. Consider using React Testing Library's waitFor to handle async state changes
3. Review ActivityManager's state management approach
4. Consider moving button state logic to a separate effect

### Issue: ActivityManager Timeline Check Function
**Date:** 2024-01-06
**Tags:** #bugfix #testing #components
**Status:** Resolved

#### Context
While implementing Planning state UI changes, ActivityManager component was using an undefined function `isActivityInTimeline`, causing test failures across many test cases.

#### Technical Implementation
1. Added isActivityInTimeline utility function:
   - Takes activityId and timelineEntries as parameters
   - Returns boolean indicating if activity appears in timeline
   - Used for disabling activity removal and status display

2. Updated ActivityManager component:
   - Added proper function parameters
   - Fixed prop handling for timeline integration
   - Maintained existing activity management functionality

#### Test Strategy
Verified fixes through existing test suite covering:
- Activity rendering
- Timeline integration
- Planning mode functionality
- Button state management

#### Resolution
Successfully implemented missing function and integrated it with:
1. Proper parameter passing
2. Clean timeline integration
3. Maintained existing functionality
4. Fixed all related test failures

#### Lessons Learned
1. Extract utility functions before implementing components that use them
2. Verify all dependencies are properly defined before component updates
3. Use TypeScript to catch undefined function issues earlier
4. Keep utility functions close to their primary usage location

### Issue: Planning State Transition Button Visibility and State
**Date:** 2024-01-06
**Tags:** #ui #testing #state-management #react #visibility

#### Context
While implementing the Planning state UI's "Start Activities" transition button, we encountered a conflict between two test requirements:
1. The button should not be visible when there are no activities
2. The button should be disabled when there are no activities

These requirements created a test contradiction where one test expects the button to not exist, while another expects to find it and verify its disabled state.

#### Attempted Solutions
1. Conditional Rendering
   - What was tried: Only rendered button when hasActivities is true
   - Outcome: Failed - "disable transition button" test couldn't find button to check disabled state
   - Why it didn't work: Button needs to exist for disabled state test

2. CSS Visibility
   - What was tried: Used style.visibility to hide button instead of removing from DOM
   - Outcome: Failed - Button still found by test looking for non-existence
   - Why it didn't work: Hidden elements still exist in DOM

3. Split Button State Logic
   - What was tried: Separated visibility and disabled state handling with explicit conditions
   - Outcome: In Progress - Working on finding right balance between visibility and state

#### Investigation
The core issue appears to be a conflict in the test expectations:
```javascript
// Test 1 expects button to not exist initially
expect(screen.queryByText('Start Activities')).not.toBeInTheDocument();

// Test 2 expects button to exist but be disabled
expect(transitionButton).toBeDisabled();
```

#### Next Steps
1. Review test requirements to determine if both conditions are actually needed
2. Consider updating tests to have consistent expectations about button presence
3. Investigate using aria-hidden instead of CSS visibility
4. Consider using a different approach to indicate empty state

#### Lessons Learned
1. Be careful when mixing visibility and state in UI elements
2. Test requirements should be reviewed for potential conflicts
3. Consider accessibility implications of hiding vs removing elements
4. DOM presence and visual presence are different concerns

### Issue: Planning State Transition Button Resolution
**Date:** 2024-01-06
**Tags:** #ui #testing #state-management #react #resolved

#### Context
We had conflicting test requirements for the "Start Activities" transition button in planning mode:
1. One test expected the button to not exist when there are no activities
2. Another test expected to find the button and verify its disabled state

#### Resolution
We resolved the issue by:
1. Updating test expectations to be more consistent:
   - Button is always present in planning mode
   - Button is disabled when there are no activities
   - Button is enabled when activities exist

2. Simplifying the component implementation:
   - Always render button in planning mode
   - Use disabled attribute for state management
   - Removed visibility logic to avoid complexity

#### Key Decisions
1. Chose to always show the button with disabled state over hiding it because:
   - Provides better UX by showing available actions
   - Makes the UI more predictable
   - Follows common patterns in form submission buttons
   - Simplifies state management
   - Improves accessibility by maintaining consistent layout

2. Updated test suite to reflect real-world usage:
   - Tests now verify state transitions
   - Better matches user expectations
   - More maintainable test code

#### Lessons Learned
1. When faced with conflicting UI requirements, prefer the more explicit approach
2. Button state (disabled) is often clearer than visibility toggling
3. Tests should reflect actual user interactions
4. Consider accessibility and UX when choosing between hiding and disabling elements

### Issue: Cypress End-to-End Test Failures for Planning State [RESOLVED]
**Date:** 2024-03-19
**Tags:** #testing #cypress #state-management #e2e
**Status:** Resolved

#### Context
During end-to-end testing with Cypress, we encountered failures in the planning state functionality test. The test expects specific behavior around the "Start Activities" button and activity management during the planning phase.

#### Issues Fixed
1. Start Activities button not found with correct data-testid
   - Fixed by properly handling planningMode prop in ActivityManager
   - Added consistent data-testid attribute handling
2. Race conditions in activity state updates
   - Improved state update batching
   - Removed redundant updates
3. Drag and drop functionality
   - Implemented Cypress-compatible drag and drop
   - Added position-based drop indicators
   - Used element positions for more reliable reordering

#### Solution Implementation
1. ActivityManager changes:
   - Added position-based drag and drop handling
   - Improved button state management
   - Fixed activity reordering logic
2. CSS updates:
   - Added drag and drop visual indicators
   - Implemented top/bottom drop zone styling
   - Fixed button visibility states

#### Test Coverage
Successfully verified:
- Adding activities in planning mode
- Button disabled state management
- Activity reordering via drag and drop
- State transitions from planning to activity mode
- Form visibility in different states

#### Lessons Learned
1. End-to-end tests require careful coordination of component state
2. Cypress synthetic events need special handling for drag and drop
3. State updates should be batched when possible
4. Component responsibilities need clear boundaries
5. Visual indicators improve both UX and test reliability

### Issue: Completed State UI Enhancement
**Date:** 2024-06-26
**Tags:** #ui #animation #state-management #user-experience
**Status:** Resolved

#### Context
As part of the 4-state model implementation, we needed to enhance the Completed state UI with:
- A more prominent "Start New Session" button
- Clearer visual feedback when resetting the application state
- Success message indicating completion of activities

#### Technical Implementation
1. Enhanced the "Start New Session" button with:
   - Increased size (400px width) and padding for better visibility
   - Pulsing animation effect to draw attention
   - Plus icon to reinforce the action
   - Hover effects with subtle lift and glow effects
   - Box shadow for depth

2. Added visual feedback for session reset:
   - Full-screen overlay transition
   - Animated checkmark icon
   - Clear status message
   - Smooth fade-in/scale animation

3. Added a success message component that:
   - Displays a congratulatory message
   - Shows a checkmark icon
   - Has a distinct color scheme to indicate success
   - Animates in for better visual engagement

4. Improved the overall completed state UI:
   - Better centered content
   - Clear "Session Complete!" heading
   - More visual hierarchy in the layout

#### Test Strategy
1. Added new tests to verify:
   - Success message appears in completed state
   - Enhanced button is displayed with correct text and styling
   - Visual feedback appears when starting a new session
   - App state is reset properly after animation completes

2. Updated existing tests to account for:
   - New component structure with success message
   - Updated button implementation with icon
   - Animation timing

#### Resolution
Successfully implemented all planned enhancements:
1. Button is now more prominent and provides clear visual affordance
2. Reset flow provides clear feedback through animation
3. Success message enhances the sense of accomplishment
4. All tests pass, confirming the functionality works as expected

#### Lessons Learned
1. Animations improve perceived performance and user experience
2. Clear visual feedback during state transitions makes the app feel more polished
3. Test timings need to account for animation durations
4. CSS animations can be used effectively for visual feedback without complex JavaScript
5. Visual hierarchy in the UI helps guide users to the next appropriate action

## Current Progress on 4-State Model Implementation
- ✅ Progress bar color states
- ✅ State transition validation
- ✅ Invalid state handling
- ✅ Test coverage for new features
- ✅ Planning state UI with empty activities
- ✅ Planning to Activity transition button
- ✅ Timeline integration fixes
- ✅ Completed State UI enhancement

## Next Steps
1. Add activity reordering functionality
2. Complete remaining state transition buttons
3. Update documentation for new workflow

## 4-State Model Transition Progress [2024-01-30]

### Context
Implementing transition from 3-state to 4-state application flow model (Setup → Planning → Activity → Completed).

### Status
Core functionality implemented:
- AppStateMachine with 4-state support
- useAppState hook with state transitions
- Activity reordering in Planning state
- Test coverage for state transitions

Remaining work documented in PLANNED_CHANGES.md:
1. Planning State UI Enhancement
2. Activity State Behavior Restrictions
3. Progress Bar Visual Enhancement
4. Completed State UI Enhancement

### Tags
#state-management #ui-ux #in-progress #test-coverage #accessibility

### Notes
- Consider progressive enhancement for animations
- Maintain accessibility during UI enhancements
- Watch for performance impact of glow animations