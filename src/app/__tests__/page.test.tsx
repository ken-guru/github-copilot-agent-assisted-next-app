/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';
import resetService from '@/utils/resetService';
import { ResetCallback } from '@/utils/resetService';

// Define a proper interface for the mock resetService to avoid 'any' types
interface MockResetService {
  reset: jest.Mock;
  registerResetCallback: jest.Mock;
  callbacks: ResetCallback[];
  executeCallbacks: () => void;
  setConfirmFunction: jest.Mock;
}

// Mock resetService
jest.mock('@/utils/resetService', () => {
  const mockService: Partial<MockResetService> = {
    reset: jest.fn(),
    registerResetCallback: jest.fn().mockImplementation((callback: ResetCallback) => {
      if (!mockService.callbacks) {
        mockService.callbacks = [];
      }
      mockService.callbacks.push(callback);
      return jest.fn();
    }),
    executeCallbacks: () => {
      if (mockService.callbacks) {
        mockService.callbacks.forEach(cb => cb());
      }
    },
    setConfirmFunction: jest.fn()
  };
  
  return {
    __esModule: true,
    default: mockService
  };
});

// Cast the mocked service to our interface type
const mockedResetService = resetService as unknown as MockResetService;

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
    mockedResetService.callbacks = [];
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
    
    expect(mockedResetService.reset).toHaveBeenCalled();
  });

  it('should register reset callbacks with resetService', () => {
    render(<Home />);
    
    expect(mockedResetService.registerResetCallback).toHaveBeenCalled();
    
    // Simulate reset service execution of callbacks
    mockedResetService.executeCallbacks();
    
    // Check that reset functions were called through callbacks
    expect(mockResetActivities).toHaveBeenCalled();
    expect(mockResetTimer).toHaveBeenCalled();
  });
});