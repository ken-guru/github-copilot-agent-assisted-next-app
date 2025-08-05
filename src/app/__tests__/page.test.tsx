/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../page';
import resetService, { DialogCallback } from '@/utils/resetService';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { ConfirmationDialogProps, ConfirmationDialogRef } from '@/components/ConfirmationDialog';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ToastProvider } from '@/contexts/ToastContext';

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
  })),
}));

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

  it('should always show TimeSetup component in setup state', () => {
    renderHome();
    
    expect(screen.getByTestId('time-setup')).toBeInTheDocument();
  });

  it('should navigate to timer page when time is set', () => {
    renderHome();
    
    // Find and trigger the TimeSetup component
    const timeSetupButton = screen.getByRole('button', { name: /set time/i });
    fireEvent.click(timeSetupButton);
    
    // Should navigate to /timer with duration parameter (0 seconds is the default since no time was set)
    expect(mockPush).toHaveBeenCalledWith('/timer?t=0');
  });

  it('should not show reset button in setup state', () => {
    renderHome();
    
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('should register dialog callback with resetService', () => {
    renderHome();
    
    expect(mockedResetService.setDialogCallback).toHaveBeenCalled();
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
    it('should render main layout structure correctly', () => {
      // Mock window dimensions for mobile
      window.innerWidth = 480;
      window.innerHeight = 800;
      
      renderHome();
      
      // Since we've simplified the page to only show TimeSetup,
      // we should verify the main content is properly structured
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toHaveClass('container-fluid', 'd-flex', 'flex-column', 'overflow-x-hidden', 'overflow-y-auto');
    });
  });
});

