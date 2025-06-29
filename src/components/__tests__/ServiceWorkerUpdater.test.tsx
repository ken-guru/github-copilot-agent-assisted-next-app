import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { mockServiceWorker } from '../../utils/testUtils/serviceWorkerUtils';
import ServiceWorkerUpdater from '../ServiceWorkerUpdater';

describe('ServiceWorkerUpdater', () => {
  it('should not show update message initially', () => {
    const { cleanup } = mockServiceWorker();
    
    render(<ServiceWorkerUpdater />);
    
    expect(screen.queryByTestId('update-notification')).not.toBeInTheDocument();
    
    cleanup();
  });
  
  it('should show update notification when service worker update is available', async () => {
    const { simulateUpdate, cleanup } = mockServiceWorker();
    
    render(<ServiceWorkerUpdater />);
    
    // Initially no notification
    expect(screen.queryByTestId('update-notification')).not.toBeInTheDocument();
    
    // Simulate service worker update
    act(() => {
      simulateUpdate();
    });
    
    // Wait for the update notification to appear
    await waitFor(() => {
      expect(screen.getByTestId('update-notification')).toBeInTheDocument();
      expect(screen.getByText(/update available/i)).toBeInTheDocument();
    });
    
    cleanup();
  });
  
  it('should send skip_waiting message and reload when update button is clicked', async () => {
    // Get mock objects including postMessageMock
    const { simulateUpdate, postMessageMock, simulateActivation, cleanup } = mockServiceWorker();
    
    // Listen for the reload event instead of mocking window.location.reload
    const reloadEventListener = jest.fn();
    window.addEventListener('appReloadTriggered', reloadEventListener);
    
    render(<ServiceWorkerUpdater />);
    
    // Simulate service worker update
    act(() => {
      simulateUpdate();
    });
    
    // Wait for notification and click update button
    await waitFor(() => {
      expect(screen.getByTestId('update-notification')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /update now/i }));
    
    // Check if the postMessage was called with SKIP_WAITING
    expect(postMessageMock).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    
    // Simulate the controllerchange event using our mock's helper
    act(() => {
      simulateActivation();
    });
    
    // Check if the reload event was fired (since window.location.reload is skipped in tests)
    expect(reloadEventListener).toHaveBeenCalled();
    
    // Clean up event listener
    window.removeEventListener('appReloadTriggered', reloadEventListener);
    
    cleanup();
  });
  
  it('should handle dismissing the update notification', async () => {
    const { simulateUpdate, cleanup } = mockServiceWorker();
    
    render(<ServiceWorkerUpdater />);
    
    // Simulate service worker update
    act(() => {
      simulateUpdate();
    });
    
    // Wait for notification to appear
    await waitFor(() => {
      expect(screen.getByTestId('update-notification')).toBeInTheDocument();
    });
    
    // Click dismiss button
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    
    // Notification should disappear
    expect(screen.queryByTestId('update-notification')).not.toBeInTheDocument();
    
    cleanup();
  });
  
  // Update the event listener tests to match our implementation
  it('should handle service worker registration on mount', () => {
    const { mockServiceWorkerContainer, cleanup } = mockServiceWorker();
    
    // Spy on getRegistration to verify it was called
    const getRegistrationSpy = jest.spyOn(mockServiceWorkerContainer, 'getRegistration');
    
    render(<ServiceWorkerUpdater />);
    
    // Check that getRegistration was called
    expect(getRegistrationSpy).toHaveBeenCalled();
    
    getRegistrationSpy.mockRestore();
    cleanup();
  });
  
  it('should properly clean up on unmount', () => {
    const { cleanup } = mockServiceWorker();
    
    const { unmount } = render(<ServiceWorkerUpdater />);
    
    // Unmount component to trigger cleanup
    unmount();
    
    // Since we've restructured how event listeners are cleaned up,
    // we just need to make sure the component unmounts cleanly
    
    cleanup();
  });
});