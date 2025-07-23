import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider, useToast } from '@/contexts/ToastContext';

// Test component to interact with the toast context
function TestComponent() {
  const { toasts, addToast, removeToast, clearAllToasts } = useToast();

  return (
    <div>
      <div data-testid="toast-count">{toasts.length}</div>
      <div data-testid="toast-list">
        {toasts.map(toast => (
          <div key={toast.id} data-testid={`toast-${toast.id}`}>
            {toast.message} - {toast.variant}
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => addToast({ message: 'Test message', variant: 'success' })}
        data-testid="add-toast"
      >
        Add Toast
      </button>
      
      <button 
        onClick={() => addToast({ 
          message: 'Custom toast', 
          variant: 'warning',
          duration: 2000,
          autoDismiss: false
        })}
        data-testid="add-custom-toast"
      >
        Add Custom Toast
      </button>
      
      <button 
        onClick={() => addToast({ 
          message: 'Persistent toast', 
          variant: 'info',
          persistent: true
        })}
        data-testid="add-persistent-toast"
      >
        Add Persistent Toast
      </button>
      
      <button 
        onClick={() => {
          if (toasts.length > 0 && toasts[0]) {
            removeToast(toasts[0].id);
          }
        }}
        data-testid="remove-first-toast"
      >
        Remove First Toast
      </button>
      
      <button 
        onClick={clearAllToasts}
        data-testid="clear-all-toasts"
      >
        Clear All Toasts
      </button>
    </div>
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}

describe('ToastContext', () => {
  it('should provide empty toast list initially', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('should add toast with default configuration', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-toast'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByTestId('toast-list')).toHaveTextContent('Test message - success');
  });

  it('should add toast with custom configuration', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-custom-toast'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByTestId('toast-list')).toHaveTextContent('Custom toast - warning');
  });

  it('should generate unique IDs for each toast', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-toast'));
    fireEvent.click(screen.getByTestId('add-toast'));
    fireEvent.click(screen.getByTestId('add-toast'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
    
    const toastElements = screen.getByTestId('toast-list').children;
    const ids = Array.from(toastElements).map(el => el.getAttribute('data-testid'));
    
    // All IDs should be unique
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(3);
  });

  it('should handle persistent toast configuration', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-persistent-toast'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByTestId('toast-list')).toHaveTextContent('Persistent toast - info');
  });

  it('should remove specific toast by ID', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Add multiple toasts
    fireEvent.click(screen.getByTestId('add-toast'));
    fireEvent.click(screen.getByTestId('add-custom-toast'));
    
    expect(screen.getByTestId('toast-count')).toHaveTextContent('2');

    // Remove first toast
    fireEvent.click(screen.getByTestId('remove-first-toast'));
    
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByTestId('toast-list')).toHaveTextContent('Custom toast - warning');
  });

  it('should clear all toasts', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Add multiple toasts
    fireEvent.click(screen.getByTestId('add-toast'));
    fireEvent.click(screen.getByTestId('add-custom-toast'));
    fireEvent.click(screen.getByTestId('add-persistent-toast'));
    
    expect(screen.getByTestId('toast-count')).toHaveTextContent('3');

    // Clear all
    fireEvent.click(screen.getByTestId('clear-all-toasts'));
    
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('should return toast ID when adding toast', () => {
    const TestComponentWithId = () => {
      const { addToast } = useToast();
      const [lastToastId, setLastToastId] = React.useState<string>('');

      return (
        <div>
          <button
            onClick={() => {
              const id = addToast({ message: 'Test', variant: 'success' });
              setLastToastId(id);
            }}
            data-testid="add-and-track-toast"
          >
            Add Toast
          </button>
          <div data-testid="last-toast-id">{lastToastId}</div>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponentWithId />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-and-track-toast'));

    const toastId = screen.getByTestId('last-toast-id').textContent;
    expect(toastId).toBeTruthy();
    expect(toastId).toMatch(/^toast-\d+-[a-z0-9]+$/);
  });

  it('should handle invalid toast removal gracefully', () => {
    const TestComponentWithInvalidRemove = () => {
      const { toasts, addToast, removeToast } = useToast();

      return (
        <div>
          <div data-testid="toast-count">{toasts.length}</div>
          <button
            onClick={() => addToast({ message: 'Test', variant: 'success' })}
            data-testid="add-toast"
          >
            Add Toast
          </button>
          <button
            onClick={() => removeToast('non-existent-id')}
            data-testid="remove-invalid-toast"
          >
            Remove Invalid Toast
          </button>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponentWithInvalidRemove />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-toast'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    // Try to remove non-existent toast - should not crash or affect existing toasts
    fireEvent.click(screen.getByTestId('remove-invalid-toast'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
  });

  it('should throw error when useToast is used outside ToastProvider', () => {
    const TestComponentOutsideProvider = () => {
      useToast(); // This should throw
      return <div>This should throw</div>;
    };

    // Capture console.error to avoid test noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponentOutsideProvider />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });

  it('should preserve toast order (FIFO)', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Add toasts in specific order
    fireEvent.click(screen.getByTestId('add-toast')); // "Test message"
    fireEvent.click(screen.getByTestId('add-custom-toast')); // "Custom toast"
    fireEvent.click(screen.getByTestId('add-persistent-toast')); // "Persistent toast"

    const toastList = screen.getByTestId('toast-list');
    const messages = toastList.textContent;
    
    // Should appear in the order they were added
    expect(messages?.indexOf('Test message')).toBeLessThan(messages?.indexOf('Custom toast') || 0);
    expect(messages?.indexOf('Custom toast')).toBeLessThan(messages?.indexOf('Persistent toast') || 0);
  });
});
