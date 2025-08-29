import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityButtonMaterial3 } from '../ActivityButtonMaterial3';
import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('@/hooks/useMotionSystem', () => ({
  useMotionSystem: () => ({
    transitions: {
      cardHover: { transform: 'translateY(-2px)' },
      focus: { enter: {}, exit: {} }
    }
  })
}));

jest.mock('@/hooks/useThemeReactive', () => ({
  useThemeReactive: () => 'light'
}));

jest.mock('@/utils/colors', () => ({
  getActivityColorsForTheme: () => [
    {
      background: 'hsl(200, 60%, 95%)',
      text: 'hsl(200, 60%, 25%)',
      border: 'hsl(200, 60%, 35%)'
    }
  ]
}));

describe('ActivityButtonMaterial3 - Basic Integration', () => {
  const mockActivity = {
    id: 'activity-1',
    name: 'Design Review',
    colorIndex: 0,
    createdAt: new Date().toISOString(),
    isActive: true
  };

  const mockProps = {
    activity: mockActivity,
    isCompleted: false,
    isRunning: false,
    onSelect: jest.fn(),
    timelineEntries: [],
    elapsedTime: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with basic props and maintains ActivityButton interface', () => {
    render(<ActivityButtonMaterial3 {...mockProps} />);
    
    // Should render activity name
    expect(screen.getByText('Design Review')).toBeInTheDocument();
    
    // Should have start button
    expect(screen.getByTestId('start-activity-design-review')).toBeInTheDocument();
  });

  it('handles all activity states like original ActivityButton', () => {
    const { rerender } = render(<ActivityButtonMaterial3 {...mockProps} />);
    
    // Idle state
    expect(screen.getByTestId('start-activity-design-review')).toBeInTheDocument();
    expect(screen.queryByText('Done')).not.toBeInTheDocument();
    
    // Running state
    rerender(<ActivityButtonMaterial3 {...mockProps} isRunning={true} elapsedTime={120} />);
    expect(screen.getByTestId('complete-activity-design-review')).toBeInTheDocument();
    expect(screen.getByText('02:00')).toBeInTheDocument();
    
    // Completed state
    rerender(<ActivityButtonMaterial3 {...mockProps} isCompleted={true} />);
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.queryByTestId('start-activity-design-review')).not.toBeInTheDocument();
    expect(screen.queryByTestId('complete-activity-design-review')).not.toBeInTheDocument();
  });

  it('handles remove functionality when provided', () => {
    const onRemove = jest.fn();
    render(<ActivityButtonMaterial3 {...mockProps} onRemove={onRemove} />);
    
    const removeButton = screen.getByTestId('remove-activity-design-review');
    expect(removeButton).toBeInTheDocument();
    
    fireEvent.click(removeButton);
    expect(onRemove).toHaveBeenCalledWith('activity-1');
  });

  it('maintains same callback interface as original ActivityButton', () => {
    const onSelect = jest.fn();
    render(<ActivityButtonMaterial3 {...mockProps} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByTestId('start-activity-design-review'));
    expect(onSelect).toHaveBeenCalledWith(mockActivity);
  });

  it('applies Material 3 styling while preserving functionality', () => {
    render(<ActivityButtonMaterial3 {...mockProps} />);
    
    // Should use Material 3 container
    const container = screen.getByText('Design Review').closest('[class*="container"]');
    expect(container).toBeInTheDocument();
    
    // Should have activity card styling
    const activityCard = screen.getByText('Design Review').closest('[class*="activityCard"]');
    expect(activityCard).toBeInTheDocument();
    
    // Should maintain functionality
    expect(screen.getByTestId('start-activity-design-review')).toBeInTheDocument();
  });
});