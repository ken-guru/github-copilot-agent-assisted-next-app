import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayoutClient } from '../LayoutClient';

// Mock next/navigation to control pathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/shared/abc123'),
}));

// Mock hooks that would require GlobalTimerProvider
jest.mock('../../hooks/useNavigationGuard', () => ({
  useNavigationGuard: jest.fn(),
}));
jest.mock('../../hooks/usePageStateSync', () => ({
  usePageStateSync: jest.fn(),
}));

// Mock next/script to avoid loading external script
jest.mock('next/script', () => {
  return function MockScript({ src }: { src?: string }) {
    return <div data-testid="bootstrap-script" data-src={src} />;
  };
});

// Mock child components used inside LayoutClient that are not directly under test
jest.mock('../ui/ServiceWorkerUpdater', () => {
  const MockServiceWorkerUpdater = () => null;
  MockServiceWorkerUpdater.displayName = 'MockServiceWorkerUpdater';
  return MockServiceWorkerUpdater;
});
jest.mock('../Navigation', () => {
  const MockNavigation = () => null;
  MockNavigation.displayName = 'MockNavigation';
  return MockNavigation;
});
jest.mock('../OfflineIndicator', () => {
  const MockOfflineIndicator = () => null;
  MockOfflineIndicator.displayName = 'MockOfflineIndicator';
  return { OfflineIndicator: MockOfflineIndicator };
});
jest.mock('../ui/ToastContainer', () => {
  const MockToastContainer = () => null;
  MockToastContainer.displayName = 'MockToastContainer';
  return { ToastContainer: MockToastContainer };
});
jest.mock('../TimerDrawer', () => {
  const MockTimerDrawer = () => {
    return <div data-testid="timer-drawer">drawer</div>;
  };
  MockTimerDrawer.displayName = 'MockTimerDrawer';
  return MockTimerDrawer;
});

describe('LayoutClient on shared session page', () => {
  it('does not render TimerDrawer when on /shared/[id]', () => {
    render(
      <LayoutClient>
        <div>content</div>
      </LayoutClient>
    );

    expect(screen.queryByTestId('timer-drawer')).not.toBeInTheDocument();
  });
});
