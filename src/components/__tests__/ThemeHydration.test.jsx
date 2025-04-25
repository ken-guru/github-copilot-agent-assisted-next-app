import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { getThemeVariable } from '../../utils/themeSync';

// Mock component that uses theme variables
const ThemedComponent = ({ style }) => (
  <div data-testid="themed-component" style={style}>
    Themed Content
  </div>
);

describe('Theme Hydration Tests', () => {
  // Mock localStorage
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true
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
        dispatchEvent: jest.fn()
      })),
      writable: true
    });
    
    // Mock document classes
    document.documentElement.classList = {
      contains: jest.fn().mockReturnValue(false),
      toggle: jest.fn()
    };
  });
  
  test('components using getThemeVariable render correctly', () => {
    const style = {
      backgroundColor: getThemeVariable('--bg-light', '--bg-dark', '#fff'),
      color: getThemeVariable('--text-light', '--text-dark', '#000')
    };
    
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemedComponent style={style} />
      </ThemeProvider>
    );
    
    const component = getByTestId('themed-component');
    expect(component).toHaveStyle({
      backgroundColor: 'var(--bg-light, #fff)',
      color: 'var(--text-light, #000)'
    });
  });
  
  test('theme variables change when dark mode is active', () => {
    // Mock dark mode active
    document.documentElement.classList.contains.mockReturnValue(true);
    
    const style = {
      backgroundColor: getThemeVariable('--bg-light', '--bg-dark', '#fff'),
      color: getThemeVariable('--text-light', '--text-dark', '#000')
    };
    
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemedComponent style={style} />
      </ThemeProvider>
    );
    
    const component = getByTestId('themed-component');
    expect(component).toHaveStyle({
      backgroundColor: 'var(--bg-dark, #fff)',
      color: 'var(--text-dark, #000)'
    });
  });
  
  test('theme preference from localStorage is applied', () => {
    // Mock localStorage returning dark theme
    window.localStorage.getItem.mockReturnValue('dark');
    
    // Mock the initializeTheme function effect
    document.documentElement.classList.contains.mockReturnValue(true);
    
    const style = {
      backgroundColor: getThemeVariable('--bg-light', '--bg-dark', '#fff')
    };
    
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemedComponent style={style} />
      </ThemeProvider>
    );
    
    const component = getByTestId('themed-component');
    expect(component).toHaveStyle({
      backgroundColor: 'var(--bg-dark, #fff)'
    });
    
    // Verify localStorage was checked
    expect(window.localStorage.getItem).toHaveBeenCalledWith('theme');
  });
});
