import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TouchableButton from '../TouchableButton';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook to control touch behavior in tests
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn().mockReturnValue({
    isMobile: false,
    hasTouch: false
  })
}));

describe('TouchableButton Component', () => {
  // Reset the mock between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with children', () => {
    render(<TouchableButton onClick={() => {}}>Test Button</TouchableButton>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<TouchableButton onClick={handleClick}>Click Me</TouchableButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick handler when disabled', () => {
    const handleClick = jest.fn();
    render(
      <TouchableButton onClick={handleClick} disabled>
        Disabled Button
      </TouchableButton>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies primary variant class by default', () => {
    render(<TouchableButton onClick={() => {}}>Default Button</TouchableButton>);
    expect(screen.getByRole('button')).toHaveClass('primary');
  });

  test('applies correct variant class when specified', () => {
    const { rerender } = render(
      <TouchableButton onClick={() => {}} variant="secondary">
        Secondary Button
      </TouchableButton>
    );
    expect(screen.getByRole('button')).toHaveClass('secondary');
    
    rerender(
      <TouchableButton onClick={() => {}} variant="outline">
        Outline Button
      </TouchableButton>
    );
    expect(screen.getByRole('button')).toHaveClass('outline');
    
    rerender(
      <TouchableButton onClick={() => {}} variant="danger">
        Danger Button
      </TouchableButton>
    );
    expect(screen.getByRole('button')).toHaveClass('danger');
  });

  test('applies correct size class based on size prop', () => {
    const { rerender } = render(
      <TouchableButton onClick={() => {}} size="small">
        Small Button
      </TouchableButton>
    );
    expect(screen.getByRole('button')).toHaveClass('small');
    
    rerender(
      <TouchableButton onClick={() => {}} size="medium">
        Medium Button
      </TouchableButton>
    );
    expect(screen.getByRole('button')).toHaveClass('medium');
    
    rerender(
      <TouchableButton onClick={() => {}} size="large">
        Large Button
      </TouchableButton>
    );
    expect(screen.getByRole('button')).toHaveClass('large');
  });

  test('applies touch-friendly class when on touch device', () => {
    // Mock touch device detection
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true
    });
    
    render(<TouchableButton onClick={() => {}}>Touch Button</TouchableButton>);
    expect(screen.getByRole('button')).toHaveClass('touchFriendly');
  });

  test('does not apply touch-friendly class when not on touch device', () => {
    // Mock non-touch device
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false
    });
    
    render(<TouchableButton onClick={() => {}}>Non-Touch Button</TouchableButton>);
    expect(screen.getByRole('button')).not.toHaveClass('touchFriendly');
  });

  test('applies fullWidth class when fullWidth prop is true', () => {
    render(
      <TouchableButton onClick={() => {}} fullWidth>
        Full Width Button
      </TouchableButton>
    );
    expect(screen.getByRole('button')).toHaveClass('fullWidth');
  });

  test('applies custom className when provided', () => {
    render(
      <TouchableButton onClick={() => {}} className="customClass">
        Custom Class Button
      </TouchableButton>
    );
    expect(screen.getByRole('button')).toHaveClass('customClass');
  });

  test('renders with icon when provided', () => {
    render(
      <TouchableButton 
        onClick={() => {}} 
        icon={<span data-testid="test-icon">🔍</span>}
      >
        Button with Icon
      </TouchableButton>
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Button with Icon')).toBeInTheDocument();
  });

  test('has correct ARIA attributes for accessibility', () => {
    const { rerender } = render(
      <TouchableButton onClick={() => {}} aria-label="Accessible Button">
        Button Text
      </TouchableButton>
    );
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Accessible Button');
    
    // Test disabled state
    rerender(
      <TouchableButton onClick={() => {}} disabled>
        Disabled Button
      </TouchableButton>
    );
    
    expect(screen.getByRole('button')).toHaveAttribute('disabled');
  });
});
