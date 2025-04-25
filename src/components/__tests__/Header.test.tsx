import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { ThemeProvider } from '../../context/ThemeContext';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

// Mock the Logo component
jest.mock('../Logo', () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>
}));

// Mock the ThemeToggle component
jest.mock('../ThemeToggle', () => ({
  __esModule: true,
  default: () => <button data-testid="theme-toggle">Toggle Theme</button>
}));

describe('Header Component', () => {
  beforeEach(() => {
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false
    });
  });
  
  test('renders logo and theme toggle', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });
  
  test('applies mobile class on mobile viewport', () => {
    // Mock mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true
    });
    
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('mobileHeader');
  });
  
  test('applies desktop class on desktop viewport', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false
    });
    
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header');
    expect(header).not.toHaveClass('mobileHeader');
  });
  
  test('includes semantic role', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
