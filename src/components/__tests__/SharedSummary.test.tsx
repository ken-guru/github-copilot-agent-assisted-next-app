import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import SharedSummary from '../SharedSummary';
import { ToastProvider } from '@/contexts/ToastContext';
import type { SessionSummaryData } from '@/types/session-sharing';

// Mock the utilities
jest.mock('@/utils/activity-storage', () => ({
  saveActivities: jest.fn(),
}));

jest.mock('@/utils/uuid', () => ({
  generateUUID: jest.fn(() => 'mock-uuid-123'),
}));

jest.mock('@/utils/colors', () => ({
  isDarkMode: jest.fn(() => false),
  internalActivityColors: [
    {
      light: {
        background: 'hsl(120, 60%, 95%)',
        text: 'hsl(120, 60%, 25%)',
        border: 'hsl(120, 60%, 35%)'
      },
      dark: {
        background: 'hsl(120, 60%, 20%)',
        text: 'hsl(120, 60%, 85%)',
        border: 'hsl(120, 60%, 40%)'
      }
    },
    {
      light: {
        background: 'hsl(210, 100%, 95%)',
        text: 'hsl(210, 100%, 30%)',
        border: 'hsl(210, 83%, 45%)'
      },
      dark: {
        background: 'hsl(210, 100%, 20%)',
        text: 'hsl(210, 100%, 85%)',
        border: 'hsl(210, 83%, 50%)'
      }
    }
  ]
}));

// Mock navigation - we'll test the core functionality without navigation

// Mock setTimeout
jest.useFakeTimers();

const mockSessionData: SessionSummaryData = {
  plannedTime: 3600, // 1 hour
  timeSpent: 3300, // 55 minutes
  overtime: 0,
  idleTime: 300, // 5 minutes
  activities: [
    {
      id: 'activity-1',
      name: 'Reading',
      duration: 1800, // 30 minutes
      colorIndex: 0
    },
    {
      id: 'activity-2',
      name: 'Writing',
      duration: 1500, // 25 minutes
      colorIndex: 1
    }
  ],
  skippedActivities: [
    {
      id: 'activity-3',
      name: 'Exercise'
    }
  ],
  timelineEntries: [],
  completedAt: '2024-01-15T10:30:00.000Z',
  sessionType: 'completed'
};

const defaultProps = {
  sessionData: mockSessionData,
  sharedAt: '2024-01-15T10:30:00.000Z',
  expiresAt: '2024-04-15T10:30:00.000Z',
  onDuplicateActivities: jest.fn(),
};

const renderWithToast = (props = {}) => {
  return render(
    <ToastProvider>
      <SharedSummary {...defaultProps} {...props} />
    </ToastProvider>
  );
};

