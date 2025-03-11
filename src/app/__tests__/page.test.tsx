/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';

// Mock window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

// Mock the hooks with reset functionality
const mockResetActivities = jest.fn();
const mockResetTimer = jest.fn();

jest.mock('@/hooks/useActivityState', () => ({
  useActivityState: () => ({
    currentActivity: null,
    timelineEntries: [],
    completedActivityIds: [],
    allActivitiesCompleted: false,
    handleActivitySelect: jest.fn(),
    handleActivityRemoval: jest.fn(),
    resetActivities: mockResetActivities,
  }),
}));

jest.mock('@/hooks/useTimerState', () => ({
  useTimerState: () => ({
    elapsedTime: 0,
    isTimeUp: false,
    timerActive: false,
    startTimer: jest.fn(),
    resetTimer: mockResetTimer,
  }),
}));

// Mock window theme detection
beforeAll(() => {
  Object.defineProperty(document.documentElement, 'classList', {
    value: {
      contains: jest.fn().mockReturnValue(false),
      add: jest.fn(),
      remove: jest.fn(),
    }
  });
});

describe('Home Page', () => {
  beforeEach(() => {
    mockConfirm.mockReset();
    mockResetActivities.mockReset();
    mockResetTimer.mockReset();
  });

  it('should not show reset button in setup state', () => {
    render(<Home />);
    
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('should show reset button after time is set', () => {
    render(<Home />);
    
    // Find and trigger the TimeSetup component
    const timeSetupButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(timeSetupButton);
    
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should show confirmation dialog when reset is clicked', () => {
    mockConfirm.mockImplementation(() => true);
    render(<Home />);
    
    // Set initial time to move past setup state
    const timeSetupButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(timeSetupButton);
    
    // Click reset button
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockResetActivities).toHaveBeenCalled();
    expect(mockResetTimer).toHaveBeenCalled();
  });

  it('should not reset if user cancels confirmation', () => {
    mockConfirm.mockImplementation(() => false);
    render(<Home />);
    
    // Set initial time to move past setup state
    const timeSetupButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(timeSetupButton);
    
    // Click reset button
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockResetActivities).not.toHaveBeenCalled();
    expect(mockResetTimer).not.toHaveBeenCalled();
  });
});