import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppLayout } from '../AppLayout';
import MobileNavigation from '../../components/MobileNavigation';
import { ThemeProvider } from '../../context/ThemeContext';
import { AppStateProvider } from '../../context/AppStateContext';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

// Mock other components that would be rendered
jest.mock('../../components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header-mock">Header Mock</div>
}));

jest.mock('../../components/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer-mock">Footer Mock</div>
}));

// Mock MobileNavigation component for integration testing
jest.mock('../../components/MobileNavigation', () => {
  return {
    __esModule: true,
    default: jest.fn(({ views, activeView, onViewChange }) => (
      <nav data-testid="mobile-navigation-mock">
        {views.map(view => (
          <button
            key={view.id}
            data-testid={`nav-button-mock-${view.id}`}
            onClick={() => onViewChange(view.id)}
            aria-pressed={activeView === view.id}
          >
            {view.label}
          </button>
        ))}
      </nav>
    ))
  };
});

describe('MobileNavigation Integration', () => {
  const mockViews = [
    { id: 'activity', label: 'Activities', icon: 'A' },
    { id: 'timeline', label: 'Timeline', icon: 'T' },
    { id: 'summary', label: 'Summary', icon: 'S' }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true,
      viewportCategory: 'mobile'
    });
  });
  
  test('MobileNavigation is rendered within AppLayout on mobile', () => {
    render(
      <ThemeProvider>
        <AppStateProvider>
          <AppLayout>
            <div data-testid="main-content">Main Content</div>
            <MobileNavigation 
              views={mockViews}
              activeView="activity"
              onViewChange={jest.fn()}
            />
          </AppLayout>
        </AppStateProvider>
      </ThemeProvider>
    );
    
    // Check that MobileNavigation is rendered
    const mobileNav = screen.getByTestId('mobile-navigation-mock');
    expect(mobileNav).toBeInTheDocument();
  });
  
  test('View changes when navigation button is clicked', () => {
    const handleViewChange = jest.fn();
    
    render(
      <ThemeProvider>
        <AppStateProvider>
          <AppLayout>
            <div data-testid="main-content">Main Content</div>
            <MobileNavigation 
              views={mockViews}
              activeView="activity"
              onViewChange={handleViewChange}
            />
          </AppLayout>
        </AppStateProvider>
      </ThemeProvider>
    );
    
    // Click on the timeline button
    const timelineButton = screen.getByTestId('nav-button-mock-timeline');
    fireEvent.click(timelineButton);
    
    // Check that onViewChange was called with the correct view
    expect(handleViewChange).toHaveBeenCalledWith('timeline');
  });
  
  test('MobileNavigation is not rendered on desktop', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      width: 1024,
      height: 768,
      isMobile: false,
      hasTouch: false,
      viewportCategory: 'desktop'
    });
    
    render(
      <ThemeProvider>
        <AppStateProvider>
          <AppLayout>
            <div data-testid="main-content">Main Content</div>
            <MobileNavigation 
              views={mockViews}
              activeView="activity"
              onViewChange={jest.fn()}
            />
          </AppLayout>
        </AppStateProvider>
      </ThemeProvider>
    );
    
    // MobileNavigation should not be rendered
    expect(screen.queryByTestId('mobile-navigation-mock')).not.toBeInTheDocument();
  });
});
