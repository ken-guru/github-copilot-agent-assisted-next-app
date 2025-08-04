/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook } from '@testing-library/react';
import { useResponsiveToast } from '../useResponsiveToast';

// Mock the toast context
const mockAddToast = jest.fn();
const mockRemoveToast = jest.fn();

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: mockAddToast,
    removeToast: mockRemoveToast,
  }),
}));

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockRemoveEventListener,
});

describe('useResponsiveToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInnerWidth(1024); // Default to desktop
    mockAddToast.mockReturnValue('toast-id-123');
  });

  it('should detect desktop viewport initially', () => {
    mockInnerWidth(1024);
    const { result } = renderHook(() => useResponsiveToast());
    
    expect(result.current.isMobile).toBe(false);
  });

  it('should detect mobile viewport', () => {
    mockInnerWidth(480);
    const { result } = renderHook(() => useResponsiveToast());
    
    expect(result.current.isMobile).toBe(true);
  });

  it('should use full message on desktop', async () => {
    mockInnerWidth(1024);
    const { result } = renderHook(() => useResponsiveToast());
    
    const toastId = result.current.addResponsiveToast({
      message: 'This is a long desktop message',
      mobileMessage: 'Short!',
      variant: 'info'
    });
    
    expect(toastId).toBeDefined();
    expect(mockAddToast).toHaveBeenCalledWith({
      message: 'This is a long desktop message',
      variant: 'info'
    });
  });

  it('should use mobile message on mobile when provided', async () => {
    mockInnerWidth(480);
    const { result } = renderHook(() => useResponsiveToast());
    
    const toastId = result.current.addResponsiveToast({
      message: 'This is a long desktop message',
      mobileMessage: 'Short!',
      variant: 'info'
    });
    
    expect(toastId).toBeDefined();
    expect(mockAddToast).toHaveBeenCalledWith({
      message: 'Short!',
      variant: 'info'
    });
  });

  it('should use main message on mobile when mobile message not provided', async () => {
    mockInnerWidth(480);
    const { result } = renderHook(() => useResponsiveToast());
    
    const toastId = result.current.addResponsiveToast({
      message: 'This message works on all devices',
      variant: 'info'
    });
    
    expect(toastId).toBeDefined();
    expect(mockAddToast).toHaveBeenCalledWith({
      message: 'This message works on all devices',
      variant: 'info'
    });
  });

  it('should set up resize event listener', () => {
    renderHook(() => useResponsiveToast());
    
    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should clean up resize event listener on unmount', () => {
    const { unmount } = renderHook(() => useResponsiveToast());
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should provide removeToast function', () => {
    const { result } = renderHook(() => useResponsiveToast());
    
    expect(typeof result.current.removeToast).toBe('function');
  });

  it('should handle toast options correctly', () => {
    const { result } = renderHook(() => useResponsiveToast());
    
    const toastId = result.current.addResponsiveToast({
      message: 'Test message',
      variant: 'warning',
      persistent: true,
      autoDismiss: false,
      duration: 3000
    });
    
    expect(toastId).toBeDefined();
    expect(mockAddToast).toHaveBeenCalledWith({
      message: 'Test message',
      variant: 'warning',
      persistent: true,
      autoDismiss: false,
      duration: 3000
    });
  });
});
