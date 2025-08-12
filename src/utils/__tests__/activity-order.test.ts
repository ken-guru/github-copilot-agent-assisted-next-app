/**
 * Unit tests for activity order management utilities
 * @module activity-order.test
 */

import {
  getActivityOrder,
  setActivityOrder,
  addActivityToOrder,
  removeActivityFromOrder,
  sortActivitiesByOrder,
  cleanupActivityOrder,
  clearActivityOrder,
  getActivityOrderMetadata,
  hasCustomActivityOrder
} from '../activity-order';
import { Activity } from '../../types/activity';

// Mock localStorage
const createMockLocalStorage = () => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    _getStore: () => store,
    _setStore: (newStore: Record<string, string>) => { store = newStore; }
  };
};

const mockLocalStorage = createMockLocalStorage();

// Replace global localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock console methods to avoid noise in tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  mockLocalStorage.clear();
  mockLocalStorage._setStore({});
  jest.clearAllMocks();
  
  // Reset all localStorage methods to their original implementations
  const store = mockLocalStorage._getStore();
  mockLocalStorage.getItem.mockImplementation((key: string) => store[key] || null);
  mockLocalStorage.setItem.mockImplementation((key: string, value: string) => {
    store[key] = value;
  });
  mockLocalStorage.removeItem.mockImplementation((key: string) => {
    delete store[key];
  });
  
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

