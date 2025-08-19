/**
 * Tests for shared session page route
 */

import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import SharedSessionPage, { generateMetadata } from '../page';
import { validateSessionSharingId } from '@/utils/uuid';
import type { GetSessionResponse } from '@/types/session-sharing';

// Mock dependencies
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

jest.mock('@/utils/uuid', () => ({
  validateSessionSharingId: jest.fn(),
}));

jest.mock('@/components/SharedSummary', () => {
  return function MockSharedSummary({ 
    sessionData, 
    sharedAt, 
    expiresAt 
  }: {
    sessionData: unknown;
    sharedAt: string;
    expiresAt: string;
  }) {
    return (
      <div data-testid="shared-summary">
        <div data-testid="session-data">{JSON.stringify(sessionData)}</div>
        <div data-testid="shared-at">{sharedAt}</div>
        <div data-testid="expires-at">{expiresAt}</div>
      </div>
    );
  };
});

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock environment variables
const originalEnv = process.env;

describe('SharedSessionPage', () => {
  const mockSessionId = 'test-uuid-123';
  const mockSessionData: GetSessionResponse = {
    sessionData: {
      plannedTime: 3600,
      timeSpent: 3300,
      overtime: 0,
      idleTime: 300,
      activities: [
        {
          id: 'activity-1',
          name: 'Test Activity',
          duration: 1800,
          colorIndex: 0,
        },
      ],
      skippedActivities: [],
      timelineEntries: [],
      completedAt: '2024-01-15T10:00:00.000Z',
      sessionType: 'completed' as const,
    },
    metadata: {
      id: mockSessionId,
      createdAt: '2024-01-15T10:00:00.000Z',
      expiresAt: '2024-04-15T10:00:00.000Z',
      version: '1.0',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mocks
    (validateSessionSharingId as jest.Mock).mockReturnValue(mockSessionId);
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSessionData),
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('UUID validation', () => {
    it('should call notFound for invalid UUID', async () => {
      (validateSessionSharingId as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid UUID');
      });

      await expect(SharedSessionPage({ params: { uuid: 'invalid-uuid' } }))
        .rejects.toThrow('NEXT_NOT_FOUND');

      expect(notFound).toHaveBeenCalled();
    });

    it('should validate UUID format', async () => {
      await SharedSessionPage({ params: { uuid: mockSessionId } });

      expect(validateSessionSharingId).toHaveBeenCalledWith(mockSessionId);
    });
  });

  describe('data fetching', () => {
    it('should fetch session data from API', async () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      });
      
      await SharedSessionPage({ params: { uuid: mockSessionId } });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/sessions/${mockSessionId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'User-Agent': 'Mr. Timely SSR/1.0',
          }),
        })
      );
    });

    it('should use Vercel URL in production', async () => {
      Object.defineProperty(process.env, 'VERCEL_URL', {
        value: 'test-app.vercel.app',
        writable: true,
        configurable: true,
      });
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true,
      });
      
      await SharedSessionPage({ params: { uuid: mockSessionId } });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://test-app.vercel.app/api/sessions/${mockSessionId}`,
        expect.any(Object)
      );
    });

    it('should call notFound when fetch fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(SharedSessionPage({ params: { uuid: mockSessionId } }))
        .rejects.toThrow('NEXT_NOT_FOUND');

      expect(notFound).toHaveBeenCalled();
    });

    it('should call notFound when fetch throws error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(SharedSessionPage({ params: { uuid: mockSessionId } }))
        .rejects.toThrow('NEXT_NOT_FOUND');

      expect(notFound).toHaveBeenCalled();
    });
  });

  describe('component rendering', () => {
    it('should render SharedSummary with correct props', async () => {
      const result = await SharedSessionPage({ params: { uuid: mockSessionId } });
      
      render(result as React.ReactElement);

      expect(screen.getByTestId('shared-summary')).toBeInTheDocument();
      expect(screen.getByTestId('session-data')).toHaveTextContent(
        JSON.stringify(mockSessionData.sessionData)
      );
      expect(screen.getByTestId('shared-at')).toHaveTextContent(
        mockSessionData.metadata.createdAt
      );
      expect(screen.getByTestId('expires-at')).toHaveTextContent(
        mockSessionData.metadata.expiresAt
      );
    });
  });
});

describe('generateMetadata', () => {
  const mockSessionId = 'test-uuid-123';
  const mockSessionData: GetSessionResponse = {
    sessionData: {
      plannedTime: 3600,
      timeSpent: 3300,
      overtime: 0,
      idleTime: 300,
      activities: [
        { id: 'activity-1', name: 'Test Activity', duration: 1800, colorIndex: 0 },
        { id: 'activity-2', name: 'Another Activity', duration: 1500, colorIndex: 1 },
      ],
      skippedActivities: [],
      timelineEntries: [],
      completedAt: '2024-01-15T10:00:00.000Z',
      sessionType: 'completed' as const,
    },
    metadata: {
      id: mockSessionId,
      createdAt: '2024-01-15T10:00:00.000Z',
      expiresAt: '2024-04-15T10:00:00.000Z',
      version: '1.0',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (validateSessionSharingId as jest.Mock).mockReturnValue(mockSessionId);
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSessionData),
    });
  });

  it('should generate metadata for valid session', async () => {
    const metadata = await generateMetadata({ params: { uuid: mockSessionId } });

    expect(metadata.title).toContain('1/15/2024');
    expect(metadata.description).toContain('2 activities');
    expect(metadata.description).toContain('55 minutes');
    expect(metadata.robots).toBe('noindex, nofollow');
  });

  it('should generate fallback metadata for invalid UUID', async () => {
    (validateSessionSharingId as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid UUID');
    });

    const metadata = await generateMetadata({ params: { uuid: 'invalid' } });

    expect(metadata.title).toBe('Shared Session - Mr. Timely');
    expect(metadata.robots).toBe('noindex, nofollow');
  });

  it('should generate not found metadata when session not found', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    const metadata = await generateMetadata({ params: { uuid: mockSessionId } });

    expect(metadata.title).toBe('Session Not Found - Mr. Timely');
    expect(metadata.description).toContain('could not be found');
    expect(metadata.robots).toBe('noindex, nofollow');
  });

  it('should include OpenGraph and Twitter metadata', async () => {
    const metadata = await generateMetadata({ params: { uuid: mockSessionId } });

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.title).toContain('1/15/2024');
    expect(metadata.openGraph?.description).toContain('2 activities');
    
    expect(metadata.twitter).toBeDefined();
    expect((metadata.twitter as { card?: string })?.card).toBe('summary');
  });
});