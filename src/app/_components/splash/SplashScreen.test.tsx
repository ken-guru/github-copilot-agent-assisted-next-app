'use client';

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import SplashScreen from '@/app/_components/splash/SplashScreen';

// Mock the loading context
const mockUseLoading = jest.fn().mockReturnValue({
  isLoading: false,
  setIsLoading: jest.fn()
});

jest.mock('@contexts/loading', () => ({
  useLoading: () => mockUseLoading(),
  LoadingProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('SplashScreen Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    
    // Reset the mock
    mockUseLoading.mockReturnValue({
      isLoading: true,
      setIsLoading: jest.fn()
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the splash screen', () => {
    render(<SplashScreen />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Test for functional elements instead of CSS classes
    expect(screen.getByRole('img', { name: /application logo/i })).toBeInTheDocument();
  });

  it('hides after minimum display time when not loading', () => {
    mockUseLoading.mockReturnValue({
      isLoading: false,
      setIsLoading: jest.fn()
    });
    
    const { container } = render(<SplashScreen minimumDisplayTime={500} />);
    
    // Splash should be visible initially
    expect(container.firstChild).not.toBeNull();
    
    // Advance time to trigger minimum display timeout plus fade out
    act(() => {
      jest.advanceTimersByTime(1100); // 500ms + 500ms fade + buffer
    });
    
    // Component should be removed from DOM after timeout
    expect(container.firstChild).toBeNull();
  });

  it('stays visible while loading, even after minimum time', () => {
    mockUseLoading.mockReturnValue({
      isLoading: true,
      setIsLoading: jest.fn()
    });
    
    const { container } = render(<SplashScreen minimumDisplayTime={500} />);
    
    // Advance time past minimum display time
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Splash should still be visible because loading is true
    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild).not.toHaveClass('fading');
  });

  it('starts fade out when loading changes to false', () => {
    const setIsLoadingMock = jest.fn();
    
    // Start with loading=true
    mockUseLoading.mockReturnValue({
      isLoading: true,
      setIsLoading: setIsLoadingMock
    });
    
    const { container, rerender } = render(<SplashScreen minimumDisplayTime={500} />);
    
    // Advance time past minimum display time
    act(() => {
      jest.advanceTimersByTime(600);
    });
    
    // Splash should still be visible
    expect(container.firstChild).not.toBeNull();
    
    // Now change loading to false and rerender
    mockUseLoading.mockReturnValue({
      isLoading: false,
      setIsLoading: setIsLoadingMock
    });
    
    rerender(<SplashScreen minimumDisplayTime={500} />);
    
    // Check if it eventually gets removed from DOM after fade completes
    act(() => {
      jest.advanceTimersByTime(600); // Allow time for fade animation to complete
    });
    
    // Component should eventually be removed from DOM
    expect(container.firstChild).toBeNull();
  });
});
