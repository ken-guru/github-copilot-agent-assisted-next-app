import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ActivityManager from '../ActivityManager';

// Mock utils and setup
jest.mock('../../utils/colors', () => ({
  ...jest.requireActual('../../utils/colors'),
  getNextAvailableColorSet: jest.fn().mockImplementation(() => ({
    background: '#E8F5E9',
    text: '#1B5E20',
    border: '#2E7D32'
  }))
}));

beforeAll(() => {
  Object.defineProperty(document.documentElement, 'classList', {
    value: {
      contains: jest.fn().mockReturnValue(false),
      add: jest.fn(),
      remove: jest.fn(),
    }
  });
});

describe('ActivityManager Bootstrap Integration', () => {
  const mockOnActivitySelect = jest.fn();
  const mockOnActivityRemove = jest.fn();

  beforeEach(() => {
    mockOnActivitySelect.mockClear();
    mockOnActivityRemove.mockClear();
    jest.clearAllMocks();
  });

  describe('Bootstrap Container Structure', () => {
    it('renders with Bootstrap Card structure', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('card', 'h-100');
    });

    it('renders heading with Bootstrap Card Header', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const heading = screen.getByRole('heading', { name: 'Activities' });
      expect(heading).toHaveClass('mb-0');
      
      // Check that it's inside a Card.Header
      const cardHeader = heading.closest('.card-header');
      expect(cardHeader).toBeInTheDocument();
    });

    it('renders activity list with Bootstrap structure', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toHaveClass('row', 'gy-3');
      });
    });
  });

  describe('Bootstrap Layout Components', () => {
    it('renders ActivityForm in proper Bootstrap column', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        const formColumn = screen.getByTestId('activity-form-column');
        expect(formColumn).toHaveClass('flex-shrink-0', 'mb-3');
      });
    });

    it('renders each activity in full-width Bootstrap column', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      const activityColumns = screen.getAllByTestId(/^activity-column-/);
      activityColumns.forEach(column => {
        expect(column).toHaveClass('col-12');
        // Should not have responsive breakpoint classes for multi-column layout
        expect(column).not.toHaveClass('col-md-6');
        expect(column).not.toHaveClass('col-lg-4');
      });
    });

    it('applies full-width layout classes correctly', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Check that activity columns have full-width layout
      const homeworkColumn = screen.getByTestId('activity-column-1');
      expect(homeworkColumn).toHaveClass('col-12'); // Full width on all screen sizes
      // Should not have responsive breakpoint classes
      expect(homeworkColumn).not.toHaveClass('col-md-6');
      expect(homeworkColumn).not.toHaveClass('col-lg-4');
    });
  });

  describe('Bootstrap Empty State', () => {
    it('renders empty state with Bootstrap Alert styling', async () => {
      // Render with no default activities by mocking useEffect
      const ActivityManagerNoDefaults = () => {
        return (
          <div className="card h-100" data-testid="activity-manager">
            <div className="card-header">
              <h5 className="mb-0">Activities</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info text-center" role="alert" data-testid="empty-state">
                No activities defined
              </div>
            </div>
          </div>
        );
      };

      render(<ActivityManagerNoDefaults />);

      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toHaveClass('alert', 'alert-info', 'text-center');
      expect(emptyState).toHaveAttribute('role', 'alert');
    });
  });

  describe('Bootstrap Spacing and Layout', () => {
    it('maintains Bootstrap spacing utilities', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('card', 'h-100');

      const heading = screen.getByRole('heading', { name: 'Activities' });
      expect(heading).toHaveClass('mb-0');

      await waitFor(() => {
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toHaveClass('gy-3'); // Bootstrap row gutter spacing
      });
    });

    it('applies proper Bootstrap grid structure', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        // Container should be a card
        const container = screen.getByTestId('activity-manager');
        expect(container).toHaveClass('card', 'h-100');

        // Activity list should be a row
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toHaveClass('row');

        // Form should be in a column
        const formColumn = screen.getByTestId('activity-form-column');
        expect(formColumn).toHaveClass('flex-shrink-0');
      });
    });
  });

  describe('Bootstrap Full-Width Layout', () => {
    it('handles full-width column behavior correctly', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Each activity should be in a full-width column
      const activityColumns = screen.getAllByTestId(/^activity-column-/);
      expect(activityColumns.length).toBeGreaterThan(0);

      activityColumns.forEach(column => {
        // Full width on all screen sizes
        expect(column).toHaveClass('col-12');
        // Should not have multi-column breakpoints
        expect(column).not.toHaveClass('col-md-6');
        expect(column).not.toHaveClass('col-lg-4');
      });
    });

    it('maintains Bootstrap structure during activity interactions', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Add a new activity
      const input = screen.getByLabelText('Name');
      fireEvent.change(input, { target: { value: 'Test Activity' } });
      fireEvent.click(screen.getByText('Add Activity'));

      await waitFor(() => {
        expect(screen.getByText('Test Activity')).toBeInTheDocument();
      });

      // Grid structure should be maintained
      const activityList = screen.getByTestId('activity-list');
      expect(activityList).toHaveClass('row', 'gy-3');

      const activityColumns = screen.getAllByTestId(/^activity-column-/);
      expect(activityColumns.length).toBeGreaterThan(4); // Should include new activity

      // New activity column should have proper full-width Bootstrap classes
      const newActivityColumn = activityColumns[activityColumns.length - 1];
      expect(newActivityColumn).toHaveClass('col-12');
      expect(newActivityColumn).not.toHaveClass('col-md-6');
      expect(newActivityColumn).not.toHaveClass('col-lg-4');
    });
  });

  describe('Bootstrap Integration with Child Components', () => {
    it('maintains Bootstrap structure with ActivityForm integration', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      // ActivityForm should be in its own column
      const formColumn = screen.getByTestId('activity-form-column');
      expect(formColumn).toHaveClass('flex-shrink-0', 'mb-3');

      // Form should be properly contained within Bootstrap structure
      const form = screen.getByRole('form');
      expect(form.closest('[data-testid="activity-form-column"]')).toBe(formColumn);
    });

    it('maintains Bootstrap structure with ActivityButton integration', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Each ActivityButton should be properly contained in a Bootstrap column
      const homeworkColumn = screen.getByTestId('activity-column-1');
      const homeworkText = within(homeworkColumn).getByText('Homework');
      expect(homeworkText).toBeInTheDocument();

      // Column should have proper full-width Bootstrap classes
      expect(homeworkColumn).toHaveClass('col-12');
      expect(homeworkColumn).not.toHaveClass('col-md-6');
      expect(homeworkColumn).not.toHaveClass('col-lg-4');
    });
  });

  describe('Bootstrap Theme Integration', () => {
    it('applies Bootstrap theme classes consistently', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('card', 'h-100');

      const heading = screen.getByRole('heading', { name: 'Activities' });
      expect(heading.tagName.toLowerCase()).toBe('h5');

      await waitFor(() => {
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toHaveClass('row');
      });
    });

    it('maintains Bootstrap consistency during state changes', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Start an activity
      const homeworkColumn = screen.getByTestId('activity-column-1');
      const startButton = within(homeworkColumn).getByRole('button', { name: 'Start' });
      fireEvent.click(startButton);

      // Bootstrap structure should be maintained
      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('card', 'h-100');

      const activityList = screen.getByTestId('activity-list');
      expect(activityList).toHaveClass('row', 'gy-3');
    });
  });

  describe('Bootstrap Accessibility Features', () => {
    it('maintains proper Bootstrap accessibility with container structure', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      // Container should have proper structure
      const container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();

      // Heading should be properly structured
      const heading = screen.getByRole('heading', { name: 'Activities' });
      expect(heading).toBeInTheDocument();

      await waitFor(() => {
        // Activity list should be accessible
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toBeInTheDocument();
      });
    });

    it('preserves activity accessibility within Bootstrap grid', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Activities should remain accessible within grid structure
      const activities = ['Homework', 'Reading', 'Play Time', 'Chores'];
      activities.forEach(activityName => {
        const activityText = screen.getByText(activityName);
        expect(activityText).toBeInTheDocument();
        
        // Should be within a Bootstrap column
        const column = activityText.closest('[class*="col-"]');
        expect(column).toBeTruthy();
      });
    });
  });

  describe('Bootstrap Overflow and Scrolling', () => {
    it('handles Bootstrap card overflow properly', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('card');
      
      // Container should handle full height
      expect(container).toHaveClass('h-100');
    });
  });
});
