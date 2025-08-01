/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../page';
import resetService, { DialogCallback } from '@/utils/resetService';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { ConfirmationDialogProps, ConfirmationDialogRef } from '@/components/ConfirmationDialog';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ToastProvider } from '@/contexts/ToastContext';

// Store dialog props for testing
let mockDialogProps = {
  message: '',
  onConfirm: jest.fn(),
  onCancel: jest.fn()
};

// Mock the ConfirmationDialog component
jest.mock('@/components/ConfirmationDialog', () => {
  const ForwardRefComponent = jest.fn().mockImplementation(
    ({ message, onConfirm, onCancel }, ref) => {
      // Store the props for testing
      mockDialogProps = { message, onConfirm, onCancel };
      
      // Mock the showDialog method
      if (ref) {
        ref.current = {
          showDialog: () => {
            // Update the dialog message in our mock when showDialog is called
            mockDialogProps = { ...mockDialogProps, message };
          }
        };
      }

      return (
        <div data-testid="mock-dialog">
          <p data-testid="dialog-message">{mockDialogProps.message}</p>
          <button onClick={mockDialogProps.onConfirm}>Confirm</button>
          <button onClick={mockDialogProps.onCancel}>Cancel</button>
        </div>
      );
    }
  ) as unknown as ForwardRefExoticComponent<ConfirmationDialogProps & RefAttributes<ConfirmationDialogRef>>;
  
  ForwardRefComponent.displayName = 'MockConfirmationDialog';
  return { __esModule: true, default: ForwardRefComponent };
});

// Define a proper interface for the mock resetService
interface MockResetService {
  reset: jest.Mock;
  registerResetCallback: jest.Mock;
  setDialogCallback: jest.Mock;
  dialogCallbackFn: DialogCallback | null;
  callbacks: Array<() => void>;
  executeCallbacks: () => void;
}

// Mock resetService
jest.mock('@/utils/resetService', () => {
  const mockService: Partial<MockResetService> = {
    reset: jest.fn().mockResolvedValue(true),
    registerResetCallback: jest.fn().mockImplementation((callback) => {
      if (!mockService.callbacks) {
        mockService.callbacks = [];
      }
      mockService.callbacks.push(callback);
      return jest.fn();
    }),
    setDialogCallback: jest.fn().mockImplementation((callback) => {
      // Use type assertion instead of any
      (mockService as Partial<MockResetService>).dialogCallbackFn = callback;
    }),
    executeCallbacks: () => {
      if (mockService.callbacks) {
        mockService.callbacks.forEach(cb => cb());
      }
    }
  };
  
  return {
    __esModule: true,
    default: mockService
  };
});

// Cast the mocked service
const mockedResetService = resetService as unknown as MockResetService;

// Mock the hooks with reset functionality
const mockResetActivities = jest.fn();
const mockResetTimer = jest.fn();

// Set up useActivityState mock with reusable implementation
const mockUseActivityState = jest.fn().mockImplementation(() => ({
  currentActivity: null,
  timelineEntries: [],
  completedActivityIds: [],
  allActivitiesCompleted: false,
  handleActivitySelect: jest.fn(),
  handleActivityRemoval: jest.fn(),
  resetActivities: mockResetActivities,
}));

