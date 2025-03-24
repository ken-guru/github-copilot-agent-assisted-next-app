import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from '../useOnlineStatus';

describe('useOnlineStatus hook', () => {
  // Store original window.navigator.onLine value
  const originalOnLine = window.navigator.onLine;
  
  // Mock for online/offline event listeners
  let onlineCallback: EventListener | null = null;
  let offlineCallback: EventListener | null = null;
  
  // Mock addEventListener and removeEventListener
  const addEventListenerMock = jest.spyOn(window, 'addEventListener');
  const removeEventListenerMock = jest.spyOn(window, 'removeEventListener');
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock event listeners
    addEventListenerMock.mockImplementation((event, callback) => {
      if (event === 'online') onlineCallback = callback as EventListener;
      if (event === 'offline') offlineCallback = callback as EventListener;
    });
    
    // Mock navigator.onLine
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });
  });
  
  afterAll(() => {
    // Restore original onLine value
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: originalOnLine,
    });
    
    // Restore mocks
    addEventListenerMock.mockRestore();
    removeEventListenerMock.mockRestore();
  });
  
  it('should return true when online', () => {
    // Arrange & Act
    const { result } = renderHook(() => useOnlineStatus());
    
    // Assert
    expect(result.current).toBe(true);
  });
  
  it('should return false when offline', () => {
    // Arrange
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    });
    
    // Act
    const { result } = renderHook(() => useOnlineStatus());
    
    // Assert
    expect(result.current).toBe(false);
  });
  
  it('should add event listeners on mount', () => {
    // Arrange & Act
    renderHook(() => useOnlineStatus());
    
    // Assert
    expect(addEventListenerMock).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerMock).toHaveBeenCalledWith('offline', expect.any(Function));
  });
  
  it('should remove event listeners on unmount', () => {
    // Arrange
    const { unmount } = renderHook(() => useOnlineStatus());
    
    // Act
    unmount();
    
    // Assert
    expect(removeEventListenerMock).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerMock).toHaveBeenCalledWith('offline', expect.any(Function));
  });
  
  it('should update online status when online event is triggered', () => {
    // Arrange
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    });
    
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(false);
    
    // Mock navigator.onLine to be true for the event
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });
    
    // Act
    act(() => {
      if (onlineCallback) onlineCallback(new Event('online'));
    });
    
    // Assert
    expect(result.current).toBe(true);
  });
  
  it('should update online status when offline event is triggered', () => {
    // Arrange
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
    
    // Mock navigator.onLine to be false for the event
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    });
    
    // Act
    act(() => {
      if (offlineCallback) offlineCallback(new Event('offline'));
    });
    
    // Assert
    expect(result.current).toBe(false);
  });
});