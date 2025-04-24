import { renderHook, act } from '@testing-library/react';
import useWakeLock from '../../hooks/useWakeLock';

describe('useWakeLock', () => {
  // Setup for browser environment
  const setupBrowserEnv = (isSupported = true) => {
    // Mock wake lock sentinel
    const mockWakeLock = {
      release: jest.fn().mockResolvedValue(undefined),
    };

    // Mock request function
    const mockRequest = jest.fn().mockResolvedValue(mockWakeLock);

    if (isSupported) {
      // Define wakeLock in navigator for supported case
      Object.defineProperty(navigator, 'wakeLock', {
        value: {
          request: mockRequest,
        },
        configurable: true,
        writable: true,
      });
    } else {
      // Remove wakeLock for unsupported case
      // @ts-ignore - Deliberately removing wakeLock to simulate unsupported environment
      delete navigator.wakeLock;
    }

    return { mockRequest, mockWakeLock };
  };

  // Teardown for each test
  afterEach(() => {
    jest.resetAllMocks();
  });

  // Test for SSR compatibility
  it('should handle server-side rendering gracefully', () => {
    // Save original window and navigator
    const originalWindow = global.window;
    const originalNavigator = global.navigator;

    // Simulate SSR by removing window
    // @ts-ignore - Deliberately setting window to undefined to simulate SSR
    global.window = undefined;
    // @ts-ignore - Deliberately setting navigator to undefined to simulate SSR
    global.navigator = undefined;

    // Should not throw when used in SSR
    const { result } = renderHook(() => useWakeLock());

    // Should have safe default values
    expect(result.current.isSupported).toBe(false);
    expect(result.current.isActive).toBe(false);

    // Restore original globals
    global.window = originalWindow;
    global.navigator = originalNavigator;
  });

  // Test detection of browser support
  it('should detect if wake lock is supported', () => {
    setupBrowserEnv(true);
    
    const { result } = renderHook(() => useWakeLock());
    
    // Give time for the effect to run
    act(() => {
      jest.runAllTimers();
    });
    
    expect(result.current.isSupported).toBe(true);
  });
  
  it('should detect if wake lock is not supported', () => {
    setupBrowserEnv(false);
    
    const { result } = renderHook(() => useWakeLock());
    
    expect(result.current.isSupported).toBe(false);
  });
  
  it('should request wake lock when enabled', async () => {
    const { mockRequest } = setupBrowserEnv(true);
    
    const { result } = renderHook(() => useWakeLock());
    
    // Force the hook to recognize support
    act(() => {
      jest.runAllTimers();
    });
    
    await act(async () => {
      await result.current.request();
    });
    
    expect(mockRequest).toHaveBeenCalledWith('screen');
    expect(result.current.isActive).toBe(true);
  });
  
  it('should not request wake lock when not supported', async () => {
    const { mockRequest } = setupBrowserEnv(false);
    
    const { result } = renderHook(() => useWakeLock());
    
    await act(async () => {
      await result.current.request();
    });
    
    expect(mockRequest).not.toHaveBeenCalled();
    expect(result.current.isActive).toBe(false);
  });
});
