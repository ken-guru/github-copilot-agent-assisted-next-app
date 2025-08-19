/**
 * Tests for activity duplication utilities
 */

import { fetchActivitiesForDuplication, duplicateActivitiesWorkflow, handleActivityDuplication } from '../duplication';
import { duplicateActivitiesFromSession } from '../../activity-storage';
import type { ActivityDuplicationData } from '@/types/session-sharing';

// Mock dependencies
jest.mock('../../activity-storage');
const mockDuplicateActivitiesFromSession = duplicateActivitiesFromSession as jest.MockedFunction<typeof duplicateActivitiesFromSession>;

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock window.location
const mockLocation = {
  href: ''
};
delete (window as unknown as { location: unknown }).location;
(window as unknown as { location: unknown }).location = mockLocation;

describe('Activity Duplication Utilities', () => {
  const mockSessionId = 'test-session-123';
  const mockDuplicationData: ActivityDuplicationData = {
    activities: [
      { id: '1', name: 'Homework', duration: 1800, colorIndex: 0 },
      { id: '2', name: 'Reading', duration: 1700, colorIndex: 1 }
    ],
    originalSessionId: mockSessionId,
    duplicatedAt: '2024-01-01T12:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
  });

  describe('fetchActivitiesForDuplication', () => {
    it('should fetch activities successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockDuplicationData)
      } as unknown as Response);

      const result = await fetchActivitiesForDuplication(mockSessionId);

      expect(result).toEqual(mockDuplicationData);
      expect(mockFetch).toHaveBeenCalledWith(`/api/sessions/${mockSessionId}/activities`);
    });

    it('should throw error for failed request', async () => {
      const errorResponse = { message: 'Session not found' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue(errorResponse)
      } as unknown as Response);

      await expect(fetchActivitiesForDuplication(mockSessionId))
        .rejects.toThrow('Session not found');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchActivitiesForDuplication(mockSessionId))
        .rejects.toThrow('Network error');
    });

    it('should handle malformed error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      } as unknown as Response);

      await expect(fetchActivitiesForDuplication(mockSessionId))
        .rejects.toThrow('Failed to fetch activities: 500');
    });
  });

  describe('duplicateActivitiesWorkflow', () => {
    it('should complete duplication workflow successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockDuplicationData)
      } as unknown as Response);

      await duplicateActivitiesWorkflow(mockSessionId);

      expect(mockDuplicateActivitiesFromSession).toHaveBeenCalledWith(
        mockDuplicationData.activities,
        mockDuplicationData.originalSessionId
      );
      // Note: window.location.href assignment is mocked and may not work in tests
    });

    it('should handle fetch errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ message: 'Session not found' })
      } as unknown as Response);

      await expect(duplicateActivitiesWorkflow(mockSessionId))
        .rejects.toThrow('Session not found');
      
      expect(mockDuplicateActivitiesFromSession).not.toHaveBeenCalled();
      expect(mockLocation.href).toBe('');
    });

    it('should handle storage errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockDuplicationData)
      } as unknown as Response);
      
      mockDuplicateActivitiesFromSession.mockImplementation(() => {
        throw new Error('Storage error');
      });

      await expect(duplicateActivitiesWorkflow(mockSessionId))
        .rejects.toThrow('Storage error');
      
      expect(mockLocation.href).toBe('');
    });
  });

  describe('handleActivityDuplication', () => {
    it('should call success callback on successful duplication', async () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();

      // Reset the mock to not throw errors
      mockDuplicateActivitiesFromSession.mockImplementation(() => {
        // Mock successful storage operation
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockDuplicationData)
      } as unknown as Response);

      await handleActivityDuplication(mockSessionId, onSuccess, onError);

      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      // Note: window.location.href assignment is mocked and may not work in tests
    });

    it('should call error callback on failure', async () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ message: 'Session not found' })
      } as unknown as Response);

      await handleActivityDuplication(mockSessionId, onSuccess, onError);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Session not found' })
      );
    });

    it('should work without callbacks', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockDuplicationData)
      } as unknown as Response);

      await expect(handleActivityDuplication(mockSessionId))
        .resolves.toBeUndefined();
    });

    it('should handle non-Error exceptions', async () => {
      const onError = jest.fn();
      
      mockFetch.mockRejectedValueOnce('String error');

      await handleActivityDuplication(mockSessionId, undefined, onError);

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Unknown error occurred' })
      );
    });
  });
});