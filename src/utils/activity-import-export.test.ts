import { importActivities, exportActivities } from './activity-import-export';
import { Activity } from '../types/activity';

// Mock crypto.randomUUID for consistent testing
const mockUUID = 'test-uuid-12345';
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: jest.fn(() => mockUUID) },
});

// Mock Date for consistent timestamps
const mockDate = '2025-07-21T15:30:00.000Z';
jest.spyOn(global, 'Date').mockImplementation(() => ({
  toISOString: () => mockDate,
}) as unknown as Date);

describe('activity-import-export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exportActivities', () => {
    it('should export activities without isActive field by default', () => {
      const activities: Activity[] = [
        {
          id: '1',
          name: 'Homework',
          description: 'Academic work',
          colorIndex: 0,
          createdAt: '2025-07-21T10:00:00.000Z',
          isActive: true
        },
        {
          id: '2',
          name: 'Exercise',
          description: 'Physical fitness',
          colorIndex: 1,
          createdAt: '2025-07-21T11:00:00.000Z',
          isActive: false
        }
      ];

      const exported = exportActivities(activities);
      
      expect(exported).toHaveLength(2);
      expect(exported[0]).toEqual({
        id: '1',
        name: 'Homework',
        description: 'Academic work',
        colorIndex: 0,
        createdAt: '2025-07-21T10:00:00.000Z'
      });
      expect(exported[1]).toEqual({
        id: '2',
        name: 'Exercise',
        description: 'Physical fitness',
        colorIndex: 1,
        createdAt: '2025-07-21T11:00:00.000Z'
      });
      
      // Ensure isActive is not included
      expect(exported[0]).not.toHaveProperty('isActive');
      expect(exported[1]).not.toHaveProperty('isActive');
    });

    it('should include isActive field when explicitly requested', () => {
      const activities: Activity[] = [
        {
          id: '1',
          name: 'Homework',
          description: 'Academic work',
          colorIndex: 0,
          createdAt: '2025-07-21T10:00:00.000Z',
          isActive: true
        }
      ];

      const exported = exportActivities(activities, { includeIsActive: true });
      
      expect(exported).toHaveLength(1);
      expect(exported[0]).toEqual({
        id: '1',
        name: 'Homework',
        description: 'Academic work',
        colorIndex: 0,
        createdAt: '2025-07-21T10:00:00.000Z',
        isActive: true
      });
    });

    it('should filter out inactive activities when requested', () => {
      const activities: Activity[] = [
        {
          id: '1',
          name: 'Active Activity',
          colorIndex: 0,
          createdAt: '2025-07-21T10:00:00.000Z',
          isActive: true
        },
        {
          id: '2',
          name: 'Inactive Activity',
          colorIndex: 1,
          createdAt: '2025-07-21T11:00:00.000Z',
          isActive: false
        }
      ];

      const exported = exportActivities(activities, { activeOnly: true });
      
      expect(exported).toHaveLength(1);
      expect(exported[0].name).toBe('Active Activity');
    });

    it('should handle empty activity array', () => {
      const exported = exportActivities([]);
      expect(exported).toEqual([]);
    });

    it('should handle activities without descriptions', () => {
      const activities: Activity[] = [
        {
          id: '1',
          name: 'Simple Activity',
          colorIndex: 0,
          createdAt: '2025-07-21T10:00:00.000Z',
          isActive: true
        }
      ];

      const exported = exportActivities(activities);
      
      expect(exported[0]).toEqual({
        id: '1',
        name: 'Simple Activity',
        colorIndex: 0,
        createdAt: '2025-07-21T10:00:00.000Z'
      });
    });
  });

  describe('importActivities', () => {
    it('should import complete activity objects', () => {
      const importData = [
        {
          id: '1',
          name: 'Homework',
          description: 'Academic work',
          colorIndex: 0,
          createdAt: '2025-07-21T10:00:00.000Z'
        }
      ];

      const imported = importActivities(importData);
      
      expect(imported).toHaveLength(1);
      expect(imported[0]).toEqual({
        id: '1',
        name: 'Homework',
        description: 'Academic work',
        colorIndex: 0,
        createdAt: '2025-07-21T10:00:00.000Z',
        isActive: true
      });
    });

    it('should import minimal activity objects with only name', () => {
      const importData = [
        { name: 'Reading' },
        { name: 'Exercise' }
      ];

      const imported = importActivities(importData);
      
      expect(imported).toHaveLength(2);
      expect(imported[0]).toEqual({
        id: mockUUID,
        name: 'Reading',
        colorIndex: 0,
        createdAt: mockDate,
        isActive: true
      });
      expect(imported[1]).toEqual({
        id: mockUUID,
        name: 'Exercise',
        colorIndex: 1,
        createdAt: mockDate,
        isActive: true
      });
    });

    it('should auto-populate missing fields with defaults', () => {
      const importData = [
        {
          name: 'Partial Activity',
          description: 'Has description but missing other fields'
        }
      ];

      const imported = importActivities(importData);
      
      expect(imported[0]).toEqual({
        id: mockUUID,
        name: 'Partial Activity',
        description: 'Has description but missing other fields',
        colorIndex: 0,
        createdAt: mockDate,
        isActive: true
      });
    });

    it('should handle undefined, null, and missing fields', () => {
      const importData = [
        {
          id: undefined,
          name: 'Test Activity',
          description: null,
          colorIndex: undefined,
          createdAt: null
        }
      ];

      const imported = importActivities(importData);
      
      expect(imported[0]).toEqual({
        id: mockUUID,
        name: 'Test Activity',
        colorIndex: 0,
        createdAt: mockDate,
        isActive: true
      });
    });

    it('should assign sequential color indices when missing', () => {
      const importData = [
        { name: 'Activity 1' },
        { name: 'Activity 2' },
        { name: 'Activity 3' },
        { name: 'Activity 4', colorIndex: 10 }
      ];

      const imported = importActivities(importData);
      
      expect(imported[0].colorIndex).toBe(0);
      expect(imported[1].colorIndex).toBe(1);
      expect(imported[2].colorIndex).toBe(2);
      expect(imported[3].colorIndex).toBe(10); // Preserve existing colorIndex
    });

    it('should preserve existing isActive values if present', () => {
      const importData = [
        {
          name: 'Active Activity',
          isActive: true
        },
        {
          name: 'Inactive Activity', 
          isActive: false
        },
        {
          name: 'Default Activity'
          // No isActive field
        }
      ];

      const imported = importActivities(importData);
      
      expect(imported[0].isActive).toBe(true);
      expect(imported[1].isActive).toBe(false);
      expect(imported[2].isActive).toBe(true); // Default value
    });

    it('should handle existing activity options', () => {
      const existingActivities: Activity[] = [
        {
          id: '1',
          name: 'Existing Activity',
          colorIndex: 0,
          createdAt: '2025-07-21T09:00:00.000Z',
          isActive: true
        }
      ];

      const importData = [
        { name: 'New Activity 1' },
        { name: 'New Activity 2' }
      ];

      const imported = importActivities(importData, { 
        existingActivities,
        colorStartIndex: 1 
      });
      
      expect(imported[0].colorIndex).toBe(1); // Start from index 1
      expect(imported[1].colorIndex).toBe(2);
    });

    it('should throw error for invalid import data', () => {
      const invalidData = [
        { /* missing name */ },
        { name: '' }, // Empty name
        { name: null }, // Null name
        { name: 123 } // Wrong type
      ];

      for (const data of invalidData) {
        expect(() => importActivities([data])).toThrow();
      }
    });

    it('should throw error for non-array input', () => {
      expect(() => importActivities(null as unknown as unknown[])).toThrow();
      expect(() => importActivities(undefined as unknown as unknown[])).toThrow();
      expect(() => importActivities({} as unknown as unknown[])).toThrow();
      expect(() => importActivities('string' as unknown as unknown[])).toThrow();
    });

    it('should handle empty import array', () => {
      const imported = importActivities([]);
      expect(imported).toEqual([]);
    });

    it('should preserve valid IDs and generate new ones for invalid IDs', () => {
      const importData = [
        {
          id: 'valid-id-1',
          name: 'Activity with valid ID'
        },
        {
          id: '',
          name: 'Activity with empty ID'
        },
        {
          name: 'Activity without ID'
        }
      ];

      const imported = importActivities(importData);
      
      expect(imported[0].id).toBe('valid-id-1');
      expect(imported[1].id).toBe(mockUUID);
      expect(imported[2].id).toBe(mockUUID);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete export-import cycle', () => {
      const originalActivities: Activity[] = [
        {
          id: '1',
          name: 'Original Activity',
          description: 'Original description',
          colorIndex: 0,
          createdAt: '2025-07-21T10:00:00.000Z',
          isActive: true
        }
      ];

      // Export without isActive
      const exported = exportActivities(originalActivities);
      
      // Import should restore full structure
      const imported = importActivities(exported);
      
      expect(imported[0]).toEqual({
        id: '1',
        name: 'Original Activity',
        description: 'Original description',
        colorIndex: 0,
        createdAt: '2025-07-21T10:00:00.000Z',
        isActive: true // Auto-populated
      });
    });

    it('should handle backwards compatibility with old export format', () => {
      const oldExportFormat = [
        {
          id: '1',
          name: 'Old Format Activity',
          description: 'From old export',
          colorIndex: 0,
          createdAt: '2025-07-21T10:00:00.000Z',
          isActive: true // Old format included this
        }
      ];

      const imported = importActivities(oldExportFormat);
      
      expect(imported[0]).toEqual({
        id: '1',
        name: 'Old Format Activity',
        description: 'From old export',
        colorIndex: 0,
        createdAt: '2025-07-21T10:00:00.000Z',
        isActive: true
      });
    });
  });
});
