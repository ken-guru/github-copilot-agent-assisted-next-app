import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SummaryPage from '../page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

// Mock the shared hooks
const mockResetActivities = jest.fn();
const mockResetTimer = jest.fn();

jest.mock('@/hooks/useActivityState', () => ({
  useActivityState: jest.fn(() => ({
    currentActivity: null,
    timelineEntries: [],
    completedActivityIds: [],
    allActivitiesCompleted: false,
    handleActivitySelect: jest.fn(),
    handleActivityRemoval: jest.fn(),
    resetActivities: mockResetActivities,
  })),
}));

jest.mock('@/hooks/useTimerState', () => ({
  useTimerState: jest.fn(() => ({
    elapsedTime: 0,
    isTimeUp: false,
    timerActive: false,
    startTimer: jest.fn(),
    resetTimer: mockResetTimer,
  })),
}));

// Mock reset service
jest.mock('@/utils/resetService', () => ({
  __esModule: true,
  default: {
    reset: jest.fn(),
    registerResetCallback: jest.fn(() => jest.fn()),
    setDialogCallback: jest.fn(),
  },
}));

// Mock Summary component
jest.mock('@/components/Summary', () => {
  return function MockSummary({ onReset }: { onReset: () => void }) {
    return (
      <div data-testid="summary">
        <button onClick={onReset}>Reset</button>
      </div>
    );
  };
});

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.Mock;

describe('Summary Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });
  });

  it('should render Summary component when there are timeline entries', () => {
    // Mock having timeline entries (actual data)
    const mockUseActivityState = jest.requireMock('@/hooks/useActivityState').useActivityState;
    mockUseActivityState.mockReturnValue({
      currentActivity: null,
      timelineEntries: [
        { id: '1', activityId: 'act1', activityName: 'Test Activity', startTime: 0, endTime: 60 }
      ],
      completedActivityIds: ['act1'],
      allActivitiesCompleted: true,
      handleActivitySelect: jest.fn(),
      handleActivityRemoval: jest.fn(),
      resetActivities: mockResetActivities,
    });
    
    render(<SummaryPage />);
    
    expect(screen.getByTestId('summary')).toBeInTheDocument();
  });

  it('should display empty state when no timeline entries exist', () => {
    // Mock having no timeline entries
    const mockUseActivityState = jest.requireMock('@/hooks/useActivityState').useActivityState;
    mockUseActivityState.mockReturnValue({
      currentActivity: null,
      timelineEntries: [],
      completedActivityIds: [],
      allActivitiesCompleted: false,
      handleActivitySelect: jest.fn(),
      handleActivityRemoval: jest.fn(),
      resetActivities: mockResetActivities,
    });
    
    render(<SummaryPage />);
    
    expect(screen.getByText('No Activities Completed')).toBeInTheDocument();
    expect(screen.getByText(/You haven.*t completed any activities yet/)).toBeInTheDocument();
  });

  it('should navigate to setup when "Return to Setup" is clicked', () => {
    // Mock empty state
    const mockUseActivityState = jest.requireMock('@/hooks/useActivityState').useActivityState;
    mockUseActivityState.mockReturnValue({
      currentActivity: null,
      timelineEntries: [],
      completedActivityIds: [],
      allActivitiesCompleted: false,
      handleActivitySelect: jest.fn(),
      handleActivityRemoval: jest.fn(),
      resetActivities: mockResetActivities,
    });
    
    render(<SummaryPage />);
    
    const returnButton = screen.getByText(/return to setup/i);
    fireEvent.click(returnButton);
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should call reset service when reset is clicked from Summary', () => {
    // Mock having timeline entries
    const mockUseActivityState = jest.requireMock('@/hooks/useActivityState').useActivityState;
    mockUseActivityState.mockReturnValue({
      currentActivity: null,
      timelineEntries: [
        { id: '1', activityId: 'act1', activityName: 'Test Activity', startTime: 0, endTime: 60 }
      ],
      completedActivityIds: ['act1'],
      allActivitiesCompleted: true,
      handleActivitySelect: jest.fn(),
      handleActivityRemoval: jest.fn(),
      resetActivities: mockResetActivities,
    });
    
    const mockResetService = jest.requireMock('@/utils/resetService').default;
    
    render(<SummaryPage />);
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockResetService.reset).toHaveBeenCalled();
  });
});
