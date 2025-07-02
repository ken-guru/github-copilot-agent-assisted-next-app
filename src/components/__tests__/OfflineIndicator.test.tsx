import React from 'react';
import { render, screen } from '@testing-library/react';
import { OfflineIndicator } from '../OfflineIndicator';

// Mock the useOnlineStatus hook
jest.mock('../../hooks/useOnlineStatus', () => ({
  useOnlineStatus: jest.fn()
}));

// Import the mocked hook
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

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
    expect(screen.getByText(/you are offline/i)).toBeInTheDocument();
  });
  
  it('should apply offline indicator styles when offline', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    const indicator = screen.getByRole('alert');
    expect(indicator).toHaveClass('alert-warning');
  });

  it('should render with proper nested structure', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    const { container } = render(<OfflineIndicator />);
    
    const outerDiv = container.firstChild as HTMLElement;
    
    expect(outerDiv?.getAttribute('role')).toBe('alert');
    expect(outerDiv?.textContent).toBe('You are offline');
  });
});