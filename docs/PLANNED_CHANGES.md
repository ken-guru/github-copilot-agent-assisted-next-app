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

# Application Flow Restructuring: 3-State to 4-State Model

## Context
This change affects the core state management and user flow of the application.
- The primary state machine component and related UI components need modification
- Current behavior uses a 3-state flow (Setup → Activity → Completed) which needs to be expanded
- This change addresses user needs for better planning functionality and a clearer separation between planning activities and executing them

## Requirements
1. Restructure application flow from 3 states to 4 states
   - Current states: Setup, Activity, Completed
   - New states: Setup, Planning, Activity, Completed
   - Implement state transitions: Setup → Planning → Activity → Completed

2. Setup State modifications
   - Maintain current functionality where users input duration or end time
   - Ensure clear transition to Planning state once time is set
   - Testing: Verify that all existing time selection functionality works as before

3. New Planning State implementation
   - Create new UI for activity planning
   - Allow users to add, remove, and reorder activities
   - Start with an empty activity list (remove predefined activities)
   - Provide clear transition button/action to move to Activity state
   - Testing: Verify CRUD operations on activities and state transition

4. Activity State modifications
   - Remove ability to add/remove activities (only start and complete)
   - Maintain timeline functionality showing activity progress
   - Redesign progress bar to show total elapsed time (not staggered by activity)
   - Implement color-coded progress bar with different states:
     - >50% time remaining: green glow
     - 25-50% time remaining: yellow glow
     - <25% time remaining: orange glow
     - Time expired: pulsing red glow
   - When time expires, maintain the pulsing effect but don't show overtime
   - Testing: Verify all time boundary conditions and visual indicators

5. Completed State modifications
   - Maintain current summary functionality
   - Add prominent "Start New" button to reset to Setup state
   - Testing: Verify reset functionality and summary data accuracy

## Technical Guidelines
- Update the existing state machine to accommodate the new state flow
- Implement responsive UI for all new components
- Ensure accessibility for color-based indicators (use additional visual cues)
- Maintain dark/light theme compatibility for new UI elements
- Add comprehensive tests for new state transitions and edge cases
- Consider performance impact of progress bar animations, especially pulsing effect

## Expected Outcome
- User perspective:
  - Clearer separation between planning and execution phases
  - Better visual indication of remaining time
  - More intuitive flow from start to finish
  - Easy way to restart the process after completion

- Technical perspective:
  - Well-structured state machine handling the 4-state model
  - Responsive and accessible UI components
  - Maintainable code structure separating concerns between states

- Testing criteria:
  - All state transitions work correctly
  - Progress bar visual indicators trigger at appropriate thresholds
  - Empty activity list in Planning state works as expected
  - Reset functionality from Completed state works correctly

## Validation Criteria
- [ ] Test cases written for all new state transitions
- [ ] Test cases written for progress bar visual indicators
- [ ] Implementation of four-state model complete
- [ ] Empty activity list in Planning state implemented
- [ ] Progress bar redesign with time-based color indicators implemented
- [ ] Reset button in Completed state implemented
- [ ] All tests passing
- [ ] Theme compatibility verified for all new UI components
- [ ] Documentation updated to reflect new application flow

# Application Flow Restructuring: 3-State to 4-State Model - Remaining Features

## Context
The core state machine transition from 3-state to 4-state model has been partially implemented:
- AppStateMachine class supports all four states (SETUP → PLANNING → ACTIVITY → COMPLETED)
- useAppState hook includes state transition methods
- Initial drag-and-drop functionality for activity reordering is implemented
- Test coverage for state transitions exists

The remaining features focus on UI/UX improvements and state-specific behavior modifications.

## Requirements

1. Planning State UI Enhancement
   - Remove default activities in Planning state
   - Show empty state message: "Add activities to get started"
   - Update activity list initialization logic
   - Testing: Verify empty state and activity addition flow

2. Activity State Behavior Restrictions
   - Remove ability to add new activities once in Activity state
   - Remove ability to remove activities once in Activity state
   - Maintain only start/complete functionality
   - Update ActivityManager and ActivityForm components
   - Testing: Verify state-specific behavioral restrictions

3. Progress Bar Visual Enhancement
   - Redesign progress bar to show total elapsed time
   - Implement color-coded progress states:
     * >50% remaining: green glow
     * 25-50% remaining: yellow glow
     * <25% remaining: orange glow
     * Time expired: pulsing red glow
   - Stop showing overtime when time expires
   - Update progress bar styles and animations
   - Testing: Verify all time boundary conditions and visual indicators

4. Completed State UI Enhancement
   - Add prominent "Start New" button
   - Position button for maximum visibility
   - Add clear visual feedback for state reset
   - Testing: Verify reset functionality

## Technical Guidelines
- Use CSS animations for glow effects
- Implement responsive styling for all new UI elements
- Use CSS custom properties for theme-consistent colors
- Add ARIA labels for accessibility
- Consider reduced motion preferences
- Add comprehensive test coverage for new functionality

## Expected Outcome
User perspective:
- Clear distinction between planning and activity phases
- Intuitive progress visualization
- Easy activity management in appropriate states
- Smooth transition between states

Technical perspective:
- Clean separation of concerns
- Maintainable animation code
- Proper test coverage
- Accessible UI components

## Validation Criteria
- [ ] Empty activity list in Planning state implemented
- [ ] Activity state restrictions implemented and tested
- [ ] Progress bar redesign complete with all visual states
- [ ] Reset functionality from Completed state implemented
- [ ] Animation performance verified
- [ ] Accessibility features tested
- [ ] Theme compatibility verified
- [ ] All tests passing
- [ ] Documentation updated
