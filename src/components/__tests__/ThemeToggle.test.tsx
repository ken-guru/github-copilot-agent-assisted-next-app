import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../ThemeToggle';

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

  it('respects system preference when no theme is saved', async () => {
    // Reset document to default light state
    document.documentElement.className = 'light-mode';
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-bs-theme', 'light');
    
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
    
    // Wait for the component to apply the theme (it's async now)
    await new Promise(resolve => setTimeout(resolve, 10));
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

  it('should render buttons with correct Bootstrap styling', () => {
    render(<ThemeToggle />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      // Now using Bootstrap button classes instead of CSS modules
      expect(button).toHaveClass('btn');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('should maintain proper spacing with Bootstrap ButtonGroup', () => {
    render(<ThemeToggle />);
    
    const buttonGroup = document.querySelector('.btn-group');
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup).toHaveClass('btn-group');
  });

  it('should render in Bootstrap ButtonGroup container', () => {
    render(<ThemeToggle />);
    
    const container = screen.getByRole('group');
    expect(container).toHaveClass('btn-group');
    expect(container).toHaveClass('btn-group-sm');
  });
});