import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Textarea } from '@/components/ui/Textarea';

describe('Textarea', () => {
  describe('Basic Rendering', () => {
    it('renders textarea element', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders with placeholder', () => {
      render(<Textarea placeholder="Enter your message" />);
      const textarea = screen.getByPlaceholderText('Enter your message');
      expect(textarea).toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(<Textarea defaultValue="Initial content" />);
      const textarea = screen.getByDisplayValue('Initial content');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      render(<Textarea size="sm" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('min-h-[60px]', 'px-2', 'py-1', 'text-sm');
    });

    it('applies default/medium size classes', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('min-h-[100px]', 'px-3', 'py-2');
    });

    it('applies large size classes', () => {
      render(<Textarea size="lg" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('min-h-[140px]', 'px-4', 'py-3', 'text-lg');
    });
  });

  describe('Resize Options', () => {
    it('applies no resize by default', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-none');
    });

    it('applies vertical resize', () => {
      render(<Textarea resize="vertical" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-y');
    });

    it('applies horizontal resize', () => {
      render(<Textarea resize="horizontal" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-x');
    });

    it('applies both resize', () => {
      render(<Textarea resize="both" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize');
    });
  });

  describe('States', () => {
    it('applies disabled state', () => {
      render(<Textarea disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('applies error state styling', () => {
      render(<Textarea error />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    });

    it('applies success state styling', () => {
      render(<Textarea success />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-green-500', 'focus:border-green-500', 'focus:ring-green-500');
    });
  });

  describe('Rows and Cols', () => {
    it('accepts rows prop', () => {
      render(<Textarea rows={5} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('accepts cols prop', () => {
      render(<Textarea cols={40} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('cols', '40');
    });
  });

  describe('User Interactions', () => {
    it('handles onChange events', () => {
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');
      
      fireEvent.change(textarea, { target: { value: 'test content' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('handles onFocus events', () => {
      const handleFocus = vi.fn();
      render(<Textarea onFocus={handleFocus} />);
      const textarea = screen.getByRole('textbox');
      
      fireEvent.focus(textarea);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles onBlur events', () => {
      const handleBlur = vi.fn();
      render(<Textarea onBlur={handleBlur} />);
      const textarea = screen.getByRole('textbox');
      
      fireEvent.blur(textarea);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events', () => {
      const handleKeyDown = vi.fn();
      render(<Textarea onKeyDown={handleKeyDown} />);
      const textarea = screen.getByRole('textbox');
      
      fireEvent.keyDown(textarea, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Textarea aria-label="Message input" />);
      const textarea = screen.getByLabelText('Message input');
      expect(textarea).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <div>
          <Textarea aria-describedby="help-text" />
          <div id="help-text">This is help text</div>
        </div>
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports required attribute', () => {
      render(<Textarea required />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
    });

    it('supports aria-invalid for error state', () => {
      render(<Textarea error />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('supports maxLength attribute', () => {
      render(<Textarea maxLength={100} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxlength', '100');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Textarea className="custom-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-textarea');
    });

    it('merges custom className with default classes', () => {
      render(<Textarea className="custom-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-textarea');
      expect(textarea).toHaveClass('rounded-md'); // Default class should still be present
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = { current: null };
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });
});
