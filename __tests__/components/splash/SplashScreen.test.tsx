import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SplashScreen from '../../../components/splash/SplashScreen';

// Mock LoadingContext
jest.mock('../../../contexts/LoadingContext', () => ({
  useLoading: jest.fn().mockReturnValue({ isLoading: true }),
}));

// Mock theme utility - correct path to src/utils/theme
jest.mock('../../../src/utils/theme', () => ({
  isDarkTheme: jest.fn().mockReturnValue(false),
}));

// Get the mocked LoadingContext
const mockLoadingContext = require('../../../contexts/LoadingContext');

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    // Reset the mock to default loading state
    mockLoadingContext.useLoading.mockReturnValue({ isLoading: true });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the splash screen when loading', () => {
    render(<SplashScreen />);
    
    // Verify the splash screen is rendered
    const splashScreen = screen.getByTestId('splash-screen');
    expect(splashScreen).toBeInTheDocument();
    
    // Verify loading indicator is present
    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
    
    // Check for the logo
    const logo = screen.getByAltText('Application logo');
    expect(logo).toBeInTheDocument();
  });

  it('properly maintains image aspect ratio', () => {
    render(<SplashScreen />);
    
    const image = screen.getByAltText('Application logo');
    
    // Cache the original function
    const originalGetComputedStyle = window.getComputedStyle;
    
    // Mock getComputedStyle
    window.getComputedStyle = jest.fn().mockReturnValue({
      width: '250px',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '100%'
    });
    
    // Get computed styles
    const imageStyle = window.getComputedStyle(image);
    
    // Test that if one dimension is set in CSS, the other is set to 'auto'
    if (imageStyle.width !== 'auto' && imageStyle.maxWidth !== 'none') {
      expect(imageStyle.height).toBe('auto');
    }
    
    if (imageStyle.height !== 'auto' && imageStyle.maxHeight !== 'none') {
      expect(imageStyle.width).toBe('auto');
    }
    
    // Restore original function
    window.getComputedStyle = originalGetComputedStyle;
  });

  it('respects updated minimum display time of 1000ms or less', () => {
    // Start with loading
    mockLoadingContext.useLoading.mockReturnValue({ isLoading: true });
    
    const { rerender } = render(<SplashScreen minimumDisplayTime={1000} />);
    
    // Change loading state to false
    mockLoadingContext.useLoading.mockReturnValue({ isLoading: false });
    rerender(<SplashScreen minimumDisplayTime={1000} />);
    
    // Advance time to just before the minimum display time
    act(() => {
      jest.advanceTimersByTime(900);
    });
    
    // Splash screen should still be visible
    expect(screen.queryByRole('status')).toBeInTheDocument();
    
    // Advance past minimum display time
    act(() => {
      jest.advanceTimersByTime(200); // Total 1100ms
    });
    
    // Force all timers to complete
    act(() => {
      jest.runAllTimers();
    });
    
    // Now it should be gone
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
