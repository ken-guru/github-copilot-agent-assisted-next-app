/**
 * Tests for useMobileOptimizations hook
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useMobileOptimizations, useResponsiveValue, useTouchOptimizedHandlers, useOrientationChange, useViewportAwareAnimations } from '../useMobileOptimizations';

// Mock the mobile utils
jest.mock('../../utils/material3-mobile-utils', () => ({
  isTouchDevice: jest.fn(() => false),
  isPortraitOrientation: jest.fn(() => true),
  getViewportSize: jest.fn(() => 'md'),
  isMobileViewport: jest.fn(() => false),
  isTabletViewport: jest.fn(() => false),
  handleOrientationChange: jest.fn((callback) => {
    // Simulate orientation change
    setTimeout(() => callback('landscape'), 100);
    return jest.fn(); // cleanup function
  }),
  createRippleEffect: jest.fn(),
  getTouchOptimizedSpacing: jest.fn((spacing) => spacing),
  getTouchOptimizedSize: jest.fn((component) => component === 'button' ? 48 : 56),
}));

// Mock window
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('useMobileOptimizations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial mobile optimization state', () => {
    const { result } = renderHook(() => useMobileOptimizations());

    expect(result.current.isTouch).toBe(false);
    expect(result.current.orientation).toBe('portrait');
    expect(result.current.viewportSize).toBe('md');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isPortrait).toBe(true);
  });

  test('should provide touch optimization functions', () => {
    const { result } = renderHook(() => useMobileOptimizations());

    expect(typeof result.current.getTouchSpacing).toBe('function');
    expect(typeof result.current.getTouchSize).toBe('function');
    expect(typeof result.current.createRipple).toBe('function');
    expect(typeof result.current.shouldEnableHover).toBe('function');
  });

  test('should get touch-optimized spacing', () => {
    const { result } = renderHook(() => useMobileOptimizations());

    const spacing = result.current.getTouchSpacing('16px');
    expect(spacing).toBe('16px');
  });

  test('should get touch-optimized size', () => {
    const { result } = renderHook(() => useMobileOptimizations());

    const buttonSize = result.current.getTouchSize('button');
    const inputSize = result.current.getTouchSize('input');

    expect(buttonSize).toBe(48);
    expect(inputSize).toBe(56);
  });

  test('should determine hover capability', () => {
    const { result } = renderHook(() => useMobileOptimizations());

    expect(result.current.shouldEnableHover()).toBe(true); // Not touch device
  });

  test('should create ripple effect', () => {
    const { result } = renderHook(() => useMobileOptimizations());
    const element = document.createElement('div');
    const event = new MouseEvent('click');

    result.current.createRipple(element, event);

    const { createRippleEffect } = require('../../utils/material3-mobile-utils');
    expect(createRippleEffect).toHaveBeenCalledWith(element, event);
  });

  test('should handle resize events', () => {
    const { result } = renderHook(() => useMobileOptimizations());

    // Simulate window resize
    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });

    // State should update based on new viewport size
    expect(result.current.viewportSize).toBeDefined();
  });

  test('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useMobileOptimizations());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});

describe('useResponsiveValue', () => {
  test('should return responsive value based on viewport size', () => {
    const values = {
      xs: 'small',
      sm: 'medium',
      md: 'large',
      lg: 'extra-large',
      default: 'default',
    };

    const { result } = renderHook(() => useResponsiveValue(values));

    expect(result.current).toBe('large'); // md viewport
  });

  test('should return default value when viewport size not specified', () => {
    const values = {
      xs: 'small',
      default: 'default',
    };

    const { result } = renderHook(() => useResponsiveValue(values));

    expect(result.current).toBe('default'); // md not specified
  });
});

describe('useTouchOptimizedHandlers', () => {
  test('should create touch-optimized event handlers', () => {
    const { result } = renderHook(() => useTouchOptimizedHandlers());
    const onClick = jest.fn();

    const handlers = result.current.createTouchHandler(onClick, { enableRipple: true });

    expect(handlers.onClick).toBeDefined();
    expect(handlers.onTouchStart).toBeUndefined(); // Not touch device
  });

  test('should handle click events', () => {
    const { result } = renderHook(() => useTouchOptimizedHandlers());
    const onClick = jest.fn();

    const handlers = result.current.createTouchHandler(onClick);
    const mockEvent = {
      currentTarget: document.createElement('button'),
      nativeEvent: new MouseEvent('click'),
    } as React.MouseEvent;

    handlers.onClick(mockEvent);

    expect(onClick).toHaveBeenCalledWith(mockEvent);
  });

  test('should create ripple effect on click when enabled', () => {
    const { result } = renderHook(() => useTouchOptimizedHandlers());
    const onClick = jest.fn();

    const handlers = result.current.createTouchHandler(onClick, { enableRipple: true });
    const mockElement = document.createElement('button');
    const mockEvent = {
      currentTarget: mockElement,
      nativeEvent: new MouseEvent('click'),
    } as React.MouseEvent;

    handlers.onClick(mockEvent);

    const { createRippleEffect } = require('../../utils/material3-mobile-utils');
    expect(createRippleEffect).toHaveBeenCalledWith(mockElement, mockEvent.nativeEvent);
  });
});

describe('useOrientationChange', () => {
  test('should call callback on orientation change', async () => {
    const callback = jest.fn();

    renderHook(() => useOrientationChange(callback));

    // Wait for the mocked orientation change
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(callback).toHaveBeenCalledWith('landscape');
  });

  test('should not call callback if orientation unchanged', () => {
    const callback = jest.fn();

    renderHook(() => useOrientationChange(callback));

    // Callback should not be called initially since orientation hasn't changed
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('useViewportAwareAnimations', () => {
  test('should provide animation duration adjustment', () => {
    const { result } = renderHook(() => useViewportAwareAnimations());

    const duration = result.current.getAnimationDuration(1000);
    expect(typeof duration).toBe('number');
    expect(duration).toBeGreaterThan(0);
  });

  test('should detect reduced motion preference', () => {
    const { result } = renderHook(() => useViewportAwareAnimations());

    const shouldReduce = result.current.shouldReduceMotion();
    expect(typeof shouldReduce).toBe('boolean');
  });

  test('should adjust duration for mobile devices', () => {
    // Mock mobile viewport
    const { isMobileViewport } = require('../../utils/material3-mobile-utils');
    isMobileViewport.mockReturnValue(true);

    const { result } = renderHook(() => useViewportAwareAnimations());

    const baseDuration = 1000;
    const adjustedDuration = result.current.getAnimationDuration(baseDuration);

    expect(adjustedDuration).toBe(800); // 80% of base duration for mobile
  });

  test('should adjust duration for tablet devices', () => {
    // Mock tablet viewport
    const { isMobileViewport, isTabletViewport } = require('../../utils/material3-mobile-utils');
    isMobileViewport.mockReturnValue(false);
    isTabletViewport.mockReturnValue(true);

    const { result } = renderHook(() => useViewportAwareAnimations());

    const baseDuration = 1000;
    const adjustedDuration = result.current.getAnimationDuration(baseDuration);

    expect(adjustedDuration).toBe(900); // 90% of base duration for tablet
  });
});