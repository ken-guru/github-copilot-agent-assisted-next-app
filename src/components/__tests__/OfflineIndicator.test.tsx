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
    // Arrange
    mockedUseOnlineStatus.mockReturnValue(true);
    
    // Act
    const { container } = render(<OfflineIndicator />);
    
    // Assert
    expect(container.firstChild).toBeNull();
  });
  
  it('should render offline message when offline', () => {
    // Arrange
    mockedUseOnlineStatus.mockReturnValue(false);
    
    // Act
    render(<OfflineIndicator />);
    
    // Assert
    expect(screen.getByText(/you are offline/i)).toBeInTheDocument();
  });
  
  it('should apply offline indicator styles when offline', () => {
    // Arrange
    mockedUseOnlineStatus.mockReturnValue(false);
    
    // Act
    render(<OfflineIndicator />);
    
    // Assert
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveClass('offlineIndicator');
  });
});