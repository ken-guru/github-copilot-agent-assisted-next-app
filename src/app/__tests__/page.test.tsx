/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';
import resetService from '@/utils/resetService';

// Mock resetService
jest.mock('@/utils/resetService', () => ({
  __esModule: true,
  default: {
    reset: jest.fn(),
    registerResetCallback: jest.fn().mockImplementation(callback => {
      (resetService as any).callbacks = [(resetService as any).callbacks || [], callback].flat();
      return jest.fn();
    }),
    executeCallbacks: () => {
      ((resetService as any).callbacks || []).forEach((cb: () => void) => cb());
    },
    setConfirmFunction: jest.fn()
  }
}));

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
    jest.clearAllMocks();
    (resetService as any).callbacks = [];
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

  it('should call resetService when reset is clicked', () => {
    render(<Home />);
    
    // Set initial time to move past setup state
    const timeSetupButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(timeSetupButton);
    
    // Click reset button
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(resetService.reset).toHaveBeenCalled();
  });

  it('should register reset callbacks with resetService', () => {
    render(<Home />);
    
    expect(resetService.registerResetCallback).toHaveBeenCalled();
    
    // Simulate reset service execution of callbacks
    (resetService as any).executeCallbacks();
    
    // Check that reset functions were called through callbacks
    expect(mockResetActivities).toHaveBeenCalled();
    expect(mockResetTimer).toHaveBeenCalled();
  });
});