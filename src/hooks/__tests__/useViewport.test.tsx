import { renderHook, act } from '@testing-library/react';
import { useViewport } from '../useViewport';

describe('useViewport Hook', () => {
  // Store original window dimensions and matchMedia
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;
  const originalMatchMedia = window.matchMedia;

  // Mock window resize event
  const fireResize = (width: number, height: number) => {
    window.innerWidth = width;
    window.innerHeight = height;
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    // Mock matchMedia for all tests
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  afterEach(() => {
    // Restore original dimensions and matchMedia after each test
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
    window.matchMedia = originalMatchMedia;
  });

  test('should return the current viewport dimensions', () => {
    // Set initial size
    fireResize(1024, 768);

    const { result } = renderHook(() => useViewport());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  test('should update dimensions when window is resized', () => {
    // Set initial size
    fireResize(1024, 768);

    const { result } = renderHook(() => useViewport());
    
    // Initial check
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);

    // Resize window
    act(() => {
      fireResize(375, 667);
    });

    // Check if values updated
    expect(result.current.width).toBe(375);
    expect(result.current.height).toBe(667);
  });

  test('should correctly identify if viewport is mobile', () => {
    // Set desktop size
    fireResize(1024, 768);

    const { result, rerender } = renderHook(() => useViewport());
    
    // Should not be mobile on desktop
    expect(result.current.isMobile).toBe(false);

    // Change to mobile size
    act(() => {
      fireResize(375, 667);
    });
    rerender();

    // Should be mobile now
    expect(result.current.isMobile).toBe(true);
  });

  test('should correctly identify if viewport is tablet', () => {
    // Set mobile size
    fireResize(375, 667);

    const { result, rerender } = renderHook(() => useViewport());
    
    // Should not be tablet on mobile
    expect(result.current.isTablet).toBe(false);

    // Change to tablet size
    act(() => {
      fireResize(768, 1024);
    });
    rerender();

    // Should be tablet now
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  test('should correctly identify if viewport is desktop', () => {
    // Set tablet size
    fireResize(768, 1024);

    const { result, rerender } = renderHook(() => useViewport());
    
    // Should not be desktop on tablet
    expect(result.current.isDesktop).toBe(false);

    // Change to desktop size
    act(() => {
      fireResize(1200, 800);
    });
    rerender();

    // Should be desktop now
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isMobile).toBe(false);
  });
  
  test('should handle touch capability detection', () => {
    // Mock touch capability
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(pointer: coarse)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useViewport());
    
    // Should detect touch capability
    expect(result.current.hasTouch).toBe(true);
  });
  
  test('should properly cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => useViewport());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
