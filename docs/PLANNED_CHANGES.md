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

# Time Utilities Consolidation

## Context
Our application currently has duplicate implementations of time-related utilities with overlapping functionality:
- `/src/utils/timeUtils.ts` - Contains a `formatTime` function that formats seconds to "MM:SS" format
- `/src/utils/testUtils/timeUtils.ts` - Contains a different `formatTime` that formats to "HH:MM:SS" format

This duplication creates confusion for developers and potential maintenance issues as both utilities evolve independently.

## Requirements
1. Clarify and distinguish the purpose of each time utility module
   - Clearly document each function's purpose and format
   - Rename functions to explicitly indicate their formatting style
   - Update tests to match renamed functions
   - Maintain backward compatibility where needed

2. Implement a phased consolidation approach
   - **Phase 1: Immediate Clarification**
     - Rename ambiguous functions to be more specific (e.g., `formatTimeHHMMSS`)
     - Add comprehensive documentation to each utility function
     - Update test files to use the new function names
     - Provide compatibility exports for existing code

   - **Phase 2: Comprehensive Consolidation**
     - Create a unified time utility module with format options
     - Move test-only utilities to appropriate locations
     - Update imports throughout the codebase
     - Add thorough test coverage for all functions

   - **Phase 3: Maintenance Improvements**
     - Establish guidelines for adding new utility functions
     - Create a review process for utility additions
     - Document best practices for testing utilities

3. Ensure consistent behavior across all time-related functions
   - Handle edge cases consistently (negative values, zero, large numbers)
   - Apply the same rounding rules for partial seconds/milliseconds
   - Document expected behavior for all functions

## Technical Guidelines
- Follow strict TypeScript typing for all function parameters and returns
- Apply consistent naming conventions across all time utilities
- Use JSDoc comments to document each function thoroughly
- Ensure test coverage includes edge cases for all functions
- Consider creating adapter functions for backward compatibility
- Document format specifiers clearly for developer understanding

## Expected Outcome
- Clear distinction between production time utilities and testing-specific utilities
- Consistent and well-documented time formatting across the application
- No duplicate implementations of the same functionality
- Comprehensive test coverage for all time utility functions
- Enhanced developer experience when working with time in the application

## Validation Criteria
- [x] Functions renamed to clearly indicate their purpose and format
- [x] All time utility functions thoroughly documented
- [x] Tests updated to use correct function names
- [x] Backward compatibility maintained where necessary
- [x] Documentation updated with utility usage examples
- [x] Memory log updated with consolidation process (MRTMLY-038)

## Detailed Implementation Plan

### Phase 1: Immediate Clarification
- [x] Rename functions to be more specific (e.g., formatTimeHHMMSS)
- [x] Add better documentation with JSDoc comments
- [x] Update tests to match renamed functions
- [x] Maintain compatibility with existing code via exports

### Phase 2: Comprehensive Consolidation

#### 1. Evaluate Core Time Functionality Needs
- [x] Create a unified time utility module with:
  - [x] Support for multiple format options (MM:SS, HH:MM:SS, custom)
  - [x] Consistent handling of milliseconds vs seconds inputs
  - [x] Clear documentation for each format option
  - [x] Thorough test coverage

#### 2. Separate Production vs Test Utilities
- [x] Move all test-only utilities to a dedicated location
- [x] Move shared utilities to a common location
- [x] Update imports across the codebase
- [x] Document the purpose of each utility location

#### 3. Update Other Files Using Time Utilities
- [x] Identify all files importing from timeUtils
- [x] Update imports and function calls as needed
- [x] Verify functionality remains the same

#### 4. Test Coverage Verification
- [x] Add any missing test cases for edge cases
- [x] Verify all modified functions have adequate test coverage
- [x] Run complete test suite to ensure no regressions

#### 5. Documentation
- [x] Update project-level documentation about time utilities
- [x] Add examples of using each time utility function
- [x] Document the rationale behind the structure changes

### Phase 3: Ongoing Maintenance

#### 1. Preventing Future Duplication
- [x] Create guidelines for adding new utility functions
- [ ] Establish review process for utility additions
- [x] Add utility usage examples to developer docs

#### 2. Review Testing Strategy
- [ ] Evaluate if test utilities need their own tests
- [ ] Consider meta-testing approach for test utilities
- [ ] Document best practices for testing utilities
