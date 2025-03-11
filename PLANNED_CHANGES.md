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

# Mobile Layout Optimization

## Overview
Improve the mobile user experience by reorganizing layout elements and utilizing screen space more efficiently.

## Planned Changes

### 1. Reposition Progress Bar
- Move progress bar component above activity list in mobile view
- Use CSS Grid/Flexbox reordering in the ActivityGrid component
- Ensure proper spacing and margins in mobile layout

### 2. Timeline Visibility
- Hide timeline component on mobile devices using CSS media queries
- Consider adding a collapsible version that can be shown on demand if users request this feature
- Ensure this change doesn't affect desktop layout

### 3. Activity Timer Integration
- Replace "Active" badge with live timer in ActivityButton component
- Modify ActivityButton to accept and display current elapsed time
- Use existing useTimeDisplay hook for consistent time formatting
- Style the timer to be prominent but not disruptive to the activity card layout

## Implementation Details

### CSS Changes Required:
1. Update page.module.css:
   - Modify activityGrid layout for mobile
   - Add media queries for timeline visibility
   - Adjust progress bar positioning

2. Update ActivityManager.module.css:
   - Modify activityItem layout to accommodate timer
   - Update runningIndicator styles for timer display

3. Update ActivityButton component:
   - Add timer display logic
   - Style the timer display
   - Update the activity status area

### Component Updates Required:
1. Page Component:
   - Update grid layout structure
   - Add mobile-specific layout logic

2. ActivityButton Component:
   - Add timer integration
   - Update running state display
   - Connect to useTimeDisplay hook

3. ActivityManager Component:
   - Pass necessary timing props to ActivityButton
   - Update layout structure for mobile

### Testing Considerations:
- Test on various mobile screen sizes
- Verify timer accuracy and updates
- Ensure desktop layout remains unchanged
- Test theme switching with new timer display
- Validate accessibility of new layout

## Future Enhancements to Consider:
- Optional timeline toggle for mobile users
- Compact view mode for activity list
- Gesture-based interactions for mobile
- Timeline view in landscape orientation