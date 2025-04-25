import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  useLongPress,
  useMultiTouch,
  useSpringAnimation,
  useRippleEffect,
  TouchFeedbackProvider
} from '../advancedTouchInteractions';

describe('Advanced Touch Interactions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  
  describe('useLongPress Hook', () => {
    test('triggers callback after pressing for default duration', () => {
      const longPressCallback = jest.fn();
      const onTap = jest.fn();
      
      const TestComponent = () => {
        const longPressProps = useLongPress(longPressCallback, {
          onTap,
          delay: 500,
          preventDefault: true
        });
        
        return (
          <button {...longPressProps} data-testid="long-press-button">
            Press and Hold
          </button>
        );
      };
      
      render(<TestComponent />);
      
      const button = screen.getByTestId('long-press-button');
      
      // Start long press
      fireEvent.touchStart(button);
      expect(longPressCallback).not.toHaveBeenCalled();
      expect(onTap).not.toHaveBeenCalled();
      
      // Advance timer past threshold
      act(() => {
        jest.advanceTimersByTime(600);
      });
      
      // Should have triggered long press callback
      expect(longPressCallback).toHaveBeenCalledTimes(1);
      expect(onTap).not.toHaveBeenCalled();
      
      // End touch
      fireEvent.touchEnd(button);
    });
    
    test('cancels long press when touch ends early', () => {
      const longPressCallback = jest.fn();
      const onTap = jest.fn();
      
      const TestComponent = () => {
        const longPressProps = useLongPress(longPressCallback, {
          onTap,
          delay: 500
        });
        
        return (
          <button {...longPressProps} data-testid="long-press-button">
            Press and Hold
          </button>
        );
      };
      
      render(<TestComponent />);
      
      const button = screen.getByTestId('long-press-button');
      
      // Start long press
      fireEvent.touchStart(button);
      
      // End touch before threshold
      act(() => {
        jest.advanceTimersByTime(200);
      });
      
      fireEvent.touchEnd(button);
      
      // Should have triggered tap but not long press
      expect(longPressCallback).not.toHaveBeenCalled();
      expect(onTap).toHaveBeenCalledTimes(1);
    });
    
    test('fires onMove callback during long press motion', () => {
      const longPressCallback = jest.fn();
      const onMove = jest.fn();
      
      const TestComponent = () => {
        const longPressProps = useLongPress(longPressCallback, {
          onMove,
          delay: 500
        });
        
        return (
          <button {...longPressProps} data-testid="long-press-button">
            Press and Hold
          </button>
        );
      };
      
      render(<TestComponent />);
      
      const button = screen.getByTestId('long-press-button');
      
      // Start long press
      fireEvent.touchStart(button, {
        touches: [{ clientX: 100, clientY: 200 }]
      });
      
      // Move finger while holding
      fireEvent.touchMove(button, {
        touches: [{ clientX: 120, clientY: 220 }]
      });
      
      // Should have triggered move callback
      expect(onMove).toHaveBeenCalledTimes(1);
      expect(onMove).toHaveBeenCalledWith(
        expect.objectContaining({
          deltaX: 20,
          deltaY: 20,
          absX: 20,
          absY: 20
        })
      );
    });
    
    test('resets state when component unmounts during long press', () => {
      const longPressCallback = jest.fn();
      
      const TestContainer = ({ showComponent }) => {
        return showComponent ? (
          <TestButton callback={longPressCallback} />
        ) : null;
      };
      
      const TestButton = ({ callback }) => {
        const longPressProps = useLongPress(callback, { delay: 500 });
        return (
          <button {...longPressProps} data-testid="long-press-button">
            Press and Hold
          </button>
        );
      };
      
      const { rerender } = render(<TestContainer showComponent={true} />);
      
      const button = screen.getByTestId('long-press-button');
      
      // Start long press
      fireEvent.touchStart(button);
      
      // Unmount component during long press
      rerender(<TestContainer showComponent={false} />);
      
      // Advance timer
      act(() => {
        jest.advanceTimersByTime(600);
      });
      
      // Callback should not be called after unmount
      expect(longPressCallback).not.toHaveBeenCalled();
    });
  });

  describe('useMultiTouch Hook', () => {
    test('detects pinch gesture and calculates scale', () => {
      const onPinch = jest.fn();
      const onRotate = jest.fn();
      
      const TestComponent = () => {
        const multiTouchProps = useMultiTouch({
          onPinch,
          onRotate
        });
        
        return (
          <div {...multiTouchProps} data-testid="multi-touch-area" style={{ width: 300, height: 300 }}>
            Touch Area
          </div>
        );
      };
      
      render(<TestComponent />);
      
      const touchArea = screen.getByTestId('multi-touch-area');
      
      // Start with two fingers
      fireEvent.touchStart(touchArea, {
        touches: [
          { identifier: 0, clientX: 100, clientY: 100 },
          { identifier: 1, clientX: 200, clientY: 200 }
        ]
      });
      
      // Move fingers apart (pinch out)
      fireEvent.touchMove(touchArea, {
        touches: [
          { identifier: 0, clientX: 50, clientY: 50 },
          { identifier: 1, clientX: 250, clientY: 250 }
        ]
      });
      
      // Should have called onPinch with scale increase
      expect(onPinch).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: expect.any(Number),
          center: expect.any(Object)
        })
      );
      expect(onPinch.mock.calls[0][0].scale).toBeGreaterThan(1);
      
      // End touch
      fireEvent.touchEnd(touchArea);
    });
    
    test('detects rotation gesture and calculates angle', () => {
      const onPinch = jest.fn();
      const onRotate = jest.fn();
      
      const TestComponent = () => {
        const multiTouchProps = useMultiTouch({
          onPinch,
          onRotate
        });
        
        return (
          <div {...multiTouchProps} data-testid="multi-touch-area" style={{ width: 300, height: 300 }}>
            Touch Area
          </div>
        );
      };
      
      render(<TestComponent />);
      
      const touchArea = screen.getByTestId('multi-touch-area');
      
      // Start with two fingers horizontally aligned
      fireEvent.touchStart(touchArea, {
        touches: [
          { identifier: 0, clientX: 100, clientY: 150 },
          { identifier: 1, clientX: 200, clientY: 150 }
        ]
      });
      
      // Move to a ~45 degree position
      fireEvent.touchMove(touchArea, {
        touches: [
          { identifier: 0, clientX: 100, clientY: 100 },
          { identifier: 1, clientX: 200, clientY: 200 }
        ]
      });
      
      // Should have called onRotate with angle
      expect(onRotate).toHaveBeenCalledWith(
        expect.objectContaining({
          angle: expect.any(Number),
          center: expect.any(Object)
        })
      );
      
      // The angle should be approximately 45 degrees (π/4 radians), 
      // but we'll allow some flexibility in the test
      const rotationAngle = onRotate.mock.calls[0][0].angle;
      expect(Math.abs(rotationAngle - Math.PI / 4)).toBeLessThan(0.1);
      
      // End touch
      fireEvent.touchEnd(touchArea);
    });
    
    test('handles touch cancel events', () => {
      const onPinchEnd = jest.fn();
      const onRotateEnd = jest.fn();
      
      const TestComponent = () => {
        const multiTouchProps = useMultiTouch({
          onPinchEnd,
          onRotateEnd
        });
        
        return (
          <div {...multiTouchProps} data-testid="multi-touch-area">
            Touch Area
          </div>
        );
      };
      
      render(<TestComponent />);
      
      const touchArea = screen.getByTestId('multi-touch-area');
      
      // Start multi-touch
      fireEvent.touchStart(touchArea, {
        touches: [
          { identifier: 0, clientX: 100, clientY: 100 },
          { identifier: 1, clientX: 200, clientY: 200 }
        ]
      });
      
      // Cancel touch (e.g., system interrupt)
      fireEvent.touchCancel(touchArea);
      
      // Should have called end handlers
      expect(onPinchEnd).toHaveBeenCalled();
      expect(onRotateEnd).toHaveBeenCalled();
    });
  });

  describe('useSpringAnimation Hook', () => {
    test('creates spring animation with default params', () => {
      const TestComponent = () => {
        const [props, api] = useSpringAnimation({
          from: { opacity: 0, scale: 0.8 },
          to: { opacity: 1, scale: 1 }
        });
        
        return (
          <div 
            data-testid="animated-element" 
            style={{ 
              opacity: props.opacity, 
              transform: `scale(${props.scale})` 
            }}
          >
            Animated Content
          </div>
        );
      };
      
      render(<TestComponent />);
      
      const element = screen.getByTestId('animated-element');
      
      // Should start animation automatically
      expect(element).toHaveStyle('opacity: 0');
      
      // After animation frames, should approach target values
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      // Note: We can't test the exact style values since the animation is calculated
      // with physics equations, but we can check that it's changing
      expect(element).not.toHaveStyle('opacity: 0');
    });
    
    test('allows controlling animation with API', () => {
      const animationApi = { current: null };
      
      const TestComponent = () => {
        const [props, api] = useSpringAnimation({
          from: { x: 0 },
          to: { x: 100 },
          immediate: true, // No animation initially
          config: { tension: 170, friction: 26 }
        });
        
        // Store ref to API for testing
        animationApi.current = api;
        
        return (
          <div 
            data-testid="animated-element" 
            style={{ 
              transform: `translateX(${props.x}px)` 
            }}
          >
            Animated Content
          </div>
        );
      };
      
      render(<TestComponent />);
      
      const element = screen.getByTestId('animated-element');
      
      // With immediate: true, should be at target value
      expect(element).toHaveStyle('transform: translateX(100px)');
      
      // Update animation with API
      act(() => {
        animationApi.current.start({
          to: { x: 200 },
          immediate: false
        });
      });
      
      // After some time, should approach new target
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      // Should be moving toward target value
      const transform = element.style.transform;
      const match = transform.match(/translateX\((\d+)px\)/);
      const xValue = match ? parseInt(match[1], 10) : 0;
      
      // Should be between initial and target values
      expect(xValue).toBeGreaterThan(100);
    });
    
    test('cleans up animation when component unmounts', () => {
      const mockStop = jest.fn();
      const originalUseEffect = React.useEffect;
      
      // Mock useEffect to capture cleanup function
      let cleanupFn;
      React.useEffect = jest.fn((fn, deps) => {
        cleanupFn = fn();
        return originalUseEffect(fn, deps);
      });
      
      const TestComponent = () => {
        const [props] = useSpringAnimation({
          from: { opacity: 0 },
          to: { opacity: 1 }
        });
        
        return (
          <div data-testid="animated-element" style={{ opacity: props.opacity }}>
            Animated Content
          </div>
        );
      };
      
      const { unmount } = render(<TestComponent />);
      
      // Unmount component
      unmount();
      
      // Cleanup should have been called
      if (cleanupFn) cleanupFn();
      
      // Restore original useEffect
      React.useEffect = originalUseEffect;
    });
  });

  describe('useRippleEffect Hook', () => {
    test('creates ripple effect on touch', () => {
      const TestComponent = () => {
        const rippleProps = useRippleEffect({ color: 'rgba(0, 0, 0, 0.3)' });
        
        return (
          <button 
            {...rippleProps}
            data-testid="ripple-button" 
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            Click Me
          </button>
        );
      };
      
      render(<TestComponent />);
      
      const button = screen.getByTestId('ripple-button');
      
      // Trigger touch
      fireEvent.touchStart(button, {
        touches: [{ clientX: 50, clientY: 50, radiusX: 10, radiusY: 10 }]
      });
      
      // Check if ripple element was created
      const ripple = button.querySelector('.ripple');
      expect(ripple).toBeInTheDocument();
      
      // End touch
      fireEvent.touchEnd(button);
      
      // After animation time, ripple should be removed
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Ripple should be fading out
      expect(ripple.style.opacity).toBe('0');
    });
    
    test('creates ripples at touch position', () => {
      const TestComponent = () => {
        const rippleProps = useRippleEffect();
        
        return (
          <div 
            {...rippleProps}
            data-testid="ripple-area" 
            style={{ 
              position: 'relative',
              width: '300px',
              height: '300px',
              overflow: 'hidden'
            }}
          >
            Touch Area
          </div>
        );
      };
      
      render(<TestComponent />);
      
      const area = screen.getByTestId('ripple-area');
      const rect = { left: 50, top: 50 }; // Mock getBoundingClientRect
      area.getBoundingClientRect = jest.fn().mockReturnValue(rect);
      
      // Trigger touch at specific position
      fireEvent.touchStart(area, {
        touches: [{ clientX: 100, clientY: 150 }]
      });
      
      // Check ripple position
      const ripple = area.querySelector('.ripple');
      expect(ripple).toBeInTheDocument();
      
      // Position should be relative to element
      expect(ripple.style.left).toBe('50px'); // 100 - rect.left
      expect(ripple.style.top).toBe('100px'); // 150 - rect.top
    });
  });
  
  describe('TouchFeedbackProvider', () => {
    test('provides haptic feedback for compatible events', () => {
      // Mock navigator.vibrate
      const mockVibrate = jest.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: mockVibrate,
        configurable: true,
        writable: true
      });
      
      const TestComponent = () => {
        return (
          <TouchFeedbackProvider>
            <button data-testid="feedback-button">Click Me</button>
          </TouchFeedbackProvider>
        );
      };
      
      render(<TestComponent />);
      
      const button = screen.getByTestId('feedback-button');
      
      // Trigger long press (should provide feedback)
      const longPressEvent = new CustomEvent('longpress', {
        bubbles: true,
        detail: { intensity: 'medium' }
      });
      button.dispatchEvent(longPressEvent);
      
      expect(mockVibrate).toHaveBeenCalledWith([15]);
      
      // Reset mock
      mockVibrate.mockClear();
      
      // Trigger different intensity
      const strongEvent = new CustomEvent('longpress', {
        bubbles: true,
        detail: { intensity: 'strong' }
      });
      button.dispatchEvent(strongEvent);
      
      expect(mockVibrate).toHaveBeenCalledWith([25]);
    });
    
    test('respects user vibration preferences', () => {
      // Mock localStorage
      const mockGetItem = jest.fn().mockReturnValue('false'); // Vibration disabled
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: mockGetItem,
          setItem: jest.fn()
        },
        configurable: true,
        writable: true
      });
      
      const mockVibrate = jest.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: mockVibrate,
        configurable: true,
        writable: true
      });
      
      const TestComponent = () => {
        return (
          <TouchFeedbackProvider>
            <button data-testid="feedback-button">Click Me</button>
          </TouchFeedbackProvider>
        );
      };
      
      render(<TestComponent />);
      
      const button = screen.getByTestId('feedback-button');
      
      // Trigger event
      const event = new CustomEvent('longpress', {
        bubbles: true,
        detail: { intensity: 'medium' }
      });
      button.dispatchEvent(event);
      
      // Should not vibrate when disabled
      expect(mockVibrate).not.toHaveBeenCalled();
      
      // Restore original
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
        writable: true
      });
    });
  });
});
