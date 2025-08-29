/**
 * Tests for useAnimations hook
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import {
  useAnimations,
  useHoverAnimation,
  useFocusAnimation,
  useLoadingAnimation,
  useMicroInteractions,
} from '../useAnimations';

// Mock the animation utilities
jest.mock('../../utils/material3-animations', () => ({
  createSharedElementTransition: jest.fn(() => ({ cancel: jest.fn() })),
  createLoadingAnimation: jest.fn(() => ({ cancel: jest.fn() })),
  createMicroInteraction: jest.fn(() => ({ cancel: jest.fn() })),
  createPageTransition: jest.fn(() => Promise.resolve()),
  createOptimizedAnimation: jest.fn(() => ({ cancel: jest.fn(), reverse: jest.fn() })),
  AnimationPerformanceManager: {
    getInstance: jest.fn(() => ({
      isReducedMotionPreferred: jest.fn(() => false),
      getActiveAnimationCount: jest.fn(() => 0),
      pauseAllAnimations: jest.fn(),
      resumeAllAnimations: jest.fn(),
    })),
  },
  MATERIAL3_DURATION: {
    short3: '150ms',
    short4: '200ms',
  },
  MATERIAL3_EASING: {
    emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
  },
}));

const mockAnimationUtils = require('../../utils/material3-animations');

describe('useAnimations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide animation controls', () => {
    const { result } = renderHook(() => useAnimations());

    expect(result.current).toHaveProperty('createSharedTransition');
    expect(result.current).toHaveProperty('startLoadingAnimation');
    expect(result.current).toHaveProperty('stopLoadingAnimation');
    expect(result.current).toHaveProperty('triggerMicroInteraction');
    expect(result.current).toHaveProperty('transitionToPage');
    expect(result.current).toHaveProperty('createHoverAnimation');
    expect(result.current).toHaveProperty('createFocusAnimation');
    expect(result.current).toHaveProperty('isReducedMotion');
    expect(result.current).toHaveProperty('activeAnimationCount');
    expect(result.current).toHaveProperty('pauseAllAnimations');
    expect(result.current).toHaveProperty('resumeAllAnimations');
  });

  it('should respect reduced motion preference', () => {
    mockAnimationUtils.AnimationPerformanceManager.getInstance.mockReturnValue({
      isReducedMotionPreferred: () => true,
      getActiveAnimationCount: () => 0,
      pauseAllAnimations: jest.fn(),
      resumeAllAnimations: jest.fn(),
    });

    const { result } = renderHook(() => useAnimations());

    expect(result.current.isReducedMotion).toBe(true);

    const element = document.createElement('div');
    const animation = result.current.createHoverAnimation(element);

    expect(animation).toBeNull();
    expect(mockAnimationUtils.createOptimizedAnimation).not.toHaveBeenCalled();
  });

  it('should create shared element transitions', () => {
    const { result } = renderHook(() => useAnimations());

    const element = document.createElement('div');
    const targetElement = document.createElement('div');

    act(() => {
      result.current.createSharedTransition({ element, targetElement });
    });

    expect(mockAnimationUtils.createSharedElementTransition).toHaveBeenCalledWith({
      element,
      targetElement,
    });
  });

  it('should manage loading animations', () => {
    const { result } = renderHook(() => useAnimations());

    const element = document.createElement('div');
    const config = { type: 'pulse' as const };

    act(() => {
      result.current.startLoadingAnimation(element, config);
    });

    expect(mockAnimationUtils.createLoadingAnimation).toHaveBeenCalledWith(element, config);
  });

  it('should trigger micro-interactions', () => {
    const { result } = renderHook(() => useAnimations());

    const element = document.createElement('div');
    const config = {
      trigger: 'hover' as const,
      animation: 'scale' as const,
    };

    act(() => {
      result.current.triggerMicroInteraction(element, config);
    });

    expect(mockAnimationUtils.createMicroInteraction).toHaveBeenCalledWith(element, config);
  });

  it('should handle page transitions', async () => {
    const { result } = renderHook(() => useAnimations());

    const exitElement = document.createElement('div');
    const enterElement = document.createElement('div');

    await act(async () => {
      await result.current.transitionToPage(exitElement, enterElement, 'forward');
    });

    expect(mockAnimationUtils.createPageTransition).toHaveBeenCalledWith(
      exitElement,
      enterElement,
      'forward'
    );
  });

  it('should create hover animations', () => {
    const { result } = renderHook(() => useAnimations());

    const element = document.createElement('div');

    act(() => {
      result.current.createHoverAnimation(element);
    });

    expect(mockAnimationUtils.createOptimizedAnimation).toHaveBeenCalledWith(
      element,
      expect.arrayContaining([
        expect.objectContaining({ transform: 'scale(1)' }),
        expect.objectContaining({ transform: 'scale(1.02)' }),
      ]),
      expect.objectContaining({
        duration: 150,
        easing: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
        fill: 'forwards',
      })
    );
  });

  it('should create focus animations', () => {
    const { result } = renderHook(() => useAnimations());

    const element = document.createElement('div');

    act(() => {
      result.current.createFocusAnimation(element);
    });

    expect(mockAnimationUtils.createOptimizedAnimation).toHaveBeenCalledWith(
      element,
      expect.arrayContaining([
        expect.objectContaining({ outline: '0px solid var(--md-sys-color-primary)' }),
        expect.objectContaining({ outline: '2px solid var(--md-sys-color-primary)' }),
      ]),
      expect.objectContaining({
        duration: 200,
        easing: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
        fill: 'forwards',
      })
    );
  });

  it('should pause and resume animations', () => {
    const mockManager = {
      isReducedMotionPreferred: () => false,
      getActiveAnimationCount: () => 2,
      pauseAllAnimations: jest.fn(),
      resumeAllAnimations: jest.fn(),
    };

    mockAnimationUtils.AnimationPerformanceManager.getInstance.mockReturnValue(mockManager);

    const { result } = renderHook(() => useAnimations());

    act(() => {
      result.current.pauseAllAnimations();
    });

    expect(mockManager.pauseAllAnimations).toHaveBeenCalled();

    act(() => {
      result.current.resumeAllAnimations();
    });

    expect(mockManager.resumeAllAnimations).toHaveBeenCalled();
  });
});

describe('useHoverAnimation', () => {
  it('should handle mouse enter and leave events', () => {
    const elementRef = { current: document.createElement('div') };
    const { result } = renderHook(() => useHoverAnimation(elementRef));

    const mockAnimation = { reverse: jest.fn() };
    mockAnimationUtils.createOptimizedAnimation.mockReturnValue(mockAnimation);

    act(() => {
      result.current.handleMouseEnter();
    });

    expect(mockAnimationUtils.createOptimizedAnimation).toHaveBeenCalled();

    act(() => {
      result.current.handleMouseLeave();
    });

    expect(mockAnimation.reverse).toHaveBeenCalled();
  });

  it('should not animate when reduced motion is preferred', () => {
    mockAnimationUtils.AnimationPerformanceManager.getInstance.mockReturnValue({
      isReducedMotionPreferred: () => true,
      getActiveAnimationCount: () => 0,
      pauseAllAnimations: jest.fn(),
      resumeAllAnimations: jest.fn(),
    });

    const elementRef = { current: document.createElement('div') };
    const { result } = renderHook(() => useHoverAnimation(elementRef));

    act(() => {
      result.current.handleMouseEnter();
    });

    expect(mockAnimationUtils.createOptimizedAnimation).not.toHaveBeenCalled();
  });
});

describe('useFocusAnimation', () => {
  it('should handle focus and blur events', () => {
    const elementRef = { current: document.createElement('div') };
    const { result } = renderHook(() => useFocusAnimation(elementRef));

    const mockAnimation = { reverse: jest.fn() };
    mockAnimationUtils.createOptimizedAnimation.mockReturnValue(mockAnimation);

    act(() => {
      result.current.handleFocus();
    });

    expect(mockAnimationUtils.createOptimizedAnimation).toHaveBeenCalled();

    act(() => {
      result.current.handleBlur();
    });

    expect(mockAnimation.reverse).toHaveBeenCalled();
  });
});

describe('useLoadingAnimation', () => {
  it('should manage loading state and animation', () => {
    const config = { type: 'pulse' as const };
    const { result } = renderHook(() => useLoadingAnimation(config));

    expect(result.current.isLoading).toBe(false);

    const element = document.createElement('div');
    const mockAnimation = { cancel: jest.fn() };
    mockAnimationUtils.createLoadingAnimation.mockReturnValue(mockAnimation);

    act(() => {
      result.current.startLoading(element);
    });

    expect(result.current.isLoading).toBe(true);
    expect(mockAnimationUtils.createLoadingAnimation).toHaveBeenCalledWith(element, config);

    act(() => {
      result.current.stopLoading();
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockAnimation.cancel).toHaveBeenCalled();
  });

  it('should cleanup animation on unmount', () => {
    const config = { type: 'pulse' as const };
    const { result, unmount } = renderHook(() => useLoadingAnimation(config));

    const element = document.createElement('div');
    const mockAnimation = { cancel: jest.fn() };
    mockAnimationUtils.createLoadingAnimation.mockReturnValue(mockAnimation);

    act(() => {
      result.current.startLoading(element);
    });

    unmount();

    expect(mockAnimation.cancel).toHaveBeenCalled();
  });
});

describe('useMicroInteractions', () => {
  it('should provide micro-interaction triggers', () => {
    const { result } = renderHook(() => useMicroInteractions());

    expect(result.current).toHaveProperty('triggerValidationError');
    expect(result.current).toHaveProperty('triggerSuccess');
    expect(result.current).toHaveProperty('triggerClick');
    expect(result.current).toHaveProperty('triggerHover');
  });

  it('should trigger validation error animation', () => {
    const { result } = renderHook(() => useMicroInteractions());

    const element = document.createElement('div');

    act(() => {
      result.current.triggerValidationError(element);
    });

    expect(mockAnimationUtils.createMicroInteraction).toHaveBeenCalledWith(element, {
      trigger: 'validation',
      animation: 'shake',
      intensity: 'moderate',
    });
  });

  it('should trigger success animation', () => {
    const { result } = renderHook(() => useMicroInteractions());

    const element = document.createElement('div');

    act(() => {
      result.current.triggerSuccess(element);
    });

    expect(mockAnimationUtils.createMicroInteraction).toHaveBeenCalledWith(element, {
      trigger: 'success',
      animation: 'bounce',
      intensity: 'subtle',
    });
  });

  it('should trigger click animation', () => {
    const { result } = renderHook(() => useMicroInteractions());

    const element = document.createElement('div');

    act(() => {
      result.current.triggerClick(element);
    });

    expect(mockAnimationUtils.createMicroInteraction).toHaveBeenCalledWith(element, {
      trigger: 'click',
      animation: 'ripple',
      intensity: 'moderate',
    });
  });

  it('should trigger hover animation', () => {
    const { result } = renderHook(() => useMicroInteractions());

    const element = document.createElement('div');

    act(() => {
      result.current.triggerHover(element);
    });

    expect(mockAnimationUtils.createMicroInteraction).toHaveBeenCalledWith(element, {
      trigger: 'hover',
      animation: 'scale',
      intensity: 'subtle',
    });
  });
});

// Integration test component
const TestComponent: React.FC = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { handleMouseEnter, handleMouseLeave } = useHoverAnimation(buttonRef);
  const { handleFocus, handleBlur } = useFocusAnimation(buttonRef);

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      Test Button
    </button>
  );
};

describe('Animation Hooks Integration', () => {
  it('should work together in a component', () => {
    render(<TestComponent />);

    const button = screen.getByRole('button', { name: 'Test Button' });

    fireEvent.mouseEnter(button);
    expect(mockAnimationUtils.createOptimizedAnimation).toHaveBeenCalled();

    fireEvent.focus(button);
    expect(mockAnimationUtils.createOptimizedAnimation).toHaveBeenCalledTimes(2);

    fireEvent.mouseLeave(button);
    fireEvent.blur(button);
  });
});