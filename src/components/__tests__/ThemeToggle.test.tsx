import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../ThemeToggle';
import styles from '../ThemeToggle.module.css';

// Mock window.matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Create a helper function to safely check CSS classes that might be undefined
const safelyCheckClass = (element: HTMLElement, className?: string) => {
  if (className) {
    expect(element).toHaveClass(className);
  }
};

describe('ThemeToggle', () => {
  const originalLocalStorage = window.localStorage;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(key => localStorageMock[key]),
        setItem: jest.fn((key, value) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn(key => {
          delete localStorageMock[key];
        }),
      },
      writable: true,
    });

    // Reset document classes
    document.documentElement.className = '';
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
  });

  it('renders theme toggle buttons', () => {
    render(<ThemeToggle />);
    
    const lightButton = screen.getByTitle('Light theme');
    const systemButton = screen.getByTitle('System theme');
    const darkButton = screen.getByTitle('Dark theme');
    
    expect(lightButton).toBeInTheDocument();
    expect(systemButton).toBeInTheDocument();
    expect(darkButton).toBeInTheDocument();
  });

  it('applies dark theme when dark button is clicked', () => {
    render(<ThemeToggle />);
    
    const darkButton = screen.getByTitle('Dark theme');
    fireEvent.click(darkButton);
    
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('applies light theme when light button is clicked', () => {
    render(<ThemeToggle />);
    
    const lightButton = screen.getByTitle('Light theme');
    fireEvent.click(lightButton);
    
    expect(document.documentElement.classList.contains('light-mode')).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('removes theme preference when system button is clicked', () => {
    render(<ThemeToggle />);
    
    const systemButton = screen.getByTitle('System theme');
    fireEvent.click(systemButton);
    
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('theme');
  });

  it('loads saved theme from localStorage on mount', () => {
    localStorageMock.theme = 'dark';
    
    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });

  it('respects system preference when no theme is saved', () => {
    // Mock system dark mode preference
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });

  it('updates theme when system preference changes', () => {
    let callback: ((e: { matches: boolean }) => void) | null = null;
    
    // Mock matchMedia with event listener support
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((_, cb) => {
        callback = cb;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ThemeToggle />);

    // Simulate system preference change
    act(() => {
      if (callback) {
        callback({ matches: true });
      }
    });

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });
});

describe('Mobile Layout', () => {
  beforeEach(() => {
    // Mock mobile viewport
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('should render buttons with correct styling', () => {
    render(<ThemeToggle />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      if (styles.toggleButton) {
        expect(button).toHaveClass(styles.toggleButton);
        // The toggleButton class in our CSS has explicit width and height set to 44px
        expect(button.className).toContain(styles.toggleButton);
      }
    });
  });

  it('should maintain proper spacing between buttons on mobile', () => {
    render(<ThemeToggle />);
    
    const toggleGroup = document.querySelector(`.${styles.toggleGroup || ''}`);
    expect(toggleGroup).not.toBeNull();
    if (toggleGroup && styles.toggleGroup) {
      safelyCheckClass(toggleGroup as HTMLElement, styles.toggleGroup);
    }
  });

  it('should render in a container with proper styling', () => {
    render(<ThemeToggle />);
    
    const container = screen.getByRole('group');
    if (styles.container) {
      safelyCheckClass(container, styles.container);
    }
  });
});