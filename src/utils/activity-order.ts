/**
 * Activity order management utilities for custom activity reordering
 * Handles localStorage persistence and synchronization with activity CRUD operations
 * @module activity-order
 */

import { Activity } from '../types/activity';

const ORDER_STORAGE_KEY = 'activity_order_v1';

/**
 * Activity order storage schema
 */
interface ActivityOrderStorage {
  version: string;
  order: string[];
  lastUpdated: string;
}

/**
 * Get the current activity order from localStorage
 * @returns Array of activity IDs in custom order, or empty array if no order exists
 */
export function getActivityOrder(): string[] {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return [];
    
    const parsed: ActivityOrderStorage = JSON.parse(raw);
    
    // Validate storage structure
    if (!isValidOrderStorage(parsed)) {
      console.warn('Invalid activity order storage structure, clearing');
      clearActivityOrder();
      return [];
    }
    
    return parsed.order;
  } catch (error) {
    console.warn('Failed to parse activity order from localStorage:', error);
    clearActivityOrder();
    return [];
  }
}

/**
 * Set the activity order in localStorage
 * @param order Array of activity IDs in desired order
 */
export function setActivityOrder(order: string[]): void {
  try {
    // Validate input
    if (!Array.isArray(order)) {
      throw new Error('Order must be an array');
    }
    
    // Ensure all items are strings
    if (!order.every(id => typeof id === 'string' && id.length > 0)) {
      throw new Error('All order items must be non-empty strings');
    }
    
    // Remove duplicates while preserving order
    const uniqueOrder = [...new Set(order)];
    
    const orderStorage: ActivityOrderStorage = {
      version: '1.0',
      order: uniqueOrder,
      lastUpdated: new Date().toISOString()
    };
    
    const serializedData = JSON.stringify(orderStorage);
    
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, serializedData);
    } catch (storageError) {
      // Handle quota exceeded or other storage errors
      if (isQuotaExceededError(storageError)) {
        console.warn('localStorage quota exceeded, attempting to free space for activity order');
        
        // Try to clear old data and retry
        if (attemptStorageCleanup()) {
          try {
            localStorage.setItem(ORDER_STORAGE_KEY, serializedData);
            console.info('Successfully saved activity order after cleanup');
          } catch (retryError) {
            console.error('Failed to save activity order even after cleanup:', retryError);
          }
        } else {
          console.error('Unable to free localStorage space for activity order');
        }
      } else if (storageError instanceof Error && storageError.message.includes('localStorage')) {
        console.warn('localStorage is not available, activity order will not persist');
      } else {
        throw storageError; // Re-throw other errors
      }
    }
  } catch (error) {
    console.error('Failed to save activity order:', error);
    // Don't throw - graceful degradation
  }
}

/**
 * Add an activity ID to the end of the custom order
 * @param activityId Activity ID to add
 */
export function addActivityToOrder(activityId: string): void {
  if (!activityId || typeof activityId !== 'string') {
    console.warn('Invalid activity ID provided to addActivityToOrder');
    return;
  }
  
  const currentOrder = getActivityOrder();
  
  // Don't add if already exists
  if (currentOrder.includes(activityId)) {
    return;
  }
  
  const newOrder = [...currentOrder, activityId];
  setActivityOrder(newOrder);
}

/**
 * Remove an activity ID from the custom order
 * @param activityId Activity ID to remove
 */
export function removeActivityFromOrder(activityId: string): void {
  if (!activityId || typeof activityId !== 'string') {
    console.warn('Invalid activity ID provided to removeActivityFromOrder');
    return;
  }
  
  const currentOrder = getActivityOrder();
  const newOrder = currentOrder.filter(id => id !== activityId);
  
  // Only update if something was actually removed
  if (newOrder.length !== currentOrder.length) {
    setActivityOrder(newOrder);
  }
}

/**
 * Sort activities by custom order, with fallback to creation order
 * Activities not in custom order are appended at the end in creation order
 * @param activities Array of activities to sort
 * @returns Sorted array of activities
 */
export function sortActivitiesByOrder<T extends { id: string; createdAt?: string }>(activities: T[]): T[] {
  if (!Array.isArray(activities)) {
    console.warn('Invalid activities array provided to sortActivitiesByOrder');
    return [];
  }
  
  const customOrder = getActivityOrder();
  
  // If no custom order exists, return activities in creation order (existing behavior)
  if (customOrder.length === 0) {
    return [...activities].sort((a, b) => {
      // Sort by createdAt if available, otherwise maintain original order
      if (a.createdAt && b.createdAt) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });
  }
  
  // Create a map for O(1) lookup of order positions
  const orderMap = new Map<string, number>();
  customOrder.forEach((id, index) => {
    orderMap.set(id, index);
  });
  
  // Separate activities into ordered and unordered groups
  const orderedActivities: T[] = [];
  const unorderedActivities: T[] = [];
  
  activities.forEach(activity => {
    if (orderMap.has(activity.id)) {
      orderedActivities.push(activity);
    } else {
      unorderedActivities.push(activity);
    }
  });
  
  // Sort ordered activities by their position in custom order
  orderedActivities.sort((a, b) => {
    const posA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const posB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return posA - posB;
  });
  
  // Sort unordered activities by creation date (fallback behavior)
  unorderedActivities.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });
  
  // Combine ordered activities first, then unordered
  return [...orderedActivities, ...unorderedActivities];
}

