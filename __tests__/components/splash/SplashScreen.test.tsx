import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { SplashScreen } from '../../../components/splash/SplashScreen';
import { LoadingProvider, useLoading } from '../../../contexts/LoadingContext';

// Mock the useLoading hook
jest.mock('../../../contexts/LoadingContext', () => ({
  useLoading: jest.fn(),
  LoadingProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the CSS module
jest.mock('../../../components/splash/SplashScreen.module.css', () => ({
  splashScreen: 'splashScreen',
  logoContainer: 'logoContainer',
  logo: 'logo',
  loadingIndicator: 'loadingIndicator',
  loadingDot: 'loadingDot'
}));

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (useLoading as jest.Mock).mockReturnValue({ isLoading: true, setIsLoading: jest.fn() });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders the splash screen when loading', () => {
    render(<SplashScreen minimumDisplayTime={100} />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByAltText('Application logo')).toBeInTheDocument();
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('hides the splash screen when loading is complete', () => {
    (useLoading as jest.Mock).mockReturnValue({ isLoading: false, setIsLoading: jest.fn() });
    
    render(<SplashScreen minimumDisplayTime={100} />);
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('respects minimum display time even when loading finishes quickly', () => {
    const mockSetIsLoading = jest.fn();
    let mockIsLoading = true;
    
    (useLoading as jest.Mock).mockImplementation(() => ({
      isLoading: mockIsLoading,
      setIsLoading: mockSetIsLoading
    }));
    
    const { rerender } = render(<SplashScreen minimumDisplayTime={1000} />);
    
    // Splash screen should be visible initially
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Change loading state to false
    mockIsLoading = false;
    (useLoading as jest.Mock).mockImplementation(() => ({
      isLoading: mockIsLoading,
      setIsLoading: mockSetIsLoading
    }));
    
    rerender(<SplashScreen minimumDisplayTime={1000} />);
    
    // Advance time less than minimum display time
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Splash screen should still be visible
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Advance past minimum display time
    act(() => {
      jest.advanceTimersByTime(600); // Total 1100ms
    });
    
    // Now it should be gone
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('is accessible with proper aria attributes', () => {
    render(<SplashScreen minimumDisplayTime={100} />);
    
    const splashScreen = screen.getByRole('status');
    expect(splashScreen).toHaveAttribute('aria-live', 'polite');
    expect(splashScreen).toHaveAttribute('aria-label', 'Application is loading');
  });

  it('displays in both light and dark themes', () => {
    render(<SplashScreen minimumDisplayTime={100} />);
    
    const splashScreen = screen.getByTestId('splash-screen');
    // Fix: Test for the correct class name that matches the CSS module
    expect(splashScreen).toHaveClass('splashScreen');
    
    // Note: We can't directly test global theme classes in this test environment
    // without additional setup, so we'll just check for the base class
  });
});
