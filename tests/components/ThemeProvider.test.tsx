import React from 'react';
import { render, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../components/contexts/ThemeProvider';

// Test component that uses the theme context
const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-status">{isDarkMode ? 'dark' : 'light'}</div>
      <button data-testid="toggle-btn" onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  // Mock localStorage
  const mockLocalStorage = () => {
    const store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      })
    };
  };

  let originalLocalStorage: Storage;
  let originalDocument: Document;
  
  beforeEach(() => {
    originalLocalStorage = global.localStorage;
    originalDocument = global.document;
    
    const mockStorage = mockLocalStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });
    
    // Mock document.documentElement
    Object.defineProperty(document.documentElement, 'classList', {
      value: {
        add: jest.fn(),
        remove: jest.fn(),
      },
      writable: true
    });
  });
  
  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });
  
  it('renders consistently between server and client', () => {
    // Save original window
    const originalWindow = global.window;
    
    // Simulate server environment
    // @ts-ignore - Deliberately setting window to undefined to simulate server environment
    global.window = undefined;
    
    // Render on "server"
    const { container: serverContainer } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const serverHTML = serverContainer.innerHTML;
    
    // Restore window for client rendering
    global.window = originalWindow;
    
    // Render on "client"
    const { container: clientContainer } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const clientHTML = clientContainer.innerHTML;
    
    // The HTML structure should match to avoid hydration mismatches
    expect(serverHTML).toEqual(clientHTML);
  });
  
  it('initializes with light theme by default for SSR consistency', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(getByTestId('theme-status').textContent).toBe('light');
  });
  
  it('loads theme preference from localStorage on client', () => {
    // Setup Jest fake timers
    jest.useFakeTimers();
    
    // Set mock localStorage to return dark theme
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce('dark');
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial render should be light for SSR consistency
    expect(getByTestId('theme-status').textContent).toBe('light');
    
    // After useEffect runs, it should update to dark
    act(() => {
      // Advance timers to trigger setTimeout
      jest.runAllTimers();
    });
    
    // Verify dark mode class was added
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark-mode');
    
    // Clean up
    jest.useRealTimers();
  });
});