/**
 * Clean up orphaned activity IDs from the order array
 * Removes IDs that don't correspond to existing activities
 * @param existingActivityIds Array of currently existing activity IDs
 */
export function cleanupActivityOrder(existingActivityIds: string[]): void {
  if (!Array.isArray(existingActivityIds)) {
    console.warn('Invalid existing activity IDs provided to cleanupActivityOrder');
    return;
  }
  
  const currentOrder = getActivityOrder();
  const existingIds = new Set(existingActivityIds);
  
  // Filter out orphaned IDs
  const cleanedOrder = currentOrder.filter(id => existingIds.has(id));
  
  // Only update if cleanup was needed
  if (cleanedOrder.length !== currentOrder.length) {
    setActivityOrder(cleanedOrder);
  }
}

/**
 * Clear all activity order data from localStorage
 */
export function clearActivityOrder(): void {
  try {
    localStorage.removeItem(ORDER_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear activity order:', error);
  }
}

/**
 * Validate activity order storage structure
 * @param data Parsed storage data to validate
 * @returns True if valid, false otherwise
 */
function isValidOrderStorage(data: unknown): data is ActivityOrderStorage {
  if (!data || typeof data !== 'object') return false;
  
  const storage = data as Partial<ActivityOrderStorage>;
  
  return (
    typeof storage.version === 'string' &&
    Array.isArray(storage.order) &&
    storage.order.every(id => typeof id === 'string' && id.length > 0) &&
    typeof storage.lastUpdated === 'string'
  );
}

/**
 * Get activity order metadata (version, last updated)
 * @returns Order metadata or null if no order exists
 */
export function getActivityOrderMetadata(): { version: string; lastUpdated: string } | null {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;
    
    const parsed: ActivityOrderStorage = JSON.parse(raw);
    
    if (!isValidOrderStorage(parsed)) {
      return null;
    }
    
    return {
      version: parsed.version,
      lastUpdated: parsed.lastUpdated
    };
  } catch {
    return null;
  }
}

/**
 * Check if a custom activity order exists
 * @returns True if custom order exists, false otherwise
 */
export function hasCustomActivityOrder(): boolean {
  return getActivityOrder().length > 0;
}

/**
 * Check if localStorage is available and functional
 * @returns True if localStorage is available, false otherwise
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    // Test localStorage functionality
    const testKey = '__activity_order_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if an error is a quota exceeded error
 * @param error The error to check
 * @returns True if the error indicates quota exceeded
 */
function isQuotaExceededError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  
  const errorObj = error as { name?: string; code?: number };
  
  // Check for various quota exceeded error patterns
  return (
    errorObj.name === 'QuotaExceededError' ||
    errorObj.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    errorObj.code === 22 || // QUOTA_EXCEEDED_ERR
    (error instanceof Error && error.message.toLowerCase().includes('quota'))
  );
}

/**
 * Attempt to clean up localStorage to free space
 * @returns True if cleanup was attempted, false if no cleanup possible
 */
function attemptStorageCleanup(): boolean {
  try {
    // Get current localStorage usage
    const currentKeys = Object.keys(localStorage);
    
    // Look for non-essential keys that can be removed
    const cleanupCandidates = currentKeys.filter(key => {
      // Don't remove essential app data
      if (key.startsWith('activity_') || key.startsWith('timer_') || key.startsWith('theme_')) {
        return false;
      }
      
      // Remove old or temporary data
      return (
        key.includes('temp') ||
        key.includes('cache') ||
        key.includes('debug') ||
        key.startsWith('_') ||
        key.includes('test')
      );
    });
    
    // Remove cleanup candidates
    let removedCount = 0;
    for (const key of cleanupCandidates) {
      try {
        localStorage.removeItem(key);
        removedCount++;
      } catch {
        // Continue with other keys if one fails
      }
    }
    
    if (removedCount > 0) {
      console.info(`Cleaned up ${removedCount} localStorage entries to free space`);
      return true;
    }
    
    // If no cleanup candidates, try to remove oldest activity order versions
    const orderKeys = currentKeys.filter(key => key.startsWith('activity_order_') && key !== ORDER_STORAGE_KEY);
    if (orderKeys.length > 0) {
      for (const key of orderKeys) {
        try {
          localStorage.removeItem(key);
          removedCount++;
        } catch {
          // Continue with other keys
        }
      }
      
      if (removedCount > 0) {
        console.info(`Cleaned up ${removedCount} old activity order entries`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.warn('Failed to perform localStorage cleanup:', error);
    return false;
  }
}