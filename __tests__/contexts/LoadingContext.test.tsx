import React from 'react';
import { render, act } from '@testing-library/react';
import { LoadingProvider, LoadingContext } from '../../contexts/LoadingContext';
import { useLoading } from '../../contexts/useLoading';

// Test component that uses the loading context
const TestComponent = () => {
  const { isLoading, setIsLoading } = useLoading();
  
  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <button 
        onClick={() => setIsLoading(false)}
        data-testid="finish-loading-button"
      >
        Finish Loading
      </button>
      <button 
        onClick={() => setIsLoading(true)}
        data-testid="start-loading-button"
      >
        Start Loading
      </button>
    </div>
  );
};

describe('LoadingContext', () => {
  it('provides loading state and update function', () => {
    const { getByTestId } = render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    );
    
    // Default state should be loading
    expect(getByTestId('loading-state')).toHaveTextContent('Loading');
    
    // Change loading state
    act(() => {
      getByTestId('finish-loading-button').click();
    });
    
    expect(getByTestId('loading-state')).toHaveTextContent('Not Loading');
    
    // Change back to loading
    act(() => {
      getByTestId('start-loading-button').click();
    });
    
    expect(getByTestId('loading-state')).toHaveTextContent('Loading');
  });
  
  it('throws error when used outside of LoadingProvider', () => {
    // Suppress console.error for this test as we expect an error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useLoading must be used within a LoadingProvider');
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('has Provider, Consumer, and $$typeof properties', () => {
    expect(LoadingContext).toHaveProperty('Provider');
    expect(LoadingContext).toHaveProperty('Consumer');
    expect(LoadingContext).toHaveProperty('$$typeof');
  });
});
