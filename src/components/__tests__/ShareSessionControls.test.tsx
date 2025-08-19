/**
 * Tests for ShareSessionControls component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider } from '@/contexts/ToastContext';
import ShareSessionControls from '../ShareSessionControls';
import type { SessionSummaryData } from '@/types/session-sharing';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock clipboard API
const mockClipboard = {
  writeText: jest.fn(),
};

// Mock window.isSecureContext
Object.defineProperty(window, 'isSecureContext', {
  writable: true,
  value: true,
});

Object.assign(navigator, {
  clipboard: mockClipboard,
});

// Mock document.execCommand for fallback
document.execCommand = jest.fn();

// Sample session data for testing
const mockSessionData: SessionSummaryData = {
  plannedTime: 1800, // 30 minutes
  timeSpent: 1900, // 31 minutes 40 seconds
  overtime: 100, // 1 minute 40 seconds
  idleTime: 120, // 2 minutes
  activities: [
    {
      id: '1',
      name: 'Study Math',
      duration: 900,
      colorIndex: 0,
    },
    {
      id: '2',
      name: 'Read Book',
      duration: 800,
      colorIndex: 1,
    },
  ],
  skippedActivities: [
    {
      id: '3',
      name: 'Exercise',
    },
  ],
  timelineEntries: [
    {
      id: 'entry-1',
      activityId: '1',
      activityName: 'Study Math',
      startTime: Date.now() - 1900000,
      endTime: Date.now() - 1000000,
      colorIndex: 0,
    },
    {
      id: 'entry-2',
      activityId: '2',
      activityName: 'Read Book',
      startTime: Date.now() - 1000000,
      endTime: Date.now(),
      colorIndex: 1,
    },
  ],
  completedAt: new Date().toISOString(),
  sessionType: 'completed',
};

// Test wrapper with ToastProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('ShareSessionControls', () => {
  const mockOnMakeShareable = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockClipboard.writeText.mockClear();
    (document.execCommand as jest.Mock).mockClear();
  });

  describe('Not Shared State', () => {
    it('renders Make Shareable button when not shared', () => {
      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={false}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /make shareable/i })).toBeInTheDocument();
      expect(screen.getByTitle('Create a shareable link for this session summary')).toBeInTheDocument();
    });

    it('shows privacy modal when Make Shareable is clicked', async () => {
      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={false}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /make shareable/i }));

      await waitFor(() => {
        expect(screen.getByText('Share Session Summary')).toBeInTheDocument();
        expect(screen.getByText(/Privacy Notice/)).toBeInTheDocument();
        expect(screen.getByText(/Generate a unique URL/)).toBeInTheDocument();
      });
    });

    it('can cancel privacy modal', async () => {
      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={false}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /make shareable/i }));

      await waitFor(() => {
        expect(screen.getByText('Share Session Summary')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.queryByText('Share Session Summary')).not.toBeInTheDocument();
      });
    });

    it('makes API call when share is confirmed', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          shareId: 'test-uuid',
          shareUrl: 'https://example.com/shared/test-uuid',
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });

      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={false}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      // Open privacy modal
      fireEvent.click(screen.getByRole('button', { name: /make shareable/i }));

      await waitFor(() => {
        expect(screen.getByText('Share Session Summary')).toBeInTheDocument();
      });

      // Confirm share
      fireEvent.click(screen.getByRole('button', { name: /create shareable link/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/sessions/share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionData: mockSessionData,
          }),
        });
        expect(mockOnMakeShareable).toHaveBeenCalled();
      });
    });

    it('handles API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Rate limit exceeded',
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
        }),
      });

      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={false}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      // Open privacy modal and confirm
      fireEvent.click(screen.getByRole('button', { name: /make shareable/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Share Session Summary')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /create shareable link/i }));

      await waitFor(() => {
        expect(screen.getByText(/too many share requests/i)).toBeInTheDocument();
      });
    });

    it('disables button when disabled prop is true', () => {
      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={false}
            onMakeShareable={mockOnMakeShareable}
            disabled={true}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /make shareable/i })).toBeDisabled();
    });
  });

  describe('Shared State', () => {
    const shareUrl = 'https://example.com/shared/test-uuid';

    it('renders copy link interface when shared', () => {
      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={true}
            shareUrl={shareUrl}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      expect(screen.getByText(/shareable link created/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(shareUrl)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
      expect(screen.getByText(/link expires in 90 days/i)).toBeInTheDocument();
    });

    it('copies URL to clipboard using modern API', async () => {
      mockClipboard.writeText.mockResolvedValueOnce(undefined);
      
      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={true}
            shareUrl={shareUrl}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /copy/i }));

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(shareUrl);
      });
    });

    it('falls back to execCommand when clipboard API fails', async () => {
      // Mock clipboard API to not exist and not secure context
      const originalClipboard = navigator.clipboard;
      const originalIsSecureContext = window.isSecureContext;
      
      Object.assign(navigator, { clipboard: undefined });
      Object.defineProperty(window, 'isSecureContext', { value: false });
      (document.execCommand as jest.Mock).mockReturnValueOnce(true);

      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={true}
            shareUrl={shareUrl}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /copy/i }));

      await waitFor(() => {
        expect(document.execCommand).toHaveBeenCalledWith('copy');
      });

      // Restore for other tests
      Object.assign(navigator, { clipboard: originalClipboard });
      Object.defineProperty(window, 'isSecureContext', { value: originalIsSecureContext });
    });

    it('selects all text when URL input is focused', () => {
      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={true}
            shareUrl={shareUrl}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      const input = screen.getByDisplayValue(shareUrl) as HTMLInputElement;
      const selectSpy = jest.spyOn(input, 'select');

      fireEvent.focus(input);

      expect(selectSpy).toHaveBeenCalled();
    });

    it('shows success state after copying', async () => {
      mockClipboard.writeText.mockResolvedValueOnce(undefined);
      
      render(
        <TestWrapper>
          <ShareSessionControls
            sessionData={mockSessionData}
            isShared={true}
            shareUrl={shareUrl}
            onMakeShareable={mockOnMakeShareable}
          />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /copy/i }));

      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });
    });
  });
});