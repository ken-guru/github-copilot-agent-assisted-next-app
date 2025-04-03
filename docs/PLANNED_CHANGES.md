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

<!-- Progress Bar styling implementation has been completed and moved to IMPLEMENTED_CHANGES.md (2025-04-02) -->
<!-- Time Utilities Consolidation has been completed and moved to IMPLEMENTED_CHANGES.md (2023-10-31) -->

# Test Suite Expansion Based on Known Bugs

## Context
Our application has several known bugs documented in KNOWN_BUGS.md and historical issues recorded in MEMORY_LOG.md. Before implementing fixes, we need to expand our test suite to properly capture these issues, ensuring they don't recur after fixes are applied.

- The current test suite has good coverage but doesn't adequately test edge cases related to known bugs
- Components involved: Summary, Timeline, TimeDisplay, TimeSetup, and related hooks
- Issues relate to activity ordering, timer updates, break visualization, time calculations, and service worker functionality

## Requirements
1. Create new test files and enhance existing ones to cover known bugs
   - Maintain test isolation to prevent cross-test contamination
   - Use Jest's timer mocking capabilities for time-dependent tests
   - Create specific tests for each documented bug
   - Test both normal and edge cases

2. Implement seven targeted test expansions
   - **Activity Order in Summary**
     - Test edge cases with similar start times
     - Verify order is maintained after re-renders
   
   - **Timer Display Consistency**
     - Test timer updates at regular intervals
     - Verify synchronization with elapsed time
     - Test long-running session behavior
   
   - **Break Visualization**
     - Test immediate break visualization
     - Verify breaks appear as soon as they begin
     - Test various timing scenarios for breaks
   
   - **Idle Time Calculation**
     - Test accurate calculation with various break patterns
     - Verify correct handling of multiple breaks
     - Test edge cases in time accounting

   - **Time Setup Input Formats**
     - Test consistency between duration and time-based inputs
     - Verify automatic break insertion works with time formats
     - Test edge cases in time input handling

   - **Service Worker Testing**
     - Improve test isolation
     - Test network awareness and retry mechanisms
     - Verify update notification processes

   - **Resource Cleanup and Memory Leaks**
     - Test proper component cleanup on unmount
     - Verify all timeouts and intervals are cleared
     - Test event listener cleanup

3. Ensure theme compatibility across all tested components
   - Test components in both light and dark themes
   - Verify contrast ratios meet accessibility standards
   - Test theme transitions work correctly

## Technical Guidelines
- Use React Testing Library for component tests
- Implement proper async/await patterns for asynchronous tests
- Use Jest's timer mocking (jest.useFakeTimers()) for time-dependent tests
- Follow test isolation best practices to prevent test interference
- Add specific data-testid attributes where needed for reliable selection
- Create dedicated test utilities for common testing patterns
- Implement theme testing utilities to verify theme compatibility

## Expected Outcome
- A comprehensive test suite that captures all known bugs
- Tests that fail initially but will pass once bugs are fixed
- Clear documentation of expected behavior through test assertions
- Improved developer understanding of correct component behavior
- Foundation for implementing fixes with confidence

## Validation Criteria
- [ ] New test files created
- [ ] Existing tests enhanced
- [ ] Tests specifically target known bug behaviors
- [ ] Tests initially fail (demonstrating they capture the bug)
- [ ] Tests isolated to prevent cross-contamination
- [ ] Documentation updated with test coverage information
- [ ] Memory log updated with test development process

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
- [ ] Updated globals.css with simplified scale
- [ ] All CSS modules updated to use new spacing variables
- [ ] Visual review of all components to ensure consistent appearance
- [ ] Responsive layout testing across different screen sizes
- [ ] Theme compatibility verified in both light and dark modes
- [ ] Documentation updated to reflect new spacing system
