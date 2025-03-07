import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
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

// Test component that uses the theme context
function TestComponent() {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useTheme();
  return (
    <div>
      <div data-testid="dark-mode-status">{isDarkMode ? 'dark' : 'light'}</div>
      <button data-testid="toggle-btn" onClick={toggleDarkMode}>
        Toggle
      </button>
      <button data-testid="set-dark-btn" onClick={() => setDarkMode(true)}>
        Set Dark
      </button>
      <button data-testid="set-light-btn" onClick={() => setDarkMode(false)}>
        Set Light
      </button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.classList.remove('dark-mode');
    localStorageMock.clear();
  });

  it('should default to light mode', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
  });

  it('should toggle dark mode when function is called', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true');
    
    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'false');
  });

  it('should set dark mode explicitly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.click(screen.getByTestId('set-dark-btn'));
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    
    fireEvent.click(screen.getByTestId('set-light-btn'));
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
  });

  it('should respect saved preference in localStorage', () => {
    // Setup fake timers
    jest.useFakeTimers();
    
    localStorageMock.getItem.mockReturnValueOnce('true');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Wait for effects to run
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    
    // Clean up
    jest.useRealTimers();
  });
});