describe('activity-order utilities', () => {
  const mockActivities: Activity[] = [
    {
      id: 'activity-1',
      name: 'First Activity',
      colorIndex: 0,
      createdAt: '2023-01-01T00:00:00.000Z',
      isActive: true
    },
    {
      id: 'activity-2',
      name: 'Second Activity',
      colorIndex: 1,
      createdAt: '2023-01-02T00:00:00.000Z',
      isActive: true
    },
    {
      id: 'activity-3',
      name: 'Third Activity',
      colorIndex: 2,
      createdAt: '2023-01-03T00:00:00.000Z',
      isActive: true
    }
  ];

  describe('getActivityOrder', () => {
    it('should return empty array when no order exists', () => {
      const order = getActivityOrder();
      expect(order).toEqual([]);
    });

    it('should return stored order when valid data exists', () => {
      const testOrder = ['activity-2', 'activity-1', 'activity-3'];
      const storageData = {
        version: '1.0',
        order: testOrder,
        lastUpdated: '2023-01-01T00:00:00.000Z'
      };
      mockLocalStorage.setItem('activity_order_v1', JSON.stringify(storageData));

      const order = getActivityOrder();
      expect(order).toEqual(testOrder);
    });

    it('should handle corrupted JSON data gracefully', () => {
      mockLocalStorage.setItem('activity_order_v1', 'invalid-json');

      const order = getActivityOrder();
      expect(order).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to parse activity order from localStorage:',
        expect.any(Error)
      );
    });

    it('should handle invalid storage structure', () => {
      mockLocalStorage.setItem('activity_order_v1', JSON.stringify({ invalid: 'data' }));

      const order = getActivityOrder();
      expect(order).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        'Invalid activity order storage structure, clearing'
      );
    });

    it('should clear invalid data from localStorage', () => {
      mockLocalStorage.setItem('activity_order_v1', 'invalid-json');
      
      getActivityOrder();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('activity_order_v1');
    });
  });

  describe('setActivityOrder', () => {
    it('should save valid order to localStorage', () => {
      const testOrder = ['activity-1', 'activity-2', 'activity-3'];
      
      setActivityOrder(testOrder);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'activity_order_v1',
        expect.stringContaining('"order":["activity-1","activity-2","activity-3"]')
      );
    });

    it('should remove duplicates while preserving order', () => {
      const testOrder = ['activity-1', 'activity-2', 'activity-1', 'activity-3'];
      
      setActivityOrder(testOrder);
      
      const savedOrder = getActivityOrder();
      expect(savedOrder).toEqual(['activity-1', 'activity-2', 'activity-3']);
    });

    it('should handle non-array input gracefully', () => {
      setActivityOrder('not-an-array' as any);
      
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save activity order:',
        expect.any(Error)
      );
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle array with non-string items', () => {
      const invalidOrder = ['activity-1', 123, null, 'activity-2'] as any;
      
      setActivityOrder(invalidOrder);
      
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save activity order:',
        expect.any(Error)
      );
    });

    it('should handle localStorage quota exceeded', () => {
      // First set a valid order
      setActivityOrder(['activity-1']);
      expect(getActivityOrder()).toEqual(['activity-1']);
      
      // Then mock setItem to throw
      const originalSetItem = mockLocalStorage.setItem;
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      setActivityOrder(['activity-2']);
      
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save activity order:',
        expect.any(Error)
      );
      
      // Restore the original implementation
      mockLocalStorage.setItem = originalSetItem;
      
      // Order should remain unchanged since save failed
      expect(getActivityOrder()).toEqual(['activity-1']);
    });

    it('should include version and timestamp in saved data', () => {
      const testOrder = ['activity-1'];
      const beforeTime = Date.now();
      
      setActivityOrder(testOrder);
      
      const afterTime = Date.now();
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0]?.[1] || '{}');
      
      expect(savedData.version).toBe('1.0');
      expect(savedData.order).toEqual(testOrder);
      
      const savedTime = new Date(savedData.lastUpdated).getTime();
      expect(savedTime).toBeGreaterThanOrEqual(beforeTime);
      expect(savedTime).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('addActivityToOrder', () => {
    it('should add new activity to end of order', () => {
      setActivityOrder(['activity-1', 'activity-2']);
      
      addActivityToOrder('activity-3');
      
      const order = getActivityOrder();
      expect(order).toEqual(['activity-1', 'activity-2', 'activity-3']);
    });

    it('should not add duplicate activity', () => {
      setActivityOrder(['activity-1', 'activity-2']);
      
      addActivityToOrder('activity-1');
      
      const order = getActivityOrder();
      expect(order).toEqual(['activity-1', 'activity-2']);
    });

    it('should handle invalid activity ID gracefully', () => {
      addActivityToOrder('');
      addActivityToOrder(null as any);
      addActivityToOrder(undefined as any);
      
      expect(console.warn).toHaveBeenCalledTimes(3);
      expect(getActivityOrder()).toEqual([]);
    });

    it('should work with empty initial order', () => {
      addActivityToOrder('activity-1');
      
      const order = getActivityOrder();
      expect(order).toEqual(['activity-1']);
    });
  });

  describe('removeActivityFromOrder', () => {
    it('should remove activity from order', () => {
      setActivityOrder(['activity-1', 'activity-2', 'activity-3']);
      
      removeActivityFromOrder('activity-2');
      
      const order = getActivityOrder();
      expect(order).toEqual(['activity-1', 'activity-3']);
    });

    it('should handle non-existent activity gracefully', () => {
      setActivityOrder(['activity-1', 'activity-2']);
      
      removeActivityFromOrder('activity-999');
      
      const order = getActivityOrder();
      expect(order).toEqual(['activity-1', 'activity-2']);
    });

    it('should handle invalid activity ID gracefully', () => {
      setActivityOrder(['activity-1']);
      
      removeActivityFromOrder('');
      removeActivityFromOrder(null as any);
      removeActivityFromOrder(undefined as any);
      
      expect(console.warn).toHaveBeenCalledTimes(3);
      expect(getActivityOrder()).toEqual(['activity-1']);
    });

    it('should handle empty order gracefully', () => {
      removeActivityFromOrder('activity-1');
      
      expect(getActivityOrder()).toEqual([]);
    });
  });

  describe('sortActivitiesByOrder', () => {
    it('should sort activities by custom order', () => {
      setActivityOrder(['activity-3', 'activity-1', 'activity-2']);
      
      const sorted = sortActivitiesByOrder(mockActivities);
      
      expect(sorted.map(a => a.id)).toEqual(['activity-3', 'activity-1', 'activity-2']);
    });

    it('should append unordered activities at end in creation order', () => {
      setActivityOrder(['activity-2']);
      
      const sorted = sortActivitiesByOrder(mockActivities);
      
      expect(sorted.map(a => a.id)).toEqual(['activity-2', 'activity-1', 'activity-3']);
    });

    it('should handle activities without createdAt', () => {
      const activitiesWithoutDate = mockActivities.map(a => ({ ...a, createdAt: undefined }));
      setActivityOrder(['activity-3', 'activity-1']);
      
      const sorted = sortActivitiesByOrder(activitiesWithoutDate);
      
      expect(sorted.map(a => a.id)).toEqual(['activity-3', 'activity-1', 'activity-2']);
    });

    it('should return creation order when no custom order exists', () => {
      const sorted = sortActivitiesByOrder(mockActivities);
      
      expect(sorted.map(a => a.id)).toEqual(['activity-1', 'activity-2', 'activity-3']);
    });

    it('should handle invalid input gracefully', () => {
      const sorted = sortActivitiesByOrder(null as any);
      
      expect(sorted).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        'Invalid activities array provided to sortActivitiesByOrder'
      );
    });

    it('should handle empty activities array', () => {
      const sorted = sortActivitiesByOrder([]);
      
      expect(sorted).toEqual([]);
    });

    it('should preserve original array (immutability)', () => {
      setActivityOrder(['activity-3', 'activity-1', 'activity-2']);
      const originalOrder = mockActivities.map(a => a.id);
      
      sortActivitiesByOrder(mockActivities);
      
      expect(mockActivities.map(a => a.id)).toEqual(originalOrder);
    });
  });

  describe('cleanupActivityOrder', () => {
    it('should remove orphaned activity IDs', () => {
      setActivityOrder(['activity-1', 'activity-999', 'activity-2', 'activity-888']);
      
      cleanupActivityOrder(['activity-1', 'activity-2', 'activity-3']);
      
      const order = getActivityOrder();
      expect(order).toEqual(['activity-1', 'activity-2']);
    });

    it('should not update if no cleanup needed', () => {
      setActivityOrder(['activity-1', 'activity-2']);
      const setItemCallCount = mockLocalStorage.setItem.mock.calls.length;
      
      cleanupActivityOrder(['activity-1', 'activity-2', 'activity-3']);
      
      expect(mockLocalStorage.setItem.mock.calls.length).toBe(setItemCallCount);
    });

    it('should handle invalid input gracefully', () => {
      setActivityOrder(['activity-1']);
      
      cleanupActivityOrder(null as any);
      
      expect(console.warn).toHaveBeenCalledWith(
        'Invalid existing activity IDs provided to cleanupActivityOrder'
      );
      expect(getActivityOrder()).toEqual(['activity-1']);
    });

    it('should handle empty existing IDs', () => {
      setActivityOrder(['activity-1', 'activity-2']);
      
      cleanupActivityOrder([]);
      
      const order = getActivityOrder();
      expect(order).toEqual([]);
    });
  });

  describe('clearActivityOrder', () => {
    it('should remove order data from localStorage', () => {
      setActivityOrder(['activity-1', 'activity-2']);
      
      clearActivityOrder();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('activity_order_v1');
      expect(getActivityOrder()).toEqual([]);
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      clearActivityOrder();
      
      expect(console.error).toHaveBeenCalledWith(
        'Failed to clear activity order:',
        expect.any(Error)
      );
    });
  });

  describe('getActivityOrderMetadata', () => {
    it('should return metadata when valid order exists', () => {
      const testDate = '2023-01-01T00:00:00.000Z';
      setActivityOrder(['activity-1']);
      
      // Mock the stored data to have a specific timestamp
      const storageData = {
        version: '1.0',
        order: ['activity-1'],
        lastUpdated: testDate
      };
      mockLocalStorage.setItem('activity_order_v1', JSON.stringify(storageData));
      
      const metadata = getActivityOrderMetadata();
      
      expect(metadata).toEqual({
        version: '1.0',
        lastUpdated: testDate
      });
    });

    it('should return null when no order exists', () => {
      const metadata = getActivityOrderMetadata();
      
      expect(metadata).toBeNull();
    });

    it('should return null for invalid data', () => {
      mockLocalStorage.setItem('activity_order_v1', 'invalid-json');
      
      const metadata = getActivityOrderMetadata();
      
      expect(metadata).toBeNull();
    });
  });

  describe('hasCustomActivityOrder', () => {
    it('should return true when custom order exists', () => {
      setActivityOrder(['activity-1', 'activity-2']);
      
      expect(hasCustomActivityOrder()).toBe(true);
    });

    it('should return false when no custom order exists', () => {
      expect(hasCustomActivityOrder()).toBe(false);
    });

    it('should return false after clearing order', () => {
      setActivityOrder(['activity-1']);
      clearActivityOrder();
      
      expect(hasCustomActivityOrder()).toBe(false);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle localStorage being disabled', () => {
      // Mock localStorage methods to throw
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage disabled');
      });
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage disabled');
      });
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage disabled');
      });
      
      // Should not throw and should handle gracefully
      const order = getActivityOrder();
      expect(order).toEqual([]);
      
      setActivityOrder(['activity-1']);
      
      addActivityToOrder('activity-2');
      removeActivityFromOrder('activity-1');
      cleanupActivityOrder(['activity-1']);
      clearActivityOrder();
      
      expect(hasCustomActivityOrder()).toBe(false);
      expect(getActivityOrderMetadata()).toBeNull();
    });

    it('should handle very large order arrays', () => {
      const largeOrder = Array.from({ length: 1000 }, (_, i) => `activity-${i}`);
      
      setActivityOrder(largeOrder);
      const retrieved = getActivityOrder();
      expect(retrieved).toEqual(largeOrder);
    });

    it('should handle special characters in activity IDs', () => {
      const specialIds = ['activity-with-dashes', 'activity_with_underscores', 'activity.with.dots'];
      
      setActivityOrder(specialIds);
      const retrieved = getActivityOrder();
      
      expect(retrieved).toEqual(specialIds);
    });
  });
});