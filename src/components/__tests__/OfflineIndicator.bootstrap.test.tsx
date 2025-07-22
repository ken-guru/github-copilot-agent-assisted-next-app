import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { OfflineIndicator } from '../OfflineIndicator';
import { ToastProvider } from '../ToastNotificationProvider';

// Mock the useOnlineStatus hook
jest.mock('../../hooks/useOnlineStatus', () => ({
  useOnlineStatus: jest.fn()
}));

// Import the mocked hook
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

describe('OfflineIndicator Bootstrap Integration', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  // Cast mocked function to proper type
  const mockedUseOnlineStatus = useOnlineStatus as jest.MockedFunction<typeof useOnlineStatus>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should not render a toast when online', () => {
    mockedUseOnlineStatus.mockReturnValue(true);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    expect(screen.queryByTestId('global-toast')).not.toBeInTheDocument();
  });
  
  it('should render a toast when offline', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    const toast = screen.getByTestId('global-toast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('toast', 'bg-warning', 'show');
    expect(toast).toHaveAttribute('role', 'alert');
    expect(toast).toHaveTextContent(/you are offline/i);
  });

  it('should display offline message in toast', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    const toast = screen.getByTestId('global-toast');
    expect(toast).toHaveTextContent(/you are offline/i);
  });

  it('should have proper toast variant styling', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    const toast = screen.getByTestId('global-toast');
    expect(toast).toHaveClass('bg-warning');
  });

  it('should maintain accessibility with toast', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    const toast = screen.getByTestId('global-toast');
    expect(toast).toHaveAttribute('role', 'alert');
    expect(toast).toHaveAttribute('data-testid', 'global-toast');
  });

  it('should render with toast spacing utilities', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    const toast = screen.getByTestId('global-toast');
    expect(toast.parentElement).toHaveClass('toast-container');
  });

  it('should not render when transitioning from offline to online', () => {
    // Start offline
    mockedUseOnlineStatus.mockReturnValue(false);
    const { rerender } = render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    expect(screen.getByTestId('global-toast')).toBeInTheDocument();
    // Go online
    mockedUseOnlineStatus.mockReturnValue(true);
    rerender(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    // Advance timers to trigger toast autohide after going online
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByTestId('global-toast')).not.toBeInTheDocument();
  });

  // SSR test is not relevant for toast-based implementation (client-only)

  // Removed: not relevant for toast-based implementation

  // Removed: not relevant for toast-based implementation

  // Removed: not relevant for toast-based implementation
});
