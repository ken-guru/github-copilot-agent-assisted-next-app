import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppLayout } from '../AppLayout';
import { ThemeProvider } from '../../context/ThemeContext';
import { AppStateProvider } from '../../context/AppStateContext';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn().mockReturnValue({
    width: 375, 
    height: 667,
    isMobile: true,
    isTablet: false, 
    isDesktop: false,
    viewportCategory: 'mobile',
    hasTouch: true
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

describe('AppLayout Component (Mobile)', () => {
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
  
  test('applies mobile-specific classes on mobile viewport', () => {
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
    expect(container).toHaveClass('mobileContainer');
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('mobileHeader');
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('mobileMain');
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('mobileFooter');
  });
  
  test('renders child content in main section', () => {
    render(
      <ThemeProvider>
        <AppStateProvider>
          <AppLayout>
            <div data-testid="test-child">Child Content</div>
          </AppLayout>
        </AppStateProvider>
      </ThemeProvider>
    );
    
    const main = screen.getByRole('main');
    const child = screen.getByTestId('test-child');
    
    expect(main).toContainElement(child);
    expect(child).toHaveTextContent('Child Content');
  });
  
  test('includes Header component', () => {
    render(
      <ThemeProvider>
        <AppStateProvider>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </AppStateProvider>
      </ThemeProvider>
    );
    
    const header = screen.getByTestId('header-component');
    expect(header).toBeInTheDocument();
  });
  
  test('includes Footer component', () => {
    render(
      <ThemeProvider>
        <AppStateProvider>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </AppStateProvider>
      </ThemeProvider>
    );
    
    const footer = screen.getByTestId('footer-component');
    expect(footer).toBeInTheDocument();
  });
});
