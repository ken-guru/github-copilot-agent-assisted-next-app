import { render, screen, act } from '@testing-library/react';
import { useOnlineStatus, useInterval, useTimeout, useWindowResize } from '../eventListenerUtils';

// Create components that use our hooks for testing purposes
const OnlineStatusComponent = () => {
  const isOnline = useOnlineStatus();
  return <div data-testid="status">{isOnline ? 'online' : 'offline'}</div>;
};

const IntervalComponent = ({ callback, delay }: { callback: () => void; delay: number | null }) => {
  useInterval(callback, delay);
  return <div>Interval Component</div>;
};

const TimeoutComponent = ({ callback, delay }: { callback: () => void; delay: number | null }) => {
  useTimeout(callback, delay);
  return <div>Timeout Component</div>;
};

const ResizeComponent = ({ callback, throttle }: { callback: () => void; throttle?: number }) => {
  useWindowResize(callback, throttle ? { throttle } : undefined);
  return <div>Resize Component</div>;
};

describe('Event Listener Utilities', () => {
  // Mock window event listeners before each test
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  
  beforeEach(() => {
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });
  
  afterEach(() => {
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });
  
  describe('useOnlineStatus', () => {
    it('should register and unregister online/offline event listeners', () => {
      const { unmount } = render(<OnlineStatusComponent />);
      
      // Check that event listeners were registered
      expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
      
      // Get the registered handlers
      const calls = (window.addEventListener as jest.Mock).mock.calls;
      const onlineHandler = calls.find(call => call[0] === 'online')[1];
      const offlineHandler = calls.find(call => call[0] === 'offline')[1];
      
      // Reset mock to check unmount cleanup
      jest.clearAllMocks();
      
      // Unmount to trigger cleanup
      unmount();
      
      // Check that event listeners were unregistered with the same handlers
      expect(window.removeEventListener).toHaveBeenCalledWith('online', onlineHandler);
      expect(window.removeEventListener).toHaveBeenCalledWith('offline', offlineHandler);
    });
    
    it('should update state when online status changes', () => {
      // Instead of getting the property descriptor (which might be undefined),
      // directly save the current value to restore later
      const originalOnlineValue = navigator.onLine;
      
      // Mock navigator.onLine
      Object.defineProperty(navigator, 'onLine', { 
        configurable: true,
        get: () => true,
      });
      
      const { rerender } = render(<OnlineStatusComponent />);
      
      // Check initial state
      expect(screen.getByTestId('status')).toHaveTextContent('online');
      
      // Get the registered offline handler
      const calls = (window.addEventListener as jest.Mock).mock.calls;
      const offlineHandler = calls.find(call => call[0] === 'offline')[1];
      
      // Trigger offline event
      Object.defineProperty(navigator, 'onLine', { 
        configurable: true,
        get: () => false,
      });
      act(() => {
        offlineHandler(new Event('offline'));
      });
      
      // Rerender to see the updated state
      rerender(<OnlineStatusComponent />);
      expect(screen.getByTestId('status')).toHaveTextContent('offline');
      
      // Get the registered online handler
      const onlineHandler = calls.find(call => call[0] === 'online')[1];
      
      // Trigger online event
      Object.defineProperty(navigator, 'onLine', { 
        configurable: true,
        get: () => true,
      });
      act(() => {
        onlineHandler(new Event('online'));
      });
      
      // Rerender to see the updated state
      rerender(<OnlineStatusComponent />);
      expect(screen.getByTestId('status')).toHaveTextContent('online');
      
      // Restore original navigator.onLine value
      Object.defineProperty(navigator, 'onLine', { 
        configurable: true,
        get: () => originalOnlineValue,
      });
    });
  });
  
  describe('useInterval', () => {
    it('should set up and clean up interval', () => {
      // Mock setInterval and clearInterval
      const originalSetInterval = window.setInterval;
      const originalClearInterval = window.clearInterval;
      
      window.setInterval = jest.fn().mockReturnValue(123);
      window.clearInterval = jest.fn();
      
      const callback = jest.fn();
      const { unmount } = render(<IntervalComponent callback={callback} delay={1000} />);
      
      // Check that interval was set up
      expect(window.setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
      
      // Unmount to trigger cleanup
      unmount();
      
      // Check that interval was cleared
      expect(window.clearInterval).toHaveBeenCalledWith(123);
      
      // Restore original functions
      window.setInterval = originalSetInterval;
      window.clearInterval = originalClearInterval;
    });
    
    it('should not set up interval if delay is null', () => {
      // Mock setInterval
      const originalSetInterval = window.setInterval;
      window.setInterval = jest.fn();
      
      const callback = jest.fn();
      render(<IntervalComponent callback={callback} delay={null} />);
      
      // Check that interval was not set up
      expect(window.setInterval).not.toHaveBeenCalled();
      
      // Restore original function
      window.setInterval = originalSetInterval;
    });
    
    it('should update interval when delay changes', () => {
      // Mock setInterval and clearInterval
      const originalSetInterval = window.setInterval;
      const originalClearInterval = window.clearInterval;
      
      window.setInterval = jest.fn()
        .mockReturnValueOnce(123)
        .mockReturnValueOnce(456);
      window.clearInterval = jest.fn();
      
      const callback = jest.fn();
      const { rerender } = render(<IntervalComponent callback={callback} delay={1000} />);
      
      // Check that interval was set up
      expect(window.setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
      
      // Reset mock to check rerender
      jest.clearAllMocks();
      
      // Update delay
      rerender(<IntervalComponent callback={callback} delay={2000} />);
      
      // Check that old interval was cleared and new one was set up
      expect(window.clearInterval).toHaveBeenCalledWith(123);
      expect(window.setInterval).toHaveBeenCalledWith(expect.any(Function), 2000);
      
      // Restore original functions
      window.setInterval = originalSetInterval;
      window.clearInterval = originalClearInterval;
    });
  });
  
  describe('useTimeout', () => {
    it('should set up and clean up timeout', () => {
      // Mock setTimeout and clearTimeout
      const originalSetTimeout = window.setTimeout;
      const originalClearTimeout = window.clearTimeout;
      
      window.setTimeout = jest.fn().mockReturnValue(123);
      window.clearTimeout = jest.fn();
      
      const callback = jest.fn();
      const { unmount } = render(<TimeoutComponent callback={callback} delay={1000} />);
      
      // Check that timeout was set up
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
      
      // Unmount to trigger cleanup
      unmount();
      
      // Check that timeout was cleared
      expect(window.clearTimeout).toHaveBeenCalledWith(123);
      
      // Restore original functions
      window.setTimeout = originalSetTimeout;
      window.clearTimeout = originalClearTimeout;
    });
    
    it('should not set up timeout if delay is null', () => {
      // Mock setTimeout
      const originalSetTimeout = window.setTimeout;
      window.setTimeout = jest.fn();
      
      const callback = jest.fn();
      render(<TimeoutComponent callback={callback} delay={null} />);
      
      // Check that timeout was not set up
      expect(window.setTimeout).not.toHaveBeenCalled();
      
      // Restore original function
      window.setTimeout = originalSetTimeout;
    });
  });
  
  describe('useWindowResize', () => {
    it('should register and unregister resize event listener', () => {
      const callback = jest.fn();
      const { unmount } = render(<ResizeComponent callback={callback} />);
      
      // Check that event listener was registered
      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      
      // Get the registered handler
      const resizeHandler = (window.addEventListener as jest.Mock).mock.calls.find(
        call => call[0] === 'resize'
      )[1];
      
      // Reset mock to check unmount cleanup
      jest.clearAllMocks();
      
      // Unmount to trigger cleanup
      unmount();
      
      // Check that event listener was unregistered with the same handler
      expect(window.removeEventListener).toHaveBeenCalledWith('resize', resizeHandler);
    });
    
    it('should call callback immediately on mount', () => {
      const callback = jest.fn();
      render(<ResizeComponent callback={callback} />);
      
      // Check that callback was called on mount
      expect(callback).toHaveBeenCalledTimes(1);
    });
    
    it('should throttle resize events when throttle option is provided', () => {
      // Mock setTimeout and clearTimeout
      const originalSetTimeout = window.setTimeout;
      const originalClearTimeout = window.clearTimeout;
      
      let storedCallback: Function | null = null;
      window.setTimeout = jest.fn().mockImplementation((callback, delay) => {
        // Store the callback so we can call it manually in our test
        storedCallback = callback;
        return 123;
      });
      window.clearTimeout = jest.fn();
      
      const callback = jest.fn();
      render(<ResizeComponent callback={callback} throttle={200} />);
      
      // Clear initial callback call that happens on mount
      callback.mockClear();
      
      // Get the registered resize handler
      const resizeHandler = (window.addEventListener as jest.Mock).mock.calls.find(
        call => call[0] === 'resize'
      )[1];
      
      // Trigger resize event
      act(() => {
        resizeHandler();
      });
      
      // Verify setTimeout was called with the right delay
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 200);
      
      // Check that callback was not called immediately
      expect(callback).not.toHaveBeenCalled();
      
      // Manually trigger the stored timeout callback
      if (storedCallback) {
        act(() => {
          storedCallback();
        });
      }
      
      // Now the callback should have been called
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Restore original functions
      window.setTimeout = originalSetTimeout;
      window.clearTimeout = originalClearTimeout;
    });
  });
});