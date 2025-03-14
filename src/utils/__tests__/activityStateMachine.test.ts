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

    test('should allow PENDING -> RUNNING transition', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      const activity = stateMachine.getActivityState('activity1');
      
      expect(activity?.state).toBe('RUNNING');
      expect(activity?.startedAt).toBeDefined();
      expect(activity?.completedAt).toBeUndefined();
    });

    test('should allow RUNNING -> COMPLETED transition', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      
      const activity = stateMachine.getActivityState('activity1');
      expect(activity?.state).toBe('COMPLETED');
      expect(activity?.startedAt).toBeDefined();
      expect(activity?.completedAt).toBeDefined();
    });

    test('should allow PENDING -> REMOVED transition', () => {
      stateMachine.addActivity('activity1');
      stateMachine.removeActivity('activity1');
      
      const activity = stateMachine.getActivityState('activity1');
      expect(activity?.state).toBe('REMOVED');
      expect(activity?.startedAt).toBeUndefined();
      expect(activity?.removedAt).toBeDefined();
    });

    test('should allow RUNNING -> REMOVED transition', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.removeActivity('activity1');
      
      const activity = stateMachine.getActivityState('activity1');
      expect(activity?.state).toBe('REMOVED');
      expect(activity?.startedAt).toBeDefined();
      expect(activity?.removedAt).toBeDefined();
    });

    test('should automatically complete current activity when starting a new one', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      
      stateMachine.startActivity('activity1');
      expect(stateMachine.getCurrentActivity()?.id).toBe('activity1');
      expect(stateMachine.getActivityState('activity1')?.state).toBe('RUNNING');
      
      stateMachine.startActivity('activity2');
      
      const activity1 = stateMachine.getActivityState('activity1');
      expect(activity1?.state).toBe('COMPLETED');
      expect(activity1?.completedAt).toBeDefined();
      
      const activity2 = stateMachine.getActivityState('activity2');
      expect(activity2?.state).toBe('RUNNING');
      expect(stateMachine.getCurrentActivity()?.id).toBe('activity2');
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

    test('should not start activity that is COMPLETED', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      
      expect(() => stateMachine.startActivity('activity1')).toThrow();
    });

    test('should not start activity that is REMOVED', () => {
      stateMachine.addActivity('activity1');
      stateMachine.removeActivity('activity1');
      
      expect(() => stateMachine.startActivity('activity1')).toThrow();
    });

    test('should not complete non-existing activity', () => {
      expect(() => stateMachine.completeActivity('nonexistent')).toThrow();
    });

    test('should not complete activity that is PENDING', () => {
      stateMachine.addActivity('activity1');
      expect(() => stateMachine.completeActivity('activity1')).toThrow();
    });

    test('should not complete activity that is COMPLETED', () => {
      stateMachine.addActivity('activity1');
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      
      expect(() => stateMachine.completeActivity('activity1')).toThrow();
    });

    test('should not complete activity that is REMOVED', () => {
      stateMachine.addActivity('activity1');
      stateMachine.removeActivity('activity1');
      
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

    test('isCompleted should return true when activities are mix of completed and removed', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      stateMachine.addActivity('activity3');
      
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      stateMachine.removeActivity('activity2'); // Direct PENDING -> REMOVED transition
      stateMachine.startActivity('activity3');
      stateMachine.removeActivity('activity3'); // RUNNING -> REMOVED transition
      
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

    test('getActivitiesByState should return correct activities', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      stateMachine.addActivity('activity3');
      stateMachine.addActivity('activity4');
      
      // Complete activity1
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      
      // Start activity2
      stateMachine.startActivity('activity2');
      
      // Remove activity3 from PENDING
      stateMachine.removeActivity('activity3');
      
      const pending = stateMachine.getActivitiesByState('PENDING');
      const running = stateMachine.getActivitiesByState('RUNNING');
      const completed = stateMachine.getActivitiesByState('COMPLETED');
      const removed = stateMachine.getActivitiesByState('REMOVED');
      
      expect(pending.length).toBe(1);
      expect(pending[0].id).toBe('activity4');
      
      expect(running.length).toBe(1);
      expect(running[0].id).toBe('activity2');
      
      expect(completed.length).toBe(1);
      expect(completed[0].id).toBe('activity1');
      
      expect(removed.length).toBe(1);
      expect(removed[0].id).toBe('activity3');
    });
  });

  describe('Completion Rules', () => {
    test('isCompleted should return false when there are running activities', () => {
      stateMachine.addActivity('activity1');
      
      stateMachine.startActivity('activity1');
      expect(stateMachine.isCompleted()).toBeFalsy();
    });

    test('isCompleted should return true only when all activities are either completed or removed', () => {
      stateMachine.addActivity('activity1');
      stateMachine.addActivity('activity2');
      stateMachine.addActivity('activity3');
      
      // Start and complete activity1
      stateMachine.startActivity('activity1');
      stateMachine.completeActivity('activity1');
      
      // Remove activity2 without starting
      stateMachine.removeActivity('activity2');
      
      // Start and complete activity3
      stateMachine.startActivity('activity3');
      stateMachine.completeActivity('activity3');
      
      expect(stateMachine.isCompleted()).toBeTruthy();
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