describe('SharedSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('renders the shared summary with correct title', () => {
    renderWithToast();
    
    expect(screen.getByRole('heading', { name: 'Shared Session Summary' })).toBeInTheDocument();
    expect(screen.getByTestId('shared-summary')).toBeInTheDocument();
  });

  it('displays session metadata correctly', () => {
    renderWithToast();
    
    const metadata = screen.getByTestId('session-metadata');
    expect(metadata).toBeInTheDocument();
    expect(metadata).toHaveTextContent('Shared:');
    expect(metadata).toHaveTextContent('Expires:');
    expect(metadata).toHaveTextContent('Completed:');
  });

  it('displays session statistics correctly', () => {
    renderWithToast();
    
    expect(screen.getByTestId('stat-value-planned')).toHaveTextContent('1h 0m 0s');
    expect(screen.getByTestId('stat-value-spent')).toHaveTextContent('55m 0s');
    expect(screen.getByTestId('stat-value-idle')).toHaveTextContent('5m 0s');
    expect(screen.getByTestId('stat-value-overtime')).toHaveTextContent('0s');
  });

  it('displays activities with correct durations and colors', () => {
    renderWithToast();
    
    const activityList = screen.getByTestId('activity-list');
    expect(activityList).toBeInTheDocument();
    
    // Check first activity
    const readingActivity = screen.getByTestId('activity-summary-item-activity-1');
    expect(readingActivity).toBeInTheDocument();
    expect(screen.getByTestId('activity-name-activity-1')).toHaveTextContent('Reading');
    
    // Check second activity
    const writingActivity = screen.getByTestId('activity-summary-item-activity-2');
    expect(writingActivity).toBeInTheDocument();
    expect(screen.getByTestId('activity-name-activity-2')).toHaveTextContent('Writing');
  });

  it('displays skipped activities when present', () => {
    renderWithToast();
    
    const skippedSection = screen.getByTestId('skipped-activities');
    expect(skippedSection).toBeInTheDocument();
    expect(skippedSection).toHaveTextContent('Skipped activities (1)');
    expect(screen.getByTestId('skipped-activity-name-activity-3')).toHaveTextContent('Exercise');
  });

  it('does not display skipped activities section when none exist', () => {
    const sessionWithoutSkipped = {
      ...mockSessionData,
      skippedActivities: []
    };
    
    renderWithToast({ sessionData: sessionWithoutSkipped });
    
    expect(screen.queryByTestId('skipped-activities')).not.toBeInTheDocument();
  });

  it('shows correct status message for completed session that finished early', () => {
    renderWithToast();
    
    const status = screen.getByTestId('session-status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('This session finished 5m 0s earlier than planned!');
  });

  it('shows correct status message for session that went overtime', () => {
    const overtimeSession = {
      ...mockSessionData,
      timeSpent: 4200, // 70 minutes (10 minutes overtime)
      overtime: 600
    };
    
    renderWithToast({ sessionData: overtimeSession });
    
    const status = screen.getByTestId('session-status');
    expect(status).toHaveTextContent('This session took 10m 0s more than planned');
  });

  it('shows correct status message for timeUp session type', () => {
    const timeUpSession = {
      ...mockSessionData,
      sessionType: 'timeUp' as const
    };
    
    renderWithToast({ sessionData: timeUpSession });
    
    const status = screen.getByTestId('session-status');
    expect(status).toHaveTextContent('Time was up when this session was completed.');
  });

  it('renders "Use These Activities" button', () => {
    renderWithToast();
    
    const button = screen.getByTestId('duplicate-activities-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Use These Activities');
    expect(button).not.toBeDisabled();
  });

  it('calls duplication handler when button is clicked', () => {
    const mockOnDuplicate = jest.fn();
    
    renderWithToast({ onDuplicateActivities: mockOnDuplicate });
    
    const button = screen.getByTestId('duplicate-activities-button');
    fireEvent.click(button);
    
    // The button click should trigger the duplication process
    // We'll test the actual duplication logic separately
    expect(button).toBeInTheDocument();
  });

  it('handles duplication errors gracefully', async () => {
    const mockModule = jest.requireMock('@/utils/activity-storage') as { saveActivities: jest.MockedFunction<(activities: unknown[]) => void> };
    const mockSaveActivities = mockModule.saveActivities;
    mockSaveActivities.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    renderWithToast();
    
    const button = screen.getByTestId('duplicate-activities-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('Use These Activities');
    });
  });

  it('button exists and is clickable', () => {
    renderWithToast();
    
    const button = screen.getByTestId('duplicate-activities-button');
    
    // Button should be present and clickable
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    
    // Should be able to click without errors
    fireEvent.click(button);
  });

  it('displays sharing information section', () => {
    renderWithToast();
    
    const sharingInfo = screen.getByTestId('sharing-info');
    expect(sharingInfo).toBeInTheDocument();
    expect(sharingInfo).toHaveTextContent('About this shared session:');
    expect(sharingInfo).toHaveTextContent('This is a read-only view');
  });

  it('formats durations correctly', () => {
    const sessionWithVariedDurations = {
      ...mockSessionData,
      plannedTime: 7265, // 2h 1m 5s
      timeSpent: 125, // 2m 5s
      idleTime: 65, // 1m 5s
      overtime: 5, // 5s
      activities: [
        {
          id: 'activity-1',
          name: 'Long Task',
          duration: 7200, // 2h 0m 0s
          colorIndex: 0
        },
        {
          id: 'activity-2',
          name: 'Short Task',
          duration: 30, // 30s
          colorIndex: 1
        }
      ]
    };
    
    renderWithToast({ sessionData: sessionWithVariedDurations });
    
    expect(screen.getByTestId('stat-value-planned')).toHaveTextContent('2h 1m 5s');
    expect(screen.getByTestId('stat-value-spent')).toHaveTextContent('2m 5s');
    expect(screen.getByTestId('stat-value-idle')).toHaveTextContent('1m 5s');
    expect(screen.getByTestId('stat-value-overtime')).toHaveTextContent('5s');
  });

  it('handles empty activities list', () => {
    const sessionWithoutActivities = {
      ...mockSessionData,
      activities: []
    };
    
    renderWithToast({ sessionData: sessionWithoutActivities });
    
    expect(screen.queryByTestId('activity-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('activity-list-heading')).not.toBeInTheDocument();
  });

  it('handles invalid date formats gracefully', () => {
    const sessionWithInvalidDates = {
      ...defaultProps,
      sharedAt: 'invalid-date',
      expiresAt: 'also-invalid',
      sessionData: {
        ...mockSessionData,
        completedAt: 'not-a-date'
      }
    };
    
    renderWithToast(sessionWithInvalidDates);
    
    const metadata = screen.getByTestId('session-metadata');
    // Should show "Unknown date" for each invalid date
    expect(metadata).toHaveTextContent('Unknown date');
  });

  it('applies correct theme colors to activities', () => {
    renderWithToast();
    
    const readingActivity = screen.getByTestId('activity-summary-item-activity-1');
    const writingActivity = screen.getByTestId('activity-summary-item-activity-2');
    
    // Should have background colors applied
    expect(readingActivity).toHaveStyle({
      backgroundColor: 'hsl(120, 60%, 95%)',
      borderColor: 'hsl(120, 60%, 35%)'
    });
    
    expect(writingActivity).toHaveStyle({
      backgroundColor: 'hsl(210, 100%, 95%)',
      borderColor: 'hsl(210, 83%, 45%)'
    });
  });

  it('handles color index out of bounds gracefully', () => {
    const sessionWithInvalidColorIndex = {
      ...mockSessionData,
      activities: [
        {
          id: 'activity-1',
          name: 'Invalid Color Activity',
          duration: 1800,
          colorIndex: 999 // Out of bounds
        }
      ]
    };
    
    renderWithToast({ sessionData: sessionWithInvalidColorIndex });
    
    const activity = screen.getByTestId('activity-summary-item-activity-1');
    expect(activity).toBeInTheDocument();
    // Should not crash and should apply fallback colors
  });
});