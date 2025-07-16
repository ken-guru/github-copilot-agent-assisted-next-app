/**
 * Utility functions for managing activities in localStorage
 * @module activity-storage
 * @see docs/components/activity-storage.md
 */
import { Activity, DEFAULT_ACTIVITIES } from '../types/activity';

const STORAGE_KEY = 'activities_v1';

/**
 * Get all activities from localStorage, or fallback to defaults
 * Handles corrupted data and versioning
 */
export function getActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ACTIVITIES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Corrupted data');
    // Validate each activity
    if (parsed.every(validateActivity)) {
      return parsed;
    }
    throw new Error('Invalid activity structure');
  } catch {
    // Fallback to defaults on error
    return DEFAULT_ACTIVITIES;
  }
}

/**
 * Save all activities to localStorage
 * @param activities Array of Activity objects
 */
export function saveActivities(activities: Activity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch {
    // Quota exceeded or localStorage disabled
    // Silently fail for now, could add error reporting
  }
}

/**
 * Add a new activity to localStorage
 * @param activity Activity object to add
 */
export function addActivity(activity: Activity): void {
  const activities = getActivities();
  activities.push(activity);
  saveActivities(activities);
}

/**
 * Update an existing activity in localStorage
 * @param activity Activity object to update
 */
export function updateActivity(activity: Activity): void {
  const activities = getActivities();
  const idx = activities.findIndex(a => a.id === activity.id);
  if (idx !== -1) {
    activities[idx] = activity;
    saveActivities(activities);
  }
}

/**
 * Delete (soft) an activity by id
 * @param id Activity id to delete
 */
export function deleteActivity(id: string): void {
  const activities = getActivities();
  const idx = activities.findIndex(a => a.id === id);
  if (idx !== -1 && activities[idx]) {
    activities[idx] = { ...activities[idx], isActive: false };
    try {
      saveActivities(activities);
    } catch {
      // Handle quota exceeded or localStorage disabled
      // Optionally log error or notify user
    }
  }
}

/**
 * Validate activity data structure
 * @param activity Activity object to validate
 */
export function validateActivity(activity: unknown): activity is Activity {
  if (!activity || typeof activity !== 'object') return false;
  const a = activity as Partial<Activity>;
  return (
    typeof a.id === 'string' &&
    typeof a.name === 'string' &&
    typeof a.colorIndex === 'number' &&
    typeof a.createdAt === 'string' &&
    typeof a.isActive === 'boolean'
  );
}
