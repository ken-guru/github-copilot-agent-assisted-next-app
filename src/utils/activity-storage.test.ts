import {
  getActivities,
  saveActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  validateActivity,
  resetActivitiesToDefault,
  duplicateActivitiesFromSession,
  getOriginalSessionId,
  clearOriginalSessionTracking,
  areActivitiesDuplicated,
} from './activity-storage';
import { Activity, DEFAULT_ACTIVITIES } from '../types/activity';
import type { ActivitySummary } from '../types/session-sharing';

describe('activity-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default activities if localStorage is empty', () => {
    const activities = getActivities();
    
    // Check that we get the expected default activities structure
    expect(activities).toHaveLength(4);
    expect(activities[0]).toMatchObject({
      id: '1',
      name: 'Homework',
      colorIndex: 0,
      description: 'Academic work and study time',
      isActive: true
    });
    expect(activities[0]?.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should save and retrieve activities from localStorage', () => {
    saveActivities(DEFAULT_ACTIVITIES);
    expect(getActivities()).toEqual(DEFAULT_ACTIVITIES);
  });

  it('should add a new activity', () => {
    const newActivity: Activity = {
      id: '5',
      name: 'Exercise',
      colorIndex: 4,
      description: 'Physical activity',
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    addActivity(newActivity);
    const activities = getActivities();
    expect(activities.some(a => a.id === '5')).toBe(true);
  });

  it('should update an existing activity', () => {
    const original = DEFAULT_ACTIVITIES[0];
    expect(original).toBeDefined();
    const updated: Activity = {
      id: original!.id,
      name: 'Homework Updated',
      description: original!.description,
      colorIndex: original!.colorIndex,
      createdAt: original!.createdAt,
      isActive: original!.isActive,
    };
    saveActivities(DEFAULT_ACTIVITIES);
    updateActivity(updated);
    const activities = getActivities();
    expect(activities.find(a => a.id === '1')?.name).toBe('Homework Updated');
  });

  it('should soft delete an activity', () => {
    saveActivities(DEFAULT_ACTIVITIES);
    deleteActivity('1');
    const activities = getActivities();
    expect(activities.find(a => a.id === '1')?.isActive).toBe(false);
  });

  it('should validate a correct activity object', () => {
    expect(validateActivity(DEFAULT_ACTIVITIES[0])).toBe(true);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem('activities_v1', 'not-json');
    const activities = getActivities();
    
    // Check that we get the expected default activities structure
    expect(activities).toHaveLength(4);
    const firstActivity = activities[0];
    expect(firstActivity).toMatchObject({
      id: '1',
      name: 'Homework',
      colorIndex: 0,
      description: 'Academic work and study time',
      isActive: true
    });
    expect(firstActivity?.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should handle localStorage quota exceeded error', () => {
    // Simulate quota exceeded by throwing on setItem
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => { throw new DOMException('QuotaExceededError'); };
    expect(() => saveActivities(DEFAULT_ACTIVITIES)).not.toThrow();
    localStorage.setItem = originalSetItem;
  });

  it('should persist activities across sessions', () => {
    saveActivities(DEFAULT_ACTIVITIES);
    // Simulate reload
    expect(getActivities()).toEqual(DEFAULT_ACTIVITIES);
  });

  describe('resetActivitiesToDefault', () => {
    it('should clear localStorage and restore default activities', () => {
      // Set up some custom activities in localStorage first
      const customActivities = [
        {
          id: 'custom-1',
          name: 'Custom Activity',
          description: 'A custom activity',
          colorIndex: 0,
          createdAt: new Date().toISOString(),
          isActive: true,
        }
      ];
      saveActivities(customActivities);
      
      // Verify custom activities are stored
      expect(getActivities()).toEqual(customActivities);
      
      // Reset to defaults
      resetActivitiesToDefault();
      
      // Verify localStorage now contains default activities
      const activities = getActivities();
      expect(activities).toHaveLength(4);
      expect(activities[0]).toMatchObject({
        id: '1',
        name: 'Homework',
        colorIndex: 0,
        description: 'Academic work and study time',
        isActive: true
      });
      expect(activities[0]?.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should generate fresh timestamps when resetting', () => {
      const beforeReset = new Date();
      resetActivitiesToDefault();
      const afterReset = new Date();
      
      const activities = getActivities();
      const firstActivityTimestamp = new Date(activities[0]?.createdAt || '');
      
      expect(firstActivityTimestamp.getTime()).toBeGreaterThanOrEqual(beforeReset.getTime());
      expect(firstActivityTimestamp.getTime()).toBeLessThanOrEqual(afterReset.getTime());
    });
  });

  describe('Activity Duplication', () => {
    const mockActivitySummaries: ActivitySummary[] = [
      { id: 'shared-1', name: 'Shared Homework', duration: 1800, colorIndex: 0 },
      { id: 'shared-2', name: 'Shared Reading', duration: 1200, colorIndex: 1 }
    ];
    const mockSessionId = 'test-session-123';

    beforeEach(() => {
      localStorage.clear();
    });

    describe('duplicateActivitiesFromSession', () => {
      it('should replace current activities with duplicated ones', () => {
        // Set up some existing activities
        saveActivities(DEFAULT_ACTIVITIES);
        expect(getActivities()).toHaveLength(4);

        // Duplicate activities from session
        duplicateActivitiesFromSession(mockActivitySummaries, mockSessionId);

        // Check that activities were replaced
        const activities = getActivities();
        expect(activities).toHaveLength(2);
        expect(activities[0]).toMatchObject({
          name: 'Shared Homework',
          colorIndex: 0,
          description: 'Duplicated from shared session',
          isActive: true
        });
        expect(activities[0]?.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(activities[0]?.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });

      it('should store original session tracking information', () => {
        duplicateActivitiesFromSession(mockActivitySummaries, mockSessionId);

        expect(localStorage.getItem('originalSessionId')).toBe(mockSessionId);
        expect(localStorage.getItem('activitiesDuplicatedAt')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });

      it('should handle empty activity list', () => {
        duplicateActivitiesFromSession([], mockSessionId);

        const activities = getActivities();
        expect(activities).toHaveLength(0);
        expect(getOriginalSessionId()).toBe(mockSessionId);
      });

      it('should throw error on localStorage failure', () => {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = () => { throw new Error('Storage error'); };

        expect(() => duplicateActivitiesFromSession(mockActivitySummaries, mockSessionId))
          .toThrow('Failed to duplicate activities from shared session');

        localStorage.setItem = originalSetItem;
      });
    });

    describe('getOriginalSessionId', () => {
      it('should return original session ID when activities are duplicated', () => {
        duplicateActivitiesFromSession(mockActivitySummaries, mockSessionId);
        expect(getOriginalSessionId()).toBe(mockSessionId);
      });

      it('should return null when no activities are duplicated', () => {
        expect(getOriginalSessionId()).toBeNull();
      });

      it('should handle localStorage errors gracefully', () => {
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = () => { throw new Error('Storage error'); };

        expect(getOriginalSessionId()).toBeNull();

        localStorage.getItem = originalGetItem;
      });
    });

    describe('clearOriginalSessionTracking', () => {
      it('should clear tracking information', () => {
        duplicateActivitiesFromSession(mockActivitySummaries, mockSessionId);
        expect(getOriginalSessionId()).toBe(mockSessionId);

        clearOriginalSessionTracking();
        expect(getOriginalSessionId()).toBeNull();
        expect(localStorage.getItem('activitiesDuplicatedAt')).toBeNull();
      });

      it('should handle localStorage errors gracefully', () => {
        const originalRemoveItem = localStorage.removeItem;
        localStorage.removeItem = () => { throw new Error('Storage error'); };

        expect(() => clearOriginalSessionTracking()).not.toThrow();

        localStorage.removeItem = originalRemoveItem;
      });
    });

    describe('areActivitiesDuplicated', () => {
      it('should return true when activities are duplicated', () => {
        duplicateActivitiesFromSession(mockActivitySummaries, mockSessionId);
        expect(areActivitiesDuplicated()).toBe(true);
      });

      it('should return false when no activities are duplicated', () => {
        expect(areActivitiesDuplicated()).toBe(false);
      });

      it('should return false after clearing tracking', () => {
        duplicateActivitiesFromSession(mockActivitySummaries, mockSessionId);
        expect(areActivitiesDuplicated()).toBe(true);

        clearOriginalSessionTracking();
        expect(areActivitiesDuplicated()).toBe(false);
      });

      it('should handle localStorage errors gracefully', () => {
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = () => { throw new Error('Storage error'); };

        expect(areActivitiesDuplicated()).toBe(false);

        localStorage.getItem = originalGetItem;
      });
    });
  });
});
