import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayoutClient } from '@/components/LayoutClient';
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

  test('renders all essential layout components', () => {
    render(
      <LayoutClient>
        <div data-testid="test-content">Test Content</div>
      </LayoutClient>
    );

    expect(screen.getByTestId('service-worker-updater')).toBeInTheDocument();
    expect(screen.getByTestId('offline-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('bootstrap-script')).toBeInTheDocument();
  });

  test('renders offline indicator when offline', () => {
    render(
      <LayoutClient>
        <div>Content</div>
      </LayoutClient>
    );

    const offlineIndicator = screen.getByTestId('offline-indicator');
    expect(offlineIndicator).toBeInTheDocument();
    expect(offlineIndicator).toHaveTextContent('You are offline');
    expect(offlineIndicator).toHaveClass('alert', 'alert-warning');
  });

  test('does not render offline indicator when online', () => {
    // Mock online state
    mockedUseOnlineStatus.mockReturnValue(true);

    render(
      <LayoutClient>
        <div>Content</div>
      </LayoutClient>
    );

    expect(screen.queryByTestId('offline-indicator')).not.toBeInTheDocument();
  });

  test('renders components in correct order', () => {
    render(
      <LayoutClient>
        <div data-testid="test-content">Test Content</div>
      </LayoutClient>
    );

    const layoutElement = screen.getByTestId('service-worker-updater').parentElement;
    const children = Array.from(layoutElement?.children || []);
    
    // Check order: Bootstrap script, ServiceWorkerUpdater, OfflineIndicator, Navigation, Content
    expect(children[0]).toHaveAttribute('data-testid', 'bootstrap-script');
    expect(children[1]).toHaveAttribute('data-testid', 'service-worker-updater');
    expect(children[2]).toHaveAttribute('data-testid', 'offline-indicator');
    expect(children[3]).toHaveAttribute('data-testid', 'navigation');
    expect(children[4]).toHaveAttribute('data-testid', 'test-content');
  });
});
