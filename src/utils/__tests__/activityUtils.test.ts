import { isActivitiesCompleted } from '../activityUtils';

describe('activityUtils', () => {
  const defaultParams = {
    currentActivityRunning: false,
    activities: new Set<string>(),
    allActivityIds: new Set<string>(),
    startedActivityIds: new Set<string>(),
    completedActivityIds: [],
    removedActivityIds: []
  };

  describe('isActivitiesCompleted', () => {
    it('should return false when activity is running', () => {
      expect(isActivitiesCompleted({
        ...defaultParams,
        currentActivityRunning: true
      })).toBe(false);
    });

    it('should return false when activities set is not empty', () => {
      expect(isActivitiesCompleted({
        ...defaultParams,
        activities: new Set(['1'])
      })).toBe(false);
    });

    it('should return true when all activities are started and completed', () => {
      expect(isActivitiesCompleted({
        ...defaultParams,
        allActivityIds: new Set(['1', '2']),
        startedActivityIds: new Set(['1', '2']),
        completedActivityIds: ['1', '2']
      })).toBe(true);
    });

    it('should return false when some activities are not started', () => {
      expect(isActivitiesCompleted({
        ...defaultParams,
        allActivityIds: new Set(['1', '2']),
        startedActivityIds: new Set(['1']),
        completedActivityIds: ['1']
      })).toBe(false);
    });

    it('should return true when some activities are removed and others completed', () => {
      expect(isActivitiesCompleted({
        ...defaultParams,
        allActivityIds: new Set(['1', '2']),
        startedActivityIds: new Set(['1']),
        completedActivityIds: ['1'],
        removedActivityIds: ['2']
      })).toBe(true);
    });

    it('should return false when all activities are removed without starting any', () => {
      expect(isActivitiesCompleted({
        ...defaultParams,
        allActivityIds: new Set(['1', '2']),
        removedActivityIds: ['1', '2']
      })).toBe(false);
    });

    it('should return true when all activities are handled and at least one completed', () => {
      expect(isActivitiesCompleted({
        ...defaultParams,
        allActivityIds: new Set(['1', '2', '3']),
        startedActivityIds: new Set(['1']),
        completedActivityIds: ['1'],
        removedActivityIds: ['2', '3']
      })).toBe(true);
    });

    it('should return false when no activities exist', () => {
      expect(isActivitiesCompleted(defaultParams)).toBe(false);
    });
  });
});