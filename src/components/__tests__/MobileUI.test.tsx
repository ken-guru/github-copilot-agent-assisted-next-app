import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../../app/App';
import { ThemeProvider } from '../../context/ThemeContext';
import { AppStateProvider } from '../../context/AppStateContext';

// Mock useViewport hook before importing components that might use it
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn().mockReturnValue({
    width: 375,
    height: 667,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    viewportCategory: 'mobile',
    hasTouch: true,
  })
}));

describe('Mobile UI Improvements', () => {
  // Helper function to mock different screen sizes
  const setMobileViewport = (width = 375, height = 667) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: width });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: height });
    window.dispatchEvent(new Event('resize'));
  };
  
  const setDesktopViewport = (width = 1024, height = 768) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: width });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: height });
    window.dispatchEvent(new Event('resize'));
  };

  // Mock window.matchMedia for responsive tests
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('renders with larger touch-friendly elements on mobile viewport', () => {
    setMobileViewport();
    
    const { container } = render(
      <ThemeProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </ThemeProvider>
    );
    
    // Check for app container with data-testid instead of class
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toBeInTheDocument();
    expect(appContainer).toHaveClass('mobileView');
  });
  
  test('shows overtime indication when in overtime state', () => {
    setMobileViewport();
    
    // Set up app state with overtime
    const overtimeState = {
      timeRemaining: -120, // 2 minutes overtime
      isRunning: true
    };
    
    render(
      <ThemeProvider>
        <AppStateProvider initialAppState={overtimeState}>
          <App />
        </AppStateProvider>
      </ThemeProvider>
    );
    
    // Check for overtime indicator
    const overtimeElement = screen.getByTestId('overtime-indicator');
    expect(overtimeElement).toBeInTheDocument();
    expect(overtimeElement).toHaveTextContent(/overtime/i);
  });
});
