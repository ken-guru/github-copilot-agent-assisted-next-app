/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';

// Mock window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

// Mock the hooks with reset functionality
const mockResetActivities = jest.fn();
const mockResetTimer = jest.fn();
const mockResetAppState = jest.fn();

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

// Modified AppState mock to simulate different application states
const mockAppState = {
  currentState: 'SETUP',
  moveToPlanning: jest.fn(),
  moveToActivity: jest.fn(),
  moveToCompleted: jest.fn(),
  reset: mockResetAppState,
  isSetupState: true,
  isPlanningState: false,
  isActivityState: false,
  isCompletedState: false
};

jest.mock('@/hooks/useAppState', () => ({
  useAppState: jest.fn().mockImplementation(({ onTimerStart } = {}) => mockAppState),
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

  // Mock setTimeout
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('Home Page', () => {
  beforeEach(() => {
    mockConfirm.mockReset();
    mockResetActivities.mockReset();
    mockResetTimer.mockReset();
    mockResetAppState.mockReset();
    
    // Reset the mock app state to setup state
    mockAppState.currentState = 'SETUP';
    mockAppState.isSetupState = true;
    mockAppState.isPlanningState = false;
    mockAppState.isActivityState = false;
    mockAppState.isCompletedState = false;
  });

  it('should not show reset button in setup state', () => {
    render(<Home />);
    
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('should show reset button after time is set', () => {
    // Simulate being in Planning state
    mockAppState.currentState = 'PLANNING';
    mockAppState.isSetupState = false;
    mockAppState.isPlanningState = true;
    
    render(<Home />);
    
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should show confirmation dialog when reset is clicked', () => {
    mockConfirm.mockImplementation(() => true);
    
    // Simulate being in Planning state
    mockAppState.currentState = 'PLANNING';
    mockAppState.isSetupState = false;
    mockAppState.isPlanningState = true;
    
    render(<Home />);
    
    // Click reset button
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockResetActivities).toHaveBeenCalled();
    expect(mockResetTimer).toHaveBeenCalled();
  });

  it('should not reset if user cancels confirmation', () => {
    mockConfirm.mockImplementation(() => false);
    
    // Simulate being in Planning state
    mockAppState.currentState = 'PLANNING';
    mockAppState.isSetupState = false;
    mockAppState.isPlanningState = true;
    
    render(<Home />);
    
    // Click reset button
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockResetActivities).not.toHaveBeenCalled();
    expect(mockResetTimer).not.toHaveBeenCalled();
  });

  it('should show Start New Session button in completed state', () => {
    // Simulate being in Completed state
    mockAppState.currentState = 'COMPLETED';
    mockAppState.isSetupState = false;
    mockAppState.isPlanningState = false;
    mockAppState.isActivityState = false;
    mockAppState.isCompletedState = true;
    
    render(<Home />);
    
    // Check if the Start New Session button exists with the proper test ID
    expect(screen.getByTestId('start-new-session')).toBeInTheDocument();
    expect(screen.getByText('Start New Session')).toBeInTheDocument();
  });

  it('should show completion success message in completed state', () => {
    // Simulate being in Completed state
    mockAppState.currentState = 'COMPLETED';
    mockAppState.isSetupState = false;
    mockAppState.isPlanningState = false;
    mockAppState.isActivityState = false;
    mockAppState.isCompletedState = true;
    
    render(<Home />);
    
    // Check if the completion success message exists with the proper test ID
    expect(screen.getByTestId('completion-message')).toBeInTheDocument();
    expect(screen.getByText('All activities have been completed successfully!')).toBeInTheDocument();
    expect(screen.getByText('Session Complete!')).toBeInTheDocument();
  });

  it('should show reset feedback and reset app state when Start New Session is clicked', async () => {
    // Simulate being in Completed state
    mockAppState.currentState = 'COMPLETED';
    mockAppState.isSetupState = false;
    mockAppState.isPlanningState = false;
    mockAppState.isActivityState = false;
    mockAppState.isCompletedState = true;
    
    render(<Home />);
    
    // Click the Start New Session button
    const startNewButton = screen.getByTestId('start-new-session');
    fireEvent.click(startNewButton);
    
    // Verify the reset feedback appears
    expect(screen.getByTestId('reset-feedback')).toBeInTheDocument();
    expect(screen.getByText('Starting new session...')).toBeInTheDocument();
    
    // Advance timers to simulate animation completion
    jest.advanceTimersByTime(800);
    
    // Verify state reset functions were called
    expect(mockResetActivities).toHaveBeenCalled();
    expect(mockResetTimer).toHaveBeenCalled();
    expect(mockResetAppState).toHaveBeenCalled();
  });
});