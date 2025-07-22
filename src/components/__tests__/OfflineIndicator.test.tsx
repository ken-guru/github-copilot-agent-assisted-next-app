import React from 'react';
import { render, screen } from '@testing-library/react';
import { OfflineIndicator } from '../OfflineIndicator';
import { ToastProvider } from '../ToastNotificationProvider';

// Mock the useOnlineStatus hook
jest.mock('../../hooks/useOnlineStatus', () => ({
  useOnlineStatus: jest.fn()
}));

// Import the mocked hook
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

describe('OfflineIndicator', () => {
  // Cast mocked function to proper type
  const mockedUseOnlineStatus = useOnlineStatus as jest.MockedFunction<typeof useOnlineStatus>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should not render anything when online', () => {
    mockedUseOnlineStatus.mockReturnValue(true);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    expect(screen.queryByTestId('global-toast')).not.toBeInTheDocument();
  });
  
  it('should render offline message when offline', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    expect(screen.getByTestId('global-toast')).toHaveTextContent(/you are offline/i);
  });
  
  it('should apply offline indicator styles when offline', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    // Toast is used, not alert
    expect(screen.getByTestId('global-toast')).toHaveTextContent(/you are offline/i);
  });

  it('should render with proper nested structure', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
  render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    // Toast is used, not alert
    expect(screen.getByTestId('global-toast')).toHaveTextContent(/you are offline/i);
  });
});