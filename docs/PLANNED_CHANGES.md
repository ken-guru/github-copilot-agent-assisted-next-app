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

# Test Structure Reorganization

## Context
The current test organization has tests and mocks spread across multiple inconsistent locations:
- Some tests in `__tests__` subdirectories within source directories
- Some tests directly alongside components with `.test.tsx` extensions
- Test utilities in different locations
- Mock files in separate directories
- Duplicate test files for the same functionality

This inconsistent structure makes it difficult to:
- Find tests for specific functionality
- Understand test coverage
- Maintain a consistent testing approach
- Prevent duplication of test code

## Requirements
1. Establish a clear, consistent test organization structure
   - Define standard locations for unit tests, integration tests, and mocks
   - Create conventions for test file naming
   - Standardize import paths for test utilities

2. Migrate existing test files to the new structure
   - Create scripts to automate migration where possible
   - Ensure all imports are updated to reflect new locations
   - Verify tests still work after migration

3. Consolidate duplicate test files
   - Identify and remove duplicate tests (e.g., `useActivitiesTracking.duplicate.test.tsx`)
   - Merge test coverage where appropriate

4. Standardize test utilities and mocks
   - Create central location for mock data
   - Establish shared test utilities
   - Document usage patterns for test utilities

5. Update documentation for testing standards
   - Document the new structure
   - Provide guidelines for creating new tests
   - Include examples of proper test organization

## Technical Guidelines
- Preserve test functionality during migration
- Follow Jest best practices for test organization
- Update all import paths to prevent broken tests
- Maintain or improve test coverage during restructuring
- Use consistent naming patterns (e.g., `ComponentName.test.tsx`, `hookName.test.ts`)
- Separate unit tests from integration tests

## Expected Outcome
### New Test Structure:
```
/src
  /__tests__           # Root test directory
    /unit             # Unit tests
      /components     # Component unit tests
      /hooks          # Hook unit tests
      /utils          # Utility function unit tests
    /integration      # Integration tests
    /fixtures         # Test data fixtures
    /mocks            # Mock implementations
    /utils            # Test utilities
  /components
  /hooks
  /utils
```

### Benefits:
- All tests easily findable in one logical structure
- Clear separation between unit and integration tests
- Reduced duplication through centralized test utilities
- Improved maintainability
- Better test coverage visibility
- Consistent import paths

## Validation Criteria
- [ ] Migration script created for automated file movement
- [ ] All tests migrated to new structure
- [ ] All tests passing in new location
- [ ] Duplicate tests consolidated
- [ ] Test documentation updated
- [ ] CI pipeline updated to find tests in new locations
- [ ] Developer documentation updated with new test organization guidelines
- [ ] Example tests created for reference
- [ ] Memory Log updated with migration details
