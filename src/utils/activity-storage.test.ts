import {
  getActivities,
  saveActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  validateActivity,
} from './activity-storage';
import { Activity, DEFAULT_ACTIVITIES } from '../types/activity';

describe('activity-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default activities if localStorage is empty', () => {
    expect(getActivities()).toEqual(DEFAULT_ACTIVITIES);
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
    expect(getActivities()).toEqual(DEFAULT_ACTIVITIES);
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
});
