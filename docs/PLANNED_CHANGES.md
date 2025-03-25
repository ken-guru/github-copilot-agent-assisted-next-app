# Planned Changes Prompt Template
This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation. Once implemented, move the change to IMPLEMENTED_CHANGES.md with a timestamp.

# Fix Delayed Break Visualization

## Context
- **Components/Utilities Involved**: Timeline component, useTimelineEntries hook, timelineCalculations utility
- **Current Behavior**: Break periods aren't shown in the timeline until the next activity starts. When a user completes an activity, the break/gap period is not immediately visualized until they start another activity.
- **User Needs**: Users need real-time visualization of break periods to accurately track their time usage and current state.

## Requirements
1. Real-time Break Visualization
   - Implement immediate break visualization when an activity is completed
   - Break should be visible before the next activity starts
   - Break should update in real-time (showing elapsed break time)
   - Break visualization should be consistent with existing gap/break styling

2. Timeline Calculation Updates
   - Modify `calculateTimeSpans` function to detect and visualize "current break"
   - Handle case where last activity is completed but no new activity has started
   - Calculate break duration from last activity end time to current time
   - Ensure break height/proportion is correctly scaled within timeline

3. State Management Integration
   - Ensure break state is properly tracked in the activity state machine
   - Add appropriate state indicators for "in break" periods
   - Update relevant hooks to track and manage break periods
   - Maintain compatibility with existing activity state transitions

## Technical Guidelines
- Maintain React best practices for state updates and re-renders
- Utilize existing theming system for break visualization
- Consider performance impacts of real-time updates (use appropriate refresh rate)
- Ensure accessibility with proper ARIA attributes and contrast for break visualization
- Implement comprehensive tests for new functionality and edge cases

## Expected Outcome
- **User Perspective**: Users will see breaks appear immediately after completing an activity, providing accurate time tracking
- **Technical Perspective**: Break periods will be properly represented in the timeline data model and visualization
- **Testing Criteria**: All timeline states (with and without breaks) render correctly and update in real-time

## Validation Criteria
- [ ] Test cases written for break visualization in Timeline component
- [ ] Implementation complete with all requirements addressed
- [ ] Tests passing for existing and new functionality
- [ ] Theme compatibility verified for break visualization in light and dark modes
- [ ] Documentation updated to reflect new break visualization behavior

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
