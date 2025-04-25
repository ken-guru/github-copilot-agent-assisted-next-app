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

# Mobile UI Improvements

## Context
The current UI works on mobile devices but is not optimized for touch interactions or smaller screens. When users enter overtime, there's no clear indication. The visual structure needs improvement to better organize content on mobile devices.

## Requirements
1. Touch-friendly UI elements
   - Minimum touch target size of 44px
   - Proper spacing between interactive elements
   - Optimized touch feedback (visual indicators)
   - Use CSS variables for consistent scaling
   
2. Overtime indication
   - Clear visual feedback when user enters overtime
   - Formatted display of overtime duration
   - Animation to draw attention without being distracting
   - Accessibility considerations for all users
   
3. Improved visual structure
   - Reorganize layout into clear semantic sections:
     - Header with logo and theme switcher
     - Main content with components for different states
     - Footer with primary actions
   - Ensure proper hierarchy and focus on current task
   - Apply consistent spacing and component sizing

## Technical Guidelines
- Use the `useViewport` hook for responsive behavior detection
- Leverage CSS modules with mobile-specific classes
- Follow accessibility best practices (WCAG 2.1 AA)
- Implement performant animations using CSS transitions
- Support reduced motion preferences
- Add touch gesture support where appropriate

## Expected Outcome
- **User Perspective**:
  - More comfortable interaction on mobile devices
  - Clear understanding of overtime status
  - Logical progression through the application
  - No frustration with small touch targets

- **Technical Perspective**:
  - Maintainable responsive code using hooks and CSS modules
  - Clear separation of concerns between components
  - Easy theme integration across viewport sizes
  - Good performance on mobile devices

## Validation Criteria
- [x] Test cases written for all components
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Theme compatibility verified
- [ ] Documentation updated
- [ ] Accessibility tested
- [ ] Performance verified on mobile devices
