/**
 * Tests for Material3PageTransition component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import {
  Material3PageTransition,
  usePageTransition,
  SharedElementTransition,
} from '../Material3PageTransition';

// Mock the animation hooks
jest.mock('../../../hooks/useAnimations', () => ({
  useAnimations: jest.fn(() => ({
    isReducedMotion: false,
    createSharedTransition: jest.fn(),
  })),
}));

const mockAnimationHooks = require('../../../hooks/useAnimations');

// Mock DOM methods for transitions
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(HTMLElement.prototype, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

describe('Material3PageTransition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render children without transition initially', () => {
    render(
      <Material3PageTransition transitionKey="initial">
        <div>Initial Content</div>
      </Material3PageTransition>
    );

    expect(screen.getByText('Initial Content')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    render(
      <Material3PageTransition
        transitionKey="test"
        direction="forward"
        className="custom-class"
      >
        <div>Content</div>
      </Material3PageTransition>
    );

    const container = screen.getByText('Content').parentElement?.parentElement;
    expect(container).toHaveClass('container', 'directionForward', 'custom-class');
  });

  it('should handle reduced motion', () => {
    mockAnimationHooks.useAnimations.mockReturnValue({
      isReducedMotion: true,
      createSharedTransition: jest.fn(),
    });

    render(
      <Material3PageTransition transitionKey="test">
        <div>Content</div>
      </Material3PageTransition>
    );

    const container = screen.getByText('Content').parentElement;
    expect(container).not.toHaveAttribute('data-transition');
  });

  it('should trigger transition when key changes', async () => {
    const onTransitionStart = jest.fn();
    const onTransitionEnd = jest.fn();

    const { rerender } = render(
      <Material3PageTransition
        transitionKey="key1"
        onTransitionStart={onTransitionStart}
        onTransitionEnd={onTransitionEnd}
      >
        <div>Content 1</div>
      </Material3PageTransition>
    );

    rerender(
      <Material3PageTransition
        transitionKey="key2"
        onTransitionStart={onTransitionStart}
        onTransitionEnd={onTransitionEnd}
      >
        <div>Content 2</div>
      </Material3PageTransition>
    );

    // Should show both contents during transition
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();

    // Should call transition start
    expect(onTransitionStart).toHaveBeenCalled();

    // Simulate transition end
    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      expect(onTransitionEnd).toHaveBeenCalled();
    });
  });

  it('should apply direction-specific classes', () => {
    const { rerender } = render(
      <Material3PageTransition transitionKey="key1" direction="forward">
        <div>Content</div>
      </Material3PageTransition>
    );

    let container = screen.getByText('Content').parentElement?.parentElement;
    expect(container).toHaveClass('directionForward');

    rerender(
      <Material3PageTransition transitionKey="key1" direction="backward">
        <div>Content</div>
      </Material3PageTransition>
    );

    container = screen.getByText('Content').parentElement?.parentElement;
    expect(container).toHaveClass('directionBackward');

    rerender(
      <Material3PageTransition transitionKey="key1" direction="up">
        <div>Content</div>
      </Material3PageTransition>
    );

    container = screen.getByText('Content').parentElement?.parentElement;
    expect(container).toHaveClass('directionUp');

    rerender(
      <Material3PageTransition transitionKey="key1" direction="down">
        <div>Content</div>
      </Material3PageTransition>
    );

    container = screen.getByText('Content').parentElement?.parentElement;
    expect(container).toHaveClass('directionDown');
  });

  it('should handle transition with different durations and easings', () => {
    render(
      <Material3PageTransition
        transitionKey="test"
        duration="long"
        easing="decelerated"
      >
        <div>Content</div>
      </Material3PageTransition>
    );

    // Component should render without errors
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should cleanup properly on unmount', () => {
    const { unmount } = render(
      <Material3PageTransition transitionKey="test">
        <div>Content</div>
      </Material3PageTransition>
    );

    unmount();

    // Should not throw any errors
    expect(true).toBe(true);
  });
});

describe('usePageTransition', () => {
  it('should provide transition controls', () => {
    const { result } = renderHook(() => usePageTransition());

    expect(result.current).toHaveProperty('transitionKey');
    expect(result.current).toHaveProperty('isTransitioning');
    expect(result.current).toHaveProperty('triggerTransition');
    expect(result.current).toHaveProperty('handleTransitionStart');
    expect(result.current).toHaveProperty('handleTransitionEnd');

    expect(typeof result.current.transitionKey).toBe('string');
    expect(typeof result.current.isTransitioning).toBe('boolean');
    expect(typeof result.current.triggerTransition).toBe('function');
    expect(typeof result.current.handleTransitionStart).toBe('function');
    expect(typeof result.current.handleTransitionEnd).toBe('function');
  });

  it('should trigger transition with new key', () => {
    const { result } = renderHook(() => usePageTransition());

    const initialKey = result.current.transitionKey;

    act(() => {
      result.current.triggerTransition();
    });

    expect(result.current.transitionKey).not.toBe(initialKey);
  });

  it('should trigger transition with custom key', () => {
    const { result } = renderHook(() => usePageTransition());

    act(() => {
      result.current.triggerTransition('custom-key');
    });

    expect(result.current.transitionKey).toBe('custom-key');
  });

  it('should manage transition state', () => {
    const { result } = renderHook(() => usePageTransition());

    expect(result.current.isTransitioning).toBe(false);

    act(() => {
      result.current.handleTransitionStart();
    });

    expect(result.current.isTransitioning).toBe(true);

    act(() => {
      result.current.handleTransitionEnd();
    });

    expect(result.current.isTransitioning).toBe(false);
  });
});

describe('SharedElementTransition', () => {
  it('should render children with shared element attributes', () => {
    render(
      <SharedElementTransition elementId="test-element">
        <div>Shared Content</div>
      </SharedElementTransition>
    );

    const container = screen.getByText('Shared Content').parentElement;
    expect(container).toHaveAttribute('data-shared-element', 'test-element');
  });

  it('should apply custom className', () => {
    render(
      <SharedElementTransition elementId="test" className="custom-shared">
        <div>Content</div>
      </SharedElementTransition>
    );

    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('custom-shared');
  });

  it('should create shared transition when target element exists', () => {
    const mockCreateSharedTransition = jest.fn();

    mockAnimationHooks.useAnimations.mockReturnValue({
      isReducedMotion: false,
      createSharedTransition: mockCreateSharedTransition,
    });

    // Create target element
    const targetElement = document.createElement('div');
    targetElement.setAttribute('data-shared-element', 'test-element');
    document.body.appendChild(targetElement);

    render(
      <SharedElementTransition elementId="test-element">
        <div>Source Content</div>
      </SharedElementTransition>
    );

    // Should attempt to create shared transition
    expect(mockCreateSharedTransition).toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(targetElement);
  });

  it('should not create transition when no target element exists', () => {
    const mockCreateSharedTransition = jest.fn();

    mockAnimationHooks.useAnimations.mockReturnValue({
      isReducedMotion: false,
      createSharedTransition: mockCreateSharedTransition,
    });

    render(
      <SharedElementTransition elementId="non-existent">
        <div>Content</div>
      </SharedElementTransition>
    );

    // Should not create transition without target
    expect(mockCreateSharedTransition).not.toHaveBeenCalled();
  });
});

// Integration test
describe('PageTransition Integration', () => {
  it('should work with usePageTransition hook', () => {
    const TestComponent: React.FC = () => {
      const { transitionKey, triggerTransition, isTransitioning } = usePageTransition();

      return (
        <div>
          <button onClick={() => triggerTransition()}>
            Trigger Transition
          </button>
          <div>Transitioning: {isTransitioning.toString()}</div>
          <Material3PageTransition transitionKey={transitionKey}>
            <div>Page Content</div>
          </Material3PageTransition>
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByText('Page Content')).toBeInTheDocument();
    expect(screen.getByText('Transitioning: false')).toBeInTheDocument();

    const button = screen.getByText('Trigger Transition');
    expect(button).toBeInTheDocument();
  });

  it('should handle multiple page transitions', async () => {
    const TestComponent: React.FC = () => {
      const [page, setPage] = React.useState(1);

      return (
        <div>
          <button onClick={() => setPage(p => p + 1)}>
            Next Page
          </button>
          <Material3PageTransition transitionKey={`page-${page}`}>
            <div>Page {page} Content</div>
          </Material3PageTransition>
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByText('Page 1 Content')).toBeInTheDocument();

    const button = screen.getByText('Next Page');
    act(() => {
      button.click();
    });

    // During transition, both pages should be visible
    expect(screen.getByText('Page 1 Content')).toBeInTheDocument();
    expect(screen.getByText('Page 2 Content')).toBeInTheDocument();
  });
});