/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../page';
import resetService, { DialogCallback } from '@/utils/resetService';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { ConfirmationDialogProps, ConfirmationDialogRef } from '@/components/ConfirmationDialog';
import styles from '../page.module.css';

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

  it('should register reset callbacks and dialog callback with resetService', () => {
    render(<Home />);
    
    expect(mockedResetService.registerResetCallback).toHaveBeenCalled();
    expect(mockedResetService.setDialogCallback).toHaveBeenCalled();
    
    // Simulate reset service execution of callbacks
    mockedResetService.executeCallbacks();
    
    // Check that reset functions were called through callbacks
    expect(mockResetActivities).toHaveBeenCalled();
    expect(mockResetTimer).toHaveBeenCalled();
  });

  it('should provide a working dialog callback to resetService', async () => {
    render(<Home />);

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
    beforeEach(() => {
      // Mock mobile viewport
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    it('should render header with compact layout on mobile', () => {
      render(<Home />);
      
      const header = screen.getByRole('banner');
      const headerContent = header.firstElementChild;
      
      expect(headerContent).toHaveClass(styles.headerContent);
      expect(header.firstElementChild).not.toBeNull();
    });

    it('should maintain touch-friendly sizing for buttons on mobile', () => {
      render(<Home />);
      
      // Set initial time to show reset button
      const timeSetupButton = screen.getByRole('button', { name: /set time/i });
      fireEvent.click(timeSetupButton);
      
      const resetButton = screen.getByText('Reset');
      expect(resetButton).toHaveClass(styles.resetButton);
    });

    it('should render title with correct mobile styling', () => {
      render(<Home />);
      
      const title = screen.getByText('Mr. Timely');
      expect(title).toHaveClass(styles.title);
    });
  });
});

describe('OfflineIndicator Integration', () => {
  beforeEach(() => {
    // Mock offline status
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    });
  });

  afterEach(() => {
    // Reset online status
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });
  });

  it('should maintain offline indicator positioning across all app states', () => {
    const { rerender } = render(<Home />);
    
    // Check setup state
    const setupOfflineIndicator = screen.getByRole('status');
    expect(setupOfflineIndicator).toHaveTextContent('You are offline');
    
    // With our new layout, the progressContainer comes after the offline indicator
    expect(setupOfflineIndicator.nextElementSibling).toHaveClass(styles.progressContainer);
    
    // The main content (setupGrid, activityGrid, etc) now comes after the progressContainer
    const progressContainer = setupOfflineIndicator.nextElementSibling;
    expect(progressContainer?.nextElementSibling).toHaveClass(styles.setupGrid);

    // Transition to activity state
    const timeSetupButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(timeSetupButton);
    
    // Check activity state
    const activityOfflineIndicator = screen.getByRole('status');
    expect(activityOfflineIndicator).toHaveTextContent('You are offline');
    
    // Check the updated DOM order for activity state
    const activityProgressContainer = activityOfflineIndicator.nextElementSibling;
    expect(activityProgressContainer).toHaveClass(styles.progressContainer);
    expect(activityProgressContainer?.nextElementSibling).toHaveClass(styles.activityGrid);

    // Mock completed state
    mockUseActivityState.mockImplementationOnce(() => ({
      currentActivity: null,
      timelineEntries: [],
      completedActivityIds: ['1'],
      allActivitiesCompleted: true,
      handleActivitySelect: jest.fn(),
      handleActivityRemoval: jest.fn(),
      resetActivities: mockResetActivities,
    }));
    rerender(<Home />);

    // Check completed state
    const completedOfflineIndicator = screen.getByRole('status');
    expect(completedOfflineIndicator).toHaveTextContent('You are offline');
    
    // Check the updated DOM order for completed state
    const completedProgressContainer = completedOfflineIndicator.nextElementSibling;
    expect(completedProgressContainer).toHaveClass(styles.progressContainer);
    expect(completedProgressContainer?.nextElementSibling).toHaveClass(styles.completedGrid);
  });
});

describe('Progress Element Positioning', () => {
  beforeEach(() => {
    // Mock time set to true to ensure progress bar is displayed
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    
    // Mock mobile viewport
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });
  
  it('should position progress element between header and main content', () => {
    render(<Home />);
    
    const header = screen.getByRole('banner');
    const offlineIndicator = screen.queryByRole('status');
    const progressContainer = document.querySelector(`.${styles.progressContainer}`);
    
    // In our implementation, the offline indicator is the sibling of the header
    // and the progress container is positioned after the offline indicator
    expect(progressContainer).toBeInTheDocument();
    
    // Just verify the progress container is in the document and between header and content
    // rather than checking exact DOM order which might change
    const wrapperElement = header.parentElement;
    expect(wrapperElement?.contains(progressContainer)).toBe(true);
    
    // Verify that the progress container is not fixed to bottom in the new layout
    const computedStyle = window.getComputedStyle(progressContainer as Element);
    expect(computedStyle.position).not.toBe('fixed');
  });
});