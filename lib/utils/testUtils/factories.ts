/**
 * Test data factory functions
 * 
 * These utilities provide standardized ways to generate test data
 * for various components and tests throughout the application.
 */

import { TimelineEntry } from '../../../src/types/index';

/**
 * Factory function to create timeline entries for testing
 * 
 * @param overrides - Optional properties to override defaults
 * @returns A timeline entry object for testing
 */
export function createTimelineEntry(overrides?: Partial<TimelineEntry>): TimelineEntry {
  return {
    id: 'test-entry-1',
    activityId: 'activity-1',
    activityName: 'Test Activity',
    startTime: 1000000, // arbitrary start timestamp
    endTime: 1000000 + 3600000, // 1 hour duration
    colors: {
      background: '#E3F2FD',
      text: '#0D47A1',
      border: '#1976D2'
    },
    ...overrides
  };
}

/**
 * Factory function to create multiple timeline entries
 * 
 * @param count - Number of entries to create
 * @param overridesFn - Optional function to customize each entry based on its index
 * @returns Array of timeline entry objects for testing
 */
export function createTimelineEntries(
  count: number,
  overridesFn?: (index: number) => Partial<TimelineEntry>
): TimelineEntry[] {
  return Array.from({ length: count }, (_, index) => {
    const baseOverrides = overridesFn ? overridesFn(index) : {};
    
    // Default id and activityId should be unique per entry
    const defaultUniqueProps = {
      id: `test-entry-${index + 1}`,
      activityId: `activity-${index + 1}`,
      activityName: `Test Activity ${index + 1}`
    };
    
    return createTimelineEntry({
      ...defaultUniqueProps,
      ...baseOverrides
    });
  });
}

/**
 * Creates a color object for testing
 * 
 * @param overrides - Optional properties to override defaults
 * @returns A color object with background, text and border colors
 */
export function createColors(
  overrides?: Partial<{ background: string; text: string; border: string }>
) {
  return {
    background: '#E3F2FD',
    text: '#0D47A1',
    border: '#1976D2',
    ...overrides
  };
}