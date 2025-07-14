import React from 'react';
import { render, screen } from '@testing-library/react';
import { OfflineIndicator } from '../ui/OfflineIndicator';

// Mock the useOnlineStatus hook
jest.mock('../../hooks/use-online-status', () => ({
  useOnlineStatus: jest.fn()
}));

// Import the mocked hook
import { useOnlineStatus } from '../../hooks/use-online-status';

describe('OfflineIndicator', () => {
  // Cast mocked function to proper type
  const mockedUseOnlineStatus = useOnlineStatus as jest.MockedFunction<typeof useOnlineStatus>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should not render anything when online', () => {
    mockedUseOnlineStatus.mockReturnValue(true);
    const { container } = render(<OfflineIndicator />);
    expect(container.firstChild).toBeNull();
  });
  
  it('should render offline message when offline', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    const indicator = screen.getByTestId('offline-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator.textContent).toMatch(/you are offline/i);
  });
  
  it('should apply offline indicator styles when offline', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    const indicator = screen.getByTestId('offline-indicator');
    expect(indicator).toHaveAttribute('role', 'status');
    // Optionally check for custom class if needed
  });

  it('should render with proper nested structure', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    const { container } = render(<OfflineIndicator />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv?.getAttribute('role')).toBe('status');
    expect(outerDiv?.textContent).toMatch(/you are offline/i);
  });
});