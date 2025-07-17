import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

// Mock the child components to focus on layout structure
jest.mock('../../components/ui/ServiceWorkerUpdater', () => {
  return function MockServiceWorkerUpdater() {
    return <div data-testid="service-worker-updater">Service Worker Updater</div>;
  };
});

jest.mock('../../components/core/ThemeProvider', () => {
  return function MockThemeProvider({ children }: { children: React.ReactNode }) {
    return <div data-testid="theme-provider">{children}</div>;
  };
});

describe('Root Layout Integration', () => {
  const mockChildren = <main data-testid="page-content">Page Content</main>;

  it('should render the basic page structure', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);
    
    // Check for HTML structure
    expect(document.documentElement).toHaveAttribute('lang', 'en');
    
    // Check for body content
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('should have correct document title configuration', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);
    
    // Verify meta tags are properly set up for Next.js
    const titleElement = document.querySelector('title');
    expect(titleElement).toBeTruthy();
  });

  it('should include essential meta tags and viewport settings', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);
    
    // Check for viewport meta tag (added by Next.js)
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    expect(viewportMeta).toBeTruthy();
  });

  it('should render theme provider and service worker components', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);
    
    // Verify core components are rendered
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('service-worker-updater')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('should have proper accessibility structure', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);
    
    // Check for semantic HTML structure
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    
    // Verify the layout doesn't interfere with content accessibility
    const content = screen.getByTestId('page-content');
    expect(content.tagName.toLowerCase()).toBe('main');
  });
});
