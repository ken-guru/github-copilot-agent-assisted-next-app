import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import useNetworkStatus from '../useNetworkStatus';

describe('useNetworkStatus (integration)', () => {
  const originalNavigator = { ...(window as any).navigator };

  afterEach(() => {
    // Restore original navigator object after each test
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: originalNavigator,
    });
  });

  function TestComponent() {
    const { online } = useNetworkStatus();
    return <div data-testid="status">{online ? 'online' : 'offline'}</div>;
  }

  it('shows offline/online as navigator changes', async () => {
    // Ensure the hook reads the mocked navigator from window
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: { onLine: false },
    });
    render(<TestComponent />);
    expect(screen.getByTestId('status').textContent).toBe('offline');

    // simulate becoming online
    // Simulate navigator becoming online and dispatch the event
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: { onLine: true },
    });
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('online'));

    // simulate going offline
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: { onLine: false },
    });
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('offline'));
  });
});
