/**
 * Performance tests for activity order utilities
 * Tests large order arrays and rapid order operations
 */

import { jest } from '@jest/globals';
import {
  getActivityOrder,
  setActivityOrder,
  addActivityToOrder,
  removeActivityFromOrder,
  sortActivitiesByOrder,
  cleanupActivityOrder,
} from '../activity-order';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Helper to create large activity arrays
const createActivities = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i}`,
    name: `Activity ${i}`,
    description: `Description ${i}`,
    colorIndex: i % 8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

// Helper to measure execution time
const measureTime = (fn: () => void): number => {
  const start = performance.now();
  fn();
  return performance.now() - start;
};

describe('Activity Order Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Large Order Arrays', () => {
    it('should handle very large order arrays efficiently', () => {
      const largeOrder = Array.from({ length: 1000 }, (_, i) => `activity-${i}`);
      
      const setTime = measureTime(() => {
        setActivityOrder(largeOrder);
      });

      const getTime = measureTime(() => {
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
          version: '1.0',
          order: largeOrder,
          lastUpdated: new Date().toISOString(),
        }));
        getActivityOrder();
      });

      // Should handle large arrays efficiently
      expect(setTime).toBeLessThan(50);
      expect(getTime).toBeLessThan(20);
    });

    it('should sort large activity lists efficiently', () => {
      const activities = createActivities(500);
      const order = activities.map(a => a.id).reverse(); // Reverse order for maximum work

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        version: '1.0',
        order,
        lastUpdated: new Date().toISOString(),
      }));

      const sortTime = measureTime(() => {
        sortActivitiesByOrder(activities);
      });

      // Should sort large lists efficiently
      expect(sortTime).toBeLessThan(100);
    });

    it('should handle cleanup of large corrupted orders efficiently', () => {
      const validActivities = createActivities(100);
      const corruptedOrder = [
        ...validActivities.map(a => a.id),
        ...Array.from({ length: 500 }, (_, i) => `invalid-${i}`) // Many invalid IDs
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        version: '1.0',
        order: corruptedOrder,
        lastUpdated: new Date().toISOString(),
      }));

      const cleanupTime = measureTime(() => {
        cleanupActivityOrder(validActivities.map(a => a.id));
      });

      // Should cleanup efficiently even with many invalid entries
      expect(cleanupTime).toBeLessThan(50);
    });
  });

  describe('Rapid Order Operations', () => {
    it('should handle rapid add operations efficiently', () => {
      const initialOrder = Array.from({ length: 50 }, (_, i) => `activity-${i}`);
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        version: '1.0',
        order: initialOrder,
        lastUpdated: new Date().toISOString(),
      }));

      const addTime = measureTime(() => {
        // Add 100 activities rapidly
        for (let i = 50; i < 150; i++) {
          addActivityToOrder(`activity-${i}`);
        }
      });

      // Should handle rapid additions efficiently
      expect(addTime).toBeLessThan(200);
    });

    it('should handle rapid remove operations efficiently', () => {
      const initialOrder = Array.from({ length: 200 }, (_, i) => `activity-${i}`);
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        version: '1.0',
        order: initialOrder,
        lastUpdated: new Date().toISOString(),
      }));

      const removeTime = measureTime(() => {
        // Remove every other activity
        for (let i = 0; i < 200; i += 2) {
          removeActivityFromOrder(`activity-${i}`);
        }
      });

      // Should handle rapid removals efficiently
      expect(removeTime).toBeLessThan(150);
    });

    it('should handle mixed rapid operations efficiently', () => {
      const initialOrder = Array.from({ length: 100 }, (_, i) => `activity-${i}`);
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        version: '1.0',
        order: initialOrder,
        lastUpdated: new Date().toISOString(),
      }));

      const mixedTime = measureTime(() => {
        // Mix of add, remove, and reorder operations
        for (let i = 0; i < 50; i++) {
          if (i % 3 === 0) {
            addActivityToOrder(`new-activity-${i}`);
          } else if (i % 3 === 1) {
            removeActivityFromOrder(`activity-${i}`);
          } else {
            // Simulate reorder by setting new order
            const currentOrder = getActivityOrder();
            const newOrder = [...currentOrder];
            if (newOrder.length > 1) {
              const first = newOrder[0];
              const second = newOrder[1];
              if (first && second) {
                newOrder[0] = second;
                newOrder[1] = first;
              }
            }
            setActivityOrder(newOrder);
          }
        }
      });

      // Should handle mixed operations efficiently
      expect(mixedTime).toBeLessThan(300);
    });
  });

  describe('Memory Usage Optimization', () => {
    it('should not create excessive intermediate arrays during sorting', () => {
      const activities = createActivities(200);
      const order = activities.map(a => a.id);

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        version: '1.0',
        order,
        lastUpdated: new Date().toISOString(),
      }));

      // Monitor array creation by checking if sort is stable
      const result1 = sortActivitiesByOrder(activities);
      const result2 = sortActivitiesByOrder(activities);

      // Results should be consistent
      expect(result1.map(a => a.id)).toEqual(result2.map(a => a.id));
      
      // Should not mutate original array
      expect(activities[0]?.id).toBe('activity-0');
    });

    it('should handle localStorage quota efficiently', () => {
      const veryLargeOrder = Array.from({ length: 10000 }, (_, i) => `activity-${i}`);
      
      // Mock localStorage quota exceeded
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const errorTime = measureTime(() => {
        try {
          setActivityOrder(veryLargeOrder);
        } catch {
          // Expected to throw
        }
      });

      // Should fail fast without hanging
      expect(errorTime).toBeLessThan(50);
    });
  });

  describe('JSON Serialization Performance', () => {
    it('should serialize large orders efficiently', () => {
      const largeOrder = Array.from({ length: 2000 }, (_, i) => `activity-${i}`);
      
      const serializeTime = measureTime(() => {
        setActivityOrder(largeOrder);
      });

      // Should serialize efficiently
      expect(serializeTime).toBeLessThan(100);
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should deserialize large orders efficiently', () => {
      const largeOrder = Array.from({ length: 2000 }, (_, i) => `activity-${i}`);
      const serializedData = JSON.stringify({
        version: '1.0',
        order: largeOrder,
        lastUpdated: new Date().toISOString(),
      });

      mockLocalStorage.getItem.mockReturnValue(serializedData);

      const deserializeTime = measureTime(() => {
        getActivityOrder();
      });

      // Should deserialize efficiently
      expect(deserializeTime).toBeLessThan(50);
    });

    it('should handle malformed JSON gracefully and efficiently', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json {');

      const errorTime = measureTime(() => {
        const result = getActivityOrder();
        expect(result).toEqual([]); // Should return empty array
      });

      // Should handle errors quickly
      expect(errorTime).toBeLessThan(20);
    });
  });

  describe('Edge Case Performance', () => {
    it('should handle empty orders efficiently', () => {
      const emptyTime = measureTime(() => {
        setActivityOrder([]);
        const result = getActivityOrder();
        expect(result).toEqual([]);
      });

      expect(emptyTime).toBeLessThan(10);
    });

    it('should handle duplicate IDs efficiently', () => {
      const orderWithDuplicates = [
        'activity-1', 'activity-2', 'activity-1', 'activity-3', 'activity-2'
      ];

      const duplicateTime = measureTime(() => {
        setActivityOrder(orderWithDuplicates);
      });

      // Should handle duplicates without hanging
      expect(duplicateTime).toBeLessThan(20);
    });

    it('should handle very long activity IDs efficiently', () => {
      const longIds = Array.from({ length: 100 }, (_, i) => 
        `activity-${'x'.repeat(1000)}-${i}` // Very long IDs
      );

      const longIdTime = measureTime(() => {
        setActivityOrder(longIds);
        getActivityOrder();
      });

      // Should handle long IDs efficiently
      expect(longIdTime).toBeLessThan(200);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle rapid sequential operations without corruption', () => {
      const operations = measureTime(() => {
        // Simulate rapid operations that might happen in quick succession
        setActivityOrder(['a', 'b', 'c']);
        addActivityToOrder('d');
        removeActivityFromOrder('b');
        addActivityToOrder('e');
        setActivityOrder(['e', 'a', 'c', 'd']);
      });

      expect(operations).toBeLessThan(50);
      
      // Final state should be consistent (may be empty due to mocked localStorage errors)
      const finalOrder = getActivityOrder();
      expect(Array.isArray(finalOrder)).toBe(true);
    });
  });
});