import {
  getActivities,
  saveActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  validateActivity,
  resetActivitiesToDefault,
  getActivitiesInOrder,
  reorderActivities,
  restoreActivity,
  synchronizeActivityOrder,
} from './activity-storage';
import { Activity, DEFAULT_ACTIVITIES } from '../types/activity';
import { 
  getActivityOrder, 
  setActivityOrder 
} from './activity-order';

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

    it('should reset activity order to match default activities', () => {
      // Set up custom order first
      setActivityOrder(['custom-1', 'custom-2']);
      expect(getActivityOrder()).toEqual(['custom-1', 'custom-2']);
      
      // Reset to defaults
      resetActivitiesToDefault();
      
      // Verify order is reset to default activity IDs
      const activities = getActivities();
      const expectedOrder = activities
        .filter(a => a.isActive)
        .map(a => a.id);
      expect(getActivityOrder()).toEqual(expectedOrder);
    });
  });

  describe('Order Integration', () => {
    beforeEach(() => {
      localStorage.clear();
      // Set up default activities for order tests
      saveActivities(DEFAULT_ACTIVITIES);
    });

    describe('getActivitiesInOrder', () => {
      it('should return activities in creation order when no custom order exists', () => {
        const activities = getActivitiesInOrder();
        const regularActivities = getActivities();
        
        // Should be same as regular getActivities when no custom order
        expect(activities).toEqual(regularActivities);
      });

      it('should return activities in custom order when order exists', () => {
        // Set custom order (reverse of default)
        const customOrder = ['4', '3', '2', '1'];
        setActivityOrder(customOrder);
        
        const activities = getActivitiesInOrder();
        
        // Should be in custom order
        expect(activities.map(a => a.id)).toEqual(customOrder);
      });

      it('should handle activities not in custom order by appending them', () => {
        // Add a new activity
        const newActivity: Activity = {
          id: '5',
          name: 'New Activity',
          colorIndex: 4,
          description: 'New activity',
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        addActivity(newActivity);
        
        // Set partial custom order
        const partialOrder = ['2', '1'];
        setActivityOrder(partialOrder);
        
        const activities = getActivitiesInOrder();
        const orderedIds = activities.map(a => a.id);
        
        // First two should be in custom order
        expect(orderedIds.slice(0, 2)).toEqual(['2', '1']);
        // Remaining should include the unordered activities
        expect(orderedIds).toContain('3');
        expect(orderedIds).toContain('4');
        expect(orderedIds).toContain('5');
      });
    });

    describe('reorderActivities', () => {
      it('should set new activity order', () => {
        const newOrder = ['3', '1', '4', '2'];
        reorderActivities(newOrder);
        
        expect(getActivityOrder()).toEqual(newOrder);
        
        const activities = getActivitiesInOrder();
        expect(activities.map(a => a.id)).toEqual(newOrder);
      });

      it('should filter out invalid activity IDs', () => {
        const orderWithInvalid = ['3', 'invalid-id', '1', '4'];
        reorderActivities(orderWithInvalid);
        
        // Should only include valid IDs
        expect(getActivityOrder()).toEqual(['3', '1', '4']);
      });

      it('should handle empty array', () => {
        // Set initial order
        setActivityOrder(['1', '2', '3', '4']);
        
        reorderActivities([]);
        
        expect(getActivityOrder()).toEqual([]);
      });

      it('should handle non-array input gracefully', () => {
        // Set initial order
        setActivityOrder(['1', '2', '3', '4']);
        
        // @ts-expect-error Testing invalid input
        reorderActivities('not-an-array');
        
        // Should not change existing order
        expect(getActivityOrder()).toEqual(['1', '2', '3', '4']);
      });
    });

    describe('addActivity with order integration', () => {
      it('should add new activity to end of custom order', () => {
        // Set initial order
        setActivityOrder(['2', '1', '4', '3']);
        
        const newActivity: Activity = {
          id: '5',
          name: 'New Activity',
          colorIndex: 4,
          description: 'New activity',
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        
        addActivity(newActivity);
        
        // Should be added to end of order
        expect(getActivityOrder()).toEqual(['2', '1', '4', '3', '5']);
      });

      it('should not add inactive activity to order', () => {
        setActivityOrder(['1', '2']);
        
        const inactiveActivity: Activity = {
          id: '5',
          name: 'Inactive Activity',
          colorIndex: 4,
          description: 'Inactive activity',
          createdAt: new Date().toISOString(),
          isActive: false,
        };
        
        addActivity(inactiveActivity);
        
        // Order should remain unchanged
        expect(getActivityOrder()).toEqual(['1', '2']);
      });
    });

    describe('deleteActivity with order integration', () => {
      it('should remove deleted activity from custom order', () => {
        setActivityOrder(['1', '2', '3', '4']);
        
        deleteActivity('2');
        
        // Should be removed from order
        expect(getActivityOrder()).toEqual(['1', '3', '4']);
        
        // Activity should still exist but be inactive
        const activities = getActivities();
        const deletedActivity = activities.find(a => a.id === '2');
        expect(deletedActivity?.isActive).toBe(false);
      });

      it('should handle deleting activity not in order', () => {
        setActivityOrder(['1', '3']);
        
        deleteActivity('2');
        
        // Order should remain unchanged
        expect(getActivityOrder()).toEqual(['1', '3']);
      });
    });

    describe('restoreActivity', () => {
      it('should restore deleted activity and add to end of order', () => {
        // Delete an activity first
        deleteActivity('2');
        setActivityOrder(['1', '3', '4']);
        
        // Restore it
        restoreActivity('2');
        
        // Should be added back to end of order
        expect(getActivityOrder()).toEqual(['1', '3', '4', '2']);
        
        // Activity should be active again
        const activities = getActivities();
        const restoredActivity = activities.find(a => a.id === '2');
        expect(restoredActivity?.isActive).toBe(true);
      });

      it('should not affect already active activity', () => {
        setActivityOrder(['1', '2', '3', '4']);
        
        restoreActivity('2');
        
        // Order should remain unchanged
        expect(getActivityOrder()).toEqual(['1', '2', '3', '4']);
      });

      it('should handle non-existent activity ID', () => {
        setActivityOrder(['1', '2', '3', '4']);
        
        restoreActivity('non-existent');
        
        // Order should remain unchanged
        expect(getActivityOrder()).toEqual(['1', '2', '3', '4']);
      });
    });

    describe('synchronizeActivityOrder', () => {
      it('should remove orphaned IDs from order', () => {
        // Set order with some non-existent IDs
        setActivityOrder(['1', 'orphaned-1', '2', 'orphaned-2', '3']);
        
        synchronizeActivityOrder();
        
        // Should only contain existing active activity IDs
        expect(getActivityOrder()).toEqual(['1', '2', '3']);
      });

      it('should handle deleted activities in order', () => {
        setActivityOrder(['1', '2', '3', '4']);
        
        // Delete an activity
        deleteActivity('2');
        
        // Synchronize should clean up the order
        synchronizeActivityOrder();
        
        expect(getActivityOrder()).toEqual(['1', '3', '4']);
      });

      it('should not affect valid order', () => {
        const validOrder = ['1', '2', '3', '4'];
        setActivityOrder(validOrder);
        
        synchronizeActivityOrder();
        
        expect(getActivityOrder()).toEqual(validOrder);
      });
    });
  });
});
