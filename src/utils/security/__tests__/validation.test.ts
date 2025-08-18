import {
  UUIDSchema,
  InputSanitizer,
  ContentFilter,
  SizeValidator,
  validateSessionForSharing,
} from '../validation';

describe('Security Validation', () => {
  describe('UUIDSchema', () => {
    it('should validate correct UUID v4', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      expect(() => UUIDSchema.parse(validUUID)).not.toThrow();
    });

    it('should reject invalid UUID', () => {
      const invalidUUID = 'not-a-uuid';
      expect(() => UUIDSchema.parse(invalidUUID)).toThrow();
    });
  });

  describe('InputSanitizer', () => {
    it('should sanitize HTML content', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello';
      const sanitized = InputSanitizer.sanitizeHtml(maliciousInput);
      expect(sanitized).toBe('Hello');
      expect(sanitized).not.toContain('<script>');
    });

    it('should sanitize activity names', () => {
      const maliciousName = '<img src="x" onerror="alert(1)">Task Name';
      const sanitized = InputSanitizer.sanitizeActivityName(maliciousName);
      expect(sanitized).toBe('Task Name');
    });

    it('should enforce activity name length limits', () => {
      const longName = 'a'.repeat(150);
      const sanitized = InputSanitizer.sanitizeActivityName(longName);
      expect(sanitized.length).toBe(100);
    });
  });

  describe('ContentFilter', () => {
    it('should detect malicious patterns', () => {
      const maliciousPatterns = [
        'javascript:alert(1)',
        '<script>alert(1)</script>',
        'onclick="alert(1)"',
        'data:text/html,<script>alert(1)</script>',
      ];

      maliciousPatterns.forEach(pattern => {
        expect(ContentFilter.containsMaliciousContent(pattern)).toBe(true);
      });
    });

    it('should allow safe content', () => {
      const safeContent = 'This is a normal activity name';
      expect(ContentFilter.containsMaliciousContent(safeContent)).toBe(false);
    });
  });

  describe('SizeValidator', () => {
    it('should validate session size limits', () => {
      const largeData = { data: 'x'.repeat(2 * 1024 * 1024) }; // 2MB
      expect(() => SizeValidator.validateSessionSize(largeData)).toThrow('Session data too large');
    });

    it('should validate activity count limits', () => {
      const tooManyActivities = Array(60).fill({ id: '1', name: 'Activity' });
      expect(() => SizeValidator.validateActivityLimits(tooManyActivities, [])).toThrow('Too many activities');
    });
  });

  describe('validateSessionForSharing', () => {
    const validSessionData = {
      plannedTime: 3600,
      timeSpent: 3500,
      overtime: 0,
      idleTime: 100,
      activities: [
        { id: '1', name: 'Task 1', duration: 1800, colorIndex: 0 },
        { id: '2', name: 'Task 2', duration: 1700, colorIndex: 1 },
      ],
      skippedActivities: [],
      timelineEntries: [
        {
          id: '1',
          activityId: '1',
          activityName: 'Task 1',
          startTime: 0,
          endTime: 1800,
          colorIndex: 0,
        },
      ],
      completedAt: new Date().toISOString(),
      sessionType: 'completed' as const,
    };

    it('should validate correct session data', () => {
      expect(() => validateSessionForSharing(validSessionData)).not.toThrow();
    });

    it('should reject invalid session data', () => {
      const invalidData = { ...validSessionData, plannedTime: -1 };
      expect(() => validateSessionForSharing(invalidData)).toThrow();
    });

    it('should sanitize session data', () => {
      const dataWithXSS = {
        ...validSessionData,
        activities: [
          { id: '1', name: '<script>alert("xss")</script>Task', duration: 1800, colorIndex: 0 },
        ],
      };

      const result = validateSessionForSharing(dataWithXSS);
      expect(result.activities[0]?.name).toBe('Task');
    });
  });
});