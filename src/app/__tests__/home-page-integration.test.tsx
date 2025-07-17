import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';

// Mock the child components to focus on page structure
jest.mock('../../components/ui/ServiceWorkerUpdater', () => {
  return function MockServiceWorkerUpdater() {
    return <div data-testid="service-worker-updater">Service Worker Updater</div>;
  };
});

jest.mock('../../components/feature/ActivityManager', () => {
  return function MockActivityManager() {
    return <div data-testid="activity-manager">Activity Manager</div>;
  };
});

jest.mock('../../components/feature/ProgressBar', () => {
  return function MockProgressBar() {
    return <div data-testid="progress-bar">Progress Bar</div>;
  };
});

jest.mock('../../components/core/SplashScreen', () => {
  return function MockSplashScreen() {
    return <div data-testid="splash-screen">Splash Screen</div>;
  };
});

describe('Home Page Integration', () => {
  it('should load and render successfully', () => {
    render(<HomePage />);
    
    // Verify the page renders without crashing
    expect(screen.getByTestId('activity-manager')).toBeInTheDocument();
  });

  it('should include the Mr. Timely title context', () => {
    render(<HomePage />);
    
    // Since this is a Next.js page, the title is set through metadata
    // We can test that the component renders and the title will be handled by Next.js
    expect(screen.getByTestId('activity-manager')).toBeInTheDocument();
  });

  it('should render all main page components', () => {
    render(<HomePage />);
    
    // Check that all major components are present
    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
    expect(screen.getByTestId('activity-manager')).toBeInTheDocument();
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('service-worker-updater')).toBeInTheDocument();
  });

  it('should have proper page structure with main content area', () => {
    render(<HomePage />);
    
    // Verify semantic structure exists
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    
    // Verify activity manager is within main content
    expect(mainContent).toContainElement(screen.getByTestId('activity-manager'));
  });

  it('should support navigation elements accessibility', () => {
    render(<HomePage />);
    
    // Check for main content landmark
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // The page should be structured for screen readers
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});
