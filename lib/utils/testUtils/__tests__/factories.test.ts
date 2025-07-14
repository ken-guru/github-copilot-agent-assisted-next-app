import { createTimelineEntry, createTimelineEntries, createColors } from '../factories';

describe('Test Factory Utilities', () => {
  describe('createTimelineEntry', () => {
    it('should create a default timeline entry', () => {
      const entry = createTimelineEntry();
      
      expect(entry).toEqual({
        id: 'test-entry-1',
        activityId: 'activity-1',
        title: 'Test Activity',
        description: 'Test activity description',
        activityName: 'Test Activity',
        startTime: 1000000,
        endTime: 1000000 + 3600000, // 1 hour duration
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      });
    });
    
    it('should override default properties', () => {
      const entry = createTimelineEntry({
        id: 'custom-id',
        activityName: 'Custom Activity',
        startTime: 2000000,
      });
      
      expect(entry.id).toBe('custom-id');
      expect(entry.activityName).toBe('Custom Activity');
      expect(entry.startTime).toBe(2000000);
      
      // Non-overridden properties should keep defaults
      expect(entry.endTime).toBe(1000000 + 3600000);
    });
    
    it('should allow overriding nested color properties', () => {
      const entry = createTimelineEntry({
        colors: {
          background: '#FFFFFF',
          text: '#000000',
          border: '#CCCCCC'
        }
      });
      
      expect(entry.colors).toEqual({
        background: '#FFFFFF',
        text: '#000000',
        border: '#CCCCCC'
      });
    });
  });
  
  describe('createTimelineEntries', () => {
    it('should create the specified number of entries', () => {
      const entries = createTimelineEntries(3);
      
      expect(entries).toHaveLength(3);
      expect(entries[0]?.id).toBe('test-entry-1');
      expect(entries[1]?.id).toBe('test-entry-2');
      expect(entries[2]?.id).toBe('test-entry-3');
    });
    
    it('should apply the overrides function to each entry', () => {
      const entries = createTimelineEntries(3, (index) => ({
        startTime: 1000000 + index * 3600000,
        endTime: 1000000 + (index + 1) * 3600000,
      }));
      
      expect(entries).toHaveLength(3);
      
      // First entry
      expect(entries[0]?.startTime).toBe(1000000);
      expect(entries[0]?.endTime).toBe(1000000 + 3600000);
      
      // Second entry
      expect(entries[1]?.startTime).toBe(1000000 + 3600000);
      expect(entries[1]?.endTime).toBe(1000000 + 2 * 3600000);
      
      // Third entry
      expect(entries[2]?.startTime).toBe(1000000 + 2 * 3600000);
      expect(entries[2]?.endTime).toBe(1000000 + 3 * 3600000);
    });
    
    it('should provide unique IDs and activity IDs by default', () => {
      const entries = createTimelineEntries(3);
      
      // Check that IDs are unique
      const ids = entries.map(e => e.id);
      expect(new Set(ids).size).toBe(3);
      
      // Check that activity IDs are unique
      const activityIds = entries.map(e => e.activityId);
      expect(new Set(activityIds).size).toBe(3);
    });
  });
  
  describe('createColors', () => {
    it('should create default colors', () => {
      const colors = createColors();
      
      expect(colors).toEqual({
        background: '#E3F2FD',
        text: '#0D47A1',
        border: '#1976D2'
      });
    });
    
    it('should override specified color properties', () => {
      const colors = createColors({
        background: '#FFFFFF',
        text: '#000000'
      });
      
      expect(colors).toEqual({
        background: '#FFFFFF',
        text: '#000000',
        border: '#1976D2' // Default value remains
      });
    });
  });
});