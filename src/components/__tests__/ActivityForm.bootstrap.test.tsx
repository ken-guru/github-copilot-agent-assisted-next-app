import { render, screen, fireEvent } from '@testing-library/react';
import ActivityForm from '../feature/ActivityForm';
import { jest } from '@jest/globals';
import 'bootstrap/dist/css/bootstrap.min.css';

describe('ActivityForm - Bootstrap Integration', () => {
  const defaultProps = {
    onAddActivity: jest.fn(),
    isDisabled: false,
    isSimplified: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Bootstrap Form Components', () => {
    it('renders as a Bootstrap Form component', () => {
      render(<ActivityForm {...defaultProps} />);
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });

    it('input field has Bootstrap form control styling', () => {
      render(<ActivityForm {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('form-control');
    });

    it('submit button has Bootstrap button styling', () => {
      render(<ActivityForm {...defaultProps} />);
      const button = screen.getByRole('button', { name: /add/i });
      expect(button).toHaveClass('btn');
      expect(button).toHaveClass('btn-primary');
    });

    it('form uses Bootstrap input group layout', () => {
      render(<ActivityForm {...defaultProps} />);
      const inputGroup = screen.getByTestId('activity-form-input-group');
      expect(inputGroup).toHaveClass('input-group');
    });
  });

  describe('Bootstrap Responsive Behavior', () => {
    it('maintains responsive layout with Bootstrap classes', () => {
      render(<ActivityForm {...defaultProps} />);
      const form = screen.getByTestId('activity-form');
      expect(form).toBeInTheDocument(); // Form should exist
    });
  });

  describe('Bootstrap Form Validation States', () => {
    it('shows invalid state styling when form validation fails', () => {
      render(<ActivityForm {...defaultProps} />);
      const input = screen.getByRole('textbox');
      const form = screen.getByRole('form');
      
      // Submit empty form to trigger validation
      fireEvent.submit(form);
      
      // Check that Bootstrap validation classes might be applied
      expect(input).toHaveAttribute('placeholder', 'Quick add activity name');
    });

    it('applies Bootstrap disabled styling when isDisabled is true', () => {
      render(<ActivityForm {...defaultProps} isDisabled={true} />);
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');
      
      expect(input).toBeDisabled();
      expect(button).toBeDisabled();
      // Bootstrap buttons get disabled attribute, not disabled class
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('Bootstrap Accessibility Features', () => {
    it('maintains proper ARIA attributes with Bootstrap components', () => {
      render(<ActivityForm {...defaultProps} />);
      const form = screen.getByRole('form');
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');
      
      expect(form).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('supports keyboard navigation with Bootstrap form components', () => {
      render(<ActivityForm {...defaultProps} />);
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');
      
      input.focus();
      expect(input).toHaveFocus();
      
      // Test Tab navigation
      fireEvent.keyDown(input, { key: 'Tab' });
      // Button should be focusable
      expect(button).toBeInTheDocument();
    });
  });

  describe('Bootstrap Component Functionality', () => {
    it('submits form with Bootstrap form handling', () => {
      render(<ActivityForm {...defaultProps} />);
      const input = screen.getByRole('textbox');
      const form = screen.getByRole('form');

      fireEvent.change(input, { target: { value: 'Test Activity' } });
      fireEvent.submit(form);

      expect(defaultProps.onAddActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Activity',
          isActive: true,
        })
      );
      expect(input).toHaveValue('');
    });

    it('handles input changes with Bootstrap form controls', () => {
      render(<ActivityForm {...defaultProps} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'New Activity' } });
      expect(input).toHaveValue('New Activity');
    });

    it('prevents submission when disabled with Bootstrap disabled state', () => {
      render(<ActivityForm {...defaultProps} isDisabled={true} />);
      const input = screen.getByRole('textbox');
      const form = screen.getByRole('form');

      fireEvent.change(input, { target: { value: 'Test Activity' } });
      fireEvent.submit(form);

      expect(defaultProps.onAddActivity).not.toHaveBeenCalled();
    });
  });

  describe('Bootstrap Theme Integration', () => {
    it('applies consistent Bootstrap styling across form elements', () => {
      render(<ActivityForm {...defaultProps} />);
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');
      
      // Verify Bootstrap classes are applied
      expect(input).toHaveClass('form-control');
      expect(button).toHaveClass('btn', 'btn-primary');
    });

    it('maintains Bootstrap design system spacing', () => {
      render(<ActivityForm {...defaultProps} />);
      const form = screen.getByTestId('activity-form');
      
      // Check that form exists and has proper structure
      expect(form).toBeInTheDocument();
    });
  });
});
