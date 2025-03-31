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

# Code Unification Initiative

## Context
The codebase currently contains several instances of similar functionality implemented in different places. This creates maintenance challenges and increases the risk of bugs when changes need to be made in multiple locations. Key areas needing unification include:

- Time-related utility functions spread across multiple files
- Potentially duplicated state management logic in hooks
- Similar UI components that could share common patterns
- CSS utility classes that may be reimplemented across components

## Requirements

1. Unify Time Formatting Utilities
   - Consolidate time formatting functions from `time.ts` and `timeUtils.ts` into a single utility file
   - Standardize parameter formats (milliseconds vs seconds) with clear function naming
   - Create comprehensive test coverage for all time formatting scenarios
   - Update all imports across the codebase to reference the unified utilities
   - Move unrelated utility functions (like `generateUniqueId()`) to more appropriate utility files

2. Create Common Component Library
   - Identify UI elements used in multiple places (buttons, indicators, time displays)
   - Extract these elements into reusable components with consistent props
   - Ensure consistent styling across all component instances
   - Update existing implementations to use the new common components
   - Test both the common components and their integration in various contexts

3. Standardize State Management
   - Review hooks like `useTimeDisplay`, `useActivitiesTracking`, and `useTimelineEntries` for overlapping patterns
   - Create higher-order hooks for shared functionality
   - Refactor existing components to use the unified hooks
   - Ensure comprehensive test coverage for all state management scenarios
   - Document the patterns for future development

4. Establish CSS Utility Classes
   - Identify common styling patterns across components
   - Create utility classes for these patterns
   - Replace inline styles and repetitive CSS with utility classes
   - Document the available utility classes for future development
   - Ensure theme compatibility across all utility classes

## Technical Guidelines
- Each unification should be implemented as a separate PR to limit scope and risk
- All changes must include comprehensive test coverage (both unit and integration tests)
- Updates to imports must be thoroughly tested to ensure no functionality is broken
- Documentation should be updated to reflect new utility functions and components
- Performance should be considered, particularly for frequently used utility functions
- Follow test-first development by writing tests for both existing and new functionality before implementation

## Expected Outcome
- Reduced codebase size through elimination of duplicated code
- Improved maintainability with unified patterns
- Consistent behavior across similar functionality
- Easier onboarding for new developers with clearer patterns
- Reduced risk when making changes to core functionality

## Implementation Phases
1. **Discovery and Documentation (1-2 days)**
   - Complete comprehensive audit of similar functionality
   - Document all instances with examples
   - Create detailed test cases for existing functionality

2. **Time Utility Unification (2-3 days)**
   - Create unified time utilities with test coverage
   - Update all imports and usage
   - Verify behavior remains consistent

3. **Component Pattern Extraction (3-5 days)**
   - Extract common UI components
   - Update existing uses
   - Ensure consistent styling

4. **State Management Refactoring (3-5 days)**
   - Create unified hook patterns
   - Refactor components to use shared hooks
   - Verify state management remains consistent

5. **CSS Utility Standardization (2-3 days)**
   - Create utility classes
   - Replace inline and repetitive styles
   - Document available utilities

## Validation Criteria
- [ ] Comprehensive test coverage for all unified utilities
- [ ] Zero regression in existing functionality
- [ ] Reduced overall codebase size
- [ ] Documentation updated for all new patterns
- [ ] All existing components using the unified utilities
- [ ] Successful test runs across the entire application
