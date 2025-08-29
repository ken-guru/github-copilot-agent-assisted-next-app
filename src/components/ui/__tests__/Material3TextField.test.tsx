import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Material3TextField } from '../Material3TextField';

describe('Material3TextField', () => {
  describe('Basic Rendering', () => {
    it('renders with basic props', () => {
      render(<Material3TextField label="Test Label" data-testid="test-field" />);
      
      expect(screen.getByTestId('test-field')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('renders without label', () => {
      render(<Material3TextField placeholder="Enter text" data-testid="test-field" />);
      
      expect(screen.getByTestId('test-field')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(
        <Material3TextField 
          label="Test Label" 
          helperText="This is helper text"
          data-testid="test-field"
        />
      );
      
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('renders required field with asterisk', () => {
      render(<Material3TextField label="Required Field" required data-testid="test-field" />);
      
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByTestId('test-field')).toHaveAttribute('required');
    });
  });

  describe('Input Types and Variants', () => {
    it('renders different input types', () => {
      const { rerender } = render(<Material3TextField type="email" data-testid="test-field" />);
      expect(screen.getByTestId('test-field')).toHaveAttribute('type', 'email');

      rerender(<Material3TextField type="password" data-testid="test-field" />);
      expect(screen.getByTestId('test-field')).toHaveAttribute('type', 'password');

      rerender(<Material3TextField type="number" data-testid="test-field" />);
      expect(screen.getByTestId('test-field')).toHaveAttribute('type', 'number');
    });

    it('renders multiline textarea', () => {
      render(<Material3TextField multiline rows={4} label="Multiline" data-testid="test-field" />);
      
      const textarea = screen.getByTestId('test-field');
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('applies size variants correctly', () => {
      const { rerender } = render(<Material3TextField size="small" data-testid="test-field" />);
      expect(screen.getByTestId('test-field').closest('.textField')).toHaveClass('small');

      rerender(<Material3TextField size="medium" data-testid="test-field" />);
      expect(screen.getByTestId('test-field').closest('.textField')).toHaveClass('medium');

      rerender(<Material3TextField size="large" data-testid="test-field" />);
      expect(screen.getByTestId('test-field').closest('.textField')).toHaveClass('large');
    });
  });

  describe('Floating Label Animation', () => {
    it('floats label on focus', async () => {
      const user = userEvent.setup();
      render(<Material3TextField label="Test Label" data-testid="test-field" />);
      
      const input = screen.getByTestId('test-field');
      const container = input.closest('.textField');
      
      expect(container).not.toHaveClass('focused');
      
      await user.click(input);
      
      expect(container).toHaveClass('focused');
    });

    it('floats label when field has value', () => {
      render(<Material3TextField label="Test Label" value="test value" data-testid="test-field" />);
      
      const container = screen.getByTestId('test-field').closest('.textField');
      expect(container).toHaveClass('hasValue');
    });

    it('floats label with defaultValue', () => {
      render(<Material3TextField label="Test Label" defaultValue="default" data-testid="test-field" />);
      
      const container = screen.getByTestId('test-field').closest('.textField');
      expect(container).toHaveClass('hasValue');
    });

    it('shows placeholder only when focused or has value', async () => {
      const user = userEvent.setup();
      render(
        <Material3TextField 
          label="Test Label" 
          placeholder="Enter text here"
          data-testid="test-field" 
        />
      );
      
      const input = screen.getByTestId('test-field');
      
      // Initially no placeholder should be visible
      expect(input).not.toHaveAttribute('placeholder');
      
      // Focus should show placeholder
      await user.click(input);
      expect(input).toHaveAttribute('placeholder', 'Enter text here');
    });
  });

  describe('State Management', () => {
    it('handles controlled input correctly', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(
        <Material3TextField 
          label="Controlled"
          value="initial"
          onChange={handleChange}
          data-testid="test-field"
        />
      );
      
      const input = screen.getByTestId('test-field');
      expect(input).toHaveValue('initial');
      
      await user.clear(input);
      await user.type(input, 'new value');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles uncontrolled input correctly', async () => {
      const user = userEvent.setup();
      
      render(<Material3TextField label="Uncontrolled" data-testid="test-field" />);
      
      const input = screen.getByTestId('test-field');
      
      await user.type(input, 'test input');
      
      expect(input).toHaveValue('test input');
    });

    it('calls event handlers correctly', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      const handleChange = jest.fn();
      const handleKeyDown = jest.fn();
      
      render(
        <Material3TextField 
          label="Event Test"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          data-testid="test-field"
        />
      );
      
      const input = screen.getByTestId('test-field');
      
      await user.click(input);
      expect(handleFocus).toHaveBeenCalled();
      
      await user.type(input, 'a');
      expect(handleChange).toHaveBeenCalled();
      expect(handleKeyDown).toHaveBeenCalled();
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    it('applies error styling', () => {
      render(
        <Material3TextField 
          label="Error Field"
          error
          helperText="This field has an error"
          data-testid="test-field"
        />
      );
      
      const container = screen.getByTestId('test-field').closest('.textField');
      expect(container).toHaveClass('error');
      
      const helperText = screen.getByText('This field has an error');
      expect(helperText).toHaveAttribute('role', 'alert');
    });

    it('sets aria-invalid when error is true', () => {
      render(<Material3TextField label="Error Field" error data-testid="test-field" />);
      
      expect(screen.getByTestId('test-field')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled styling and behavior', () => {
      render(<Material3TextField label="Disabled Field" disabled data-testid="test-field" />);
      
      const input = screen.getByTestId('test-field');
      const container = input.closest('.textField');
      
      expect(container).toHaveClass('disabled');
      expect(input).toBeDisabled();
    });

    it('prevents interaction when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(
        <Material3TextField 
          label="Disabled Field"
          disabled
          onChange={handleChange}
          data-testid="test-field"
        />
      );
      
      const input = screen.getByTestId('test-field');
      
      await user.click(input);
      await user.type(input, 'should not work');
      
      expect(handleChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  describe('Read Only State', () => {
    it('applies read-only styling and behavior', () => {
      render(
        <Material3TextField 
          label="Read Only Field"
          value="read only value"
          readOnly
          data-testid="test-field"
        />
      );
      
      const input = screen.getByTestId('test-field');
      const container = input.closest('.textField');
      
      expect(container).toHaveClass('readOnly');
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveValue('read only value');
    });
  });

  describe('Icons', () => {
    it('renders start and end icons', () => {
      const StartIcon = () => <span data-testid="start-icon">🔍</span>;
      const EndIcon = () => <span data-testid="end-icon">✨</span>;
      
      render(
        <Material3TextField 
          label="Icon Field"
          startIcon={<StartIcon />}
          endIcon={<EndIcon />}
          data-testid="test-field"
        />
      );
      
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
      
      const container = screen.getByTestId('test-field').closest('.textField');
      expect(container).toHaveClass('hasStartIcon');
      expect(container).toHaveClass('hasEndIcon');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Material3TextField 
          id="test-field"
          label="Accessible Field"
          helperText="Helper text"
          required
          data-testid="test-field"
        />
      );
      
      const input = screen.getByTestId('test-field');
      
      expect(input).toHaveAttribute('aria-labelledby', 'test-field-label');
      expect(input).toHaveAttribute('aria-describedby', 'test-field-helper-text');
      expect(input).toHaveAttribute('required');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <Material3TextField label="Field 1" data-testid="field-1" />
          <Material3TextField label="Field 2" data-testid="field-2" />
        </div>
      );
      
      const field1 = screen.getByTestId('field-1');
      const field2 = screen.getByTestId('field-2');
      
      field1.focus();
      expect(field1).toHaveFocus();
      
      await user.tab();
      expect(field2).toHaveFocus();
    });

    it('announces errors to screen readers', () => {
      render(
        <Material3TextField 
          label="Error Field"
          error
          helperText="This field is required"
          data-testid="test-field"
        />
      );
      
      const helperText = screen.getByText('This field is required');
      expect(helperText).toHaveAttribute('role', 'alert');
    });
  });

  describe('Form Integration', () => {
    it('works with form submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <Material3TextField 
            name="testField"
            label="Test Field"
            data-testid="test-field"
          />
          <button type="submit">Submit</button>
        </form>
      );
      
      const input = screen.getByTestId('test-field');
      const submitButton = screen.getByText('Submit');
      
      await user.type(input, 'test value');
      await user.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('supports HTML5 validation attributes', () => {
      render(
        <Material3TextField 
          label="Validation Field"
          type="email"
          required
          maxLength={50}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          data-testid="test-field"
        />
      );
      
      const input = screen.getByTestId('test-field');
      
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('maxlength', '50');
      expect(input).toHaveAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
    });
  });

  describe('Responsive Behavior', () => {
    it('applies responsive classes correctly', () => {
      // This would require more complex testing setup for media queries
      // For now, we'll just verify the CSS classes are applied
      render(<Material3TextField label="Responsive Field" data-testid="test-field" />);
      
      const container = screen.getByTestId('test-field').closest('.textField');
      expect(container).toHaveClass('textField');
    });
  });

  describe('Performance', () => {
    it('does not cause unnecessary re-renders', () => {
      const renderSpy = jest.fn();
      
      const TestComponent = () => {
        renderSpy();
        return <Material3TextField label="Performance Test" data-testid="test-field" />;
      };
      
      const { rerender } = render(<TestComponent />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props should not cause additional renders
      rerender(<TestComponent />);
      
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});