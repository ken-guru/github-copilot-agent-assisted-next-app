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

# Visual Structure Consistency Implementation

## Context
The application currently has inconsistent visual structure across different states (setup, activity, completed):
- **Components Involved**: Main page layout, container components, CSS modules
- **Current Behavior**: Each application state uses different container nesting patterns:
  - Setup state: Single tight-fitting container with directly nested elements
  - Activity state: Multiple separate containers for Progress, Activities, and Timeline
  - Completed state: Single container that fills the entire available height
- **User Need**: Create a more cohesive, consistent visual experience across all application states

## Requirements

1. Create a consistent container pattern across all application states
   - Use a single white container as the main wrapper across all states
   - Standardize max-width behavior: limited width in setup/completed states, full width in activity state
   - Ensure proper padding/margin consistency between states
   - Maintain current visual aesthetics while improving structural consistency

2. Refactor activity state layout structure
   - Nest all activity state components inside a single container
   - Maintain the current visual division (progress on top, activities on left, timeline on right)
   - Implement proper grid/flex layout inside the container
   - Preserve current functionality while improving structure
   - Convert from separate containers to internal layout divisions

3. Adjust completed state container behavior
   - Make the container wrap tightly around contents instead of filling available height
   - Maintain consistent padding and margin with other states
   - Ensure responsive behavior at different screen sizes
   - Preserve current visual styling of the summary component

## Technical Guidelines
- Use CSS Grid and Flexbox for internal layouts rather than nested containers
- Ensure responsive behavior works properly at all breakpoints
- Maintain theme compatibility for both light and dark modes
- Preserve all accessibility attributes and structure
- Test layout in various screen sizes and devices
- Minimize DOM nesting depth for better performance

## Expected Outcome

From a user perspective:
- More cohesive visual experience across the application
- Consistent container styling and behavior between states
- No noticeable functional changes, only visual improvements
- Better responsive behavior across devices

From a technical perspective:
- Simplified DOM structure with less nesting
- More maintainable CSS with consistent patterns
- Improved layout structure using modern CSS techniques
- Better separation of layout and component concerns

## Validation Criteria
- [x] Test cases updated to verify new DOM structure
- [x] Implementation complete for all three application states
- [x] Tests passing for all states after refactoring
- [x] Theme compatibility verified in both light and dark modes
- [x] Responsive behavior confirmed on mobile, tablet, and desktop
- [x] Documentation updated to reflect new structure
- [x] Memory Log updated with implementation details and lessons learned
