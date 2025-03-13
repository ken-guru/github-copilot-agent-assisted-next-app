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

---

# Clarify Activity Completion Logic
## Context
The application's logic for determining when all activities are complete is currently complex and potentially inconsistent. This affects:
- `activityUtils.ts` and its completion logic
- `useActivityState.ts` hook that uses this logic
- All test files that verify completion behavior

Current behavior has some ambiguity around:
- The relationship between started and completed activities
- How removed activities affect completion status
- The order-dependency of completion checks

## Requirements
1. Implement Clear Completion Rules
   - Immediate false conditions must be checked first
     - Any activity currently running
     - Any activities still in active set
   - Base requirements for completion
     - At least one activity must be started AND completed
     - All activities must be "handled" (completed or removed)
   - Specific case handling
     - Non-removed activities must ALL be started and completed
     - Removed activities don't need to be started
     - System must have at least one completed activity

2. Update Test Coverage
   - Add comprehensive test cases for all edge cases
   - Ensure consistent testing of `hasActuallyStartedActivity` flag
   - Add tests for order-independence of completion checks
   - Update existing tests to align with clarified rules

3. Improve Documentation
   - Update code comments to clearly explain each rule
   - Add detailed explanations for edge cases
   - Document the reasoning behind completion checks

## Technical Guidelines
- Keep the implementation in TypeScript
- Maintain current function signature for backward compatibility
- Ensure consistent behavior regardless of how the state was reached
- Add detailed JSDoc comments
- Consider extracting complex logic into well-named helper functions

## Expected Outcome
User Perspective:
- More predictable behavior when activities are completed
- Clearer understanding of when the system will move to summary state

Technical Perspective:
- More maintainable and understandable code
- Better test coverage
- Elimination of order-dependent logic
- Clear documentation of all rules

## Validation Criteria
- [ ] Comprehensive test suite written first
- [ ] Implementation matches test cases
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Edge cases covered
- [ ] No regression in existing functionality