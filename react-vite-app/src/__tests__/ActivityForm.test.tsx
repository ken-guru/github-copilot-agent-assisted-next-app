import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActivityForm from '../components/activity/ActivityForm';

describe('ActivityForm', () => {
  const mockOnAddActivity = vi.fn();
  const defaultProps = {
    onAddActivity: mockOnAddActivity,
    isDisabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders form with correct elements', () => {
      render(<ActivityForm {...defaultProps} />);
      
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByLabelText(/activity name/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add activity/i })).toBeInTheDocument();
    });

    it('renders with proper accessibility attributes', () => {
      render(<ActivityForm {...defaultProps} />);
      
      const form = screen.getByRole('form');
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      expect(form).toHaveAttribute('noValidate');
      expect(input).toHaveAttribute('aria-describedby');
      expect(input).toHaveAttribute('required');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('displays correct placeholder text when enabled', () => {
      render(<ActivityForm {...defaultProps} />);
      
      expect(screen.getByPlaceholderText(/enter activity name/i)).toBeInTheDocument();
    });

    it('displays disabled state placeholder when disabled', () => {
      render(<ActivityForm {...defaultProps} isDisabled={true} />);
      
      expect(screen.getByPlaceholderText(/form is disabled/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('prevents submission with empty input', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /add activity/i });
      await user.click(button);
      
      expect(mockOnAddActivity).not.toHaveBeenCalled();
      expect(screen.getByText(/activity name is required/i)).toBeInTheDocument();
    });

    it('prevents submission with whitespace-only input', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '   ');
      await user.click(screen.getByRole('button', { name: /add activity/i }));
      
      expect(mockOnAddActivity).not.toHaveBeenCalled();
      expect(screen.getByText(/activity name is required/i)).toBeInTheDocument();
    });

    it('shows error for activity name that is too short', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'a');
      await user.click(screen.getByRole('button', { name: /add activity/i }));
      
      expect(mockOnAddActivity).not.toHaveBeenCalled();
      expect(screen.getByText(/activity name must be at least 2 characters/i)).toBeInTheDocument();
    });

    it('shows error for activity name that is too long', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const longName = 'a'.repeat(101); // Assuming max length is 100
      await user.type(input, longName);
      await user.click(screen.getByRole('button', { name: /add activity/i }));
      
      expect(mockOnAddActivity).not.toHaveBeenCalled();
      expect(screen.getByText(/activity name must be 100 characters or less/i)).toBeInTheDocument();
    });

    it('clears validation errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      // Trigger validation error
      const button = screen.getByRole('button', { name: /add activity/i });
      await user.click(button);
      expect(screen.getByText(/activity name is required/i)).toBeInTheDocument();
      
      // Start typing to clear error
      const input = screen.getByRole('textbox');
      await user.type(input, 'Test');
      
      expect(screen.queryByText(/activity name is required/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits valid activity name', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Test Activity');
      await user.click(screen.getByRole('button', { name: /add activity/i }));
      
      expect(mockOnAddActivity).toHaveBeenCalledWith('Test Activity');
      expect(mockOnAddActivity).toHaveBeenCalledTimes(1);
    });

    it('trims whitespace from activity name before submission', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '  Test Activity  ');
      await user.click(screen.getByRole('button', { name: /add activity/i }));
      
      expect(mockOnAddActivity).toHaveBeenCalledWith('Test Activity');
    });

    it('clears input after successful submission', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Test Activity');
      await user.click(screen.getByRole('button', { name: /add activity/i }));
      
      expect(input).toHaveValue('');
    });

    it('submits form using Enter key', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Test Activity');
      await user.keyboard('{Enter}');
      
      expect(mockOnAddActivity).toHaveBeenCalledWith('Test Activity');
    });

    it('shows loading state during submission', async () => {
      const mockSlowAdd = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      render(<ActivityForm {...defaultProps} onAddActivity={mockSlowAdd} />);
      
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add activity/i });
      
      await userEvent.type(input, 'Test Activity');
      fireEvent.click(button);
      
      expect(button).toBeDisabled();
      expect(screen.getByText(/adding.../i)).toBeInTheDocument();
      
      await waitFor(() => {
        expect(button).not.toBeDisabled();
        expect(screen.queryByText(/adding.../i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Disabled State', () => {
    it('disables all form elements when isDisabled is true', () => {
      render(<ActivityForm {...defaultProps} isDisabled={true} />);
      
      expect(screen.getByRole('textbox')).toBeDisabled();
      expect(screen.getByRole('button', { name: /add activity/i })).toBeDisabled();
    });

    it('prevents submission when disabled', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} isDisabled={true} />);
      
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add activity/i });
      
      // Try to interact with disabled elements
      await user.type(input, 'Test Activity');
      await user.click(button);
      
      expect(mockOnAddActivity).not.toHaveBeenCalled();
      expect(input).toHaveValue(''); // Input should remain empty when disabled
    });

    it('shows appropriate disabled styling', () => {
      render(<ActivityForm {...defaultProps} isDisabled={true} />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveClass('disabled');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports tab navigation', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add activity/i });
      
      await user.tab();
      expect(input).toHaveFocus();
      
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('supports Escape key to clear input', async () => {
      const user = userEvent.setup();
      render(<ActivityForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Test Activity');
      expect(input).toHaveValue('Test Activity');
      
      await user.keyboard('{Escape}');
      expect(input).toHaveValue('');
    });
  });

  describe('Error Handling', () => {
    it('displays error message when submission fails', async () => {
      const mockFailingAdd = vi.fn().mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup();
      
      render(<ActivityForm {...defaultProps} onAddActivity={mockFailingAdd} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Test Activity');
      await user.click(screen.getByRole('button', { name: /add activity/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/failed to add activity/i)).toBeInTheDocument();
      });
    });

    it('allows retry after error', async () => {
      const mockAdd = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      
      render(<ActivityForm {...defaultProps} onAddActivity={mockAdd} />);
      
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add activity/i });
      
      // First attempt - fails
      await user.type(input, 'Test Activity');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to add activity/i)).toBeInTheDocument();
      });
      
      // Second attempt - succeeds
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.queryByText(/failed to add activity/i)).not.toBeInTheDocument();
        expect(input).toHaveValue('');
      });
    });
  });

  describe('Component Integration', () => {
    it('accepts and respects additional props', () => {
      render(
        <ActivityForm 
          {...defaultProps} 
          className="custom-class"
          data-testid="custom-form"
        />
      );
      
      const form = screen.getByTestId('custom-form');
      expect(form).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<ActivityForm {...defaultProps} ref={ref} />);
      
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLFormElement));
    });
  });
});
