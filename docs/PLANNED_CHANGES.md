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

# CSS Spacing Scale Simplification

## Context
Our application currently uses a complex spacing scale (2xs to 3xl) in our global CSS variables. This level of complexity isn't necessary for the current application needs and may lead to inconsistent spacing usage.

- The components affected include all components using CSS modules with spacing variables
- Current spacing scale includes values from --space-2xs to --space-3xl
- This change will improve maintainability and consistency across the UI

## Requirements
1. Simplify the spacing scale to a 5-point system
   - Replace the current scale with xs, sm, md, lg, xl sizing options
   - Map current sizes to new simplified scale
   - Update semantic spacing variables (gap and padding) to use new scale
   - Maintain consistent pixel values where possible

2. Implement a migration strategy for all CSS files
   - Find and replace old variable names across all CSS modules
   - Apply consistent naming pattern across the codebase
   - Handle edge cases where specific values may be needed
   - Update any documentation referencing the spacing system

3. Ensure theme compatibility
   - Verify that the simplified spacing works in both light and dark themes
   - Test responsive layouts with new spacing values
   - Maintain existing component spacing relationships

## Technical Guidelines
- Update variables in globals.css as the single source of truth
- Use search and replace functionality to update CSS module references
- Follow the mapping pattern:
  - --space-2xs → --space-xs (0.25rem/4px)
  - --space-xs → --space-sm (0.5rem/8px)
  - --space-sm → --space-sm (0.75rem → 0.5rem)
  - --space-md → --space-md (1rem/16px)
  - --space-lg → --space-lg (1.5rem/24px)
  - --space-xl → --space-xl (2rem/32px)
  - --space-2xl → --space-xl (2.5rem → 2rem)
  - --space-3xl → --space-xl (3rem → 2rem)
- Review components after changes to ensure UI consistency

## Expected Outcome
- A more intuitive and simpler spacing system
- More consistent spacing application across the application
- Better maintainability with fewer variables to track
- Preserved visual hierarchy and component relationships

## Validation Criteria
- [x] Updated globals.css with simplified scale
- [x] All CSS modules updated to use new spacing variables
- [x] Visual review of all components to ensure consistent appearance
- [x] Responsive layout testing across different screen sizes
- [x] Theme compatibility verified in both light and dark modes
- [x] Documentation updated to reflect new spacing system
- [x] Border radius token system added as a complementary improvement
- [x] Shadow token system implemented with clear usage guidelines
