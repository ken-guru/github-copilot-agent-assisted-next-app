/**
 * Utility functions for managing activities in localStorage
 * @module activity-storage
 * @see docs/components/activity-storage.md
 */
import { Activity } from '../types/activity';
import { ActivitySummary } from '../types/session-sharing';
import { generateUUID } from './uuid';
import defaultActivitiesConfig from '../../config/default-activities.json';

const STORAGE_KEY = 'activities_v1';

/**
 * Load default activities from configuration file
 * Uses the configuration defined in config/default-activities.json
 */
function loadDefaultActivities(): Activity[] {
  return defaultActivitiesConfig.defaultActivities.map(activity => ({
    ...activity,
    createdAt: new Date().toISOString(),
    isActive: true
  }));
}

/**
 * Get all activities from localStorage, or fallback to defaults
 * Handles corrupted data and versioning
 */
export function getActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return loadDefaultActivities();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Corrupted data');
    // Validate each activity
    if (parsed.every(validateActivity)) {
      return parsed;
    }
    throw new Error('Invalid activity structure');
  } catch {
    // Fallback to defaults on error
    return loadDefaultActivities();
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
  if (idx === -1) return;
  const current = activities[idx];
  if (!current) return;
  // Mutate in place to preserve exact Activity shape
  current.isActive = false;
  try {
    saveActivities(activities);
  } catch {
    // Handle quota exceeded or localStorage disabled
    // Optionally log error or notify user
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

/**
 * Reset activities to default configuration
 * Clears localStorage and replaces with fresh default activities
 */
export function resetActivitiesToDefault(): void {
  const defaultActivities = loadDefaultActivities();
  saveActivities(defaultActivities);
}

/**
 * Convert ActivitySummary to Activity for local storage
 * @param activitySummary ActivitySummary from shared session
 * @returns Activity object for local storage
 */
function convertActivitySummaryToActivity(activitySummary: ActivitySummary): Activity {
  return {
    id: generateUUID(),
    name: activitySummary.name,
    colorIndex: activitySummary.colorIndex,
    createdAt: new Date().toISOString(),
    isActive: true,
    description: `Duplicated from shared session`
  };
}

/**
 * Replace current activities with duplicated activities from shared session
 * @param activitySummaries Array of ActivitySummary objects from shared session
 * @param originalSessionId UUID of the original shared session
 */
export function duplicateActivitiesFromSession(
  activitySummaries: ActivitySummary[],
  originalSessionId: string
): void {
  try {
    // Convert ActivitySummary objects to Activity objects
    const newActivities = activitySummaries.map(convertActivitySummaryToActivity);
    
    // Store the original session ID for potential linking
    localStorage.setItem('originalSessionId', originalSessionId);
    localStorage.setItem('activitiesDuplicatedAt', new Date().toISOString());
    
    // Replace current activities
    saveActivities(newActivities);
  } catch (error) {
    console.error('Error duplicating activities:', error);
    throw new Error('Failed to duplicate activities from shared session');
  }
}

/**
 * Get the original session ID if activities were duplicated from a shared session
 * @returns Original session UUID or null if not duplicated
 */
export function getOriginalSessionId(): string | null {
  try {
    return localStorage.getItem('originalSessionId');
  } catch {
    return null;
  }
}

/**
 * Clear the original session tracking information
 */
export function clearOriginalSessionTracking(): void {
  try {
    localStorage.removeItem('originalSessionId');
    localStorage.removeItem('activitiesDuplicatedAt');
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Check if current activities were duplicated from a shared session
 * @returns True if activities were duplicated, false otherwise
 */
export function areActivitiesDuplicated(): boolean {
  try {
    return localStorage.getItem('originalSessionId') !== null;
  } catch {
    return false;
  }
}
