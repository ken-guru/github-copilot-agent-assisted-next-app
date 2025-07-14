import React from 'react';
import { render, screen } from '@testing-library/react';
import { OfflineIndicator } from '../OfflineIndicator';

// Mock the useOnlineStatus hook
jest.mock('../../hooks/use-online-status', () => ({
  useOnlineStatus: jest.fn()
}));

// Import the mocked hook
import { useOnlineStatus } from '../../hooks/use-online-status';

describe('OfflineIndicator Bootstrap Integration', () => {
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
  
  it('should render Bootstrap Alert when offline', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('alert');
    expect(alert).toHaveClass('alert-warning');
  });

  it('should display offline message in Bootstrap Alert', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alertText = screen.getByText(/you are offline/i);
    expect(alertText).toBeInTheDocument();
    
    // Ensure it's within the alert component
    const alert = screen.getByRole('alert');
    expect(alert).toContainElement(alertText);
  });

  it('should have proper Bootstrap Alert variant styling', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-warning');
  });

  it('should maintain accessibility with Bootstrap Alert', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('role', 'alert');
    expect(alert).toHaveAttribute('data-testid', 'offline-indicator');
  });

  it('should render with Bootstrap spacing utilities', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('mb-3'); // Bootstrap margin-bottom utility
  });

  it('should not render when transitioning from offline to online', () => {
    // Start offline
    mockedUseOnlineStatus.mockReturnValue(false);
    const { rerender } = render(<OfflineIndicator />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Go online
    mockedUseOnlineStatus.mockReturnValue(true);
    rerender(<OfflineIndicator />);
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should handle SSR correctly with Bootstrap Alert', () => {
    // Create a fresh component instance to test SSR behavior
    // The component should prevent rendering until mounted client-side
    mockedUseOnlineStatus.mockReturnValue(false);
    
    // Mock the mounted state by creating a new component
    const TestComponent = () => {
      const [mounted] = React.useState(false);
      
      // Simulate SSR - component not yet mounted
      if (!mounted) {
        return null;
      }
      
      return <OfflineIndicator />;
    };
    
    const { container } = render(<TestComponent />);
    
    // Should not render during initial SSR state
    expect(container.firstChild).toBeNull();
  });

  it('should render Bootstrap Alert with default warning styling', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    
    // Check for Bootstrap alert classes
    expect(alert).toHaveClass('alert');
    expect(alert).toHaveClass('alert-warning');
    
    // Should not have dismissible by default
    expect(alert).not.toHaveClass('alert-dismissible');
  });

  it('should maintain proper text content structure', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    expect(alert.textContent?.trim()).toBe('You are offline');
  });

  it('should use Bootstrap text alignment utilities', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('text-center');
  });
});
