import { getSmartColorIndex } from '../colors';
import { Activity } from '@/types/activity';

describe('getSmartColorIndex', () => {
  it('should return 0 (Green) when no existing activities', () => {
    const result = getSmartColorIndex([]);
    expect(result).toBe(0);
  });

  it('should return first unused color index', () => {
    const existingActivities: Activity[] = [
      { id: '1', name: 'Activity 1', colorIndex: 0, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '2', name: 'Activity 2', colorIndex: 2, createdAt: '2025-01-01T00:00:00.000Z', isActive: true }
    ];
    
    // Should return 1 (first unused color after 0 and 2)
    const result = getSmartColorIndex(existingActivities);
    expect(result).toBe(1);
  });

  it('should return first unused color even when activities use later indices', () => {
    const existingActivities: Activity[] = [
      { id: '1', name: 'Activity 1', colorIndex: 5, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '2', name: 'Activity 2', colorIndex: 8, createdAt: '2025-01-01T00:00:00.000Z', isActive: true }
    ];
    
    // Should return 0 (first unused color)
    const result = getSmartColorIndex(existingActivities);
    expect(result).toBe(0);
  });

  it('should return least used color when all colors are in use', () => {
    const existingActivities: Activity[] = [
      // Use all colors 0-11 once
      { id: '1', name: 'Activity 1', colorIndex: 0, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '2', name: 'Activity 2', colorIndex: 1, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '3', name: 'Activity 3', colorIndex: 2, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '4', name: 'Activity 4', colorIndex: 3, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '5', name: 'Activity 5', colorIndex: 4, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '6', name: 'Activity 6', colorIndex: 5, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '7', name: 'Activity 7', colorIndex: 6, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '8', name: 'Activity 8', colorIndex: 7, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '9', name: 'Activity 9', colorIndex: 8, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '10', name: 'Activity 10', colorIndex: 9, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '11', name: 'Activity 11', colorIndex: 10, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '12', name: 'Activity 12', colorIndex: 11, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      // Use some colors additional times
      { id: '13', name: 'Activity 13', colorIndex: 5, createdAt: '2025-01-01T00:00:00.000Z', isActive: true }, // Cyan used twice
      { id: '14', name: 'Activity 14', colorIndex: 8, createdAt: '2025-01-01T00:00:00.000Z', isActive: true }, // Indigo used twice
    ];

    // Should return 0 (Green) since colors 0, 1, 2, 3, 4, 6, 7, 9, 10, 11 are used once each
    // and color 0 is the first/lowest index among the least used
    const result = getSmartColorIndex(existingActivities);
    expect(result).toBe(0);
  });

  it('should handle invalid color indices gracefully', () => {
    const existingActivities = [
      { id: '1', name: 'Activity 1', colorIndex: -1, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '2', name: 'Activity 2', colorIndex: 15, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '3', name: 'Activity 3', colorIndex: 0, createdAt: '2025-01-01T00:00:00.000Z', isActive: true }
    ];

    // Should return 1 (first unused valid color after 0)
    const result = getSmartColorIndex(existingActivities);
    expect(result).toBe(1);
  });

  it('should return 0 as fallback if somehow no color is found', () => {
    // Test with empty activities to ensure we get a valid color
    const result = getSmartColorIndex([]);
    expect(result).toBe(0);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(12); // Should be within valid color range
  });

  it('should find least used color correctly with multiple repetitions', () => {
    const existingActivities = [
      // Red (4) used 3 times
      { id: '1', name: 'Activity 1', colorIndex: 4, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '2', name: 'Activity 2', colorIndex: 4, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '3', name: 'Activity 3', colorIndex: 4, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      // Blue (1) used 2 times  
      { id: '4', name: 'Activity 4', colorIndex: 1, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '5', name: 'Activity 5', colorIndex: 1, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      // Green (0) used 1 time
      { id: '6', name: 'Activity 6', colorIndex: 0, createdAt: '2025-01-01T00:00:00.000Z', isActive: true }
    ];

    // Should return 2 (Orange) - first unused color
    const result = getSmartColorIndex(existingActivities);
    expect(result).toBe(2);
  });

  it('should handle activities with mixed valid and invalid color indices', () => {
    // Create test data with invalid colorIndex values that will be ignored by the function
    const existingActivities = [
      { id: '1', name: 'Activity 1', colorIndex: 0, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '2', name: 'Activity 2', colorIndex: -1, createdAt: '2025-01-01T00:00:00.000Z', isActive: true }, // Invalid: negative
      { id: '3', name: 'Activity 3', colorIndex: 2, createdAt: '2025-01-01T00:00:00.000Z', isActive: true },
      { id: '4', name: 'Activity 4', colorIndex: 15, createdAt: '2025-01-01T00:00:00.000Z', isActive: true } // Invalid: too high
    ];

    // Should return 1 (Blue) - first unused valid color (0 and 2 are used, 1 is first unused)
    const result = getSmartColorIndex(existingActivities);
    expect(result).toBe(1);
  });
});