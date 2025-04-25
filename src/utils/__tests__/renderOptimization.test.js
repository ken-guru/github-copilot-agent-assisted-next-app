import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  useMemoizedValue,
  useStableCallback, 
  useDebouncedValue,
  useThrottledCallback,
  usePreventUnnecessaryRenders,
  measureRenderTime
} from '../renderOptimization';

describe('Rendering Optimization Utilities', () => {
  // Mock performance.now for consistent test results
  let mockNow = 0;
  const originalPerformanceNow = performance.now;
  
  beforeAll(() => {
    performance.now = jest.fn(() => mockNow);
  });
  
  afterAll(() => {
    performance.now = originalPerformanceNow;
  });
  
  beforeEach(() => {
    mockNow = 0;
    jest.clearAllMocks();
  });

  describe('useMemoizedValue', () => {
    test('memoizes values correctly', () => {
      const renderSpy = jest.fn();
      
      // Test component using our hook
      const TestComponent = ({ value, deps }) => {
        const memoized = useMemoizedValue(value, deps);
        renderSpy(memoized);
        return <div>{memoized}</div>;
      };
      
      // Initial render
      const { rerender } = render(<TestComponent value="test" deps={["a"]} />);
      expect(renderSpy).toHaveBeenCalledWith("test");
      
      // Rerender with same deps - should use memoized value
      renderSpy.mockClear();
      rerender(<TestComponent value="test" deps={["a"]} />);
      expect(renderSpy).toHaveBeenCalledWith("test");
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Rerender with different deps - should recalculate
      renderSpy.mockClear();
      rerender(<TestComponent value="test" deps={["b"]} />);
      expect(renderSpy).toHaveBeenCalledWith("test");
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Rerender with different value, same deps - should recalculate
      renderSpy.mockClear();
      rerender(<TestComponent value="changed" deps={["b"]} />);
      expect(renderSpy).toHaveBeenCalledWith("changed");
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
    
    test('handles complex objects correctly', () => {
      const complexObject = { nested: { value: 'test' }};
      const renderSpy = jest.fn();
      
      const TestComponent = ({ obj, deps }) => {
        const memoized = useMemoizedValue(obj, deps);
        renderSpy(memoized);
        return <div>{memoized.nested.value}</div>;
      };
      
      const { rerender } = render(<TestComponent obj={complexObject} deps={[1]} />);
      expect(renderSpy).toHaveBeenCalledWith(complexObject);
      
      renderSpy.mockClear();
      // Same reference should be memoized
      rerender(<TestComponent obj={complexObject} deps={[1]} />);
      expect(renderSpy).toHaveBeenCalledWith(complexObject);
      
      renderSpy.mockClear();
      // New reference with same values should be different
      const newObject = { nested: { value: 'test' }};
      rerender(<TestComponent obj={newObject} deps={[2]} />);
      expect(renderSpy).toHaveBeenCalledWith(newObject);
      expect(renderSpy.mock.calls[0][0]).not.toBe(complexObject);
    });
  });

  describe('useStableCallback', () => {
    test('provides a stable callback reference', () => {
      const referenceSpy = jest.fn();
      
      const TestComponent = ({ callback }) => {
        const stableCallback = useStableCallback(callback);
        React.useEffect(() => {
          referenceSpy(stableCallback);
        }, [stableCallback]);
        
        return <button onClick={stableCallback}>Click me</button>;
      };
      
      const callback1 = () => console.log('callback1');
      const { rerender } = render(<TestComponent callback={callback1} />);
      
      const firstReference = referenceSpy.mock.calls[0][0];
      expect(typeof firstReference).toBe('function');
      
      referenceSpy.mockClear();
      const callback2 = () => console.log('callback2');
      rerender(<TestComponent callback={callback2} />);
      
      // Effect should not run again because reference is stable
      expect(referenceSpy).not.toHaveBeenCalled();
      
      // The stable callback should wrap the new function
      const button = screen.getByRole('button');
      const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      act(() => {
        button.click();
      });
      
      expect(mockConsoleLog).toHaveBeenCalledWith('callback2');
      mockConsoleLog.mockRestore();
    });
  });
  
  describe('useDebouncedValue', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    test('debounces changing values', () => {
      const renderSpy = jest.fn();
      
      const TestComponent = ({ value }) => {
        const debouncedValue = useDebouncedValue(value, 300);
        renderSpy(debouncedValue);
        return <div>{debouncedValue}</div>;
      };
      
      const { rerender } = render(<TestComponent value="initial" />);
      expect(renderSpy).toHaveBeenLastCalledWith("initial");
      
      // Change value multiple times
      rerender(<TestComponent value="change1" />);
      expect(renderSpy).toHaveBeenLastCalledWith("initial"); // Still initial
      
      rerender(<TestComponent value="change2" />);
      expect(renderSpy).toHaveBeenLastCalledWith("initial"); // Still initial
      
      rerender(<TestComponent value="final" />);
      expect(renderSpy).toHaveBeenLastCalledWith("initial"); // Still initial
      
      // After delay, should update to final value
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(renderSpy).toHaveBeenLastCalledWith("final");
    });
    
    test('applies immediate flag correctly', () => {
      const renderSpy = jest.fn();
      
      const TestComponent = ({ value }) => {
        const debouncedValue = useDebouncedValue(value, 300, true); // immediate=true
        renderSpy(debouncedValue);
        return <div>{debouncedValue}</div>;
      };
      
      // Should show first value immediately
      const { rerender } = render(<TestComponent value="first" />);
      expect(renderSpy).toHaveBeenLastCalledWith("first");
      
      // Change should be delayed
      rerender(<TestComponent value="second" />);
      expect(renderSpy).toHaveBeenLastCalledWith("first");
      
      // After delay, should update
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(renderSpy).toHaveBeenLastCalledWith("second");
    });
  });
  
  describe('useThrottledCallback', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    test('throttles callback execution', () => {
      const callbackSpy = jest.fn();
      
      const TestComponent = () => {
        const throttledCallback = useThrottledCallback(callbackSpy, 100);
        
        return (
          <button 
            data-testid="throttled-button" 
            onClick={() => throttledCallback('test')}
          >
            Click me
          </button>
        );
      };
      
      render(<TestComponent />);
      const button = screen.getByTestId('throttled-button');
      
      // First click executes immediately
      act(() => {
        button.click();
      });
      expect(callbackSpy).toHaveBeenCalledTimes(1);
      expect(callbackSpy).toHaveBeenCalledWith('test');
      
      callbackSpy.mockClear();
      
      // Multiple clicks within throttle time
      act(() => {
        button.click();
        button.click();
        button.click();
      });
      
      // Should not call immediately
      expect(callbackSpy).not.toHaveBeenCalled();
      
      // After throttle time, should call once
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      expect(callbackSpy).toHaveBeenCalledTimes(1);
      expect(callbackSpy).toHaveBeenCalledWith('test');
    });
    
    test('accepts leading=false option', () => {
      const callbackSpy = jest.fn();
      
      const TestComponent = () => {
        const throttledCallback = useThrottledCallback(callbackSpy, 100, { leading: false });
        
        return (
          <button 
            data-testid="throttled-button" 
            onClick={() => throttledCallback('test')}
          >
            Click me
          </button>
        );
      };
      
      render(<TestComponent />);
      const button = screen.getByTestId('throttled-button');
      
      // First click should not execute immediately with leading=false
      act(() => {
        button.click();
      });
      expect(callbackSpy).not.toHaveBeenCalled();
      
      // After throttle time, should call
      act(() => {
        jest.advanceTimersByTime(100);
      });
      
      expect(callbackSpy).toHaveBeenCalledTimes(1);
      expect(callbackSpy).toHaveBeenCalledWith('test');
    });
  });
  
  describe('usePreventUnnecessaryRenders', () => {
    test('prevents renders when props have not meaningfully changed', () => {
      const renderSpy = jest.fn();
      
      // Create a memoized component using our utility
      const MemoizedComponent = usePreventUnnecessaryRenders(({ a, b, onAction }) => {
        renderSpy(a, b);
        return (
          <div>
            <span>Value: {a}</span>
            <button onClick={onAction}>Action</button>
          </div>
        );
      }, ['a', 'b']);
      
      // Wrapper component that will re-render frequently
      const WrapperComponent = ({ a, b, onChange }) => {
        const [count, setCount] = React.useState(0);
        
        // Force a re-render of wrapper
        React.useEffect(() => {
          const timer = setInterval(() => setCount(c => c + 1), 100);
          return () => clearInterval(timer);
        }, []);
        
        return (
          <div data-testid="count">{count}
            <MemoizedComponent a={a} b={b} onAction={onChange} />
          </div>
        );
      };
      
      const mockOnChange = jest.fn();
      const { rerender } = render(<WrapperComponent a={1} b={2} onChange={mockOnChange} />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(renderSpy).toHaveBeenCalledWith(1, 2);
      
      renderSpy.mockClear();
      
      // Force parent re-render with same props
      rerender(<WrapperComponent a={1} b={2} onChange={mockOnChange} />);
      
      // Our component should not re-render
      expect(renderSpy).not.toHaveBeenCalled();
      
      // Change a tracked prop
      rerender(<WrapperComponent a={3} b={2} onChange={mockOnChange} />);
      
      // Now it should re-render
      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(renderSpy).toHaveBeenCalledWith(3, 2);
      
      // Even with different function reference, should not re-render
      renderSpy.mockClear();
      const newMockOnChange = jest.fn();
      rerender(<WrapperComponent a={3} b={2} onChange={newMockOnChange} />);
      
      // Should not re-render since onAction is not in tracked props
      expect(renderSpy).not.toHaveBeenCalled();
    });
  });
  
  describe('measureRenderTime', () => {
    test('measures component render time', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      mockNow = 100;
      const stopMeasuring = measureRenderTime('TestComponent');
      
      // Simulate some time passing
      mockNow = 150;
      
      const duration = stopMeasuring();
      
      expect(duration).toBe(50);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('TestComponent rendered in 50ms')
      );
      
      consoleLogSpy.mockRestore();
    });
  });
});
