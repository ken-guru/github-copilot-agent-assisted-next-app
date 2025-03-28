# Changes Backlog

This file contains specifications for planned changes that have been temporarily set aside for prioritization or future consideration. When work on a change begins, move it to PLANNED_CHANGES.md. When completed, move it to IMPLEMENTED_CHANGES.md with a timestamp.

## Backlog Entry Template

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

Note: When a backlog item is ready to be implemented, move it to PLANNED_CHANGES.md with any updated details or requirements.

# Mobile Progress Bar Redesign
## Context
The progress element in the mobile layout needs significant improvements to enhance user experience:
- Components involved: ProgressBar component and its related styles
- Current issues:
  - Progress bar appears suddenly when starting first activity, causing layout shifts
  - Takes up too much vertical space
  - Redundant on desktop where timeline provides same information
## Requirements
1. Progress Bar Visibility
   - Show progress element from initial page load
   - Maintain consistent layout without shifts when activities start
   - Remove progress element from desktop layout entirely

2. Vertical Layout Redesign
   - Convert to vertical progress bar fixed to right edge of screen
   - Should stretch from below header to bottom of window
   - Remove activity name display
   - Implement color-coded progress indication
   - Remove numerical timeline segments
   - Progress should fill from top to bottom

3. Mobile-Specific Implementation
   - Ensure proper responsive breakpoints
   - Handle various screen heights appropriately
   - Maintain proper spacing with other elements
   - Consider touch interactions

## Technical Guidelines
- Use CSS position: fixed for right-edge attachment
- Implement proper viewport height calculations
- Ensure smooth transitions when progress updates
- Consider z-index stacking for proper layering
- Update mobile breakpoint handling
- Test different mobile viewport sizes
- Maintain proper theme support for colors

## Expected Outcome
User perspective:
- Cleaner, more compact mobile interface
- No jarring layout shifts
- Clear visual progress indication
- Better use of limited mobile screen space

Technical perspective:
- Simplified progress visualization code
- Better separation of mobile/desktop layouts
- Improved performance with simpler DOM structure

## Validation Criteria
- [ ] Test cases updated for new layout
- [ ] Implementation complete with responsive design
- [ ] Smooth transitions verified
- [ ] Theme compatibility maintained
- [ ] Documentation updated
- [ ] Mobile testing across different devices
- [ ] Desktop layout verified without progress element

# Cross-Device Toast Message Integration

## Context
This backlog item builds upon the planned "Mobile Layout Optimization for Toast Message Display" by extending the toast notification system to benefit all screen sizes, not just mobile layouts.

- **Components involved**: UpdateNotification component, ProgressBar component, page layout CSS
- **Current limitations**: The current plan addresses toast message space on mobile but doesn't provide a unified approach across all screen sizes
- **User needs**: Consistent notification experience regardless of device size with optimized layouts for each form factor

**Note**: Review and update this backlog item after implementing the mobile-specific layout changes to ensure alignment with the chosen implementation approach.

## Requirements

1. Unified Toast Notification System
   - Create a consistent notification position across all breakpoints
   - Implement standard styling, animations, and behavior regardless of screen size
   - Ensure proper stacking behavior when multiple notifications appear
   - Develop a systematic approach to notification lifecycle management

2. Desktop-Specific Layout Optimizations
   - Consider removing or redesigning the Progress element for desktop views
   - Leverage the more detailed Timeline visualization on larger screens
   - Position toast messages in a non-intrusive location (bottom-right recommended)
   - Ensure proper z-index stacking for layered elements

3. Component Architecture Updates
   - Create a Toast context provider for application-wide notification management
   - Implement a notification queue system
   - Support multiple notification types (success, error, warning, info)
   - Provide accessible notification patterns with proper ARIA roles

## Technical Guidelines
- Implement a CSS variable system for notification positioning, sizing, and spacing
- Use React Context API for notification state management
- Consider a mobile-first, progressive enhancement approach
- Ensure WCAG 2.1 AA compliance for all notification components
- Implement proper focus management for notifications
- Use semantic HTML for notification components
- Maintain theme compatibility for all notification states

## Expected Outcome

User perspective:
- Consistent notification experience across all devices
- Clear visual hierarchy between content and system messages
- Non-disruptive notifications that don't interfere with primary tasks
- Appropriate notification positioning based on screen size

Technical perspective:
- Clean component architecture for notification management
- Simplified styling with shared CSS variables
- Improved separation of concerns between components
- Reduced code duplication across breakpoints
- Better maintainability through centralized notification logic

## Validation Criteria
- [ ] Toast notification system works consistently across all breakpoints
- [ ] Desktop layout optimization provides clean, non-redundant UI
- [ ] Component architecture allows easy notification triggering from anywhere
- [ ] CSS variable system properly handles all screen sizes
- [ ] Theme compatibility verified in light and dark modes
- [ ] Accessibility requirements met (focus management, ARIA roles, keyboard navigation)
- [ ] Visual regression testing confirms no layout issues
- [ ] Performance testing shows no negative impact from the notification system