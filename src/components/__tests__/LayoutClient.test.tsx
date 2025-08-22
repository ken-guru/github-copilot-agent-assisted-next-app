import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayoutClient } from '../LayoutClient';
import * as useOnlineStatusModule from '../../hooks/useOnlineStatus';

// Mock hooks that rely on GlobalTimerProvider to avoid provider coupling here
jest.mock('../../hooks/useNavigationGuard', () => ({
  useNavigationGuard: jest.fn(),
}));
jest.mock('../../hooks/usePageStateSync', () => ({
  usePageStateSync: jest.fn(),
}));

// Mock next/script
jest.mock('next/script', () => {
  return function MockScript({ src }: { src?: string }) {
    return <div data-testid="bootstrap-script" data-src={src} />;
  };
});

// Mock Navigation component
jest.mock('../Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation</nav>;
  };
});

// Mock ServiceWorkerUpdater component
jest.mock('../ui/ServiceWorkerUpdater', () => {
  return function MockServiceWorkerUpdater() {
    return <div data-testid="service-worker-updater">SW Updater</div>;
  };
});

// Mock TimerDrawer component to isolate LayoutClient
jest.mock('../TimerDrawer', () => {
  return function MockTimerDrawer() {
    return <div data-testid="timer-drawer">Timer Drawer</div>;
  };
});

// Mock useOnlineStatus hook for OfflineIndicator
jest.mock('../../hooks/useOnlineStatus');
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

  expect(Boolean(screen.getByTestId('service-worker-updater'))).toBe(true);
  expect(Boolean(screen.getByTestId('offline-indicator'))).toBe(true);
  expect(Boolean(screen.getByTestId('navigation'))).toBe(true);
  expect(Boolean(screen.getByTestId('test-content'))).toBe(true);
  expect(Boolean(screen.getByTestId('bootstrap-script'))).toBe(true);
  });

  test('renders offline indicator when offline', () => {
    render(
      <LayoutClient>
        <div>Content</div>
      </LayoutClient>
    );

    const offlineIndicator = screen.getByTestId('offline-indicator');
  expect(Boolean(offlineIndicator)).toBe(true);
  expect(offlineIndicator.textContent).toContain('You are offline');
  const className = offlineIndicator.getAttribute('class') || '';
  expect(className.includes('alert')).toBe(true);
  expect(className.includes('alert-warning')).toBe(true);
  });

  test('does not render offline indicator when online', () => {
    // Mock online state
    mockedUseOnlineStatus.mockReturnValue(true);

    render(
      <LayoutClient>
        <div>Content</div>
      </LayoutClient>
    );

  expect(screen.queryByTestId('offline-indicator')).toBeNull();
  });

  test('renders components in correct order', () => {
    render(
      <LayoutClient>
        <div data-testid="test-content">Test Content</div>
      </LayoutClient>
    );

    const layoutElement = screen.getByTestId('service-worker-updater').parentElement;
    const children = Array.from(layoutElement?.children || []);
    
    // Ensure at least 5 children are present
    expect(children.length).toBeGreaterThanOrEqual(5);

    // Check order: Bootstrap script, ServiceWorkerUpdater, OfflineIndicator, Navigation, Content
    const c0 = children[0] as HTMLElement;
    const c1 = children[1] as HTMLElement;
    const c2 = children[2] as HTMLElement;
    const c3 = children[3] as HTMLElement;
    const c4 = children[4] as HTMLElement;

    expect(c0.getAttribute('data-testid')).toBe('bootstrap-script');
    expect(c1.getAttribute('data-testid')).toBe('service-worker-updater');
    expect(c2.getAttribute('data-testid')).toBe('offline-indicator');
    expect(c3.getAttribute('data-testid')).toBe('navigation');
    expect(c4.getAttribute('data-testid')).toBe('test-content');
  });
});
