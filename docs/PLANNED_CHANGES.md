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

# Code Refactoring: Reduce Duplication and Improve Architecture

## Context
The application has grown organically and contains several areas of code duplication. This creates maintenance challenges and increases the risk of inconsistent behavior.
- Multiple components and tests contain duplicated logic for service worker mocking, time manipulation, and test data generation
- Color management code is duplicated across test files
- Event listener setup/teardown patterns are repeated in several components
- Similar utility functions exist with slight variations

## Requirements

### 1. Service Worker Testing Utilities
- Create a centralized testing utility for service worker mocking
  - Implement standardized mock setup for navigator.serviceWorker
  - Add helpers for simulating registration events and network status changes
  - Ensure proper cleanup between tests to prevent leakage
  - Document usage patterns with examples
- Update all test files to use the new utilities
  - Modify service worker registration tests
  - Update network status testing implementations
  - Ensure all tests continue to pass with the refactored approach

### 2. Test Data Generation Factories
- Implement factory functions for commonly used test objects
  - Create TimelineEntry factory with customizable properties
  - Develop color object generators that respect theme settings
  - Add activity state generation helpers
- Update test files to use the factories
  - Refactor Summary.test.tsx to use the timeline entry factory
  - Update color testing with standardized color objects
  - Ensure consistent test data across all component tests

### 3. Time Manipulation Utilities
- Create a centralized time utility for application and tests
  - Implement helpers for time calculation and formatting
  - Add test utilities for mocking Date.now() and controlling timers
  - Ensure proper cleanup of time mocks after tests
- Refactor time-dependent components and tests
  - Update components that manipulate time calculations
  - Modify tests that mock time functions
  - Ensure consistent time handling across the application

### 4. Event Listener Management
- Develop utilities for consistent event listener handling
  - Create helper for online/offline status management
  - Implement standardized cleanup patterns for useEffect hooks
  - Add utilities for managing timers and intervals
- Apply consistent patterns across components
  - Update service worker registration component
  - Modify online status detection implementation
  - Refactor components with timer/interval management

## Technical Guidelines
- Maintain backward compatibility with existing components
- Ensure each utility has proper TypeScript typing
- Document usage patterns in comments and examples
- Follow React best practices for hooks and cleanup
- Implement comprehensive test coverage for all utilities
- Use established naming conventions for consistency
- Ensure each refactoring step results in working application

## Expected Outcome
- User perspective
  - No visible changes to application behavior
  - Same functionality with improved reliability
- Technical perspective
  - Reduced code duplication
  - Improved maintainability and consistency
  - Enhanced test reliability
  - Better separation of concerns
  - More consistent patterns across codebase
- Testing criteria
  - All existing tests should continue to pass
  - Test setup should be more concise and consistent
  - Reduced test flakiness, especially in service worker tests

## Validation Criteria
For each requirement:
- [ ] Extract common patterns into utility functions
- [ ] Update existing implementations to use new utilities
- [ ] Write tests for new utility functions
- [ ] Verify all existing tests still pass
- [ ] Run the application to confirm no regression in functionality
- [ ] Update relevant documentation

Note: This refactoring should be implemented incrementally, with each step building on the previous. After each step, ensure all tests pass and the application remains fully functional before proceeding to the next step.
