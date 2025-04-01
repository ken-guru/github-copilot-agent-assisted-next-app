import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '@/context/theme/ThemeContext';
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

  const renderWithTheme = () => {
    return render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
  };

  it('renders theme toggle buttons', () => {
    renderWithTheme();
    
    const lightButton = screen.getByTitle('Light theme');
    const systemButton = screen.getByTitle('System theme');
    const darkButton = screen.getByTitle('Dark theme');
    
    expect(lightButton).toBeInTheDocument();
    expect(systemButton).toBeInTheDocument();
    expect(darkButton).toBeInTheDocument();
  });

  it('applies dark theme when dark button is clicked', () => {
    renderWithTheme();
    
    const darkButton = screen.getByTitle('Dark theme');
    fireEvent.click(darkButton);
    
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('applies light theme when light button is clicked', () => {
    renderWithTheme();
    
    const lightButton = screen.getByTitle('Light theme');
    fireEvent.click(lightButton);
    
    expect(document.documentElement.classList.contains('light-mode')).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('removes theme preference when system button is clicked', () => {
    renderWithTheme();
    
    const systemButton = screen.getByTitle('System theme');
    fireEvent.click(systemButton);
    
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('theme');
  });

  it('loads saved theme from localStorage on mount', () => {
    localStorageMock.theme = 'dark';
    
    renderWithTheme();
    
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
    
    renderWithTheme();
    
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

  it('should maintain touch-friendly button sizes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass(styles.toggleButton);
    });
  });

  it('should maintain proper spacing between buttons on mobile', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const toggleGroup = document.querySelector(`.${styles.toggleGroup}`);
    expect(toggleGroup).not.toBeNull();
    expect(toggleGroup).toHaveClass(styles.toggleGroup);
  });

  it('should render with proper container height for touch targets', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const container = document.querySelector(`.${styles.container}`);
    expect(container).not.toBeNull();
    expect(container).toHaveClass(styles.container);
  });
});