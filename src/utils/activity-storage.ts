/**
 * Utility functions for managing activities in localStorage
 * @module activity-storage
 * @see docs/components/activity-storage.md
 */
import { Activity } from '../types/activity';
import defaultActivitiesConfig from '../../config/default-activities.json';
import { 
  sortActivitiesByOrder, 
  addActivityToOrder, 
  removeActivityFromOrder, 
  cleanupActivityOrder,
  setActivityOrder 
} from './activity-order';

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
  
  // Add to end of custom order if activity is active
  if (activity.isActive) {
    addActivityToOrder(activity.id);
  }
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
    // Remove from custom order when deleted
    removeActivityFromOrder(id);
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
 * Restore a deleted activity by setting isActive to true
 * @param id Activity id to restore
 */
export function restoreActivity(id: string): void {
  const activities = getActivities();
  const idx = activities.findIndex(a => a.id === id);
  if (idx === -1) return;
  const current = activities[idx];
  if (!current) return;
  
  // Only restore if currently inactive
  if (!current.isActive) {
    current.isActive = true;
    try {
      saveActivities(activities);
      // Add back to custom order at the end
      addActivityToOrder(id);
    } catch {
      // Handle quota exceeded or localStorage disabled
      // Optionally log error or notify user
    }
  }
}

/**
 * Reset activities to default configuration
 * Clears localStorage and replaces with fresh default activities
 */
export function resetActivitiesToDefault(): void {
  const defaultActivities = loadDefaultActivities();
  saveActivities(defaultActivities);
  
  // Clean up order to match reset activities
  const activeIds = defaultActivities
    .filter(activity => activity.isActive)
    .map(activity => activity.id);
  setActivityOrder(activeIds);
}

/**
 * Get all activities from localStorage sorted by custom order
 * Falls back to creation order if no custom order exists
 * @returns Array of activities sorted by custom order
 */
export function getActivitiesInOrder(): Activity[] {
  const activities = getActivities();
  return sortActivitiesByOrder(activities);
}

/**
 * Reorder activities and persist the new arrangement
 * @param orderedIds Array of activity IDs in desired order
 */
export function reorderActivities(orderedIds: string[]): void {
  if (!Array.isArray(orderedIds)) {
    console.warn('Invalid orderedIds provided to reorderActivities');
    return;
  }

  // Validate that all provided IDs exist in current activities
  const currentActivities = getActivities();
  const existingIds = new Set(currentActivities.map(a => a.id));
  
  // Filter out any invalid IDs
  const validOrderedIds = orderedIds.filter(id => {
    if (typeof id !== 'string' || !existingIds.has(id)) {
      console.warn(`Invalid or non-existent activity ID in reorder: ${id}`);
      return false;
    }
    return true;
  });

  // Set the new order
  setActivityOrder(validOrderedIds);
}

/**
 * Synchronize activity order with current activities
 * Removes orphaned IDs and ensures all active activities are in order
 * Should be called periodically or after bulk operations
 */
export function synchronizeActivityOrder(): void {
  const currentActivities = getActivities();
  const activeActivityIds = currentActivities
    .filter(activity => activity.isActive)
    .map(activity => activity.id);
  
  // Clean up orphaned IDs from order
  cleanupActivityOrder(activeActivityIds);
}
