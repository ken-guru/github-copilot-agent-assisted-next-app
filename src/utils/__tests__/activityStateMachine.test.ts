import { ActivityStateMachine } from '../activityStateMachine';

describe('ActivityStateMachine', () => {
  let stateMachine: ActivityStateMachine;

  beforeEach(() => {
    stateMachine = new ActivityStateMachine();
  });

  describe('State Transitions', () => {
    test('should add activity in PENDING state', () => {
      stateMachine.addActivity('activity1');
      const activity = stateMachine.getActivityState('activity1');
      
      expect(activity).toBeDefined();
      expect(activity?.state).toBe('PENDING');
      expect(activity?.startedAt).toBeUndefined();
      expect(activity?.completedAt).toBeUndefined();
    });

    test('should transition from PENDING to RUNNING', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      const activity = stateMachine.getActivityState('activity1');
      
      expect(activity?.state).toBe('RUNNING');
      expect(activity?.startedAt).toBeDefined();
    });

    test('should transition from RUNNING to COMPLETED', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      const activity = stateMachine.getActivityState('activity1');
      
      expect(activity?.state).toBe('COMPLETED');
      expect(activity?.completedAt).toBeDefined();
    });

    test('should transition from PENDING to REMOVED', () => {
      stateMachine.addActivity('activity1');
      stateMachine.removeActivity('activity1');
      const activity = stateMachine.getActivityState('activity1');
      
      expect(activity?.state).toBe('REMOVED');
      expect(activity?.removedAt).toBeDefined();
    });

    test('should transition from RUNNING to REMOVED', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.removeActivity('activity1');
      const activity = stateMachine.getActivityState('activity1');
      
      expect(activity?.state).toBe('REMOVED');
      expect(activity?.removedAt).toBeDefined();
    });
  });

  describe('Invalid Transitions', () => {
    test('should not add duplicate activity', () => {
      stateMachine.addActivity('activity1');
      expect(() => stateMachine.addActivity('activity1')).toThrow();
    });

    test('should not start non-existing activity', () => {
      expect(() => stateMachine.startActivity('nonexistent')).toThrow();
    });

    test('should not start activity that is not PENDING', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      
      expect(() => stateMachine.startActivity('activity1')).toThrow();
    });

    test('should not complete non-existing activity', () => {
      expect(() => stateMachine.completeActivity('nonexistent')).toThrow();
    });

    test('should not complete activity that is not RUNNING', () => {
      stateMachine.addActivity('activity1');
      
      expect(() => stateMachine.completeActivity('activity1')).toThrow();
    });

    test('should not remove non-existing activity', () => {
      expect(() => stateMachine.removeActivity('nonexistent')).toThrow();
    });

    test('should not remove COMPLETED activity', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      
      expect(() => stateMachine.removeActivity('activity1')).toThrow();
    });
  });

  describe('Current Activity', () => {
    test('should set current activity on start', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      
      const currentActivity = stateMachine.getCurrentActivity();
      expect(currentActivity?.id).toBe('activity1');
    });

    test('should clear current activity on completion', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      
      const currentActivity = stateMachine.getCurrentActivity();
      expect(currentActivity).toBeNull();
    });

    test('should clear current activity on removal', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.removeActivity('activity1');
      
      const currentActivity = stateMachine.getCurrentActivity();
      expect(currentActivity).toBeNull();
    });

    test('should automatically complete previous activity when starting new one', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      
      stateMachine.startActivity('activity1');
      stateMachine.startActivity('activity2');
      
      const activity1 = stateMachine.getActivityState('activity1');
      const activity2 = stateMachine.getActivityState('activity2');
      
      expect(activity1?.state).toBe('COMPLETED');
      expect(activity2?.state).toBe('RUNNING');
      expect(stateMachine.getCurrentActivity()?.id).toBe('activity2');
    });
  });

  describe('State Queries', () => {
    test('isCompleted should return false when there are pending activities', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      
      expect(stateMachine.isCompleted()).toBeFalsy();
    });

    test('isCompleted should return false when there are running activities', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      
      expect(stateMachine.isCompleted()).toBeFalsy();
    });

    test('isCompleted should return true when all activities are completed', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      stateMachine.startActivity('activity2');
      stateMachine.completeActivity('activity2');
      
      expect(stateMachine.isCompleted()).toBeTruthy();
    });

    test('isCompleted should return true when activities mix of completed and removed', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      stateMachine.addActivity('activity3');
      
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      stateMachine.removeActivity('activity2');
      stateMachine.startActivity('activity3');
      stateMachine.removeActivity('activity3');
      
      expect(stateMachine.isCompleted()).toBeTruthy();
    });

    test('hasStartedAny should return false initially', () => {
      expect(stateMachine.hasStartedAny()).toBeFalsy();
    });

    test('hasStartedAny should return true after starting an activity', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      
      expect(stateMachine.hasStartedAny()).toBeTruthy();
    });

    test('getActivitiesByState should return activities with specified state', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      stateMachine.addActivity('activity3');
      
      // Start activity1
      stateMachine.startActivity('activity1');
      
      // Start activity2 - this will automatically complete activity1
      stateMachine.startActivity('activity2');
      
      const pendingActivities = stateMachine.getActivitiesByState('PENDING');
      const runningActivities = stateMachine.getActivitiesByState('RUNNING');
      const completedActivities = stateMachine.getActivitiesByState('COMPLETED');
      
      // Only activity3 should be pending
      expect(pendingActivities.length).toBe(1);
      expect(pendingActivities[0].id).toBe('activity3');
      
      // Only activity2 should be running (activity1 was completed when activity2 started)
      expect(runningActivities.length).toBe(1);
      expect(runningActivities[0].id).toBe('activity2');
      
      // activity1 should be completed
      expect(completedActivities.length).toBe(1);
      expect(completedActivities[0].id).toBe('activity1');
    });
  });

  describe('Reset', () => {
    test('should clear all activities and current activity', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      stateMachine.startActivity('activity1');
      
      stateMachine.reset();
      
      expect(stateMachine.getAllActivities()).toHaveLength(0);
      expect(stateMachine.getCurrentActivity()).toBeNull();
    });
  });
});