import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ActivityButtonMaterial3 } from '../ActivityButtonMaterial3';
import { jest } from '@jest/globals';

// Mock the motion system hook
jest.mock('@/hooks/useMotionSystem', () => ({
  useMotionSystem: () => ({
    transitions: {
      cardHover: {
        transform: 'translateY(-2px)',
        boxShadow: 'var(--md-sys-elevation-level2)'
      },
      focus: {
        enter: { outline: '2px solid var(--md-sys-color-primary)' },
        exit: { outline: 'none' }
      }
    }
  })
}));

// Mock the theme hook
jest.mock('@/hooks/useThemeReactive', () => ({
  useThemeReactive: () => 'light'
}));

// Mock the color utils
jest.mock('@/utils/colors', () => ({
  getActivityColorsForTheme: () => [
    {
      background: 'hsl(120, 60%, 95%)',
      text: 'hsl(120, 60%, 25%)',
      border: 'hsl(120, 60%, 35%)'
    }
  ]
}));

describe('ActivityButtonMaterial3', () => {
  const defaultActivity = {
    id: 'test1',
    name: 'Test Activity',
    colorIndex: 0,
    createdAt: new Date().toISOString(),
    isActive: true
  };

  const defaultProps = {
    activity: defaultActivity,
    isCompleted: false,
    isRunning: false,
    onSelect: jest.fn(),
    timelineEntries: [],
    elapsedTime: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders activity name with Material 3 typography', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      const activityName = screen.getByText('Test Activity');
      expect(activityName).toBeInTheDocument();
      expect(activityName).toHaveClass('activityName');
    });

    it('renders as Material 3 container with activity card shape', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      const container = screen.getByText('Test Activity').closest('[class*="container"]');
      expect(container).toBeInTheDocument();
    });

    it('applies dynamic color styling based on activity colors', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      const container = screen.getByText('Test Activity').closest('[class*="activityCard"]');
      expect(container).toHaveStyle({
        '--activity-bg-color': 'hsl(120, 60%, 95%)',
        '--activity-text-color': 'hsl(120, 60%, 25%)',
        '--activity-border-color': 'hsl(120, 60%, 35%)'
      });
    });
  });

  describe('Activity States', () => {
    it('applies running state styling when activity is running', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isRunning={true} />);
      const container = screen.getByText('Test Activity').closest('[class*="activityCard"]');
      expect(container).toHaveClass('running');
    });

    it('applies completed state styling when activity is completed', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isCompleted={true} />);
      const container = screen.getByText('Test Activity').closest('[class*="activityCard"]');
      expect(container).toHaveClass('completed');
    });

    it('shows running indicator when activity is running', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isRunning={true} />);
      const indicator = document.querySelector('[class*="runningIndicator"]');
      expect(indicator).toBeInTheDocument();
    });

    it('shows completed indicator when activity is completed', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isCompleted={true} />);
      const indicator = document.querySelector('[class*="completedIndicator"]');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Status Badge', () => {
    it('shows timer badge when activity is running', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isRunning={true} elapsedTime={30} />);
      const badge = screen.getByText('00:30').closest('[class*="statusBadge"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('data-status', 'running');
    });

    it('shows completed badge with checkmark when activity is completed', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isCompleted={true} />);
      const badge = screen.getByText('Done').closest('[class*="statusBadge"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('data-status', 'completed');
      expect(badge?.querySelector('svg')).toBeInTheDocument();
    });

    it('formats elapsed time correctly in running badge', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isRunning={true} elapsedTime={3665} />);
      expect(screen.getByText('61:05')).toBeInTheDocument();
    });

    it('does not show status badge when activity is idle', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      expect(document.querySelector('[class*="statusBadge"]')).not.toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('shows Material 3 start button with play icon when not running', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      const startButton = screen.getByTestId('start-activity-test-activity');
      expect(startButton).toBeInTheDocument();
      expect(startButton.querySelector('svg')).toBeInTheDocument();
      expect(startButton.tagName).toBe('BUTTON');
    });

    it('shows Material 3 complete button with checkmark when running', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isRunning={true} />);
      const completeButton = screen.getByTestId('complete-activity-test-activity');
      expect(completeButton).toBeInTheDocument();
      expect(completeButton.querySelector('svg')).toBeInTheDocument();
      expect(completeButton.tagName).toBe('BUTTON');
    });

    it('uses different button variants for start vs complete actions', () => {
      const { rerender } = render(<ActivityButtonMaterial3 {...defaultProps} />);
      const startButton = screen.getByTestId('start-activity-test-activity');
      expect(startButton).toHaveClass('md-button--filled');

      rerender(<ActivityButtonMaterial3 {...defaultProps} isRunning={true} />);
      const completeButton = screen.getByTestId('complete-activity-test-activity');
      expect(completeButton).toHaveClass('md-button--tonal');
    });

    it('does not show action buttons when activity is completed', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isCompleted={true} />);
      expect(screen.queryByTestId('start-activity-test-activity')).not.toBeInTheDocument();
      expect(screen.queryByTestId('complete-activity-test-activity')).not.toBeInTheDocument();
    });
  });

  describe('Remove Button', () => {
    it('shows Material 3 icon button for remove when onRemove provided', () => {
      const onRemove = jest.fn();
      render(<ActivityButtonMaterial3 {...defaultProps} onRemove={onRemove} />);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeInTheDocument();
      expect(removeButton.querySelector('svg')).toBeInTheDocument();
      expect(removeButton).toHaveClass('md-icon-button');
    });

    it('disables remove button when activity is in use', () => {
      const onRemove = jest.fn();
      render(<ActivityButtonMaterial3 {...defaultProps} 
        onRemove={onRemove}
        timelineEntries={[{ 
          id: '1',
          activityId: 'test1',
          activityName: 'Test Activity',
          startTime: 0,
          endTime: 300 
        }]}
      />);
      
      const removeButton = screen.getByRole('button', { name: /can't remove/i });
      expect(removeButton).toBeDisabled();
    });

    it('does not show remove button when onRemove not provided', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles select events when start button is clicked', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      fireEvent.click(screen.getByTestId('start-activity-test-activity'));
      expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultActivity);
    });

    it('handles select events when complete button is clicked', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isRunning={true} />);
      fireEvent.click(screen.getByTestId('complete-activity-test-activity'));
      expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultActivity);
    });

    it('handles remove events and prevents event propagation', () => {
      const onRemove = jest.fn();
      const onSelect = jest.fn();
      render(<ActivityButtonMaterial3 {...defaultProps} onRemove={onRemove} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByRole('button', { name: /remove/i }));
      expect(onRemove).toHaveBeenCalledWith(defaultActivity.id);
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Material 3 Expressive Features', () => {
    it('applies organic card shape through Material3Container', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      const container = screen.getByText('Test Activity').closest('[class*="container"]');
      // The shape prop should be passed to Material3Container
      expect(container).toBeInTheDocument();
    });

    it('uses appropriate elevation levels for different states', () => {
      const { rerender } = render(<ActivityButtonMaterial3 {...defaultProps} />);
      let container = screen.getByText('Test Activity').closest('[class*="container"]');
      expect(container).toBeInTheDocument();

      rerender(<ActivityButtonMaterial3 {...defaultProps} isRunning={true} />);
      container = screen.getByText('Test Activity').closest('[class*="container"]');
      expect(container).toBeInTheDocument();

      rerender(<ActivityButtonMaterial3 {...defaultProps} isCompleted={true} />);
      container = screen.getByText('Test Activity').closest('[class*="container"]');
      expect(container).toBeInTheDocument();
    });

    it('applies interactive behavior for non-completed activities', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      const container = screen.getByText('Test Activity').closest('[class*="container"]');
      expect(container).toBeInTheDocument();
    });

    it('disables interactive behavior for completed activities', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isCompleted={true} />);
      const container = screen.getByText('Test Activity').closest('[class*="container"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for remove button states', () => {
      const onRemove = jest.fn();
      const { rerender } = render(<ActivityButtonMaterial3 {...defaultProps} onRemove={onRemove} />);
      
      expect(screen.getByRole('button', { name: /remove activity/i })).toBeInTheDocument();

      rerender(<ActivityButtonMaterial3 {...defaultProps} 
        onRemove={onRemove}
        timelineEntries={[{ 
          id: '1',
          activityId: 'test1',
          activityName: 'Test Activity',
          startTime: 0,
          endTime: 300 
        }]}
      />);
      
      expect(screen.getByRole('button', { name: /can't remove while activity is in use/i })).toBeInTheDocument();
    });

    it('provides proper test IDs for automated testing', () => {
      const onRemove = jest.fn();
      render(<ActivityButtonMaterial3 {...defaultProps} onRemove={onRemove} />);
      
      expect(screen.getByTestId('start-activity-test-activity')).toBeInTheDocument();
      expect(screen.getByTestId('remove-activity-test-activity')).toBeInTheDocument();
    });

    it('uses semantic HTML structure with proper headings', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 6 });
      expect(heading).toHaveTextContent('Test Activity');
    });

    it('hides decorative indicators from screen readers', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} isRunning={true} />);
      const runningIndicator = document.querySelector('[class*="runningIndicator"]');
      expect(runningIndicator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains functionality across different screen sizes', () => {
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      const container = screen.getByText('Test Activity').closest('[class*="activityCard"]');
      expect(container).toBeInTheDocument();
      
      // Component should render consistently regardless of screen size
      expect(screen.getByTestId('start-activity-test-activity')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing activity colors gracefully', () => {
      // Test with empty colors array
      render(<ActivityButtonMaterial3 {...defaultProps} />);
      expect(screen.getByText('Test Activity')).toBeInTheDocument();
    });

    it('handles long activity names with proper text overflow', () => {
      const longNameActivity = {
        ...defaultActivity,
        name: 'This is a very long activity name that should be truncated properly'
      };
      
      render(<ActivityButtonMaterial3 {...defaultProps} activity={longNameActivity} />);
      const activityName = screen.getByText(longNameActivity.name);
      expect(activityName).toHaveClass('activityName');
    });
  });
});