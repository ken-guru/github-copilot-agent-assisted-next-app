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


# Clarify Activity Completion Logic

## Context
The activity state management currently spans multiple hooks and utilities, tracking state across various collections (activities, allActivityIds, startedActivityIds, etc). This has led to:
- Complex completion logic
- Potential state inconsistencies
- Difficult-to-predict behavior
- Hard-to-maintain code

Components/utilities affected:
- useActivitiesTracking.ts
- useActivityState.ts
- activityUtils.ts

## Requirements
1. Implement Activity State Machine
   - Define explicit states: PENDING, RUNNING, COMPLETED, REMOVED
   - Define allowed transitions:
     * PENDING -> RUNNING -> COMPLETED
     * PENDING -> RUNNING -> REMOVED
     * PENDING -> REMOVED
   - Track temporal data (startedAt, completedAt)
   - Validate all state transitions

2. State Management Interface
   - Replace multiple state collections with single state map
   - Maintain activity history for timeline
   - Prevent invalid state transitions
   - Provide clear activity status queries

3. Migration Strategy
   - Maintain backward compatibility
   - Preserve existing activity data during transitions
   - Update tests to reflect new state model

## Implementation Strategy
1. Core State Machine Types and Interfaces:
```typescript
interface ActivityState {
  id: string;
  state: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'REMOVED';
  startedAt?: number;
  completedAt?: number;
}

interface ActivityStateMachine {
  states: Map<string, ActivityState>;
  currentActivityId: string | null;

  // State Transitions
  addActivity(id: string): void;
  startActivity(id: string): void;
  completeActivity(id: string): void;
  removeActivity(id: string): void;

  // Queries
  isCompleted(): boolean;
  hasStartedAny(): boolean;
  getCurrentActivity(): ActivityState | null;
  getActivityState(id: string): ActivityState | undefined;
}
```

2. Implementation Phases
   - Create and test state machine implementation
   - Update useActivitiesTracking to use state machine internally
   - Refactor useActivityState to leverage new model
   - Update activityUtils.ts to work with state machine
   - Update tests to cover new state transitions

## Technical Guidelines
- Keep implementation in TypeScript
- Use strict type checking
- Implement as pure functions where possible
- Add comprehensive error handling
- Include detailed state transition validation
- Add extensive test coverage for state transitions
- Document all public interfaces
- Consider extracting complex logic into well-named helper functions
- Maintain current function signatures for backward compatibility
- Ensure consistent behavior regardless of how state was reached
- Add detailed JSDoc comments

## Expected Outcome
User Perspective:
- More predictable activity progression
- Clearer feedback about activity state
- No unexpected transitions to summary screen
- More predictable behavior when activities are completed
- Clearer understanding of when the system will move to summary state

Technical Perspective:
- Single source of truth for activity state
- Explicit and validated state transitions
- Simpler completion logic
- Better testability
- Easier maintenance
- Clear activity lifecycle documentation
- More maintainable and understandable code
- Better test coverage
- Elimination of order-dependent logic

## Validation Criteria
- [ ] State machine tests written and passing
- [ ] All state transitions tested
- [ ] Invalid transitions prevented
- [ ] Migration tests verifying backward compatibility
- [ ] Integration tests with existing components
- [ ] Documentation updated with state machine diagram
- [ ] No regression in existing functionality
- [ ] Edge cases covered:
  - Multiple activities
  - Activity removal mid-session
  - Activity completion order
  - Timeline integrity maintained
- [ ] All tests passing
- [ ] Documentation updated
