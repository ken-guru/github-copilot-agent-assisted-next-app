import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { mockServiceWorker, mockOnlineStatus } from '../serviceWorkerUtils';

// Test component for online status
const OnlineStatusDisplay = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return <div data-testid="online-status">{isOnline ? 'online' : 'offline'}</div>;
};

describe('Service Worker Utilities', () => {
  describe('mockServiceWorker', () => {
    it('should provide mock service worker API', () => {
      const { mockRegistration, mockServiceWorkerContainer, cleanup } = mockServiceWorker();
      
      expect(mockServiceWorkerContainer).toBeDefined();
      expect(mockServiceWorkerContainer.getRegistration).toBeDefined();
      expect(mockServiceWorkerContainer.ready).toBeInstanceOf(Promise);
      
      cleanup();
    });
    
    it('should simulate service worker update cycle', () => {
      // Pass explicitly initialWaitingState: false to ensure waiting is null at start
      const { mockRegistration, simulateUpdate, simulateActivation, cleanup } = mockServiceWorker({ 
        initialWaitingState: false 
      });
      
      // Initial state should have active service worker but no waiting
      expect(mockRegistration.active).toBeDefined();
      expect(mockRegistration.waiting).toBeNull();
      
      // Add update listener
      const updateHandler = jest.fn();
      mockRegistration.addEventListener('updatefound', updateHandler);
      
      // Simulate update
      simulateUpdate();
      
      // Now we should have a waiting service worker
      expect(mockRegistration.waiting).toBeDefined();
      expect(mockRegistration.waiting?.state).toBe('installed');
      expect(updateHandler).toHaveBeenCalled();
      
      // Add controller change listener
      const controllerChangeHandler = jest.fn();
      navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);
      
      // Simulate activation
      simulateActivation();
      
      // Waiting should become active and waiting should be null
      expect(mockRegistration.active?.state).toBe('activated');
      expect(mockRegistration.waiting).toBeNull();
      expect(controllerChangeHandler).toHaveBeenCalled();
      
      cleanup();
    });
    
    it('should restore original service worker on cleanup', () => {
      const originalServiceWorker = navigator.serviceWorker;
      const { cleanup } = mockServiceWorker();
      
      expect(navigator.serviceWorker).not.toBe(originalServiceWorker);
      
      cleanup();
      
      expect(navigator.serviceWorker).toBe(originalServiceWorker);
    });
  });
  
  describe('mockOnlineStatus', () => {
    it('should provide functions to control online status', () => {
      const { setOnlineStatus, cleanup } = mockOnlineStatus();
      
      expect(setOnlineStatus).toBeInstanceOf(Function);
      expect(cleanup).toBeInstanceOf(Function);
      
      cleanup();
    });
    
    it('should allow changing online status and trigger events', () => {
      const { setOnlineStatus, cleanup } = mockOnlineStatus();
      
      // Initial state should be online
      expect(navigator.onLine).toBe(true);
      
      // Render test component
      render(<OnlineStatusDisplay />);
      expect(screen.getByTestId('online-status')).toHaveTextContent('online');
      
      // Set to offline
      act(() => {
        setOnlineStatus(false);
      });
      
      expect(navigator.onLine).toBe(false);
      expect(screen.getByTestId('online-status')).toHaveTextContent('offline');
      
      // Set back to online
      act(() => {
        setOnlineStatus(true);
      });
      
      expect(navigator.onLine).toBe(true);
      expect(screen.getByTestId('online-status')).toHaveTextContent('online');
      
      cleanup();
    });
    
    it('should restore original online status on cleanup', () => {
      const originalOnlineValue = navigator.onLine;
      const { setOnlineStatus, cleanup } = mockOnlineStatus();
      
      // Change status
      setOnlineStatus(false);
      expect(navigator.onLine).toBe(false);
      
      // Restore original
      cleanup();
      expect(navigator.onLine).toBe(originalOnlineValue);
    });
  });
});