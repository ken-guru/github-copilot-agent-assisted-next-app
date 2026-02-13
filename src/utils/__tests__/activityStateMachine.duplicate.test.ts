import { ActivityStateMachine } from '@mr-timely/shared';

// Make sure Jest recognizes this file correctly
describe('ActivityStateMachine Duplicate Activity Handling', () => {
  let stateMachine: ActivityStateMachine;
  
  beforeEach(() => {
    stateMachine = new ActivityStateMachine();
  });
  
  test('should throw error when adding duplicate activity with throwOnExisting=true', () => {
    // First addition should succeed
    expect(stateMachine.addActivity('activity1', true)).toBe(true);
    
    // Second addition of same ID should throw when throwOnExisting=true
    expect(() => stateMachine.addActivity('activity1', true)).toThrow('Activity with ID activity1 already exists');
  });
  
  test('should return false without throwing when adding duplicate activity with throwOnExisting=false', () => {
    // First addition should succeed
    expect(stateMachine.addActivity('activity1', true)).toBe(true);
    
    // Second addition of same ID should return false but not throw
    expect(stateMachine.addActivity('activity1', false)).toBe(false);
    
    // The activity should still exist and be in its original state
    const activity = stateMachine.getActivityState('activity1');
    expect(activity).toBeDefined();
    expect(activity?.state).toBe('PENDING');
  });
  
  test('should maintain state machine integrity when silently handling duplicates', () => {
    // Add and start an activity
    stateMachine.addActivity('activity1');
    stateMachine.startActivity('activity1');
    
    // Try to add the same activity again with throwOnExisting=false
    const addResult = stateMachine.addActivity('activity1', false);
    
    // Should return false and not affect the running activity
    expect(addResult).toBe(false);
    const activity = stateMachine.getActivityState('activity1');
    expect(activity?.state).toBe('RUNNING');
    expect(activity?.startedAt).toBeDefined();
    
    // Current activity should still be correctly set
    const currentActivity = stateMachine.getCurrentActivity();
    expect(currentActivity?.id).toBe('activity1');
  });
  
  test('should handle multiple duplicate attempts without affecting state', () => {
    // Initial setup with multiple activities
    stateMachine.addActivity('activity1');
    stateMachine.addActivity('activity2');
    stateMachine.startActivity('activity1'); // activity1 is RUNNING
    
    // Attempt multiple duplicate additions
    expect(stateMachine.addActivity('activity1', false)).toBe(false);
    expect(stateMachine.addActivity('activity2', false)).toBe(false);
    
    // State should be maintained
    expect(stateMachine.getActivityState('activity1')?.state).toBe('RUNNING');
    expect(stateMachine.getActivityState('activity2')?.state).toBe('PENDING');
    expect(stateMachine.getCurrentActivity()?.id).toBe('activity1');
    
    // Should be able to continue normal operation after duplicate attempts
    stateMachine.completeActivity('activity1');
    expect(stateMachine.getActivityState('activity1')?.state).toBe('COMPLETED');
    expect(stateMachine.getCurrentActivity()).toBeNull();
  });
});
