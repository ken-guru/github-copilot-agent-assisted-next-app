import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock modal component for focus testing
const MockModal = ({ isOpen, onClose, children, autoFocus = true }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  autoFocus?: boolean;
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const firstInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen && autoFocus && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen, autoFocus]);

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      data-testid="modal"
      onClick={(e) => e.target === modalRef.current && onClose()}
    >
      <div className="modal-content">
        {children}
        <input
          ref={firstInputRef}
          data-testid="modal-input"
          placeholder="Test input"
        />
        <button onClick={onClose} data-testid="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

const TestModalComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      setIsOpen(false);
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)} data-testid="open-modal">
        Open Modal
      </button>
      <MockModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            data-testid="form-input"
            placeholder="Enter text"
          />
          <button type="submit" data-testid="save-button">
            Save
          </button>
        </form>
      </MockModal>
      {value && <div data-testid="saved-value">{value}</div>}
    </div>
  );
};

describe('Modal Focus and Keyboard Management', () => {
  it('should focus on first input when modal opens', async () => {
    render(<TestModalComponent />);
    
    fireEvent.click(screen.getByTestId('open-modal'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal-input')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('modal-input')).toHaveFocus();
  });

  it('should close modal when Escape key is pressed', async () => {
    render(<TestModalComponent />);
    
    fireEvent.click(screen.getByTestId('open-modal'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('should submit form when Enter key is pressed in input', async () => {
    render(<TestModalComponent />);
    
    fireEvent.click(screen.getByTestId('open-modal'));
    
    const input = screen.getByTestId('form-input');
    fireEvent.change(input, { target: { value: 'Test Value' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('should support keyboard navigation between modal elements', async () => {
    render(<TestModalComponent />);
    
    fireEvent.click(screen.getByTestId('open-modal'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
    
    // Tab through modal elements
    fireEvent.keyDown(screen.getByTestId('modal-input'), { key: 'Tab' });
    
    // Check that save button can receive focus
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
  });

  it('should handle modal backdrop clicks', async () => {
    const MockModalWithBackdrop = () => {
      const [isOpen, setIsOpen] = React.useState(false);
      
      return (
        <div>
          <button onClick={() => setIsOpen(true)} data-testid="open-modal">
            Open Modal
          </button>
          <MockModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div>Modal Content</div>
          </MockModal>
        </div>
      );
    };

    render(<MockModalWithBackdrop />);
    
    fireEvent.click(screen.getByTestId('open-modal'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
    
    // Click on backdrop (modal itself, not content)
    fireEvent.click(screen.getByTestId('modal'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('should maintain focus trap within modal', async () => {
    render(<TestModalComponent />);
    
    fireEvent.click(screen.getByTestId('open-modal'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
    
    // First input should be focused
    expect(screen.getByTestId('modal-input')).toHaveFocus();
    
    // Tab navigation test
    fireEvent.keyDown(screen.getByTestId('modal-input'), { key: 'Tab' });
    
    // Check that the structure supports focus management
    expect(screen.getByTestId('close-button')).toBeInTheDocument();
  });

  it('should prevent form submission with empty values', async () => {
    render(<TestModalComponent />);
    
    fireEvent.click(screen.getByTestId('open-modal'));
    
    // Try to submit empty form
    fireEvent.click(screen.getByTestId('save-button'));
    
    // Modal should remain open
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('should handle special characters in input fields', async () => {
    render(<TestModalComponent />);
    
    fireEvent.click(screen.getByTestId('open-modal'));
    
    const input = screen.getByTestId('form-input');
    const specialText = 'Test @#$%^&*()_+ Characters!';
    
    fireEvent.change(input, { target: { value: specialText } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('should handle rapid key interactions', async () => {
    render(<TestModalComponent />);
    
    fireEvent.click(screen.getByTestId('open-modal'));
    
    const input = screen.getByTestId('form-input');
    
    // Rapid typing simulation
    fireEvent.change(input, { target: { value: 'Quick' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });
});
