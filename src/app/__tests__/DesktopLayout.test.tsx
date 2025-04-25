import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppLayout } from '../AppLayout';
import { ThemeProvider } from '../../context/ThemeContext';
import { AppStateProvider } from '../../context/AppStateContext';

// Mock the useViewport hook for desktop
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn().mockReturnValue({
    width: 1024, 
    height: 768,
    isMobile: false,
    isTablet: false, 
    isDesktop: true,
    viewportCategory: 'desktop',
    hasTouch: false
  })
}));

// Mock the child components
jest.mock('../../components/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header-component">Header</header>
}));

jest.mock('../../components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer-component">Footer</footer>
}));

describe('AppLayout Component (Desktop)', () => {
  test('renders with proper semantic structure', () => {
    render(
      <ThemeProvider>
        <AppStateProvider>
          <AppLayout>
            <div data-testid="main-content">Main Content</div>
          </AppLayout>
        </AppStateProvider>
      </ThemeProvider>
    );
    
    // Check for semantic sections
    const header = screen.getByRole('banner');
    const main = screen.getByRole('main');
    const footer = screen.getByRole('contentinfo');
    
    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });
  
  test('does not apply mobile-specific classes on desktop', () => {
    render(
      <ThemeProvider>
        <AppStateProvider>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </AppStateProvider>
      </ThemeProvider>
    );
    
    const container = screen.getByTestId('app-layout');
    expect(container).not.toHaveClass('mobileContainer');
    
    const header = screen.getByRole('banner');
    expect(header).not.toHaveClass('mobileHeader');
    
    const main = screen.getByRole('main');
    expect(main).not.toHaveClass('mobileMain');
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).not.toHaveClass('mobileFooter');
  });
  
  test('applies desktop-specific classes', () => {
    render(
      <ThemeProvider>
        <AppStateProvider>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </AppStateProvider>
      </ThemeProvider>
    );
    
    const container = screen.getByTestId('app-layout');
    expect(container).toHaveClass('container');
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header');
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('main');
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('footer');
  });
});
