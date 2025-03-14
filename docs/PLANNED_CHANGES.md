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

# Fix Premature Summary State Transition Bug
## Context
The application currently has a critical bug where users can reach the summary state prematurely:
- Affects the state machine logic and activity completion flow
- Currently users can reach summary after completing just one activity
- Involves ActivityManager, Summary components, and state management
- Main components: activityStateMachine.ts, useActivityState.ts

## Requirements
1. End-to-End Test Implementation
   - Create new e2e test suite to reproduce the bug
   - Test full user flow from start to summary
   - Verify correct and incorrect state transitions
   - Must include multiple activity scenarios

2. Current Test Analysis
   - Review existing unit tests for logical flaws
   - Identify tests that should have caught this bug
   - Update tests to properly validate state transitions
   - Ensure no regression in existing functionality

3. Bug Fix Implementation
   - Update state machine logic to prevent premature transitions
   - Validate all activities are either completed or removed
   - Handle edge cases (e.g., removing vs completing activities)
   - Ensure proper state tracking for remaining activities

## Technical Guidelines
- Follow state machine pattern established in recent refactor
- Maintain separation of concerns between state logic and UI
- Ensure backward compatibility with existing features
- Add comprehensive error handling
- Include detailed test documentation
- Use TypeScript for all test implementations
- Configure Cypress for e2e testing while preserving future component testing capability
- Ensure CI/CD pipeline integration

## Testing Strategy
1. End-to-End Testing Setup
   - Replace Playwright references with Cypress
   - Configure Cypress with TypeScript support
   - Set base URL to http://localhost:3000
   - Configure default viewport for desktop testing
   - Setup test directory structure following Cypress conventions
   - Create initial test configuration that doesn't preclude future component testing

2. End-to-End Test Implementation
   - Create test suite for activity flow
   - Implement reproduction case for premature summary state
   - Test multiple activity scenarios
   - Validate correct summary state conditions

3. Unit Test Updates
   - Review activityStateMachine.test.ts
   - Update useActivityState.test.tsx
   - Add edge case coverage
   - Verify state transition logic

4. CI/CD Integration
   - Add Cypress job to GitHub workflow
   - Configure job dependencies correctly
   - Ensure proper caching of Cypress binary
   - Setup test artifact storage for failed tests
   - Configure parallel test execution if needed

## Expected Outcome
User Perspective:
- Summary state only appears when all activities are handled
- Clear feedback on remaining activities
- No unexpected state transitions

Technical Perspective:
- Robust state transition logic
- Complete test coverage
- Clear state management flow
- Documented edge cases

## Validation Criteria
- [ ] E2E tests implemented and passing
- [ ] Existing tests reviewed and updated
- [ ] Bug fix implementation complete
- [ ] State machine logic verified
- [ ] All test suites passing
- [ ] Edge cases documented and tested
- [ ] Code review completed

## Implementation Steps
1. Setup Phase
   - Create new e2e test directory
   - Setup test environment
   - Document reproduction steps

2. Testing Phase
   - Implement e2e tests
   - Review and update unit tests
   - Document test coverage gaps

3. Fix Implementation
   - Update state machine logic
   - Add state validation
   - Implement proper transition guards
   - Add activity completion tracking

4. Validation Phase
   - Run full test suite
   - Manual testing
   - Document changes
   - Review and merge
