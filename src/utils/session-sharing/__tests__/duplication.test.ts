import { 
  extractActivitiesForDuplication,
  duplicateActivitiesFromSharedSession,
  createLinkedSharedSession,
  getDuplicationStatus,
  clearDuplicationTracking,
  handleActivityDuplication
} from '../duplication';
import { duplicateActivitiesFromSession } from '@/utils/activity-storage';

// Mock the activity-storage module
jest.mock('@/utils/activity-storage', () => ({
  duplicateActivitiesFromSession: jest.fn()
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: ''
  },
  writable: true,
  configurable: true
});

describe('duplication utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('extractActivitiesForDuplication', () => {
    it('should extract activities from valid session data', () => {
      const sessionData = {
        activities: [
          { id: '1', name: 'Activity 1', duration: 300, colorIndex: 0 },
          { id: '2', name: 'Activity 2', duration: 600, colorIndex: 1 }
        ]
      };

      const result = extractActivitiesForDuplication(sessionData);

      expect(result).toEqual([
        { id: '1', name: 'Activity 1', duration: 300, colorIndex: 0 },
        { id: '2', name: 'Activity 2', duration: 600, colorIndex: 1 }
      ]);
    });

    it('should throw error for invalid session data', () => {
      expect(() => extractActivitiesForDuplication(null)).toThrow('Invalid session data: missing activities');
      expect(() => extractActivitiesForDuplication({})).toThrow('Invalid session data: missing activities');
      expect(() => extractActivitiesForDuplication({ activities: 'not-array' })).toThrow('Invalid session data: missing activities');
    });
  });

  describe('duplicateActivitiesFromSharedSession', () => {
    it('should successfully duplicate activities', async () => {
      const sessionData = {
        activities: [
          { id: '1', name: 'Activity 1', duration: 300, colorIndex: 0 }
        ]
      };
      const originalSessionId = 'test-session-id';

      const result = await duplicateActivitiesFromSharedSession(sessionData, originalSessionId);

      expect(result.success).toBe(true);
      expect(result.redirectUrl).toBe('/');
      expect(duplicateActivitiesFromSession).toHaveBeenCalledWith(
        [{ id: '1', name: 'Activity 1', duration: 300, colorIndex: 0 }],
        originalSessionId
      );
    });

    it('should handle invalid session data', async () => {
      const result = await duplicateActivitiesFromSharedSession(null, 'test-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid session data provided');
    });

    it('should handle invalid session ID', async () => {
      const sessionData = { activities: [] };
      const result = await duplicateActivitiesFromSharedSession(sessionData, '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid session ID provided');
    });

    it('should handle empty activities', async () => {
      const sessionData = { activities: [] };
      const result = await duplicateActivitiesFromSharedSession(sessionData, 'test-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No activities found in shared session');
    });

    it('should handle duplication errors', async () => {
      const sessionData = {
        activities: [{ id: '1', name: 'Activity 1', duration: 300, colorIndex: 0 }]
      };
      
      (duplicateActivitiesFromSession as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = await duplicateActivitiesFromSharedSession(sessionData, 'test-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Storage error');
    });
  });

  describe('createLinkedSharedSession', () => {
    it('should successfully create linked session', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          shareUrl: 'https://example.com/shared/new-id'
        })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const sessionData = { activities: [] };
      const originalSessionId = 'original-id';

      const result = await createLinkedSharedSession(sessionData, originalSessionId);

      expect(result.success).toBe(true);
      expect(result.shareUrl).toBe('https://example.com/shared/new-id');
      expect(global.fetch).toHaveBeenCalledWith('/api/sessions/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceSessionId: originalSessionId,
          newSessionData: sessionData
        })
      });
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'API error'
        })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createLinkedSharedSession({}, 'test-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API error');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await createLinkedSharedSession({}, 'test-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('getDuplicationStatus', () => {
    it('should return duplication status when data exists', () => {
      mockLocalStorage.getItem
        .mockReturnValueOnce('original-session-id')
        .mockReturnValueOnce('2023-01-01T00:00:00.000Z');

      const result = getDuplicationStatus();

      expect(result.isDuplicated).toBe(true);
      expect(result.originalSessionId).toBe('original-session-id');
      expect(result.duplicatedAt).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should return no duplication when data does not exist', () => {
      const result = getDuplicationStatus();

      expect(result.isDuplicated).toBe(false);
      expect(result.originalSessionId).toBe(null);
      expect(result.duplicatedAt).toBe(null);
    });

    it('should handle localStorage errors', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = getDuplicationStatus();

      expect(result.isDuplicated).toBe(false);
      expect(result.originalSessionId).toBe(null);
      expect(result.duplicatedAt).toBe(null);
    });
  });

  describe('clearDuplicationTracking', () => {
    it('should remove duplication tracking items', () => {
      clearDuplicationTracking();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('originalSessionId');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('activitiesDuplicatedAt');
    });

    it('should handle localStorage errors silently', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => clearDuplicationTracking()).not.toThrow();
    });
  });

  describe('handleActivityDuplication', () => {
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    beforeEach(() => {
      mockOnSuccess.mockClear();
      mockOnError.mockClear();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should successfully handle activity duplication', async () => {
      const mockSessionResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          sessionData: {
            activities: [
              { id: '1', name: 'Activity 1', duration: 300, colorIndex: 0 }
            ]
          }
        })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockSessionResponse);
      
      // Reset the mock to ensure it works properly
      (duplicateActivitiesFromSession as jest.Mock).mockClear();

      const promise = handleActivityDuplication('test-session-id', mockOnSuccess, mockOnError);

      await promise;

      expect(global.fetch).toHaveBeenCalledWith('/api/sessions/test-session-id');
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();

      // Test navigation after delay
      jest.advanceTimersByTime(1500);
      expect(window.location.href).toBe('/');
    });

    it('should handle fetch errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn()
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await handleActivityDuplication('test-session-id', mockOnSuccess, mockOnError);

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
      expect(mockOnError.mock.calls[0][0].message).toBe('Failed to fetch session data');
    });

    it('should handle duplication errors', async () => {
      const mockSessionResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          sessionData: { activities: [] } // Empty activities will cause error
        })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockSessionResponse);

      await handleActivityDuplication('test-session-id', mockOnSuccess, mockOnError);

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
      expect(mockOnError.mock.calls[0][0].message).toBe('No activities found in shared session');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await handleActivityDuplication('test-session-id', mockOnSuccess, mockOnError);

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
      expect(mockOnError.mock.calls[0][0].message).toBe('Network error');
    });
  });
});