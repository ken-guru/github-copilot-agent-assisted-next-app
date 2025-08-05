import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import TimerPage from '../page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

// Mock the shared hooks
jest.mock('@/hooks/useActivityState', () => ({
  useActivityState: jest.fn(() => ({
    currentActivity: null,
    timelineEntries: [],
    completedActivityIds: [],
    allActivitiesCompleted: false,
    handleActivitySelect: jest.fn(),
    handleActivityRemoval: jest.fn(),
    resetActivities: jest.fn(),
  })),
}));

jest.mock('@/hooks/useTimerState', () => ({
  useTimerState: jest.fn(() => ({
    elapsedTime: 0,
    isTimeUp: false,
    timerActive: false,
    startTimer: jest.fn(),
    resetTimer: jest.fn(),
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

// Mock components
jest.mock('@/components/ActivityManager', () => {
  return function MockActivityManager() {
    return <div data-testid="activity-manager">Activity Manager</div>;
  };
});

jest.mock('@/components/Timeline', () => {
  return function MockTimeline() {
    return <div data-testid="timeline">Timeline</div>;
  };
});

const mockUseSearchParams = useSearchParams as jest.Mock;

describe('Timer Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock - no query params
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  it('should render ActivityManager and Timeline', () => {
    render(<TimerPage />);
    
    expect(screen.getByTestId('activity-manager')).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('should parse time from query parameter', () => {
    // Mock query param t=76 (1 minute 16 seconds)
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockImplementation((key) => key === 't' ? '76' : null),
    });

    render(<TimerPage />);
    
    // The component should be rendered with the parsed time
    expect(screen.getByTestId('activity-manager')).toBeInTheDocument();
  });

  it('should default to 60 seconds for invalid time parameter', () => {
    // Mock invalid query param
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockImplementation((key) => key === 't' ? 'invalid' : null),
    });

    render(<TimerPage />);
    
    expect(screen.getByTestId('activity-manager')).toBeInTheDocument();
  });

  it('should default to 60 seconds for negative time parameter', () => {
    // Mock negative query param
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockImplementation((key) => key === 't' ? '-30' : null),
    });

    render(<TimerPage />);
    
    expect(screen.getByTestId('activity-manager')).toBeInTheDocument();
  });
});