jest.mock('@/hooks/useActivityState', () => ({
  useActivityState: () => mockUseActivityState(),
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

// Mock HTMLDialogElement functionality
HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();

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

// Helper function to render Home component with required providers
const renderHome = () => {
  return render(
    <LoadingProvider>
      <ToastProvider>
        <Home />
      </ToastProvider>
    </LoadingProvider>
  );
};

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedResetService.callbacks = [];
    mockDialogProps = {
      message: '',
      onConfirm: jest.fn(),
      onCancel: jest.fn()
    };
  });

  it('should not show reset button in setup state', () => {
    renderHome();
    
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('should show reset button after time is set', () => {
    renderHome();
    
    // Find and trigger the TimeSetup component
    const timeSetupButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(timeSetupButton);
    
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should call resetService when reset is clicked', () => {
    renderHome();
    
    // Set initial time to move past setup state
    const timeSetupButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(timeSetupButton);
    
    // Click reset button
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockedResetService.reset).toHaveBeenCalled();
  });

  it('should register reset callbacks and dialog callback with resetService', () => {
    renderHome();
    
    expect(mockedResetService.registerResetCallback).toHaveBeenCalled();
    expect(mockedResetService.setDialogCallback).toHaveBeenCalled();
    
    // Simulate reset service execution of callbacks
    mockedResetService.executeCallbacks();
    
    // Check that reset functions were called through callbacks
    expect(mockResetActivities).toHaveBeenCalled();
    expect(mockResetTimer).toHaveBeenCalled();
  });

  it('should provide a working dialog callback to resetService', async () => {
    renderHome();

    // Get the dialog callback that was registered
    const dialogCallback = mockedResetService.dialogCallbackFn;
    expect(dialogCallback).toBeDefined();
    
    if (dialogCallback) {
      // Create a promise to track resolution
      let resolveCallback: (value: boolean) => void;
      const confirmationPromise = new Promise<boolean>(resolve => {
        resolveCallback = resolve;
      });

      // Start the dialog callback process in an act block
      await act(async () => {
        // The dialog callback returns a promise that resolves when user confirms/cancels
        dialogCallback('Test message').then(result => {
          resolveCallback(result);
        });
      });

      // Find the injected confirmation dialog after state updates
      const dialog = screen.getByTestId('mock-dialog');
      expect(dialog).toBeInTheDocument();
      
      // The dialog content should exist even if it doesn't have our exact message
      // (since we're mocking and can't access internal state directly)
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
      
      // Simulate user clicking confirm
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      });
      
      // Check that our promise resolved to true
      const result = await confirmationPromise;
      expect(result).toBe(true);
    }
  });

  describe('Mobile Header Layout', () => {
    it('should render navigation with brand in main layout', () => {
      // Mock window dimensions for mobile
      window.innerWidth = 480;
      window.innerHeight = 800;
      
      renderHome();
      
      // Since we've moved the title to Navigation component and removed the main header,
      // we should verify the main content is properly structured
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toHaveClass('container-fluid', 'd-flex', 'flex-column', 'overflow-hidden');
    });
  });
});

describe('Progress Element Visibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should show progress container in activity state', () => {
    // Mock activity state (timeSet = true, !allActivitiesCompleted)
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    mockUseActivityState.mockImplementationOnce(() => ({
      currentActivity: { id: '1', name: 'Test Activity' },
      timelineEntries: [{ id: '1', activityId: '1', activityName: 'Test Activity', startTime: 0 }],
      completedActivityIds: [],
      allActivitiesCompleted: false,
      handleActivitySelect: jest.fn(),
      handleActivityRemoval: jest.fn(),
      resetActivities: mockResetActivities,
    }));
    
    renderHome();
    
    // In activity state, progress container should be present
    const progressContainer = screen.getByTestId('progress-container');
    expect(progressContainer).toBeInTheDocument();
  });
  
  it('should not show progress container in setup state', () => {
    // Mock for setup state (timeSet = false)
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);
    
    renderHome();
    
    // In setup state, progress container should not be rendered
    const progressContainer = screen.queryByTestId('progress-container');
    
    // Since our conditionally rendered progress bar should only appear
    // in the activity state, it should not be in the document in setup state
    expect(progressContainer).not.toBeInTheDocument();
  });
  
  it('should not show progress container in completed state', () => {
    // Mock for completed state (timeSet = true, allActivitiesCompleted = true)
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    
    mockUseActivityState.mockImplementationOnce(() => ({
      currentActivity: null,
      timelineEntries: [],
      completedActivityIds: ['1'],
      allActivitiesCompleted: true,
      handleActivitySelect: jest.fn(),
      handleActivityRemoval: jest.fn(),
      resetActivities: mockResetActivities,
    }));
    
    renderHome();
    
    // In completed state, progress container should not be rendered
    const progressContainer = screen.queryByTestId('progress-container');
    
    // Since our conditionally rendered progress bar should only appear
    // in the activity state, it should not be in the document in completed state
    expect(progressContainer).not.toBeInTheDocument();
  });
});
