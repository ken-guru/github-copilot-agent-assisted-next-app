import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayoutClient } from '@/components/LayoutClient';
import { ToastProvider } from '../ToastNotificationProvider';
import * as useOnlineStatusModule from '@/hooks/useOnlineStatus';

// Mock next/script
jest.mock('next/script', () => {
  return function MockScript({ src }: { src?: string }) {
    return <div data-testid="bootstrap-script" data-src={src} />;
  };
});

// Mock Navigation component
jest.mock('@/components/Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation</nav>;
  };
});

// Mock ServiceWorkerUpdater component
jest.mock('@/components/ui/ServiceWorkerUpdater', () => {
  return function MockServiceWorkerUpdater() {
    return <div data-testid="service-worker-updater">SW Updater</div>;
  };
});

// Mock useOnlineStatus hook for OfflineIndicator
jest.mock('@/hooks/useOnlineStatus');
const mockedUseOnlineStatus = jest.mocked(useOnlineStatusModule.useOnlineStatus);

// Mock service worker APIs
const mockServiceWorker = {
  ready: Promise.resolve({
    addEventListener: jest.fn(),
  }),
  addEventListener: jest.fn(),
  getRegistration: jest.fn(() => Promise.resolve(null)),
  register: jest.fn(() => Promise.resolve({
    scope: '/',
    addEventListener: jest.fn(),
    installing: null,
    waiting: null,
    active: {
      postMessage: jest.fn(),
    },
  })),
};

Object.defineProperty(global.navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
});

describe('LayoutClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset online status mock to offline for consistent testing
    mockedUseOnlineStatus.mockReturnValue(false);
  });

  test('renders all essential layout components (toast only if offline)', () => {
    render(
      <ToastProvider>
        <LayoutClient>
          <div data-testid="test-content">Test Content</div>
        </LayoutClient>
      </ToastProvider>
    );

    expect(screen.getByTestId('service-worker-updater')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('bootstrap-script')).toBeInTheDocument();
    // Toast should only be present if offline (default mock)
    expect(screen.getByTestId('global-toast')).toBeInTheDocument();
  });

  test('renders offline indicator when offline', () => {
    render(
      <ToastProvider>
        <LayoutClient>
          <div>Content</div>
        </LayoutClient>
      </ToastProvider>
    );

  const toast = screen.getByTestId('global-toast');
  expect(toast).toBeInTheDocument();
  expect(toast).toHaveTextContent('You are offline');
  expect(toast).toHaveClass('toast', 'bg-warning', 'show');
  });

  test('does not render offline indicator when online', () => {
    // Mock online state
    mockedUseOnlineStatus.mockReturnValue(true);

    render(
      <ToastProvider>
        <LayoutClient>
          <div>Content</div>
        </LayoutClient>
      </ToastProvider>
    );

  expect(screen.queryByTestId('global-toast')).not.toBeInTheDocument();
  });

  test('renders all layout components and toast is present if offline', () => {
    render(
      <ToastProvider>
        <LayoutClient>
          <div data-testid="test-content">Test Content</div>
        </LayoutClient>
      </ToastProvider>
    );

  const layoutElement = screen.getByTestId('service-worker-updater').parentElement;
  const children = Array.from(layoutElement?.children || []);

  // Check that all required components are present
  const testIds = children.map(child => child.getAttribute('data-testid'));
  expect(testIds).toContain('bootstrap-script');
  expect(testIds).toContain('service-worker-updater');
  expect(testIds).toContain('navigation');
  expect(testIds).toContain('test-content');
  // Toast should be present if offline (default mock)
  expect(screen.getByTestId('global-toast')).toBeInTheDocument();

  // Optionally, check that bootstrap-script comes before navigation and test-content
  expect(testIds.indexOf('bootstrap-script')).toBeLessThan(testIds.indexOf('navigation'));
  expect(testIds.indexOf('bootstrap-script')).toBeLessThan(testIds.indexOf('test-content'));
  });

  test('renders all layout components and toast is not present if online', () => {
    // Mock online state
    mockedUseOnlineStatus.mockReturnValue(true);
    render(
      <ToastProvider>
        <LayoutClient>
          <div data-testid="test-content">Test Content</div>
        </LayoutClient>
      </ToastProvider>
    );

    const layoutElement = screen.getByTestId('service-worker-updater').parentElement;
    const children = Array.from(layoutElement?.children || []);

    // Check that all required components are present
    const testIds = children.map(child => child.getAttribute('data-testid'));
    expect(testIds).toContain('bootstrap-script');
    expect(testIds).toContain('service-worker-updater');
    expect(testIds).toContain('navigation');
    expect(testIds).toContain('test-content');
  // Toast should NOT be present if online
  expect(screen.queryByTestId('global-toast')).not.toBeInTheDocument();

    // Optionally, check that bootstrap-script comes before navigation and test-content
    expect(testIds.indexOf('bootstrap-script')).toBeLessThan(testIds.indexOf('navigation'));
    expect(testIds.indexOf('bootstrap-script')).toBeLessThan(testIds.indexOf('test-content'));
  });
});
