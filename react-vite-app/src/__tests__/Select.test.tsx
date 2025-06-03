import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Select } from '@/components/ui/Select';

describe('Select', () => {
  describe('Basic Rendering', () => {
    it('renders select element', () => {
      render(
        <Select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });

    it('renders with options', () => {
      render(
        <Select>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      const options = screen.getAllByRole('option');
      
      expect(select).toBeInTheDocument();
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Apple');
      expect(options[1]).toHaveTextContent('Banana');
      expect(options[2]).toHaveTextContent('Cherry');
    });

    it('renders with default value', () => {
      render(
        <Select defaultValue="banana">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('banana');
    });

    it('renders with placeholder option', () => {
      render(
        <Select placeholder="Choose a fruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </Select>
      );
      const placeholderOption = screen.getByText('Choose a fruit');
      expect(placeholderOption).toBeInTheDocument();
      expect(placeholderOption).toHaveAttribute('value', '');
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      render(
        <Select size="sm">
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('h-8', 'px-2', 'text-sm');
    });

    it('applies default/medium size classes', () => {
      render(
        <Select>
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('h-10', 'px-3');
    });

    it('applies large size classes', () => {
      render(
        <Select size="lg">
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('h-12', 'px-4', 'text-lg');
    });
  });

  describe('States', () => {
    it('applies disabled state', () => {
      render(
        <Select disabled>
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
      expect(select).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('applies error state styling', () => {
      render(
        <Select error>
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    });

    it('applies success state styling', () => {
      render(
        <Select success>
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-green-500', 'focus:border-green-500', 'focus:ring-green-500');
    });
  });

  describe('Multiple Selection', () => {
    it('supports multiple selection', () => {
      render(
        <Select multiple>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
        </Select>
      );
      const select = screen.getByRole('listbox'); // Changes to listbox when multiple
      expect(select).toHaveAttribute('multiple');
    });

    it('applies different styles for multiple select', () => {
      render(
        <Select multiple>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </Select>
      );
      const select = screen.getByRole('listbox');
      expect(select).toHaveClass('min-h-[100px]'); // Different height for multiple
    });
  });

  describe('User Interactions', () => {
    it('handles onChange events', () => {
      const handleChange = vi.fn();
      render(
        <Select onChange={handleChange}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      
      fireEvent.change(select, { target: { value: 'banana' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('handles onFocus events', () => {
      const handleFocus = vi.fn();
      render(
        <Select onFocus={handleFocus}>
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      
      fireEvent.focus(select);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles onBlur events', () => {
      const handleBlur = vi.fn();
      render(
        <Select onBlur={handleBlur}>
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      
      fireEvent.blur(select);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(
        <Select aria-label="Choose an option">
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByLabelText('Choose an option');
      expect(select).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <div>
          <Select aria-describedby="help-text">
            <option value="1">Option 1</option>
          </Select>
          <div id="help-text">This is help text</div>
        </div>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports required attribute', () => {
      render(
        <Select required>
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
    });

    it('supports aria-invalid for error state', () => {
      render(
        <Select error>
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(
        <Select className="custom-select">
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('custom-select');
    });

    it('merges custom className with default classes', () => {
      render(
        <Select className="custom-select">
          <option value="1">Option 1</option>
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('custom-select');
      expect(select).toHaveClass('rounded-md'); // Default class should still be present
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to select element', () => {
      const ref = { current: null };
      render(
        <Select ref={ref}>
          <option value="1">Option 1</option>
        </Select>
      );
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
  });
});
