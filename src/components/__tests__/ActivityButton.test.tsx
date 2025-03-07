import { render, screen, fireEvent } from '@testing-library/react';
import ActivityButton from '../ActivityButton';

describe('ActivityButton', () => {
  const defaultProps = {
    id: 'test1',
    name: 'Test Activity',
    colors: {
      background: '#fff',
      text: '#000',
      border: '#ccc'
    },
    isCompleted: false,
    isCurrent: false,
    duration: 0,
    disabled: false,
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders activity name', () => {
    render(<ActivityButton {...defaultProps} />);
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
  });

  it('shows duration when provided', () => {
    render(<ActivityButton {...defaultProps} duration={300} />);
    expect(screen.getByText('5 min')).toBeInTheDocument();
  });

  it('applies completed class when completed', () => {
    render(<ActivityButton {...defaultProps} isCompleted={true} />);
    expect(screen.getByRole('button')).toHaveClass('completed');
  });

  it('applies current class when current', () => {
    render(<ActivityButton {...defaultProps} isCurrent={true} />);
    expect(screen.getByRole('button')).toHaveClass('current');
  });

  it('handles click events', () => {
    render(<ActivityButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultProps.id);
  });

  it('shows remove button when onRemove provided', () => {
    const onRemove = vi.fn();
    render(<ActivityButton {...defaultProps} onRemove={onRemove} />);
    
    const removeButton = screen.getByLabelText('Remove Test Activity');
    fireEvent.click(removeButton);
    
    expect(onRemove).toHaveBeenCalledWith(defaultProps.id);
  });
});
