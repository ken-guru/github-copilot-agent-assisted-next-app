import React, { Suspense } from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { lazyWithPreload, useComponentPreloader, measureLoadingPerformance } from '../lazyLoading';

// Mock components for testing
const TestComponent = () => <div data-testid="test-component">Test Content</div>;
const LoadingComponent = () => <div data-testid="loading-component">Loading...</div>;

// Mock performance API
const mockPerformanceNow = jest.fn();
global.performance = {
  now: mockPerformanceNow
};

// Mock React.lazy
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    lazy: jest.fn().mockImplementation((factory) => {
      // Return an object that mimics a lazy component but loads immediately in tests
      return function MockLazyComponent(props) {
        return React.createElement(TestComponent, props);
      };
    })
  };
});

describe('Lazy Loading Utilities', () => {
  beforeEach(() => {
    // Reset mocks
    mockPerformanceNow.mockReset();
    // Mock timing values for consistent tests
    mockPerformanceNow
      .mockReturnValueOnce(100) // Start time
      .mockReturnValueOnce(150); // End time
  });

  test('lazyWithPreload creates a component with preload method', () => {
    // Create a lazy component with preload capability
    const factory = () => import('../TestComponent');
    const LazyComponent = lazyWithPreload(factory);
    
    // Assert the component has a preload method
    expect(typeof LazyComponent.preload).toBe('function');
    
    // Render with Suspense
    render(
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent />
      </Suspense>
    );
    
    // Component should render immediately in test environment
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  test('useComponentPreloader loads components in the background', () => {
    // Create lazy components
    const componentA = lazyWithPreload(() => import('../ComponentA'));
    const componentB = lazyWithPreload(() => import('../ComponentB'));
    
    // Mock the preload methods
    componentA.preload = jest.fn();
    componentB.preload = jest.fn();
    
    // Test Component using the hook
    const TestPreloader = () => {
      const preloadComponents = useComponentPreloader();
      
      return (
        <button 
          data-testid="preload-button" 
          onClick={() => preloadComponents([componentA, componentB])}
        >
          Preload
        </button>
      );
    };
    
    // Render the test component
    const { getByTestId } = render(<TestPreloader />);
    
    // Click the preload button
    act(() => {
      getByTestId('preload-button').click();
    });
    
    // Verify preload methods were called
    expect(componentA.preload).toHaveBeenCalledTimes(1);
    expect(componentB.preload).toHaveBeenCalledTimes(1);
  });

  test('measureLoadingPerformance reports correct loading time', async () => {
    const mockCallback = jest.fn();
    
    // Measure performance of a mock component load
    await measureLoadingPerformance('TestComponent', async () => {
      // Simulate some async work
      await new Promise(resolve => setTimeout(resolve, 0));
      return { default: TestComponent };
    }, mockCallback);
    
    // Verify performance was measured
    expect(mockPerformanceNow).toHaveBeenCalledTimes(2);
    
    // Verify callback received correct information
    expect(mockCallback).toHaveBeenCalledWith({
      componentName: 'TestComponent',
      loadTimeMs: 50, // Mock end time - start time
      timestamp: expect.any(Number)
    });
  });

  test('lazy loaded components handle errors gracefully', () => {
    // Mock console.error to avoid test output noise
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Create a lazy component that will fail to load
    const ErrorComponent = lazyWithPreload(() => Promise.reject(new Error('Failed to load')));
    
    // Create an error boundary for testing
    class TestErrorBoundary extends React.Component {
      state = { hasError: false, error: null };
      
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      
      render() {
        if (this.state.hasError) {
          return <div data-testid="error-state">Error: {this.state.error.message}</div>;
        }
        return this.props.children;
      }
    }
    
    // Render with error boundary
    render(
      <TestErrorBoundary>
        <Suspense fallback={<LoadingComponent />}>
          <ErrorComponent />
        </Suspense>
      </TestErrorBoundary>
    );
    
    // Error should be handled by the error boundary
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByTestId('error-state')).toHaveTextContent('Error: Failed to load');
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});
