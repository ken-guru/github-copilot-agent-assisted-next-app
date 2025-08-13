import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/ToastContainer';

// Mock component to trigger toasts for testing
function TestComponent() {
  const { addToast } = useToast();
  
  return (
    <div>
      <button 
        onClick={() => addToast({ message: 'Success message', variant: 'success' })}
        data-testid="add-success-toast"
      >
        Add Success Toast
      </button>
      <button 
        onClick={() => addToast({ message: 'Error message', variant: 'error' })}
        data-testid="add-error-toast"
      >
        Add Error Toast
      </button>
      <button 
        onClick={() => addToast({ message: 'Warning message', variant: 'warning' })}
        data-testid="add-warning-toast"
      >
        Add Warning Toast
      </button>
      <button 
        onClick={() => addToast({ message: 'Info message', variant: 'info' })}
        data-testid="add-info-toast"
      >
        Add Info Toast
      </button>
      <button 
        onClick={() => addToast({ 
          message: 'Persistent message', 
          variant: 'warning', 
          persistent: true 
        })}
        data-testid="add-persistent-toast"
      >
        Add Persistent Toast
      </button>
    </div>
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}

describe('ToastContainer', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('should render empty container when no toasts', () => {
    render(
      <TestWrapper>
        <div>No toasts</div>
      </TestWrapper>
    );

    expect(screen.queryByTestId('toast-container')).not.toBeInTheDocument();
  });

  it('should display success toast with correct styling and icon', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-success-toast'));

    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    expect(screen.getByTestId('toast-notification')).toBeInTheDocument();
    expect(screen.getByTestId('toast-notification')).toHaveAttribute('data-variant', 'success');
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Success message');
    expect(screen.getByTestId('toast-notification')).toHaveClass('bg-success');
    
    // Check for success icon
    const icon = screen.getByTestId('toast-notification').querySelector('.bi-check-circle');
    expect(icon).toBeInTheDocument();
  });

  it('should display error toast with correct styling and icon', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-error-toast'));

    expect(screen.getByTestId('toast-notification')).toHaveAttribute('data-variant', 'error');
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Error message');
    expect(screen.getByTestId('toast-notification')).toHaveClass('bg-danger');
    
    // Check for error icon
    const icon = screen.getByTestId('toast-notification').querySelector('.bi-exclamation-circle');
    expect(icon).toBeInTheDocument();
  });

  it('should display warning toast with correct styling and icon', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-warning-toast'));

    expect(screen.getByTestId('toast-notification')).toHaveAttribute('data-variant', 'warning');
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Warning message');
    expect(screen.getByTestId('toast-notification')).toHaveClass('bg-warning');
    
    // Check for warning icon
    const icon = screen.getByTestId('toast-notification').querySelector('.bi-exclamation-triangle');
    expect(icon).toBeInTheDocument();
  });

  it('should display info toast with correct styling and icon', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-info-toast'));

    expect(screen.getByTestId('toast-notification')).toHaveAttribute('data-variant', 'info');
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Info message');
    expect(screen.getByTestId('toast-notification')).toHaveClass('bg-info');
    
    // Check for info icon
    const icon = screen.getByTestId('toast-notification').querySelector('.bi-info-circle');
    expect(icon).toBeInTheDocument();
  });

  it('should auto-dismiss toast after default duration (5 seconds)', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-success-toast'));
    expect(screen.getByTestId('toast-notification')).toBeInTheDocument();

    // Fast-forward 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('toast-notification')).not.toBeInTheDocument();
    });
  });

  it('should allow manual dismissal via close button', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-success-toast'));
    expect(screen.getByTestId('toast-notification')).toBeInTheDocument();

    const closeButton = screen.getByTestId('toast-close-button');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('toast-notification')).not.toBeInTheDocument();
    });
  });

  it('should not auto-dismiss persistent toasts', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-persistent-toast'));
    expect(screen.getByTestId('toast-notification')).toBeInTheDocument();

    // Fast-forward well beyond the auto-dismiss time
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Toast should still be there
    expect(screen.getByTestId('toast-notification')).toBeInTheDocument();
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Persistent message');
  });

  it('should handle multiple toasts simultaneously', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-success-toast'));
    fireEvent.click(screen.getByTestId('add-error-toast'));
    fireEvent.click(screen.getByTestId('add-warning-toast'));

    const toasts = screen.getAllByTestId('toast-notification');
    expect(toasts).toHaveLength(3);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should position toast container correctly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-success-toast'));

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveClass('position-fixed');
    expect(container).toHaveStyle({ zIndex: '1055' });
  });

  it('should provide proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-success-toast'));

    const closeButton = screen.getByTestId('toast-close-button');
    expect(closeButton).toHaveAttribute('aria-label', 'Close notification');
    
    const icon = screen.getByTestId('toast-notification').querySelector('i');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('should handle rapid toast additions without errors', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Add multiple toasts rapidly
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByTestId('add-success-toast'));
    }

    const toasts = screen.getAllByTestId('toast-notification');
    expect(toasts).toHaveLength(5);
  });
});
